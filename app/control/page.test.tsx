import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cliInstallCommand } from "@/lib/copy";
import ControlPage from "./page";

describe("control homepage", () => {
  it("wears the redesign charcoal tokens while keeping the original layout", () => {
    const { container } = render(<ControlPage />);

    expect(container.firstElementChild).toHaveClass("control-page");
    expect(container.firstElementChild).toHaveAttribute(
      "data-marketing-variant",
      "control",
    );
  });

  it("offers the CLI install command below the signup CTA", () => {
    const { container } = render(<ControlPage />);

    const cta = container.querySelector(".hero .hero-actions");
    const install = container.querySelector(".hero .install-command");
    expect(cta).not.toBeNull();
    expect(install).not.toBeNull();
    expect(cta!.compareDocumentPosition(install!)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(install).toHaveTextContent(cliInstallCommand);
    expect(within(install as HTMLElement).getByRole("button", { name: "Copy install command" })).toBeInTheDocument();
  });
});
