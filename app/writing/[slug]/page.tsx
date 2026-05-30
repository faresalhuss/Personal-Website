import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { MdxContent } from "@/components/mdx-content";
import { Section } from "@/components/section";
import { site } from "@/lib/site";
import {
  articleSchema,
  breadcrumbSchema,
  personSchema,
  websiteSchema,
} from "@/lib/structured-data";
import { buildToc, getPostBySlug, getPosts, postUrl } from "@/lib/writing";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: postUrl(post.slug),
      publishedTime: post.date,
      images: [
        { url: post.ogImage, width: 1200, height: 630, alt: post.title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage],
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function EssayPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = buildToc(post.content);

  return (
    <article className="pt-32 pb-16 sm:pt-40">
      <JsonLd data={websiteSchema()} />
      <JsonLd data={personSchema()} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          url: postUrl(post.slug),
          datePublished: post.date,
          ogImage: post.ogImage.startsWith("http")
            ? post.ogImage
            : `${site.url}${post.ogImage}`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: site.url },
          { name: "Writing", url: `${site.url}/writing` },
          { name: post.title, url: postUrl(post.slug) },
        ])}
      />

      <Section>
        <header>
          <p className="text-xs tracking-widest text-ink-faint uppercase">
            {formatDate(post.date)} &middot; {post.readingTimeMinutes} min read
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.02] text-ink normal-case sm:text-7xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-ink-dim sm:text-xl">
            {post.description}
          </p>
        </header>

        {toc.length >= 3 ? (
          <nav
            aria-label="Table of contents"
            className="mt-10 rounded-[var(--radius-card)] border border-line bg-night-soft p-5"
          >
            <p className="text-xs font-semibold tracking-widest text-ink-faint uppercase">
              On this page
            </p>
            <ul className="mt-3 space-y-1.5 text-base">
              {toc.map((item) => (
                <li
                  key={item.id}
                  className={item.depth === 3 ? "pl-4" : undefined}
                >
                  <a
                    href={`#${item.id}`}
                    className="text-ink-dim underline-offset-4 hover:text-lime hover:underline"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="essay-prose mt-12">
          <MdxContent source={post.content} />
        </div>
      </Section>
    </article>
  );
}
