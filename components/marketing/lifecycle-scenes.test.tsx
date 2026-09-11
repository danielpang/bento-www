import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  marketingBoardCaption,
  marketingBoardCaptionMeta,
  marketingBoardSessions,
  marketingShareLocalTitle,
  marketingShareRemoteTitle,
} from "@/lib/copy";
import { RemoteShareScene, TeamBoardScene } from "./lifecycle-scenes";

describe("lifecycle scenes", () => {
  it("shows a team-visible board of agent sessions", () => {
    render(<TeamBoardScene />);

    expect(screen.getByRole("figure", { name: /shared board of agent sessions/i })).toBeInTheDocument();
    expect(screen.getByText(marketingBoardCaption)).toBeInTheDocument();
    expect(screen.getByText(marketingBoardCaptionMeta)).toBeInTheDocument();
    for (const session of marketingBoardSessions) {
      expect(screen.getByText(session.title)).toBeInTheDocument();
      expect(screen.getByText(session.viewers)).toBeInTheDocument();
    }
  });

  it("compares a private laptop with a shared remote board", () => {
    render(<RemoteShareScene />);

    expect(screen.getByRole("figure", { name: /laptop-only agents versus a shared remote board/i })).toBeInTheDocument();
    expect(screen.getByText(marketingShareLocalTitle)).toBeInTheDocument();
    expect(screen.getByText(marketingShareRemoteTitle)).toBeInTheDocument();
  });
});
