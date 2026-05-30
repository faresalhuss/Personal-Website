import {
  type Book,
  currentlyReading,
  featuredLists,
  readingHistory,
} from "@/lib/books";

import { BookCover } from "./book-cover";

function marqueeBooks(): Book[] {
  const seen = new Set<string>();
  const out: Book[] = [];
  for (const b of [
    ...featuredLists.flatMap((l) => l.books),
    ...currentlyReading,
    ...readingHistory,
  ]) {
    if (!seen.has(b.key)) {
      seen.add(b.key);
      out.push(b);
    }
  }
  return out.slice(0, 16);
}

/** Decorative scrolling band of covers — adds visual weight up top. */
export function BooksMarquee() {
  const row = marqueeBooks();
  const doubled = [...row, ...row];

  return (
    <div
      aria-hidden="true"
      className="relative -mx-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)] py-2 sm:-mx-10"
    >
      <div className="marquee-track gap-4">
        {doubled.map((b, i) => (
          <div key={`${b.key}-${i}`} className="w-24 shrink-0 sm:w-28">
            <BookCover book={b} />
          </div>
        ))}
      </div>
    </div>
  );
}
