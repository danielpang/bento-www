import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "./reveal";

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
  });
});
