import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
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

  it("compares a private laptop with a shared remote board", () => {
    render(<RemoteShareScene />);

    expect(screen.getByRole("figure", { name: /laptop-only agents versus a shared remote board/i })).toBeInTheDocument();
    expect(screen.getByText(marketingShareLocalTitle)).toBeInTheDocument();
    expect(screen.getByText(marketingShareRemoteTitle)).toBeInTheDocument();
  });
});
