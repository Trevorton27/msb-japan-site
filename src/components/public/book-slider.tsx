"use client";

import Link from "next/link";

interface BookCard {
  slug: string;
  title: string;
  author: string | null;
  imageUrl: string | null;
  href: string;
}

export function BookSlider({
  books,
  heading,
  learnMoreLabel,
}: {
  books: BookCard[];
  heading: string;
  learnMoreLabel: string;
}) {
  if (books.length === 0) return null;

  return (
    <div
      className="flex gap-6 overflow-x-auto pb-4"
      style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
    >
      {books.map((book) => (
        <Link
          key={book.slug}
          href={book.href}
          className="group shrink-0 w-44 sm:w-52"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="overflow-hidden rounded-sm bg-charcoal-200 shadow-md transition-shadow group-hover:shadow-lg">
            {book.imageUrl ? (
              <img
                src={book.imageUrl}
                alt={book.title}
                className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-64 w-full items-center justify-center bg-[#1e3560]/10 px-4 text-center">
                <span className="text-sm font-medium text-[#1e3560]">
                  {book.title}
                </span>
              </div>
            )}
          </div>
          <div className="mt-3 px-1">
            <p className="text-sm font-semibold leading-snug text-[#1e3560] group-hover:underline">
              {book.title}
            </p>
            {book.author && (
              <p className="mt-1 text-xs text-charcoal-500">{book.author}</p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
