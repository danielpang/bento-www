import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function textFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(textFromChildren).join("");
  }

  if (children && typeof children === "object" && "props" in children) {
    return textFromChildren(
      (children as { props: { children?: ReactNode } }).props.children,
    );
  }

  return "";
}

const components: Components = {
  a: ({ href, children }) => {
    const isExternal = Boolean(href?.startsWith("http"));
    return (
      <a
        href={href}
        rel={isExternal ? "noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {children}
      </a>
    );
  },
  h2: ({ children }) => {
    const id = slugify(textFromChildren(children));
    return <h2 id={id}>{children}</h2>;
  },
  h3: ({ children }) => {
    const id = slugify(textFromChildren(children));
    return <h3 id={id}>{children}</h3>;
  },
  table: ({ children }) => (
    <div className="docs-table-wrap">
      <table>{children}</table>
    </div>
  ),
};

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Drop the first H1; the page shell already renders the title.
  const body = content.replace(/^#\s.+\n+/, "");

  return (
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
      {body}
    </ReactMarkdown>
  );
}
