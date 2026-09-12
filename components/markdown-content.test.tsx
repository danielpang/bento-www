import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MarkdownContent } from "./markdown-content";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
}

describe("MarkdownContent", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
    window.getSelection()?.removeAllRanges();
  });

  it("puts a copy control on each fenced command and not on inline code", () => {
    const { container } = render(
      <MarkdownContent
        content={`# Title

\`\`\`bash
pnpm dev
\`\`\`

Use \`inline\` here.

\`\`\`sh
bento --version
\`\`\`

\`\`\`yaml
name: Default
\`\`\`
`}
      />,
    );

    const buttons = screen.getAllByRole("button", { name: "Copy command" });
    expect(buttons).toHaveLength(3);
    expect(container.querySelector("code.language-bash")?.closest(".docs-code")).toContainElement(buttons[0]);
    expect(container.querySelector("code.language-sh")?.closest(".docs-code")).toContainElement(buttons[1]);
    expect(container.querySelector("code.language-yaml")?.closest(".docs-code")).toContainElement(buttons[2]);
    expect(screen.getByText("inline").closest(".docs-code")).toBeNull();
  });

  it("copies the fenced command without a trailing newline", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(
      <MarkdownContent
        content={`# Title

\`\`\`bash
curl -fsSL https://usebento.ai/install.sh | sh
\`\`\`
`}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(writeText).toHaveBeenCalledWith("curl -fsSL https://usebento.ai/install.sh | sh");
    expect(await screen.findByRole("button", { name: "Copied command" })).toBeInTheDocument();
  });
});
