import { describe, expect, it } from "vitest";
import {
  changelogEntries,
  getChangelogEntry,
  getChangelogSlugs,
} from "./changelog";

describe("changelog catalog", () => {
  it("lists dated product updates newest first, without versions", () => {
    expect(changelogEntries.map((entry) => entry.slug)).toEqual([
      "2026-08-26",
      "2026-08-23",
      "2026-08-19",
      "2026-08-14",
    ]);
    expect(changelogEntries.map((entry) => entry.displayDate)).toEqual([
      "August 26, 2026",
      "August 23, 2026",
      "August 19, 2026",
      "August 14, 2026",
    ]);
    expect(changelogEntries.map((entry) => entry.title)).toEqual([
      "DeepSeek models and harness",
      "Poolside coding agent",
      "Slack integration",
      "Linear integration",
    ]);

    for (const entry of changelogEntries) {
      expect(entry.title).not.toMatch(/\bv?\d+\.\d+/);
      expect(entry.displayDate).not.toMatch(/\bv?\d+\.\d+/);
    }
  });

  it("looks up entries by date slug", () => {
    expect(getChangelogSlugs()).toEqual([
      "2026-08-26",
      "2026-08-23",
      "2026-08-19",
      "2026-08-14",
    ]);
    expect(getChangelogEntry("2026-08-26")?.title).toBe(
      "DeepSeek models and harness",
    );
    expect(getChangelogEntry("2026-08-23")?.title).toBe(
      "Poolside coding agent",
    );
    expect(getChangelogEntry("2026-08-19")?.title).toBe("Slack integration");
    expect(getChangelogEntry("08-19-26")).toBeNull();
    expect(getChangelogEntry("1.0")).toBeNull();
  });
});
