"use client";

import { Fragment, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { MessageCircleQuestionIcon, SendIcon, RotateCcwIcon, XIcon } from "lucide-react";
import {
  subscribeAdminLocale,
  getAdminLocaleSnapshot,
  getAdminLocaleServerSnapshot,
} from "@/lib/admin-locale-store";
import type { AssistantStreamEvent } from "@/app/api/admin/assistant/route";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const labels = {
  ja: {
    open: "ダッシュボード・アシスタントを開く",
    title: "ダッシュボード・アシスタント",
    close: "閉じる",
    reset: "会話をリセット",
    placeholder: "質問を入力（例：新しいイベントの作り方）",
    send: "送信",
    thinking: "考えています…",
    greeting:
      "こんにちは。管理ダッシュボードの使い方についてご質問ください。日本語でも英語でもお答えします。",
    suggestions: [
      "新しいイベントを作成するには？",
      "ブログ記事を公開するまでの流れは？",
      "新しいユーザーを追加して役割を設定するには？",
      "Googleカレンダーと連携するには？",
    ],
    failed: "送信できませんでした。もう一度お試しください。",
  },
  en: {
    open: "Open dashboard assistant",
    title: "Dashboard Assistant",
    close: "Close",
    reset: "Reset conversation",
    placeholder: "Ask a question (e.g. how do I create an event?)",
    send: "Send",
    thinking: "Thinking…",
    greeting:
      "Hi! Ask me how to do anything in the admin dashboard. I can answer in English or Japanese.",
    suggestions: [
      "How do I create a new event?",
      "How do I get a blog post published?",
      "How do I add a new user and give them a role?",
      "How do I connect Google Calendar?",
    ],
    failed: "Couldn't send. Please try again.",
  },
} as const;

// ─── Minimal Markdown (bold, inline code, links, lists, paragraphs) ─────────

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const pattern = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[2] !== undefined) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3] !== undefined) {
      nodes.push(
        <code key={key} className="rounded bg-gray-100 px-1 py-0.5 text-[0.85em] dark:bg-gray-700">
          {match[3]}
        </code>
      );
    } else {
      const label = match[4]!;
      const href = match[5]!;
      const linkClass = "text-blue-600 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400";
      if (href.startsWith("/")) {
        nodes.push(
          <Link key={key} href={href} className={linkClass}>
            {label}
          </Link>
        );
      } else if (/^https?:\/\//.test(href)) {
        nodes.push(
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {label}
          </a>
        );
      } else {
        nodes.push(label);
      }
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const key = `p${blocks.length}`;
    blocks.push(
      <p key={key}>
        {paragraph.map((line, i) => (
          <Fragment key={i}>
            {i > 0 && <br />}
            {renderInline(line, `${key}-${i}`)}
          </Fragment>
        ))}
      </p>
    );
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    const key = `l${blocks.length}`;
    const items = list.items.map((item, i) => (
      <li key={i}>{renderInline(item, `${key}-${i}`)}</li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={key} className="list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={key} className="list-disc space-y-1 pl-5">
          {items}
        </ul>
      )
    );
    list = null;
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    if (ordered || bullet) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (list && list.ordered !== isOrdered) flushList();
      list ??= { ordered: isOrdered, items: [] };
      list.items.push((ordered ?? bullet)![1]!);
    } else if (line.trim() === "") {
      flushParagraph();
      flushList();
    } else {
      flushList();
      // Headings aren't expected, but render them as bold text if they appear.
      paragraph.push(line.replace(/^#{1,6}\s+(.*)$/, "**$1**"));
    }
  }
  flushParagraph();
  flushList();

  return <div className="space-y-2">{blocks}</div>;
}

// ─── Widget ──────────────────────────────────────────────────────────────────

export function AdminAssistant() {
  const locale = useSyncExternalStore(
    subscribeAdminLocale,
    getAdminLocaleSnapshot,
    getAdminLocaleServerSnapshot
  );
  const l = labels[locale];

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, pending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function send(question: string) {
    const text = question.trim();
    if (!text || pending) return;

    // Earlier failed turns aren't part of the conversation the model sees.
    const history = messages.filter((m) => !m.error);
    const outgoing: ChatMessage[] = [...history, { role: "user", content: text }];
    setMessages([...messages, { role: "user", content: text }]);
    setInput("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const appendToReply = (chunk: string) =>
      setMessages((prev) => {
        const last = prev.at(-1);
        if (last?.role === "assistant" && !last.error) {
          return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
        }
        return [...prev, { role: "assistant", content: chunk }];
      });
    const showError = (message: string) =>
      setMessages((prev) => [...prev, { role: "assistant", content: message, error: true }]);

    try {
      const res = await fetch("/api/admin/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: outgoing.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        showError(data?.error ?? l.failed);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as AssistantStreamEvent;
          if (event.type === "text") appendToReply(event.text);
          else if (event.type === "error") showError(event.message);
        }
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") showError(l.failed);
    } finally {
      setPending(false);
      abortRef.current = null;
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setPending(false);
  }

  const lastIsStreamingReply = pending && messages.at(-1)?.role === "assistant";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={l.open}
          className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-100 dark:text-gray-900"
        >
          <MessageCircleQuestionIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      {open && (
        <section
          aria-label={l.title}
          className="fixed right-4 bottom-4 z-50 flex h-[min(600px,calc(100vh-2rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-800"
        >
          <header className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
            <h2 className="text-sm font-semibold">{l.title}</h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={reset}
                aria-label={l.reset}
                title={l.reset}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              >
                <RotateCcwIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={l.close}
                title={l.close}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
              >
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm leading-relaxed" aria-live="polite">
            <div className="rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">{l.greeting}</div>
            {messages.length === 0 && (
              <div className="flex flex-col items-start gap-2">
                {l.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border px-3 py-1 text-left text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="ml-8 rounded-lg bg-gray-900 px-3 py-2 whitespace-pre-wrap text-white dark:bg-gray-100 dark:text-gray-900">
                  {m.content}
                </div>
              ) : (
                <div
                  key={i}
                  className={
                    m.error
                      ? "mr-8 rounded-lg bg-red-50 px-3 py-2 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "mr-8 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700"
                  }
                >
                  <Markdown text={m.content} />
                </div>
              )
            )}
            {pending && !lastIsStreamingReply && (
              <div className="mr-8 animate-pulse rounded-lg bg-gray-100 px-3 py-2 text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                {l.thinking}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 border-t p-3 dark:border-gray-700"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                // Don't send while a Japanese IME is still composing.
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={2}
              maxLength={4000}
              placeholder={l.placeholder}
              aria-label={l.placeholder}
              className="min-h-[2.5rem] flex-1 resize-none rounded-md border px-3 py-2 text-sm outline-none focus:border-gray-500 dark:border-gray-600 dark:bg-gray-900"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              aria-label={l.send}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white disabled:opacity-40 dark:bg-gray-100 dark:text-gray-900"
            >
              <SendIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
