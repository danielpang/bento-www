import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingPipelineLanes,
  marketingShareRemoteTitle,
  marketingShareSandboxes,
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

  it("shows many isolated sandboxes running in the cloud", () => {
    render(<RemoteShareScene />);

    expect(screen.getByRole("figure", { name: /many isolated sandboxes running in the cloud/i })).toBeInTheDocument();
    expect(screen.getByText("cloud")).toBeInTheDocument();
    expect(screen.getByText(`${marketingShareSandboxes.length} sandboxes`)).toBeInTheDocument();
    expect(screen.getByText(marketingShareRemoteTitle)).toBeInTheDocument();
    expect(screen.queryByText("Your laptop")).not.toBeInTheDocument();
    expect(screen.queryByText("Session")).not.toBeInTheDocument();
    expect(screen.queryByText(/attach session/i)).not.toBeInTheDocument();
    for (const sandbox of marketingShareSandboxes) {
      expect(screen.getByText(sandbox.title)).toBeInTheDocument();
    }
  });
});
