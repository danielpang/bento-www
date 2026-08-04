import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PipelineDemo } from "./pipeline-demo";

describe("PipelineDemo", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the complete default software lifecycle", () => {
    render(<PipelineDemo />);

    for (const stage of [
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]) {
      expect(screen.getByRole("heading", { name: stage })).toBeInTheDocument();
    }
  });

  it("renders the live card visibly before hydration", () => {
    const html = renderToString(<PipelineDemo />);

    expect(html).not.toContain("opacity:0.45");
    expect(html).not.toContain("translateY(8px)");
  });

  it("moves the live feature through every stage and loops to the start", () => {
    vi.useFakeTimers();
    render(<PipelineDemo />);

    expect(
      screen.getByLabelText(
        "Checkout recovery is in Product investigation",
      ),
    ).toBeInTheDocument();

    for (const stage of [
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
      "Product investigation",
    ]) {
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      expect(
        screen.getByLabelText(`Checkout recovery is in ${stage}`),
      ).toBeInTheDocument();
    }
  });
});
