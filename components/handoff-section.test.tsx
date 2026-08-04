import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HandoffSection } from "./handoff-section";

describe("HandoffSection", () => {
  it("shows a decorative mark beside every supported coding agent", () => {
    render(<HandoffSection />);

    const agentList = screen.getByLabelText("Supported coding agents");
    const agents = within(agentList);

    for (const label of [
      "Claude Code",
      "Codex CLI",
      "Cursor CLI",
      "OpenCode",
      "Pi",
    ]) {
      expect(agents.getByText(label)).toBeInTheDocument();
    }

    const logos = agentList.querySelectorAll("svg.agent-logo");

    expect(logos).toHaveLength(5);
    for (const logo of logos) {
      expect(logo).toHaveAttribute("aria-hidden", "true");
      expect(logo).toHaveAttribute("fill", "currentColor");
      expect(logo).toHaveAttribute("focusable", "false");
      expect(logo).toHaveAttribute("viewBox");
    }
  });
});
