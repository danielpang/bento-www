import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cliInstallCommand } from "@/lib/copy";
import { InstallCommand } from "./install-command";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
}

describe("InstallCommand", () => {
  afterEach(() => {
    Reflect.deleteProperty(navigator, "clipboard");
    window.getSelection()?.removeAllRanges();
  });

  it("installs the CLI from the Bento domain", () => {
    render(<InstallCommand />);

    expect(cliInstallCommand).toBe("curl -fsSL https://usebento.ai/install.sh | sh");
    expect(screen.getByText(cliInstallCommand)).toBeInTheDocument();
  });

  it("accepts a contextual label", () => {
    render(<InstallCommand label="Copy and run in your terminal" />);

    expect(screen.getByText("Copy and run in your terminal")).toBeInTheDocument();
  });

  it("copies the command and confirms it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<InstallCommand />);

    fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));

    expect(await screen.findByRole("button", { name: "Copied install command" })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(cliInstallCommand);
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });

  it("selects the command when the clipboard refuses", async () => {
    mockClipboard(vi.fn().mockRejectedValue(new Error("denied")));
    render(<InstallCommand />);

    fireEvent.click(screen.getByRole("button", { name: "Copy install command" }));

    await vi.waitFor(() => expect(window.getSelection()?.toString()).toBe(cliInstallCommand));
    expect(screen.getByRole("button", { name: "Copy install command" })).toBeInTheDocument();
  });
});
