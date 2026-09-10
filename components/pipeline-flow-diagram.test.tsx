import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PipelineFlowDiagram,
  liveCardTitle,
  pipelineStages,
} from "./pipeline-flow-diagram";

const motionPreference = vi.hoisted(() => ({
  value: false as boolean | null,
}));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return {
    ...motion,
    useReducedMotion: () => motionPreference.value,
  };
});

const stageNames = pipelineStages.map((stage) => stage.name);

function liveCard() {
  return screen.getByLabelText(new RegExp(`^${liveCardTitle}:`));
}

function expectCardIn(stageName: string, status: string) {
  expect(liveCard()).toHaveAccessibleName(
    `${liveCardTitle}: ${status} in ${stageName}`,
  );
}

function detailPanel() {
  return screen.getByText("Following the card", { exact: false }).closest(
    ".flow-detail",
  ) as HTMLElement;
}

describe("PipelineFlowDiagram", () => {
  afterEach(() => {
    motionPreference.value = false;
    vi.useRealTimers();
  });

  it("lays out the six default stages, their agents, and a done column", () => {
    render(<PipelineFlowDiagram />);

    const track = screen.getByRole("list", { name: "Pipeline stages" });
    const stages = within(track).getAllByRole("listitem");
    expect(stages).toHaveLength(pipelineStages.length + 1);

    for (const [index, stage] of pipelineStages.entries()) {
      const item = stages[index] as HTMLElement;
      const button = within(item).getByRole("button");
      expect(button).toHaveTextContent(String(index + 1).padStart(2, "0"));
      expect(button).toHaveTextContent(stage.name);
      expect(button).toHaveTextContent(stage.agent);
      expect(button).toHaveTextContent(stage.harness);
    }
    expect(within(stages[6] as HTMLElement).getByRole("button")).toHaveTextContent(
      "Done",
    );

    // Gates follow every stage; only code review advances automatically.
    const gates = track.querySelectorAll(".flow-gate");
    expect(Array.from(gates, (gate) => gate.getAttribute("data-gate"))).toEqual([
      "manual",
      "manual",
      "manual",
      "manual",
      "auto",
      "manual",
    ]);

    // Every stage reserves a live-card lane so a occupied column does not grow.
    expect(track.querySelectorAll(".flow-live")).toHaveLength(stages.length);
    const occupied = stages[2] as HTMLElement;
    expect(occupied.querySelector(".flow-live")).toBeEmptyDOMElement();
    expect(occupied).toHaveTextContent("Usage-based billing");

    // Other features share the board with the moving card.
    expect(screen.getByText("Usage-based billing")).toBeInTheDocument();
    expect(screen.getByText("Rate limit the public API")).toBeInTheDocument();
    expect(screen.getByText("Retry timed-out webhooks")).toBeInTheDocument();

    expectCardIn("Product investigation", "agent working");
    expect(
      screen.getByText(`${liveCardTitle} is agent working in Product investigation.`),
    ).toHaveAttribute("aria-live", "polite");
  });

  it("renders the same markup on the server as on the first client render", () => {
    const html = renderToString(<PipelineFlowDiagram />);

    expect(html).toContain(liveCardTitle);
    expect(html).toContain('aria-label="Pause pipeline diagram"');
    expect(html).toContain("Following the card");
  });

  it("runs the card through every stage, waits at each gate, and loops from done", () => {
    vi.useFakeTimers();
    render(<PipelineFlowDiagram />);

    for (const [index, stageName] of stageNames.entries()) {
      expectCardIn(stageName, "agent working");
      act(() => {
        vi.advanceTimersByTime(2200);
      });
      expectCardIn(
        stageName,
        pipelineStages[index]!.gate === "auto"
          ? "checks running"
          : "waiting for approval",
      );
      expect(
        screen.getByRole("list", { name: "Pipeline stages" }).querySelectorAll(
          ".flow-gate[data-waiting]",
        ),
      ).toHaveLength(1);
      act(() => {
        vi.advanceTimersByTime(1500);
      });
    }

    expectCardIn("Done", "done");
    expect(screen.getByRole("button", { name: "Approve" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Reopen" })).toBeEnabled();

    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expectCardIn("Product investigation", "agent working");
  });

  it("lets the reader approve, re-check, send back, and reopen the card", () => {
    vi.useFakeTimers();
    render(<PipelineFlowDiagram />);

    expect(screen.getByRole("button", { name: "Send back" })).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expectCardIn("UI/UX design", "agent working");

    fireEvent.click(screen.getByRole("button", { name: "Send back" }));
    expectCardIn("Product investigation", "agent working");

    for (let i = 0; i < 4; i += 1) {
      fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    }
    expectCardIn("Code review", "agent working");
    // The automatic gate is re-evaluated rather than approved.
    fireEvent.click(screen.getByRole("button", { name: "Re-check" }));
    expectCardIn("Quality engineering", "agent working");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expectCardIn("Done", "done");
    fireEvent.click(screen.getByRole("button", { name: "Reopen" }));
    expectCardIn("Quality engineering", "agent working");

    // Every action restarts the clock from the new position.
    act(() => {
      vi.advanceTimersByTime(2199);
    });
    expectCardIn("Quality engineering", "agent working");
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expectCardIn("Quality engineering", "waiting for approval");
  });

  it("follows the card in the detail panel until a stage is pinned", () => {
    vi.useFakeTimers();
    render(<PipelineFlowDiagram />);

    let panel = detailPanel();
    expect(panel).toHaveTextContent("Product investigation");
    expect(panel).toHaveTextContent("Product Manager");
    expect(panel).toHaveTextContent("Claude Code · Claude Sonnet 4.6");
    expect(panel).toHaveTextContent("docs/bento/product-investigation.md");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    panel = detailPanel();
    expect(panel).toHaveTextContent("UI/UX design");
    expect(panel).toHaveTextContent("Product Designer");

    const codeReview = screen.getByRole("button", { name: /05\s*Code review/ });
    fireEvent.click(codeReview);
    expect(codeReview).toHaveAttribute("aria-pressed", "true");
    const pinned = screen.getByRole("button", { name: "Follow the card" }).closest(
      ".flow-detail",
    ) as HTMLElement;
    expect(pinned).toHaveTextContent("Code Reviewer");
    expect(pinned).toHaveTextContent("OpenCode · GPT-5.6");
    expect(pinned).toHaveTextContent("checks_pass");
    expect(screen.queryByText("Following the card")).toBeNull();

    // The card keeps moving while the panel stays pinned.
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expectCardIn("Engineering requirements", "agent working");
    expect(pinned).toHaveTextContent("Code Reviewer");

    fireEvent.click(screen.getByRole("button", { name: "Follow the card" }));
    expect(detailPanel()).toHaveTextContent("Staff Engineer");

    fireEvent.click(screen.getByRole("button", { name: /Done/ }));
    expect(
      screen.getByRole("button", { name: "Follow the card" }).closest(".flow-detail"),
    ).toHaveTextContent("Returns the card to the stage it finished in");

    // Selecting the pinned stage again releases it.
    fireEvent.click(screen.getByRole("button", { name: /Done/ }));
    expect(detailPanel()).toHaveTextContent("Staff Engineer");
  });

  it("places the live card in the reserved lane of an already occupied stage", () => {
    render(<PipelineFlowDiagram />);

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expectCardIn("Engineering requirements", "agent working");

    const occupied = screen
      .getByRole("list", { name: "Pipeline stages" })
      .querySelectorAll(".flow-stage")[2] as HTMLElement;
    const lane = occupied.querySelector(".flow-live") as HTMLElement;
    const settled = occupied.querySelector(".flow-card:not([data-live])") as HTMLElement;

    expect(lane).toContainElement(liveCard());
    expect(settled).toHaveTextContent("Usage-based billing");
    expect(lane.compareDocumentPosition(settled) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("pauses and resumes the animation", () => {
    vi.useFakeTimers();
    render(<PipelineFlowDiagram />);

    fireEvent.click(screen.getByRole("button", { name: "Pause pipeline diagram" }));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expectCardIn("Product investigation", "agent working");

    fireEvent.click(screen.getByRole("button", { name: "Play pipeline diagram" }));
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expectCardIn("Product investigation", "waiting for approval");
  });

  it("stays still under reduced motion until the reader presses play", () => {
    vi.useFakeTimers();
    motionPreference.value = true;
    render(<PipelineFlowDiagram />);

    expect(
      screen.getByRole("button", { name: "Play pipeline diagram" }),
    ).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expectCardIn("Product investigation", "agent working");

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expectCardIn("UI/UX design", "agent working");

    fireEvent.click(screen.getByRole("button", { name: "Play pipeline diagram" }));
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expectCardIn("UI/UX design", "waiting for approval");
  });

  it("clears its timer when unmounted", () => {
    vi.useFakeTimers();
    const view = render(<PipelineFlowDiagram />);

    expect(vi.getTimerCount()).toBe(1);
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
