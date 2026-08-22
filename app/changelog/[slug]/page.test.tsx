import { notFound, redirect } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { changelogEntries } from "@/lib/changelog";
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
    redirect: vi.fn((url: string) => {
      throw new Error(`NEXT_REDIRECT:${url}`);
    }),
  };
});

describe("Changelog date page", () => {
  it("publishes a static redirect for each dated heading", () => {
    expect(generateStaticParams()).toEqual(
      changelogEntries.map((entry) => ({ slug: entry.slug })),
    );
  });

  it("moves dated URLs to the matching heading on the changelog", async () => {
    await expect(
      ChangelogEntryPage({
        params: Promise.resolve({ slug: "2026-08-19" }),
      }),
    ).rejects.toThrow("NEXT_REDIRECT:/changelog#2026-08-19");
    expect(redirect).toHaveBeenCalledWith("/changelog#2026-08-19");

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: "2026-08-19" }),
    });
    expect(metadata).toMatchObject({
      title: "Changelog",
      alternates: { canonical: "/changelog" },
    });
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
