import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HandoffSection } from "./handoff-section";

describe("HandoffSection", () => {
  it("explains how users provide model access", () => {
    render(<HandoffSection />);

    const intro = screen.getByRole("heading", { name: "Different agents. One handoff." })
      .nextElementSibling as HTMLElement;
    expect(intro).toHaveTextContent(
      "Pick the right tool and model for each stage without losing what the last agent learned. Bring your own model provider API keys.",
    );
    expect(
      screen.queryByText(/reuse a supported agent subscription/i),
    ).not.toBeInTheDocument();
  });

  it("links existing copy to the matching guides, one link per block", () => {
    const { container } = render(<HandoffSection />);

    const intro = screen.getByRole("heading", { name: "Different agents. One handoff." })
      .nextElementSibling as HTMLElement;
    expect(
      within(intro).getByRole("link", { name: "Pick the right tool and model for each stage" }),
    ).toHaveAttribute("href", "/docs/agents");

    const artifact = container.querySelector(".handoff-artifact") as HTMLElement;
    expect(within(artifact).getByRole("link", { name: "durable write-up" })).toHaveAttribute(
      "href",
      "/docs/concepts",
    );
    expect(artifact.querySelector("p")).toHaveTextContent(
      "Each stage commits a durable write-up for the next agent to read.",
    );

    // Nothing points at the reverted handoff page, and no extra CTAs appear.
    expect(container.querySelectorAll("a")).toHaveLength(2);
    expect(container.innerHTML).not.toContain("handoff-artifacts");
  });

  it("shows a decorative mark beside every supported coding agent", () => {
    render(<HandoffSection />);

    const agentList = screen.getByLabelText("Supported coding agents");
    const agents = within(agentList);

    for (const label of [
      "Claude Code",
      "Codex CLI",
      "Cursor CLI",
      "Antigravity",
      "DeepSeek",
      "OpenCode",
      "Pi",
      "Poolside",
    ]) {
      expect(agents.getByText(label)).toBeInTheDocument();
    }

    const logos = agentList.querySelectorAll("svg.agent-logo");

    expect(logos).toHaveLength(8);
    expect(agentList.querySelector(".agent-relay-line")).toBeNull();
    for (const logo of logos) {
      expect(logo).toHaveAttribute("aria-hidden", "true");
      expect(logo).toHaveAttribute("fill", "currentColor");
      expect(logo).toHaveAttribute("focusable", "false");
      expect(logo).toHaveAttribute("viewBox");
    }

    const distinctLogoStructures = new Set(
      Array.from(logos, (logo) => logo.innerHTML),
    );

    expect(distinctLogoStructures.size).toBe(8);

    const pathSignatures = Array.from(logos, (logo) => {
      const logoPaths = Array.from(logo.querySelectorAll("path"));

      expect(logoPaths.length).toBeGreaterThan(0);
      for (const path of logoPaths) {
        expect(path).toHaveAttribute("d");
        expect(path.getAttribute("d")).not.toBe("");
      }

      return logoPaths.map((path) => path.getAttribute("d")).join("|");
    });

    expect(new Set(pathSignatures).size).toBe(logos.length);
  });

});
