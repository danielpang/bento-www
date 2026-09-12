import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyableCodeBlock } from "./copyable-code-block";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
}

describe("CopyableCodeBlock", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
    window.getSelection()?.removeAllRanges();
  });

  it("places a copy control to the right of the command", () => {
    const { container } = render(
      <CopyableCodeBlock code="bento --version">
        <code>bento --version</code>
      </CopyableCodeBlock>,
    );

    const box = container.querySelector(".docs-code") as HTMLElement;
    const button = screen.getByRole("button", { name: "Copy command" });
    expect(box.children[0]?.tagName).toBe("PRE");
    expect(box.children[1]).toBe(button);
  });

  it("copies the command and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(
      <CopyableCodeBlock code={"bento update\nbento"}>
        <code>bento update{"\n"}bento</code>
      </CopyableCodeBlock>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

    expect(await screen.findByRole("button", { name: "Copied command" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("bento update\nbento");
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });

  it("selects the command when the clipboard refuses", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(
      <CopyableCodeBlock code="bento --version">
        <code>bento --version</code>
      </CopyableCodeBlock>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Copy command" }));

    await vi.waitFor(() => expect(window.getSelection()?.toString()).toBe("bento --version"));
    expect(screen.getByRole("button", { name: "Copy command" })).toBeInTheDocument();
  });
});
