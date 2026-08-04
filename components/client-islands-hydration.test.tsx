import { act } from "@testing-library/react";
import type { ReactElement } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { GateDemo } from "./gate-demo";
import { PipelineDemo } from "./pipeline-demo";

const motionPreference = vi.hoisted(() => ({
  value: null as boolean | null,
}));

vi.mock("motion/react", async (importOriginal) => {
  const motion = await importOriginal<typeof import("motion/react")>();
  return {
    ...motion,
    useReducedMotion: () => motionPreference.value,
  };
});

async function hydrateWithReducedMotion(component: ReactElement) {
  const container = document.createElement("div");
  motionPreference.value = null;
  container.innerHTML = renderToString(component);
  document.body.appendChild(container);

  motionPreference.value = true;
  const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const recoverableErrors: unknown[] = [];

  const root = hydrateRoot(container, component, {
    onRecoverableError: (error) => recoverableErrors.push(error),
  });

  await act(async () => {
    await Promise.resolve();
  });

  const hydrationErrors = consoleError.mock.calls.filter((call) =>
    call.some((value) => String(value).includes("hydrated")),
  );

  await act(async () => root.unmount());
  consoleError.mockRestore();
  motionPreference.value = null;
  container.remove();

  return { hydrationErrors, recoverableErrors };
}

describe("animated client islands", () => {
  it("hydrate cleanly when the client prefers reduced motion", async () => {
    const errors = await hydrateWithReducedMotion(
      <>
        <PipelineDemo />
        <GateDemo />
      </>,
    );

    expect(errors.hydrationErrors).toEqual([]);
    expect(errors.recoverableErrors).toEqual([]);
  });
});
