import type { MetadataRoute } from "next";

import { getIssues, issueUrl } from "@/lib/newsletter";
import { site } from "@/lib/site";
import { getPosts, postUrl } from "@/lib/writing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, issues] = await Promise.all([getPosts(), getIssues()]);
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/books`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/quiz`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/reading-list`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${site.url}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${site.url}/accessibility`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Only advertise /writing once it has at least one published essay — it's
  // noindex while empty, so it shouldn't appear in the sitemap either.
  if (posts.length > 0) {
    staticRoutes.push({
      url: `${site.url}/writing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  // Same for the newsletter archive — listed once it has at least one issue.
  if (issues.length > 0) {
    staticRoutes.push({
      url: `${site.url}/newsletter`,
      lastModified: new Date(issues[0]!.date),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  const essays: MetadataRoute.Sitemap = posts.map((post) => ({
    url: postUrl(post.slug),
    lastModified: new Date(post.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const newsletterIssues: MetadataRoute.Sitemap = issues.map((issue) => ({
    url: `${site.url}${issueUrl(issue.slug)}`,
    lastModified: new Date(issue.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...essays, ...newsletterIssues];
}
