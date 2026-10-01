/**
 * Outline list items are written "Label：text" (JA) or "Label: text" (EN).
 * Split them for display while keeping the source string intact.
 */
export function splitListItem(item: string): {
  label: string;
  sep: string;
  text: string;
} {
  const match = item.match(/^(.+?)(：|: )(.*)$/);
  return match
    ? { label: match[1] ?? item, sep: match[2] ?? "", text: match[3] ?? "" }
    : { label: item, sep: "", text: "" };
}
