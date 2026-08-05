import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getLifecycleStageFromScroll,
  LifecycleSection,
} from "./lifecycle-section";

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

describe("LifecycleSection", () => {
  afterEach(() => {
    motionPreference.value = false;
    vi.restoreAllMocks();
  });

  it("explains that the displayed pipeline is configurable", () => {
    render(<LifecycleSection />);

    const heading = screen.getByRole("heading", {
      name: "Every feature has a route.",
    });
    const sectionHeading = heading.closest(".lifecycle-heading");

    expect(sectionHeading).not.toBeNull();
    expect(
      within(sectionHeading as HTMLElement).getByText(
        "This is one example. Define any pipeline you want, with the stages, agents, skills, and rules that fit your team.",
      ),
    ).toBeInTheDocument();
  });

  it("preserves the semantic lifecycle order with sequence markers", () => {
    render(<LifecycleSection />);

    const lifecycle = screen.getByRole("list", {
      name: "Default product lifecycle",
    });
    const names = Array.from(
      lifecycle.querySelectorAll(".lifecycle-stage-name"),
      (name) => name.textContent?.trim(),
    );
    const markers = Array.from(
      lifecycle.querySelectorAll(".lifecycle-step"),
      (marker) => marker.textContent?.trim(),
    );

    expect(names).toEqual([
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]);
    expect(markers).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(lifecycle.querySelector(".lifecycle-connector")).toBeNull();
  });

  it("maps section scroll progress across all six stages", () => {
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: 0,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(0);
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: -800,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(2);
    expect(
      getLifecycleStageFromScroll({
        sectionHeight: 3000,
        sectionTop: -2000,
        stageCount: 6,
        viewportHeight: 1000,
      }),
    ).toBe(5);
  });

  it("changes the editorial heading as the user scrolls through the route", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    const view = render(<LifecycleSection />);
    const section = view.container.querySelector<HTMLElement>(
      ".lifecycle-section",
    );

    if (!section) throw new Error("Lifecycle section was not rendered");

    vi.spyOn(section, "getBoundingClientRect").mockReturnValue({
      bottom: 2200,
      height: 3000,
      left: 0,
      right: 1200,
      top: -800,
      width: 1200,
      x: 0,
      y: -800,
      toJSON: () => ({}),
    });

    fireEvent.scroll(window);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Every stage tells the next chapter.",
      }),
    ).toBeInTheDocument();
    expect(
      within(
        screen.getByRole("group", { name: "Active lifecycle stage" }),
      ).getByText("Turn intent into an executable plan."),
    ).toBeInTheDocument();
    const activeStage = within(
      screen.getByRole("list", { name: "Default product lifecycle" }),
    )
      .getByText("Engineering requirements")
      .closest("li");

    expect(activeStage).toHaveAttribute("aria-current", "step");
  });

  it("keeps every stage readable without scroll animation for reduced motion", () => {
    motionPreference.value = true;

    render(<LifecycleSection />);

    const staticRoute = screen.getByRole("list", {
      name: "Complete product lifecycle",
    });

    for (const stage of [
      "Product investigation",
      "UI/UX design",
      "Engineering requirements",
      "Implementation",
      "Code review",
      "Quality engineering",
    ]) {
      expect(within(staticRoute).getByText(stage)).toBeInTheDocument();
    }
  });

  it("removes its scroll listener when unmounted", () => {
    const removeEventListener = vi.spyOn(window, "removeEventListener");
    const view = render(<LifecycleSection />);

    act(() => view.unmount());

    expect(removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });
});
