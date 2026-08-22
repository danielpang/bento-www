import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import {
  changelogEntries,
  getChangelogEntry,
} from "@/lib/changelog";
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
  };
});

describe("Changelog date page", () => {
  it("publishes a static page for each dated entry", () => {
    expect(generateStaticParams()).toEqual(
      changelogEntries.map((entry) => ({ slug: entry.slug })),
    );
  });

  it("renders the Slack update at its date permalink", async () => {
    const page = await ChangelogEntryPage({
      params: Promise.resolve({ slug: "2026-08-19" }),
    });
    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "2026-08-19" }),
    });

    render(page);

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Slack integration" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Linear integration" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "August 19, 2026" }),
    ).toHaveAttribute("href", "/changelog/2026-08-19");
    expect(metadata).toMatchObject({
      title: "Slack integration",
      openGraph: {
        url: "/changelog/2026-08-19",
      },
    });
    expect(getChangelogEntry("2026-08-19")?.title).toBe("Slack integration");
  });

  it("returns not found for an unknown date", async () => {
    await expect(
      ChangelogEntryPage({
        params: Promise.resolve({ slug: "2026-01-01" }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
