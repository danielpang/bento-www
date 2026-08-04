import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AccessibilityPage, { metadata } from "./page";

describe("Accessibility statement", () => {
  it("states Bento's accessibility commitment", () => {
    render(<AccessibilityPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Accessibility at Bento",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/keyboard and assistive technology/i),
    ).toBeInTheDocument();
    expect(metadata.openGraph).toMatchObject({
      title: "Accessibility at Bento",
      url: "/accessibility",
    });
  });
});
