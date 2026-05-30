import { bookCoverSrc, type BookList } from "@/lib/books";
import { site } from "@/lib/site";

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

/** The canonical Person node. Referenced by @id elsewhere to avoid duplication. */
export function personSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.author.name,
    url: site.url,
    image: `${site.url}/fares-portrait.jpg`,
    description:
      "Fa'res Husseini is an entrepreneur, creator, and writer building small businesses, including the marketing firm Clicks & Clients and the pet-health startup Animedic.",
    jobTitle: "Entrepreneur, creator, and writer",
    knowsAbout: [
      "Marketing",
      "Entrepreneurship",
      "Small business",
      "Building startups",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "San Diego State University",
    },
    worksFor: [
      {
        "@type": "Organization",
        name: "Clicks & Clients",
        url: "https://clicksclients.com",
      },
      { "@type": "Organization", name: "Animedic" },
    ],
    sameAs: site.sameAs,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
  };
}

/** ProfilePage is the 2026 best practice for an "about me" page. */
export function profilePageSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/about`,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: personSchema(),
  };
}

export function articleSchema(opts: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  ogImage: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    inLanguage: "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    url: opts.url,
    image: [opts.ogImage],
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function bookListSchema(list: BookList): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    description: list.blurb,
    numberOfItems: list.books.length,
    itemListElement: list.books.map((b, i) => {
      const raw = bookCoverSrc(b);
      const cover = raw.startsWith("http") ? raw : `${site.url}${raw}`;
      return {
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Book",
          name: b.title,
          author: { "@type": "Person", name: b.author },
          ...(b.isbn ? { isbn: b.isbn } : {}),
          ...(cover ? { image: cover } : {}),
        },
      };
    }),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
