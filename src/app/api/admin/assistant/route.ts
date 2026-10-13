import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  ASSISTANT_INSTRUCTIONS,
  getAssistantKnowledge,
} from "@/server/admin-assistant/knowledge";

// Roles that only open the member portal, not the admin dashboard.
const PORTAL_ONLY_ROLES = new Set(["Member", "Stream Watcher"]);

const requestSchema = z.object({
  locale: z.enum(["ja", "en"]),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      })
    )
    .min(1)
    .max(40)
    .refine((m) => m[0]?.role === "user" && m.at(-1)?.role === "user", {
      message: "Conversation must start and end with a user message",
    }),
});

export type AssistantStreamEvent =
  | { type: "text"; text: string }
  | { type: "error"; message: string }
  | { type: "done" };

let client: Anthropic | null = null;

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.roles.some((r) => !PORTAL_ONLY_ROLES.has(r))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The assistant is not configured (ANTHROPIC_API_KEY is missing)." },
      { status: 503 }
    );
  }

  if (!checkRateLimit(`admin-assistant:${user.id}`, { max: 20, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { locale, messages } = parsed.data;

  const knowledge = await getAssistantKnowledge();
  client ??= new Anthropic();

  // The large, unchanging reference block is cached; the per-user context
  // comes after the cache breakpoint so it doesn't invalidate it.
  const userContext = [
    `Current user's roles: ${user.roles.join(", ") || "(none)"}.`,
    `Current user's permissions: ${user.permissions.join(", ") || "(none)"}.`,
    `Admin UI language currently selected: ${locale === "ja" ? "Japanese" : "English"}.`,
  ].join("\n");

  const stream = client.beta.messages.stream({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    output_config: { effort: "medium" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: [
      {
        type: "text",
        text: `${ASSISTANT_INSTRUCTIONS}\n\n${knowledge}`,
        cache_control: { type: "ephemeral" },
      },
      { type: "text", text: userContext },
    ],
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AssistantStreamEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));

      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            send({ type: "text", text: event.delta.text });
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send({
            type: "error",
            message:
              locale === "ja"
                ? "この質問にはお答えできませんでした。言い方を変えてもう一度お試しください。"
                : "I couldn't answer that one. Please try rephrasing your question.",
          });
        }
        send({ type: "done" });
      } catch (error) {
        console.error("[admin-assistant]", error);
        let message =
          locale === "ja"
            ? "アシスタントでエラーが発生しました。しばらくしてからもう一度お試しください。"
            : "The assistant ran into an error. Please try again in a moment.";
        if (error instanceof Anthropic.RateLimitError) {
          message =
            locale === "ja"
              ? "アシスタントが混み合っています。少し待ってから再度お試しください。"
              : "The assistant is busy right now. Please wait a moment and try again.";
        } else if (error instanceof Anthropic.AuthenticationError) {
          message = "The assistant's API key is invalid. Please contact the site administrator.";
        }
        send({ type: "error", message });
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
