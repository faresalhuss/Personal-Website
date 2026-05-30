import type { Metadata } from "next";
import Link from "next/link";

import { Section } from "@/components/section";
import { getPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays from Fa'res Husseini on building small businesses, what works, what doesn't, and what to take from the mistakes.",
  alternates: { canonical: "/writing" },
  openGraph: {
    type: "website",
    url: "/writing",
    title: "Writing — Fa'res Husseini",
    description:
      "Essays on building small businesses, what works, what doesn't, and what to take from the mistakes.",
    images: [
      {
        url: "/api/og?eyebrow=Writing",
        width: 1200,
        height: 630,
        alt: "Writing",
      },
    ],
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function WritingIndex() {
  const posts = await getPosts();

  return (
    <Section className="pt-32 pb-20 sm:pt-40">
      <p className="eyebrow mb-4">Essays</p>
      <h1 className="font-display text-6xl text-ink sm:text-8xl">Writing</h1>

      {posts.length === 0 ? (
        <div className="mt-8 max-w-prose text-lg text-ink-dim">
          <p>
            Nothing here yet. The first essay is on its way. Until then, the{" "}
            <Link
              href="/#newsletter"
              className="text-lime underline underline-offset-4"
            >
              weekly note
            </Link>{" "}
            is the best way to follow along.
          </p>
        </div>
      ) : (
        <ul className="mt-10 divide-y divide-line border-t border-line">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/writing/${post.slug}`} className="group block py-7">
                <p className="text-xs tracking-widest text-ink-faint uppercase">
                  {formatDate(post.date)} &middot; {post.readingTimeMinutes} min
                  read
                  {post.draft ? " · draft" : ""}
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink normal-case transition-colors group-hover:text-lime">
                  {post.title}
                </h2>
                <p className="mt-2 text-lg text-ink-dim">{post.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
