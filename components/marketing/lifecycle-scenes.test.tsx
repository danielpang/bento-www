import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
  marketingShareLinkLabel,
  marketingShareLocalTitle,
  marketingShareRemoteTitle,
} from "@/lib/copy";
import { RemoteShareScene, TeamBoardScene } from "./lifecycle-scenes";

describe("lifecycle scenes", () => {
  it("shows one card in each pipeline stage", () => {
    render(<TeamBoardScene />);

    expect(screen.getByRole("figure", { name: /one card in each stage/i })).toBeInTheDocument();
    expect(screen.getByText(marketingBoardCaption)).toBeInTheDocument();
    expect(screen.getByText(marketingBoardCaptionMeta)).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(marketingPipelineLanes.length);
    for (const lane of marketingPipelineLanes) {
      expect(screen.getByText(lane.stage)).toBeInTheDocument();
      expect(screen.getByText(lane.title)).toBeInTheDocument();
    }
  });

  it("shows a local laptop talking to a cloud VM", () => {
    render(<RemoteShareScene />);

    expect(screen.getByRole("figure", { name: /local laptop talking to a cloud VM/i })).toBeInTheDocument();
    expect(screen.getByText(marketingShareLocalTitle)).toBeInTheDocument();
    expect(screen.getByText(marketingShareLinkLabel)).toBeInTheDocument();
    expect(screen.getByText(marketingShareRemoteTitle)).toBeInTheDocument();
    expect(screen.getByText("cloud")).toBeInTheDocument();
    expect(screen.getByText("vm-12")).toBeInTheDocument();
    expect(screen.queryByText("Alex")).not.toBeInTheDocument();
    expect(screen.queryByText("Sam")).not.toBeInTheDocument();
    expect(screen.queryByText("Agent work teammates can reach")).not.toBeInTheDocument();
  });
});
