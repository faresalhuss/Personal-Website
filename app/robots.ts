import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

// AI answer-engine crawlers the owner explicitly WANTS reading the site, so
// ChatGPT, Perplexity, Claude, and Gemini can cite it. These are listed
// alongside the wildcard rule (which already permits them) to be unambiguous.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search
  "ChatGPT-User", // ChatGPT browsing on a user's behalf
  "ClaudeBot", // Anthropic
  "anthropic-ai", // Anthropic
  "Claude-Web", // Anthropic
  "PerplexityBot", // Perplexity
  "Perplexity-User", // Perplexity browsing on a user's behalf
  "Google-Extended", // Gemini / Vertex
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many models)
  "Amazonbot",
  "Bytespider",
  "Meta-ExternalAgent",
  "cohere-ai",
  "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General search + everyone else. /welcome is a noindex thank-you page.
      { userAgent: "*", allow: "/", disallow: "/welcome" },
      // AI answer engines: full access.
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
