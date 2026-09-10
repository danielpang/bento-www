import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { slackInstallUrl } from "@/lib/site";
import { IntegrationsSection } from "./integrations-section";

describe("IntegrationsSection", () => {
  it("explains Linear and Slack as ways to start a Bento card", () => {
    render(<IntegrationsSection />);

    expect(
      screen.getByRole("heading", {
        name: "Start a card from Linear or Slack.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Tasks created in Linear can automatically create a feature card in Bento and start the pipeline.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "P" &&
          element.textContent ===
            "Message @bento to create a card and start the pipeline. Approve in Slack and see agent output.",
      ),
    ).toBeInTheDocument();
  });

  it("links Slack to the one-click OAuth install", () => {
    render(<IntegrationsSection />);

    const install = screen.getByRole("link", { name: "Add to Slack" });

    expect(install).toHaveAttribute("href", slackInstallUrl);
    expect(install).toHaveAttribute("target", "_blank");
    expect(install).toHaveAttribute("rel", "noreferrer");
    expect(screen.getByText("One-click install")).toBeInTheDocument();
  });

  it("shows the Linear and Slack flows with decorative brand marks", () => {
    render(<IntegrationsSection />);

    const linearFlow = screen.getByRole("list", {
      name: "Linear integration flow",
    });
    const slackFlow = screen.getByRole("list", {
      name: "Slack integration flow",
    });

    expect(
      Array.from(linearFlow.querySelectorAll("li"), (item) => {
        const marker = item.querySelector("span");
        return item.textContent?.replace(marker?.textContent ?? "", "").trim();
      }),
    ).toEqual([
      "A Linear task is created",
      "Bento opens a feature card",
      "The pipeline starts",
    ]);
    expect(
      Array.from(slackFlow.querySelectorAll("li"), (item) => {
        const marker = item.querySelector("span");
        return item.textContent?.replace(marker?.textContent ?? "", "").trim();
      }),
    ).toEqual([
      "Message @bento to create a card",
      "The pipeline starts",
      "Approve the gate in Slack",
      "Read the agent output there",
    ]);

    const linearLogo = screen
      .getByRole("heading", { name: "Linear" })
      .closest(".integration-card")
      ?.querySelector("svg.integration-logo");

    expect(linearLogo).not.toBeNull();
    expect(linearLogo).toHaveAttribute("aria-hidden", "true");
    expect(linearLogo).toHaveAttribute("fill", "currentColor");
    expect(linearLogo).toHaveAttribute("focusable", "false");
    expect(linearLogo).toHaveAttribute("viewBox", "0 0 24 24");

    const slackCard = screen
      .getByRole("heading", { name: "Slack" })
      .closest(".integration-card");

    expect(slackCard).not.toBeNull();
    expect(
      within(slackCard as HTMLElement).getByRole("link", {
        name: "Add to Slack",
      }),
    ).toBeInTheDocument();
  });
});
