import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TermsPage, { metadata } from "./page";

describe("Terms of Use", () => {
  it("states that Bento does not train on or sell customer data", () => {
    render(<TermsPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Use" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not use your user data[\s\S]*train large language models/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not sell your user data/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/do not sell your code or code-derived data/i),
    ).toBeInTheDocument();
    expect(metadata.openGraph).toMatchObject({
      title: "Terms of Use | Bento",
      url: "/terms",
    });
  });
});
