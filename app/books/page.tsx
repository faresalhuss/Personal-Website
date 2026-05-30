import type { Metadata } from "next";

import { BookCard } from "@/components/book-card";
import { BookGrid } from "@/components/book-grid";
import { BooksMarquee } from "@/components/books-marquee";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/section";
import {
  currentlyReading,
  eReader,
  featuredLists,
  readingHistory,
  totalBooksRead,
} from "@/lib/books";
import { site } from "@/lib/site";
import {
  bookListSchema,
  breadcrumbSchema,
  websiteSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Books",
  description: `What Fa'res is reading, his favorite books by theme, and a running reading history of ${totalBooksRead}+ finished books, with Amazon links.`,
  alternates: { canonical: "/books" },
  openGraph: {
    type: "website",
    url: "/books",
    title: "Books — Fa'res Husseini",
    description:
      "What I'm reading, my favorites by theme, and my full reading history.",
    images: [
      { url: "/api/og?eyebrow=Books", width: 1200, height: 630, alt: "Books" },
    ],
  },
};

const historyGrid =
  "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5";
const featureGrid = "grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3";

const favoritesCount = featuredLists.reduce((n, l) => n + l.books.length, 0);

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-5xl text-lime sm:text-7xl">{n}</span>
      <span className="mt-1 text-[0.7rem] font-semibold tracking-widest text-ink-dim uppercase">
        {label}
      </span>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Section width="wide" className="pt-32 pb-24 sm:pt-40">
      <JsonLd data={websiteSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Books", url: `${site.url}/books` },
        ])}
      />
      {featuredLists.map((list) => (
        <JsonLd key={list.slug} data={bookListSchema(list)} />
      ))}
      <JsonLd
        data={bookListSchema({
          slug: "reading-history",
          title: "Reading history",
          books: readingHistory,
        })}
      />

      <p className="eyebrow mb-4">Reading</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">Books</h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-dim">
        What I&rsquo;m reading, the ones I&rsquo;d actually recommend, and
        everything I&rsquo;ve finished. Grouped so you can skip to what you care
        about.
      </p>

      <div className="mt-10">
        <BooksMarquee />
      </div>

      <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-y border-line py-8">
        <Stat n={totalBooksRead} label="Books finished" />
        <Stat n={currentlyReading.length} label="Reading now" />
        <Stat n={favoritesCount} label="Favorites" />
      </div>

      {/* FTC / Amazon Associates disclosure — required near affiliate links. */}
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-ink-faint">
        Some links on this page are Amazon affiliate links. As an Amazon
        Associate I earn from qualifying purchases, at no extra cost to you.
      </p>

      {currentlyReading.length > 0 ? (
        <div className="mt-20">
          <h2 className="font-display text-3xl text-lime sm:text-4xl">
            Currently reading
          </h2>
          <p className="mt-2 max-w-2xl text-base text-ink-dim">
            What I&rsquo;m working through right now, or what&rsquo;s next in
            the pipeline.
          </p>
          <BookGrid className={`max-w-3xl ${featureGrid}`}>
            {currentlyReading.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </BookGrid>
        </div>
      ) : null}

      {featuredLists.map((list) => (
        <div key={list.slug} id={list.slug} className="mt-20 scroll-mt-28">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">
            {list.title}
          </h2>
          {list.blurb ? (
            <p className="mt-2 max-w-2xl text-base text-ink-dim">
              {list.blurb}
            </p>
          ) : null}
          <BookGrid className={historyGrid}>
            {list.books.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </BookGrid>
        </div>
      ))}

      <div id="reading-history" className="mt-24 scroll-mt-28">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-10">
          <h2 className="font-display text-4xl text-ink sm:text-6xl">
            Reading history
          </h2>
          <span className="text-sm font-semibold tracking-widest text-ink-faint uppercase">
            {totalBooksRead} books
          </span>
        </div>
        <BookGrid className={historyGrid}>
          {readingHistory.map((book) => (
            <BookCard key={book.key} book={book} />
          ))}
        </BookGrid>
      </div>

      <p className="mt-20 border-t border-line pt-8 text-sm text-ink-faint">
        Read on the{" "}
        <a
          href={eReader.url}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="font-medium text-ink underline-offset-4 transition-colors hover:text-lime hover:underline"
        >
          {eReader.name}
        </a>
        , my e-reader of choice.
      </p>
    </Section>
  );
}
