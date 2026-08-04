import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaLink } from "./cta-link";

describe("CtaLink", () => {
  it("renders a reachable link when a destination exists", () => {
    render(
      <CtaLink href="https://app.bento.dev/sign-up">Sign up</CtaLink>,
    );

    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "https://app.bento.dev/sign-up",
    );
  });

  it("renders an accessible disabled link when configuration is missing", () => {
    render(<CtaLink href={null}>Sign up</CtaLink>);

    const control = screen.getByRole("link", { name: "Sign up" });
    expect(control).toHaveAttribute("aria-disabled", "true");
    expect(control).not.toHaveAttribute("href");
  });
});
