import { render, screen, within } from "@testing-library/react";
import { notFound, permanentRedirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { changelogEntries, getChangelogEntry } from "@/lib/changelog";
import { cliInstallCommand } from "@/lib/copy";
import ChangelogEntryPage, {
  generateMetadata,
  generateStaticParams,
} from "./page";

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual<typeof import("next/navigation")>(
    "next/navigation",
  );
  return {
    ...actual,
    notFound: vi.fn(() => {
      throw new Error("NEXT_NOT_FOUND");
    }),
    permanentRedirect: vi.fn((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
    }),
  };
});

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("Changelog entry page", () => {
  it("prerenders every entry and every dated URL it used to publish under", () => {
    expect(generateStaticParams()).toEqual(
      changelogEntries.flatMap((entry) => [
        { slug: entry.slug },
        { slug: entry.date },
      ]),
    );
  });

  it("renders an entry as its own page with title, date, body, and next steps", async () => {
    const entry = getChangelogEntry("slack-integration")!;
    const { container } = render(await ChangelogEntryPage(params(entry.slug)));

    expect(
      screen.getByRole("heading", { level: 1, name: entry.title }),
    ).toBeInTheDocument();
    expect(container.querySelector("time")).toHaveAttribute("dateTime", entry.date);
    expect(screen.getByText(entry.displayDate)).toBeInTheDocument();

    const body = container.querySelector(".changelog-post-body") as HTMLElement;
    expect(body.querySelectorAll("p")).toHaveLength(entry.paragraphs.length);
    expect(
      within(body).getByText((_, element) =>
        element?.textContent ===
        "Create new Bento features by tagging @bento in Slack.",
      ),
    ).toBeInTheDocument();
    // The body is the entry as it published on the changelog, unchanged.
    expect(body.textContent).toBe(
      entry.paragraphs.join("").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
    );

    // Pricing and signup calls to action belong to the answer-shaped docs
    // pages, not to release notes; the entry only leads back to the feed.
    const footer = container.querySelector(".changelog-post-footer") as HTMLElement;
    expect(within(footer).queryByRole("link", { name: /pricing/i })).toBeNull();
    expect(within(footer).queryByRole("link", { name: /account/i })).toBeNull();
    expect(within(footer).getByRole("link", { name: "All product updates" })).toHaveAttribute(
      "href",
      "/changelog",
    );
    const crumb = container.querySelector(".changelog-post-crumb") as HTMLElement;
    expect(within(crumb).getByRole("link", { name: "Changelog" })).toHaveAttribute(
      "href",
      "/changelog",
    );
    expect(container.textContent).not.toMatch(/[—–]/);
  });

  it("links the TUI launch entry to its setup guide", async () => {
    const entry = getChangelogEntry("bento-terminal-ui")!;
    const { container } = render(await ChangelogEntryPage(params(entry.slug)));
    const body = container.querySelector(".changelog-post-body") as HTMLElement;

    expect(within(body).getByText(cliInstallCommand)).toBeInTheDocument();
    expect(within(body).getByRole("button", { name: "Copy install command" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { name: "Install the CLI" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { name: "Choose where agents run" })).toBeInTheDocument();
    expect(within(body).getByRole("heading", { name: "Set up your workflow" })).toBeInTheDocument();
    expect(within(body).getByRole("link", { name: "Bento TUI guide" })).toHaveAttribute(
      "href",
      "/docs/tui",
    );
    expect(within(body).getByRole("link", { name: "Bento TUI guide" })).not.toHaveAttribute(
      "target",
    );
  });

  it("describes the entry as a TechArticle from its visible fields", async () => {
    const entry = getChangelogEntry("google-antigravity-cli")!;
    const { container } = render(await ChangelogEntryPage(params(entry.slug)));

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data).toMatchObject({
      "@type": "TechArticle",
      headline: entry.title,
      description: entry.description,
      datePublished: entry.date,
      url: "http://localhost:3000/changelog/google-antigravity-cli",
      publisher: { "@id": "http://localhost:3000/#organization" },
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(data.headline);
  });

  it("gives each entry a unique title, description, and canonical URL", async () => {
    const seen = new Set<string>();
    for (const entry of changelogEntries) {
      const metadata = await generateMetadata(params(entry.slug));
      expect(metadata.title).toBe(entry.title);
      expect(metadata.description).toBe(entry.description);
      expect(metadata.alternates?.canonical).toBe(`/changelog/${entry.slug}`);
      expect(metadata.openGraph).toMatchObject({
        title: `${entry.title} | Bento changelog`,
        url: `/changelog/${entry.slug}`,
      });
      expect(seen.has(String(metadata.title))).toBe(false);
      seen.add(String(metadata.title));
    }
  });

  it("moves the dated URLs to the descriptive slug permanently", async () => {
    await expect(ChangelogEntryPage(params("2026-08-19"))).rejects.toThrow(
      "NEXT_REDIRECT:/changelog/slack-integration",
    );
    expect(permanentRedirect).toHaveBeenCalledWith("/changelog/slack-integration");

    // The redirecting URL already carries the destination's canonical.
    const metadata = await generateMetadata(params("2026-08-19"));
    expect(metadata.alternates?.canonical).toBe("/changelog/slack-integration");
  });

  it("returns not found for an unknown slug", async () => {
    await expect(ChangelogEntryPage(params("2026-01-01"))).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
    expect(await generateMetadata(params("nothing-here"))).toEqual({
      title: "Changelog",
    });
  });
});
