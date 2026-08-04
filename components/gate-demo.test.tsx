import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { GateDemo } from "./gate-demo";

describe("GateDemo", () => {
  it("renders its status visibly before hydration", () => {
    const html = renderToString(<GateDemo />);

    expect(html).not.toContain("opacity:0");
    expect(html).not.toContain("translateY(4px)");
  });

  it("holds a feature until the person approves it", async () => {
    const user = userEvent.setup();
    render(<GateDemo />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "Waiting for your approval",
    );
    expect(
      screen.getByRole("group", { name: "Manual stage activity" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Test command passed")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Advanced to code review",
    );
    expect(screen.getByText("Manual approval recorded")).toBeInTheDocument();
  });

  it("sends work back with a clear destination", async () => {
    const user = userEvent.setup();
    render(<GateDemo />);

    await user.click(screen.getByRole("button", { name: "Send back" }));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Returned to engineering requirements",
    );
    const decision = screen.getByText("Changes requested");
    expect(decision).toBeInTheDocument();
    expect(decision.closest(".gate-check")).not.toHaveAttribute("data-pending");
  });
});
