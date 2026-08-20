import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./site-header";

describe("SiteHeader", () => {
  it("exposes primary navigation and both conversion paths", () => {
    render(
      <SiteHeader
        githubUrl="https://github.com/example/bento"
        signupUrl="https://app.bento.dev/sign-up"
      />,
    );

    const navigation = screen.getByRole("navigation", { name: "Primary" });
    expect(within(navigation).getByRole("link", { name: "Product" })).toHaveAttribute(
      "href",
      "/#product",
    );
    expect(
      within(navigation).getByRole("link", { name: "How it works" }),
    ).toHaveAttribute("href", "/#how-it-works");
    expect(
      within(navigation).getByRole("link", { name: "Integrations" }),
    ).toHaveAttribute("href", "/#integrations");
    expect(within(navigation).getByRole("link", { name: "Security" })).toHaveAttribute(
      "href",
      "/#security",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/example/bento",
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "https://app.bento.dev/sign-up",
    );
  });
});
