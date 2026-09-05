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
        name: "Hosted Bento, billed monthly.",
      }),
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
    expect(within(plans).getAllByText("$29")).toHaveLength(2);
    expect(within(plans).getByText("From $99")).toBeInTheDocument();
    expect(
      within(plans).getAllByText("per user a month, 5 seats minimum"),
    ).toHaveLength(2);
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
    expect(within(plans).getByRole("link", { name: /Start Pro/ })).toBeInTheDocument();
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
    expect(screen.getAllByText(/\$2 an agent hour/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "source license" }),
    ).toHaveAttribute("href", "/license");
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(metadata.openGraph).toMatchObject({
      title: "Pricing | Bento",
      url: "/pricing",
    });
  });
});
