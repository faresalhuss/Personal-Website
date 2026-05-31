import { bookCoverSrc, type BookList } from "@/lib/books";
import { site } from "@/lib/site";

const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;
const CLICKS_CLIENTS_ID = "https://clicksclients.com/#organization";
const ANIMEDIC_ID = `${site.url}/#animedic`;

/** Clicks & Clients — the marketing firm Fa'res founded. */
function clicksClientsSchema(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": CLICKS_CLIENTS_ID,
    name: "Clicks & Clients",
    url: "https://clicksclients.com",
    description:
      "Marketing firm founded by Fa'res Husseini in 2025, helping small businesses grow.",
    founder: { "@id": PERSON_ID },
    foundingDate: "2025-08",
  };
}

/** Animedic — the pet-health startup Fa'res co-founded. */
function animedicSchema(): Record<string, unknown> {
  return {
    "@type": "Organization",
    "@id": ANIMEDIC_ID,
    name: "Animedic",
    description:
      "Pet health app and practice tool for veterinarians, co-founded by Fa'res Husseini in 2026.",
    founder: { "@id": PERSON_ID },
    foundingDate: "2026-03",
  };
}

/** The canonical Person node. Referenced by @id elsewhere to avoid duplication. */
export function personSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: site.author.name,
    givenName: site.author.firstName,
    familyName: "Husseini",
    url: site.url,
    mainEntityOfPage: `${site.url}/about`,
    image: `${site.url}/fares-portrait.jpg`,
    description:
      "Fa'res Husseini is an entrepreneur, creator, and writer building small businesses, including the marketing firm Clicks & Clients and the pet-health startup Animedic.",
    jobTitle: "Entrepreneur, creator, and writer",
    homeLocation: {
      "@type": "Place",
      name: site.author.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Atlanta",
        addressRegion: "GA",
        addressCountry: "US",
      },
    },
    knowsAbout: [
      "Marketing",
      "Digital marketing",
      "Entrepreneurship",
      "Small business",
      "Startups",
      "Building a business from zero",
    ],
    knowsLanguage: ["en", "ar"],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "San Diego State University",
    },
    worksFor: [{ "@id": CLICKS_CLIENTS_ID }, { "@id": ANIMEDIC_ID }],
    founder: [{ "@id": CLICKS_CLIENTS_ID }, { "@id": ANIMEDIC_ID }],
    sameAs: site.sameAs,
  };
}

export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    alternateName: "fareshusseini.com",
    url: site.url,
    description: site.description,
    inLanguage: "en-US",
    publisher: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    copyrightHolder: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
  };
}

/**
 * Single connected @graph for the homepage. Emitting Person, WebSite, and the
 * organizations together (cross-referenced by @id) gives search and AI engines
 * one authoritative, de-duplicated entity description for "Fa'res Husseini".
 */
export function homeGraphSchema(): Record<string, unknown> {
  const person = personSchema();
  const website = websiteSchema();
  delete person["@context"];
  delete website["@context"];
  return {
    "@context": "https://schema.org",
    "@graph": [
      person,
      website,
      clicksClientsSchema(),
      animedicSchema(),
    ],
  };
}

/** ProfilePage is the 2026 best practice for an "about me" page. */
export function profilePageSchema(): Record<string, unknown> {
  const person = personSchema();
  delete person["@context"];
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${site.url}/about`,
    name: `About ${site.name}`,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: person,
  };
}

/** FAQPage — answers the questions people (and AI engines) actually ask. */
export function faqSchema(
  items: Array<{ question: string; answer: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
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
