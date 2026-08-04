import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PullRequestSection } from "./pull-request-section";

describe("PullRequestSection", () => {
  it("opens the pull request before evaluating GitHub requirements", () => {
    const { container } = render(<PullRequestSection />);
    const steps = Array.from(container.querySelectorAll(".publish-step")).map(
      (step) => step.textContent,
    );

    expect(steps).toEqual([
      "Agent run succeeds",
      "Pull request opens or updates",
      "Checks pass",
      "Review threads resolve",
    ]);
    expect(
      screen.getByText(
        "Successful runs open or update the pull request first. Checks and review threads then decide whether the stage advances.",
      ),
    ).toBeInTheDocument();
  });
});
