import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LicensePage, { metadata } from "./page";

describe("License", () => {
  it("allows self-hosting and forbids a competing hosted service", () => {
    render(<LicensePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Bento Source License" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/self-host the Software for yourself, your team/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/competing hosted or managed service/i),
    ).toBeInTheDocument();
    expect(metadata.openGraph).toMatchObject({
      title: "License | Bento",
      url: "/license",
    });
  });
});
