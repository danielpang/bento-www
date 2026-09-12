import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MarketingFaq } from "./faq-section";

describe("marketing FAQ", () => {
  it("answers the three product questions and links to setup and plans", () => {
    render(<MarketingFaq />);

    const faq = screen.getByRole("region", { name: "Questions?" });
    expect(within(faq).getByText("Is Bento open source?")).toBeInTheDocument();
    expect(within(faq).getByText("Does Bento support BYOK?")).toBeInTheDocument();
    expect(
      within(faq).getByText("Why use Bento over running agents directly?"),
    ).toBeInTheDocument();
    expect(within(faq).getByRole("link", { name: "Bento TUI" })).toHaveAttribute(
      "href",
      "/docs/tui",
    );
    expect(within(faq).getByRole("link", { name: "Web UI" })).toHaveAttribute(
      "href",
      "/docs/web-app",
    );
    expect(within(faq).getByRole("link", { name: "usebento.ai" })).toHaveAttribute(
      "href",
      "https://usebento.ai",
    );
    expect(within(faq).getByRole("link", { name: "paid plans" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(within(faq).getByText("SKILL.md")).toBeInTheDocument();
  });

  it("lets every answer open and close independently", () => {
    const { container } = render(<MarketingFaq />);
    const items = Array.from(container.querySelectorAll(".marketing-faq-item"));

    expect(items[0]).not.toHaveAttribute("open");
    expect(items[1]).not.toHaveAttribute("open");
    expect(items[2]).not.toHaveAttribute("open");

    fireEvent.click(within(items[1] as HTMLElement).getByText("Does Bento support BYOK?"));
    expect(items[0]).not.toHaveAttribute("open");
    expect(items[1]).toHaveAttribute("open");

    fireEvent.click(within(items[0] as HTMLElement).getByText("Is Bento open source?"));
    expect(items[0]).toHaveAttribute("open");

    fireEvent.click(within(items[0] as HTMLElement).getByText("Is Bento open source?"));
    expect(items[0]).not.toHaveAttribute("open");
    expect(items[1]).toHaveAttribute("open");
  });
});
