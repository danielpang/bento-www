"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * A fenced command in the docs, with a button that copies it.
 *
 * The control sits to the right of the snippet so it never covers the text.
 * If the clipboard is unavailable, the command is selected instead so a
 * keyboard copy still works.
 */
interface CopyableCodeBlockProps {
  children: ReactNode;
  code: string;
}

export function CopyableCodeBlock({ children, code }: CopyableCodeBlockProps) {
  const command = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      const node = command.current;
      if (!node) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    }
  }

  return (
    <div className="docs-code">
      <pre ref={command}>{children}</pre>
      <button
        aria-label={copied ? "Copied command" : "Copy command"}
        data-copied={copied ? "" : undefined}
        onClick={copy}
        type="button"
      >
        {copied ? <Check aria-hidden="true" size={16} weight="bold" /> : <Copy aria-hidden="true" size={16} />}
      </button>
      <span className="sr-only" role="status">{copied ? "Copied to clipboard" : ""}</span>
    </div>
  );
}
