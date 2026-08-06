import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BrandLockup } from "./brand-lockup";

describe("BrandLockup", () => {
  it("uses the Bento logo asset in the home link", () => {
    render(<BrandLockup />);

    const homeLink = screen.getByRole("link", { name: "Bento home" });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink.querySelector("img")).toHaveAttribute(
      "src",
      "/bento-logo.svg",
    );
  });
});
