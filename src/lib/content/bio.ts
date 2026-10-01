/**
 * Teacher bios are stored as plain text (Teacher.bioJa / bioEn) with a few
 * line markers so paragraphs, quotes and headings survive the round trip:
 *
 *   Blocks are separated by a blank line.
 *   "+ text"   tagline (the teacher's one-line description)
 *   "## text"  subheading
 *   "> text"   quote paragraph; consecutive "> " lines form one quote
 *   "~ text"   source line under the quote it belongs to
 *
 * Any other block is a plain paragraph. Bios without markers render as
 * paragraphs, so older admin-entered bios keep working.
 */
export type BioBlock =
  | { kind: "tagline"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; paragraphs: string[]; source?: string };

export function parseBio(bio: string): BioBlock[] {
  return bio
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): BioBlock => {
      if (block.startsWith("+ "))
        return { kind: "tagline", text: block.slice(2).trim() };
      if (block.startsWith("## "))
        return { kind: "heading", text: block.slice(3).trim() };
      if (block.startsWith("> ")) {
        const lines = block.split("\n").map((l) => l.trim());
        const paragraphs = lines
          .filter((l) => l.startsWith("> "))
          .map((l) => l.slice(2).trim());
        const source = lines
          .find((l) => l.startsWith("~ "))
          ?.slice(2)
          .trim();
        return source
          ? { kind: "quote", paragraphs, source }
          : { kind: "quote", paragraphs };
      }
      return { kind: "paragraph", text: block };
    });
}
