import { amazonHref, type Book } from "@/lib/books";

import { BookCover } from "./book-cover";

// Affiliate links must carry rel="sponsored" (Google) and open safely.
const AFFILIATE_REL = "sponsored noopener noreferrer";

export function BookCard({ book }: { book: Book }) {
  const href = amazonHref(book);

  return (
    <div className="flex flex-col">
      <a
        href={href}
        target="_blank"
        rel={AFFILIATE_REL}
        aria-label={`${book.title} by ${book.author} — view on Amazon`}
        className="group block"
      >
        <BookCover
          book={book}
          className="transition-transform duration-300 group-hover:-translate-y-1"
        />
      </a>
      <a
        href={href}
        target="_blank"
        rel={AFFILIATE_REL}
        className="mt-3 font-display text-base leading-snug text-ink normal-case transition-colors hover:text-lime"
      >
        {book.title}
      </a>
      <p className="text-xs text-ink-dim">{book.author}</p>
      {book.note ? (
        <p className="mt-1 text-xs text-ink-faint">{book.note}</p>
      ) : null}
    </div>
  );
}
