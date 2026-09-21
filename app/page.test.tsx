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
        name: marketingHomeHeadline,
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

  it("gives every image an alt text and every graphic an accessible name", () => {
    const { container } = render(<Home />);

    // Raster images need alt text. An empty alt is only right for a
    // purely decorative picture, and the landing page has none.
    const images = Array.from(container.querySelectorAll("img"));
    for (const image of images) {
      expect(image.getAttribute("alt")?.trim(), image.outerHTML).toBeTruthy();
    }

    // Inline SVGs are either decorative (hidden from assistive
    // technology, with the meaning carried by adjacent text) or named.
    const graphics = Array.from(container.querySelectorAll("svg"));
    expect(graphics.length).toBeGreaterThan(0);
    for (const graphic of graphics) {
      const decorative = graphic.getAttribute("aria-hidden") === "true";
      const named =
        Boolean(graphic.getAttribute("aria-label")) ||
        Boolean(graphic.getAttribute("aria-labelledby")) ||
        Boolean(graphic.querySelector("title"));
      expect(decorative || named, graphic.outerHTML).toBe(true);
    }

    // Diagrams built from markup announce what they depict.
    const figures = Array.from(container.querySelectorAll("figure"));
    expect(figures.length).toBeGreaterThan(0);
    for (const figure of figures) {
      const named =
        Boolean(figure.getAttribute("aria-label")) ||
        Boolean(figure.getAttribute("aria-labelledby")) ||
        Boolean(figure.querySelector("figcaption")?.textContent?.trim());
      expect(named, figure.outerHTML.slice(0, 200)).toBe(true);
    }

    // Videos carry their description as an accessible name.
    for (const video of Array.from(container.querySelectorAll("video"))) {
      expect(video.getAttribute("aria-label")?.trim(), video.outerHTML).toBeTruthy();
    }
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
