import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

/**
 * Everything the dashboard assistant knows about the admin dashboard. The
 * user's manual gives the friendly explanations; the admin pages, forms,
 * server actions, permissions and UI labels are included verbatim so answers
 * cover every feature and stay accurate as the code changes.
 *
 * These paths must also be listed under `outputFileTracingIncludes` in
 * next.config.ts so they are deployed with the API route.
 */
const MANUAL = "docs/admin dashboard user's manual.md";
const SOURCE_DIRS = [
  "src/app/admin",
  "src/components/admin",
  "src/server/actions",
];
// The chat widget itself isn't something staff need explained.
const EXCLUDED_FILES = new Set(["src/components/admin/admin-assistant.tsx"]);
const SOURCE_FILES = [
  "src/lib/admin-labels.ts",
  "src/lib/auth/permissions.ts",
  "src/lib/validation/schemas.ts",
];

async function listFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(full);
      return /\.(ts|tsx)$/.test(entry.name) ? [full] : [];
    })
  );
  return nested.flat();
}

async function loadKnowledge(): Promise<string> {
  const root = process.cwd();
  const read = (rel: string) => readFile(path.join(root, rel), "utf8");

  const dirFiles = (
    await Promise.all(
      SOURCE_DIRS.map(async (dir) =>
        (await listFiles(path.join(root, dir))).map((f) =>
          path.relative(root, f)
        )
      )
    )
  ).flat();
  // Sorted so the prompt is byte-identical between requests (prompt cache).
  const sourcePaths = [...new Set([...dirFiles, ...SOURCE_FILES])]
    .filter((p) => !EXCLUDED_FILES.has(p))
    .sort();

  const [manual, ...sources] = await Promise.all([
    read(MANUAL),
    ...sourcePaths.map(read),
  ]);

  const sourceBlocks = sourcePaths
    .map((p, i) => `<source path="${p}">\n${sources[i]}\n</source>`)
    .join("\n\n");

  return `<user_manual>\n${manual}\n</user_manual>\n\n<dashboard_source>\n${sourceBlocks}\n</dashboard_source>`;
}

let knowledge: Promise<string> | null = null;

export function getAssistantKnowledge(): Promise<string> {
  knowledge ??= loadKnowledge().catch((err) => {
    knowledge = null;
    throw err;
  });
  return knowledge;
}

export const ASSISTANT_INSTRUCTIONS = `You are the help assistant built into the admin dashboard of the Mangala Shri Bhuti Japan (MSB Japan) website. Staff open you from a chat window inside the dashboard to learn how to do things there: creating events, publishing content, managing users, fulfilling orders, connecting Google Calendar, and every other dashboard task.

How to answer:
- Reply in the language the person writes in: Japanese or English. If they mix languages, use the main language of their latest message.
- Give practical, step-by-step directions in terms of what they see and click: the sidebar item, the page, the button, the field names. Use the exact UI labels. In Japanese replies, use the Japanese labels from the "ja" section of src/lib/admin-labels.ts when one exists; when the UI shows a label only in English, quote it as it appears.
- The admin UI can be switched between Japanese and English with the language toggle in the top bar. The person's current setting is given below, so prefer the labels they are currently seeing.
- Link to dashboard pages with Markdown links to their paths, such as [Events](/admin/events) or [New event](/admin/events/new).
- Say which role a task needs when it matters. The person's roles and permissions are given below. If they lack the permission for a task, tell them so and which role can do it (an Administrator can grant roles under Users).
- Keep answers short and scannable: a sentence of context, then numbered steps. Use only simple Markdown: **bold**, numbered or bulleted lists, links, and \`inline code\`. No headings, tables or code blocks.
- Explain in plain, non-technical language. Do not show source code or talk about implementation details (file names, functions, database tables) unless the person explicitly asks a technical question.
- You can only explain; you cannot perform actions or see the site's data. If asked to do something, explain how they can do it themselves.

Accuracy:
- The dashboard source code below is the ground truth for what the dashboard does today. The user manual explains things in friendly terms but may be out of date or incomplete. Where they disagree, follow the source code.
- Never invent buttons, fields, pages or features. If the dashboard cannot do something, say so plainly, and suggest the closest thing it can do or that they contact the site's technical administrator.
- If a question is ambiguous (for example "how do I add a member", which could mean granting member-portal access or registering a member for an event), answer the most likely meaning briefly and mention the other.
- For questions unrelated to the dashboard or website administration, say briefly that you can only help with the admin dashboard.

Reference material follows.`;
