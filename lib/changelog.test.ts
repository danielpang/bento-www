import { describe, expect, it } from "vitest";
import {
  changelogEntries,
  getChangelogEntry,
  getChangelogEntryByDate,
  getChangelogSlugs,
} from "./changelog";

describe("changelog catalog", () => {
  it("lists dated product updates newest first, without versions", () => {
    expect(changelogEntries.map((entry) => entry.slug)).toEqual([
      "bento-terminal-ui",
      "google-antigravity-cli",
      "deepseek-models-and-harness",
      "poolside-coding-agent",
      "slack-integration",
      "linear-integration",
    ]);
    expect(changelogEntries.map((entry) => entry.date)).toEqual([
      "2026-09-11",
      "2026-09-05",
      "2026-08-26",
      "2026-08-23",
      "2026-08-19",
      "2026-08-14",
    ]);
    expect(changelogEntries.map((entry) => entry.displayDate)).toEqual([
      "September 11, 2026",
      "September 5, 2026",
      "August 26, 2026",
      "August 23, 2026",
      "August 19, 2026",
      "August 14, 2026",
    ]);
    expect(changelogEntries.map((entry) => entry.title)).toEqual([
      "Bento TUI",
      "Google Antigravity CLI as a coding agent",
      "DeepSeek models and harness",
      "Poolside as a coding agent",
      "Slack integration",
      "Linear integration",
    ]);

    for (const entry of changelogEntries) {
      expect(entry.title).not.toMatch(/\bv?\d+\.\d+/);
      expect(entry.displayDate).not.toMatch(/\bv?\d+\.\d+/);
    }
  });

  it("gives every entry what a standalone page needs", () => {
    const titles = new Set(changelogEntries.map((entry) => entry.title));
    const descriptions = new Set(changelogEntries.map((entry) => entry.description));
    expect(titles.size).toBe(changelogEntries.length);
    expect(descriptions.size).toBe(changelogEntries.length);

    for (const entry of changelogEntries) {
      expect(entry.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(entry.slug).not.toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(entry.description.length).toBeGreaterThanOrEqual(80);
      expect(entry.description.length).toBeLessThanOrEqual(160);
      expect(entry.paragraphs.length + (entry.sections?.length ?? 0)).toBeGreaterThanOrEqual(2);
      const sectionText = entry.sections?.flatMap((section) => [
        section.title,
        ...(section.paragraphs ?? []),
        ...(section.points?.flatMap((point) => [point.label, point.body]) ?? []),
      ]) ?? [];
      for (const text of [entry.title, entry.description, ...entry.paragraphs, ...sectionText]) {
        expect(text).not.toMatch(/[—–]/);
      }
    }
  });

  it("looks up entries by slug and by the date they first published under", () => {
    expect(getChangelogSlugs()).toEqual([
      "bento-terminal-ui",
      "google-antigravity-cli",
      "deepseek-models-and-harness",
      "poolside-coding-agent",
      "slack-integration",
      "linear-integration",
    ]);
    expect(getChangelogEntry("google-antigravity-cli")?.title).toBe(
      "Google Antigravity CLI as a coding agent",
    );
    expect(getChangelogEntry("bento-terminal-ui")?.title).toBe(
      "Bento TUI",
    );
    expect(getChangelogEntry("deepseek-models-and-harness")?.title).toBe(
      "DeepSeek models and harness",
    );
    expect(getChangelogEntry("poolside-coding-agent")?.title).toBe(
      "Poolside as a coding agent",
    );
    expect(getChangelogEntry("slack-integration")?.title).toBe("Slack integration");
    expect(getChangelogEntry("2026-08-19")).toBeNull();
    expect(getChangelogEntryByDate("2026-08-19")?.slug).toBe("slack-integration");
    expect(getChangelogEntryByDate("08-19-26")).toBeNull();
    expect(getChangelogEntry("1.0")).toBeNull();
  });
});
