import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("links to docs, license, and terms, and reuses the GitHub env URL", () => {
    render(
      <SiteFooter
        githubUrl="https://github.com/danielpang/bento"
        signupUrl={null}
      />,
    );

    const footer = screen.getByRole("contentinfo");

    expect(
      within(footer).getByRole("link", { name: "GitHub" }),
    ).toHaveAttribute("href", "https://github.com/danielpang/bento");
    expect(
      within(footer).getByRole("link", { name: "Documentation" }),
    ).toHaveAttribute("href", "/docs");
    expect(
      within(footer).getByRole("link", { name: "License" }),
    ).toHaveAttribute("href", "/license");
    expect(within(footer).getByRole("link", { name: "Terms" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(
      within(footer).queryByRole("link", { name: "Accessibility" }),
    ).not.toBeInTheDocument();
    expect(
      within(footer).queryByRole("link", { name: "Security" }),
    ).not.toBeInTheDocument();
  });

  it("can hide the final marketing CTA", () => {
    render(
      <SiteFooter
        githubUrl="https://github.com/danielpang/bento"
        showFinalCta={false}
        signupUrl={null}
      />,
    );

    expect(
      screen.queryByRole("heading", {
        name: "Give every feature a clear next step.",
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
