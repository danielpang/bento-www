import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingHomeHeadline,
  marketingHomePromise,
  marketingProblemHeading,
  siteDisambiguation,
  siteName,
} from "@/lib/copy";
import Home, { metadata as homepageMetadata } from "./page";

describe("Bento landing page", () => {
  it("presents the redesigned product story in a single accessible document", () => {
    const { container } = render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Your agents\.\s*One shipping team\./,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: marketingProblemHeading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Control how agents move\.\s*Keep the boundaries clear\./,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Start a card from Linear or Slack.",
      }),
    ).toBeInTheDocument();
    expect(container.querySelector("#product")).toBeInTheDocument();
    expect(container.querySelector("#security")).toBeInTheDocument();
    expect(container.querySelector("#integrations")).toBeInTheDocument();
  });

  it("keeps prohibited dash characters out of visible copy", () => {
    const { container } = render(<Home />);

    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("keeps the machine-only disambiguation line out of the visible page", () => {
    const { container } = render(<Home />);

    expect(container.textContent).not.toContain(siteDisambiguation);
    expect(container.textContent).not.toMatch(/Not to be confused/);
  });

  it("keeps heading levels in document order", () => {
    render(<Home />);
    const levels = screen
      .getAllByRole("heading")
      .map((heading) => Number(heading.tagName.slice(1)));

    expect(
      levels.every(
        (level, index) => index === 0 || level <= levels[index - 1]! + 1,
      ),
    ).toBe(true);
  });

  it("renders the initial hero without waiting for animation", () => {
    const { container } = render(<Home />);

    expect(container.querySelector(".hero-copy")).not.toHaveStyle({
      opacity: "0",
    });
    expect(container.querySelector(".hero-visual")).not.toHaveStyle({
      opacity: "0",
    });
  });
});

describe("homepage metadata", () => {
  it("matches the redesigned hero instead of the control slogan", () => {
    expect(homepageMetadata.title).toEqual({
      absolute: `${siteName} | ${marketingHomeHeadline}`,
    });
    expect(homepageMetadata.description).toBe(marketingHomePromise);
    expect(homepageMetadata.openGraph).toMatchObject({
      title: `${siteName} | ${marketingHomeHeadline}`,
      description: marketingHomePromise,
    });
  });
});
