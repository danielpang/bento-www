import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MacDownloads } from "./mac-downloads";
import { browserMacArchitecture } from "@/lib/mac-architecture";

vi.mock("@/lib/mac-architecture", () => ({ browserMacArchitecture: vi.fn() }));

beforeEach(() => vi.mocked(browserMacArchitecture).mockResolvedValue(null));

describe("Mac download choices", () => {
  it("retains both explicit download links when the browser suggests one", async () => {
    vi.mocked(browserMacArchitecture).mockResolvedValue("arm64");
    render(<MacDownloads release={{ version: "0.2.0", downloads: { arm64: "https://github.com/arm.dmg", x64: "https://github.com/intel.dmg" } }} />);
    expect(screen.getByRole("link", { name: "Download for Apple silicon" })).toHaveAttribute("href", "/download/mac/arm64");
    expect(screen.getByRole("link", { name: "Download for Intel" })).toHaveAttribute("href", "/download/mac/x64");
    expect(await screen.findByText(/Your browser suggests Apple silicon/)).toBeInTheDocument();
  });

  it("shows missing downloads without offering broken links", () => {
    render(<MacDownloads release={null} />);
    expect(screen.getAllByText("Download unavailable")).toHaveLength(2);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(/Choose the version that matches your Mac/)).toBeInTheDocument();
  });

  it("offers an available architecture while explaining the missing build", () => {
    render(<MacDownloads release={{ version: "0.2.0", downloads: { arm64: "https://github.com/arm.dmg" } }} />);
    expect(screen.getByRole("link", { name: "Download for Apple silicon" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Download for Intel" })).not.toBeInTheDocument();
    expect(screen.getByText("Download unavailable")).toBeInTheDocument();
  });
});
