"use client";

import Image from "next/image";
import { useState } from "react";

import { type Book, bookCoverSrc } from "@/lib/books";
import { cn } from "@/lib/cn";

/**
 * Uniform 2:3 book cover. Fetches by ISBN (Open Library) or uses a custom
 * coverUrl, via next/image with object-cover so covers are never stretched.
 * Falls back to a clean typographic cover if the image is missing.
 */
export function BookCover({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
  const src = bookCoverSrc(book);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-night-soft shadow-lg shadow-black/40 transition duration-300 group-hover:border-lime/40 group-hover:shadow-xl group-hover:shadow-black/60",
        className,
      )}
    >
      {!src || failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center">
          <span className="font-display text-sm leading-tight text-ink uppercase">
            {book.title}
          </span>
          <span className="text-[0.7rem] text-ink-faint">{book.author}</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={`${book.title} by ${book.author}`}
          fill
          sizes="(min-width: 1024px) 12rem, (min-width: 640px) 22vw, 42vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
