import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { Reveal } from "./reveal";

const OriginalObserver = window.IntersectionObserver;
afterEach(() => {
  window.IntersectionObserver = OriginalObserver;
});

function observeIntersections() {
  const callbacks: IntersectionObserverCallback[] = [];
  window.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    constructor(callback: IntersectionObserverCallback) {
      callbacks.push(callback);
    }
    disconnect() {}
    observe() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    unobserve() {}
  } as unknown as typeof IntersectionObserver;
  return callbacks;
}

describe("Reveal", () => {
  it("keeps its content available before animation runs", () => {
    render(
      <Reveal>
        <p>Visible product detail</p>
      </Reveal>,
    );

    expect(screen.getByText("Visible product detail")).toBeInTheDocument();
  });

  it("keeps server-rendered content visible without JavaScript", () => {
    const html = renderToString(
      <Reveal>
        <p>Server visible detail</p>
      </Reveal>,
    );

    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("data-hidden");
  });

  it("hides after hydration and reveals once scrolled into view", () => {
    const callbacks = observeIntersections();
    const { container } = render(
      <Reveal className="block" delay={0.08}>
        <p>Detail</p>
      </Reveal>,
    );
    const block = container.querySelector(".block")!;
    expect(block).toHaveClass("reveal");
    expect(block).toHaveAttribute("data-hidden");
    expect(callbacks).toHaveLength(1);

    act(() => {
      callbacks[0]!(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(block).not.toHaveAttribute("data-hidden");
    expect(block).toHaveStyle({ transitionDelay: "0.08s" });
  });
});
