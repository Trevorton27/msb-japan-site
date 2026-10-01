import Link from "next/link";
import { splitListItem } from "@/lib/content/list-item";

export type LineageBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "reference"; text: string };

export function LineageArticle({
  title,
  blocks,
  backHref,
  backLabel,
}: {
  title: string;
  blocks: LineageBlock[];
  backHref: string;
  backLabel: string;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-charcoal-900 text-3xl font-bold">{title}</h1>
      <div className="mt-8 space-y-5">
        {blocks.map((block, idx) => {
          switch (block.kind) {
            case "paragraph":
              return (
                <p key={idx} className="text-charcoal-600 leading-relaxed">
                  {block.text}
                </p>
              );
            case "list":
              return (
                <ul
                  key={idx}
                  className="border-burgundy-500 space-y-3 border-l-2 pl-5"
                >
                  {block.items.map((item) => {
                    const { label, sep, text } = splitListItem(item);
                    return (
                      <li
                        key={item}
                        className="text-charcoal-600 leading-relaxed"
                      >
                        <span className="text-charcoal-900 font-semibold">
                          {label}
                        </span>
                        {sep}
                        {text}
                      </li>
                    );
                  })}
                </ul>
              );
            case "reference":
              return (
                <p
                  key={idx}
                  className="border-charcoal-200 text-charcoal-500 border-t pt-5 text-sm italic"
                >
                  {block.text}
                </p>
              );
          }
        })}
      </div>
      <Link
        href={backHref}
        className="text-burgundy-600 hover:text-burgundy-700 mt-12 inline-block text-sm font-semibold transition-colors"
      >
        ← {backLabel}
      </Link>
    </article>
  );
}
