import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  new URL("app/marketing.css", `file://${process.cwd()}/`),
  "utf8",
);

describe("marketing layout", () => {
  it("keeps the desktop hero and agents above the fold without changing mobile flow", () => {
    expect(styles).toMatch(
      /@media \(min-width:\s*801px\)\s*\{\s*\.m-above-fold\s*\{[^}]*min-height:\s*calc\(100dvh - 76px\)/,
    );
    expect(styles).not.toMatch(/\.m-hero\s*\{[^}]*height:\s*100vh/);
  });
});

describe("marketing color scheme", () => {
  it("keeps the charcoal palette for dark devices", () => {
    expect(styles).toMatch(
      /html:has\(\.marketing-page\)\s*\{[^}]*color-scheme:\s*dark/,
    );
    expect(styles).toMatch(
      /html:has\(\.marketing-page\)\s*\{[^}]*--page:\s*#0b0b0c/,
    );
  });

  it("switches to white mode from the device color scheme", () => {
    expect(styles).toMatch(
      /@media \(prefers-color-scheme:\s*light\)\s*\{\s*html:has\(\.marketing-page\)\s*\{[^}]*color-scheme:\s*light/,
    );
    expect(styles).toMatch(
      /@media \(prefers-color-scheme:\s*light\)\s*\{\s*html:has\(\.marketing-page\)\s*\{[^}]*--page:\s*#ffffff/,
    );
    expect(styles).toMatch(
      /html:has\(\.marketing-page\),\s*body:has\(\.marketing-page\)\s*\{\s*background:\s*var\(--page\)/,
    );
  });
});
