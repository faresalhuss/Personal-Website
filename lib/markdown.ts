import "server-only";

import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

/** Render MDX/markdown body to an HTML string (for RSS content:encoded). */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
