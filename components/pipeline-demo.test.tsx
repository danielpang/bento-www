import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PipelineDemo } from "./pipeline-demo";

const motionPreference = vi.hoisted(() => ({
  value: false,
}));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return {
    ...motion,
    useReducedMotion: () => motionPreference.value,
  };
});

function mockBoardGeometry(
  container: HTMLElement,
  {
    clientWidth = 500,
    laneOffsets = [0, 200, 400, 600, 800, 1000],
    laneWidth = 200,
    scrollWidth = 1200,
  } = {},
) {
  const board = container.querySelector<HTMLElement>(".pipeline-board");
  const lanes = Array.from(
    container.querySelectorAll<HTMLElement>(".pipeline-lane"),
  );

  if (!board) throw new Error("Pipeline board was not rendered");

  Object.defineProperties(board, {
    clientWidth: { configurable: true, value: clientWidth },
    scrollWidth: { configurable: true, value: scrollWidth },
  });

  lanes.forEach((lane, index) => {
    Object.defineProperties(lane, {
      offsetLeft: { configurable: true, value: laneOffsets[index] },
      offsetWidth: { configurable: true, value: laneWidth },
    });
  });

  const scrollTo = vi.fn();
  Object.defineProperty(board, "scrollTo", {
    configurable: true,
    value: scrollTo,
  });

  return { board, lanes, scrollTo };
}

describe("PipelineDemo", () => {
  afterEach(() => {
    motionPreference.value = false;
    Reflect.deleteProperty(window, "ResizeObserver");
    vi.restoreAllMocks();
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

    expect(
      screen.getByText("Checkout recovery is in Product investigation."),
    ).toHaveAttribute("aria-atomic", "true");
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

  it("pauses and resumes the stage interval", () => {
    vi.useFakeTimers();
    render(<PipelineDemo />);

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(
      screen.getByLabelText("Checkout recovery is in UI/UX design"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Pause pipeline animation" }),
    );
    expect(
      screen.getByRole("button", { name: "Play pipeline animation" }),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(
      screen.getByLabelText("Checkout recovery is in UI/UX design"),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Play pipeline animation" }),
    );
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(
      screen.getByLabelText(
        "Checkout recovery is in Engineering requirements",
      ),
    ).toBeInTheDocument();
  });

  it("resets and stops when reduced motion becomes active", () => {
    vi.useFakeTimers();
    const view = render(<PipelineDemo />);
    const { scrollTo } = mockBoardGeometry(view.container);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(
      screen.getByLabelText(
        "Checkout recovery is in Engineering requirements",
      ),
    ).toBeInTheDocument();

    motionPreference.value = true;
    view.rerender(<PipelineDemo />);

    expect(
      screen.getByLabelText(
        "Checkout recovery is in Product investigation",
      ),
    ).toBeInTheDocument();
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "instant",
      left: 0,
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(
      screen.getByLabelText(
        "Checkout recovery is in Product investigation",
      ),
    ).toBeInTheDocument();
  });

  it("cleans up its interval when unmounted", () => {
    vi.useFakeTimers();
    const clearInterval = vi.spyOn(window, "clearInterval");
    const view = render(<PipelineDemo />);

    expect(vi.getTimerCount()).toBe(1);
    view.unmount();

    expect(clearInterval).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("clamps centering to the board scroll range", () => {
    vi.useFakeTimers();
    const view = render(<PipelineDemo />);
    const { scrollTo } = mockBoardGeometry(view.container);

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 50,
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(
      screen.getByLabelText("Checkout recovery is in Quality engineering"),
    ).toBeInTheDocument();
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 700,
    });

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 0,
    });
  });

  it("recenters the active lane when observed dimensions change", () => {
    vi.useFakeTimers();
    let resize: ResizeObserverCallback = () => undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();

    class ResizeObserverMock implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }

      disconnect = disconnect;
      observe = observe;
      unobserve() {}
    }

    window.ResizeObserver = ResizeObserverMock;

    const view = render(<PipelineDemo />);
    const { board, lanes, scrollTo } = mockBoardGeometry(view.container);

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 250,
    });
    expect(observe).toHaveBeenCalledWith(board);
    expect(observe).toHaveBeenCalledWith(lanes[2]);

    Object.defineProperties(board, {
      clientWidth: { configurable: true, value: 700 },
    });
    Object.defineProperties(lanes[2], {
      offsetWidth: { configurable: true, value: 240 },
    });

    act(() => {
      resize([], {} as ResizeObserver);
    });

    expect(scrollTo).toHaveBeenLastCalledWith({
      behavior: "smooth",
      left: 170,
    });

    view.unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
