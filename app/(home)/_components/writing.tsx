import Link from "next/link";

import { Placeholder } from "@/components/placeholder";
import { getPosts } from "@/lib/writing";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function Writing() {
  const posts = await getPosts();

  return (
    <section
      id="writing"
      className="border-y border-line bg-night-soft py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-4">Latest</p>
            <h2 className="font-display text-6xl sm:text-8xl">Writing</h2>
          </div>
          <Link
            href="/writing"
            className="hidden text-xs tracking-widest text-ink-dim uppercase transition-colors hover:text-lime sm:block"
          >
            All essays &rarr;
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-line bg-night p-10 text-center sm:p-16">
            <p className="mx-auto max-w-md text-lg text-ink-dim">
              The first essay is on its way. Until then, the weekly note is the
              best way to follow along.
            </p>
            <a href="#newsletter" className="btn-lime mt-7">
              Get the newsletter
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 6).map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-night transition-colors hover:border-lime/60"
              >
                <Placeholder
                  label="Essay image"
                  ratioClass="aspect-[16/9]"
                  className="rounded-none border-0 border-b border-line"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs tracking-widest text-ink-faint uppercase">
                    {formatDate(post.date)} &middot; {post.readingTimeMinutes}{" "}
                    min
                  </p>
                  <h3 className="mt-3 font-display text-2xl normal-case transition-colors group-hover:text-lime">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-dim">
                    {post.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
