import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./site-footer";

describe("SiteFooter", () => {
  it("links to the accessibility statement", () => {
    render(<SiteFooter githubUrl={null} signupUrl={null} />);

    expect(
      screen.getByRole("link", { name: "Accessibility" }),
    ).toHaveAttribute("href", "/accessibility");
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute(
      "href",
      "/#security",
    );
  });
});
