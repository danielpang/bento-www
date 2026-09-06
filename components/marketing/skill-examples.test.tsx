import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const preferences = vi.hoisted(() => ({ reducedMotion: false, inView: true }));
vi.mock("motion/react", () => ({
  useReducedMotion: () => preferences.reducedMotion,
  useInView: () => preferences.inView,
}));
import { SkillExamples } from "./skill-examples";

beforeEach(() => {
  vi.useFakeTimers();
  preferences.reducedMotion = false;
  preferences.inView = true;
});
afterEach(() => vi.useRealTimers());

function expectStage(stage: string) {
  expect(screen.getByRole("button", { name: stage })).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByLabelText(`${stage} stage, agent, and skill`)).toHaveAttribute("data-active", "true");
}

describe("pipeline skill examples", () => {
  it("cycles through all six stage examples, then starts again", () => {
    render(<SkillExamples />);
    expectStage("PM");
    for (const stage of ["Product design", "Tech exploration", "Implementation", "QA", "Rollout planning", "PM"]) {
      act(() => vi.advanceTimersByTime(6000));
      expectStage(stage);
    }
  });
  it("pauses and resumes without skipping the selected example", () => {
    render(<SkillExamples />);
    fireEvent.click(screen.getByRole("button", { name: "Pause stage examples" }));
    act(() => vi.advanceTimersByTime(12000));
    expectStage("PM");
    fireEvent.click(screen.getByRole("button", { name: "Play stage examples" }));
    act(() => vi.advanceTimersByTime(6000));
    expectStage("Product design");
  });
  it("manual selection stops automatic rotation so the example stays readable", () => {
    render(<SkillExamples />);
    fireEvent.click(screen.getByRole("button", { name: "QA" }));
    act(() => vi.advanceTimersByTime(12000));
    expectStage("QA");
    expect(screen.getByRole("button", { name: "Play stage examples" })).toBeEnabled();
  });
  it("does not auto-cycle offscreen or when reduced motion is requested", () => {
    preferences.inView = false;
    const { rerender } = render(<SkillExamples />);
    act(() => vi.advanceTimersByTime(12000));
    expectStage("PM");
    preferences.inView = true;
    preferences.reducedMotion = true;
    rerender(<SkillExamples />);
    act(() => vi.advanceTimersByTime(12000));
    expectStage("PM");
    expect(screen.getByRole("button", { name: "Play stage examples" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Implementation" }));
    expectStage("Implementation");
  });
  it("clears its timer on unmount", () => {
    const { unmount } = render(<SkillExamples />);
    expect(vi.getTimerCount()).toBe(1);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
