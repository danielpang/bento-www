import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { changelogEntries } from "@/lib/changelog";
import ChangelogPage, { metadata } from "./page";

describe("Changelog", () => {
  it("renders dated entries newest first with heading permalinks and no versions", () => {
    const { container } = render(<ChangelogPage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Changelog" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Google Antigravity CLI" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "DeepSeek models and harness" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Poolside coding agent" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Slack integration" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Linear integration" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/supports Google Antigravity CLI as a coding agent/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/DeepSeek models and a harness/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/supports Poolside as a coding agent/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, element) =>
        element?.textContent ===
        "Create new Bento features by tagging @bento in Slack.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/default Linear team and project/i),
    ).toBeInTheDocument();

    const entries = container.querySelectorAll(".changelog-entry");
    expect(entries).toHaveLength(changelogEntries.length);
    expect(container.querySelector(".changelog-entry-kind")).toBeNull();

    for (const [index, entry] of changelogEntries.entries()) {
      const article = entries[index] as HTMLElement;
      expect(
        within(article).getByRole("heading", { name: entry.displayDate }),
      ).toHaveAttribute("id", entry.slug);
      expect(
        within(article).getByRole("link", { name: entry.displayDate }),
      ).toHaveAttribute("href", `/changelog#${entry.slug}`);
    }

    const antigravity = entries[0] as HTMLElement;
    const antigravityWebsite = within(antigravity).getByRole("link", {
      name: "Antigravity website",
    });
    const antigravityGithub = within(antigravity).getByRole("link", {
      name: "Antigravity CLI GitHub",
    });
    expect(antigravityWebsite).toHaveAttribute(
      "href",
      "https://antigravity.google",
    );
    expect(antigravityWebsite).toHaveAttribute("target", "_blank");
    expect(antigravityWebsite).toHaveAttribute("rel", "noreferrer");
    expect(antigravityGithub).toHaveAttribute(
      "href",
      "https://github.com/google-antigravity/antigravity-cli",
    );
    expect(antigravityGithub).toHaveAttribute("target", "_blank");
    expect(antigravityGithub).toHaveAttribute("rel", "noreferrer");

    const deepseek = entries[1] as HTMLElement;
    const deepseekWebsite = within(deepseek).getByRole("link", {
      name: "DeepSeek website",
    });
    const deepseekGithub = within(deepseek).getByRole("link", {
      name: "DeepSeek GitHub",
    });
    expect(deepseekWebsite).toHaveAttribute("href", "https://www.deepseek.com");
    expect(deepseekWebsite).toHaveAttribute("target", "_blank");
    expect(deepseekWebsite).toHaveAttribute("rel", "noreferrer");
    expect(deepseekGithub).toHaveAttribute(
      "href",
      "https://github.com/deepseek-ai",
    );
    expect(deepseekGithub).toHaveAttribute("target", "_blank");
    expect(deepseekGithub).toHaveAttribute("rel", "noreferrer");

    const poolside = entries[2] as HTMLElement;
    const poolsideWebsite = within(poolside).getByRole("link", {
      name: "Poolside website",
    });
    const poolsideGithub = within(poolside).getByRole("link", {
      name: "Poolside GitHub",
    });
    expect(poolsideWebsite).toHaveAttribute(
      "href",
      "https://www.poolside.ai",
    );
    expect(poolsideWebsite).toHaveAttribute("target", "_blank");
    expect(poolsideWebsite).toHaveAttribute("rel", "noreferrer");
    expect(poolsideGithub).toHaveAttribute(
      "href",
      "https://github.com/poolsideai",
    );
    expect(poolsideGithub).toHaveAttribute("target", "_blank");
    expect(poolsideGithub).toHaveAttribute("rel", "noreferrer");

    expect(container.textContent).not.toMatch(/\bv?\d+\.\d+/);
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(metadata.openGraph).toMatchObject({
      title: "Changelog | Bento",
      url: "/changelog",
    });
    expect(
      screen.queryByRole("heading", {
        name: "Give every feature a clear next step.",
      }),
    ).not.toBeInTheDocument();
  });
});
