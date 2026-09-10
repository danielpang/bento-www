import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ControlPage from "./page";

describe("control homepage", () => {
  it("wears the redesign charcoal tokens while keeping the original layout", () => {
    const { container } = render(<ControlPage />);

    expect(container.firstElementChild).toHaveClass("control-page");
    expect(container.firstElementChild).toHaveAttribute(
      "data-marketing-variant",
      "control",
    );
  });
});
