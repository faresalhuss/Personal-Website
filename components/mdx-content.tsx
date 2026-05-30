import rehypeShiki from "@shikijs/rehype";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { AnchorHTMLAttributes } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            "aria-label": "Link to this section",
          },
          content: {
            type: "element",
            tagName: "span",
            properties: {},
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
      [rehypeShiki, { theme: "github-light" }],
    ],
  },
};

function Anchor({
  href = "",
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal =
    /^https?:\/\//.test(href) && !href.includes("fareshusseini.com");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

const components = {
  a: Anchor,
};

export function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote source={source} options={options} components={components} />
  );
}
