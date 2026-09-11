"use client";

import { Check, Copy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { cliInstallCommand } from "@/lib/copy";

/**
 * The one line that installs the CLI, with a button that copies it.
 *
 * The prompt glyph is drawn in CSS so selecting the text by hand never picks
 * it up. If the clipboard is unavailable (an insecure origin, or the browser
 * refuses), the command is selected instead so a keyboard copy still works.
 */
export function InstallCommand() {
  const command = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cliInstallCommand);
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
    <div className="install-command">
      <span className="install-command-label">Or install the CLI</span>
      <div className="install-command-box">
        <code ref={command}>{cliInstallCommand}</code>
        <button
          aria-label={copied ? "Copied install command" : "Copy install command"}
          data-copied={copied ? "" : undefined}
          onClick={copy}
          type="button"
        >
          {copied ? <Check aria-hidden="true" size={16} weight="bold" /> : <Copy aria-hidden="true" size={16} />}
        </button>
      </div>
      <span className="sr-only" role="status">{copied ? "Copied to clipboard" : ""}</span>
    </div>
  );
}
