import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { pricingPlans } from "@/lib/pricing";
import PricingPage, { metadata } from "./page";

describe("Pricing", () => {
  it("renders monthly hosted plans with the cloud catalog prices", () => {
    render(<PricingPage />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Start free. Scale the pipeline.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Begin on Free, then pick a plan as the board fills up/i),
    ).toBeInTheDocument();

    const plans = screen.getByRole("region", { name: "Plans" });
    expect(within(plans).getByRole("heading", { name: "Free" })).toBeInTheDocument();
    expect(within(plans).getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    expect(
      within(plans).getByRole("heading", { name: "Business" }),
    ).toBeInTheDocument();
    expect(
      within(plans).getByRole("heading", { name: "Enterprise" }),
    ).toBeInTheDocument();

    expect(within(plans).getByText("$0")).toBeInTheDocument();
    expect(within(plans).getByText("$29")).toBeInTheDocument();
    expect(within(plans).getByText("$59")).toBeInTheDocument();
    expect(within(plans).getByText("From $110")).toBeInTheDocument();
    expect(
      within(plans).getByText("per user a month, 5 seats minimum"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("per user a month, 25 seats minimum"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("5 agent hours a month for the team"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("25 agent hours a month for the team"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("500 agent hours a month for the team"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("2000 agent hours a month for the team"),
    ).toBeInTheDocument();
    expect(within(plans).getByText("SSO and SCIM")).toBeInTheDocument();
    expect(
      within(plans).getByText("Then $0.90 an agent hour"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("Then $0.80 an agent hour"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("Then $0.65 an agent hour"),
    ).toBeInTheDocument();
    expect(
      within(plans).getByText("Billed for 25 seats minimum"),
    ).toBeInTheDocument();
    expect(within(plans).getByRole("link", { name: /Start Pro/ })).toBeInTheDocument();
    expect(within(plans).getByRole("link", { name: /Talk to us/ })).toHaveAttribute(
      "href",
      "mailto:daniel@usebento.ai",
    );
    expect(pricingPlans).toHaveLength(4);
    expect(plans.querySelector(".pricing-card")).not.toHaveStyle({
      opacity: "0",
    });
  });

  it("explains seats, hours, overage, and self-hosting", () => {
    const { container } = render(<PricingPage />);

    expect(
      screen.getByRole("heading", { name: "Questions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/signup or subscription anniversary/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/\$0\.90 an agent hour/i).length).toBeGreaterThan(
      0,
    );
    expect(screen.getByText(/\$0\.80 on Business/i)).toBeInTheDocument();
    expect(screen.getByText(/\$0\.65 on Enterprise/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Enterprise bills at least 25/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "source license" }),
    ).toHaveAttribute("href", "/license");
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(metadata.openGraph).toMatchObject({
      title: "Pricing | Bento",
      url: "/pricing",
    });
  });

  it("publishes the visible questions as FAQPage structured data", () => {
    const { container } = render(<PricingPage />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");

    const shownQuestions = Array.from(container.querySelectorAll(".pricing-faq dt")).map(
      (term) => term.textContent,
    );
    const shownAnswers = Array.from(container.querySelectorAll(".pricing-faq dd")).map(
      (detail) => detail.textContent,
    );
    expect(shownQuestions.length).toBeGreaterThan(0);
    expect(data.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(shownQuestions);
    expect(
      data.mainEntity.map((entry: { acceptedAnswer: { text: string } }) => entry.acceptedAnswer.text),
    ).toEqual(shownAnswers);
  });
});
