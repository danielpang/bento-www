import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { faqDescription, productFaq } from "@/lib/faq";
import FaqPage, { metadata } from "./page";

describe("FAQ", () => {
  it("answers what Bento is, in the shared marketing shell", () => {
    const { container } = render(<FaqPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Questions" })).toBeInTheDocument();
    expect(screen.getByText(faqDescription)).toBeInTheDocument();
    expect(screen.getByText("What is Bento (usebento.ai)?")).toBeInTheDocument();
    expect(
      Array.from(container.querySelectorAll(".faq-section dt")).map((term) => term.textContent),
    ).toEqual(productFaq.map((question) => question.title));
    expect(container.querySelector(".marketing-page")).not.toBeNull();
    expect(screen.getByRole("navigation", { name: "Primary" })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(container.textContent).not.toMatch(/[—–]/);
    expect(metadata.openGraph).toMatchObject({ title: "FAQ | Bento", url: "/faq" });
    expect(metadata.alternates).toMatchObject({ canonical: "/faq" });
  });

  it("publishes the visible questions as FAQPage structured data", () => {
    const { container } = render(<FaqPage />);

    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const data = JSON.parse(script!.textContent ?? "null");
    expect(data["@type"]).toBe("FAQPage");

    const shownQuestions = Array.from(container.querySelectorAll(".faq-section dt")).map(
      (term) => term.textContent,
    );
    const shownAnswers = Array.from(container.querySelectorAll(".faq-section dd")).map(
      (detail) => detail.textContent,
    );
    expect(shownQuestions.length).toBeGreaterThan(0);
    expect(data.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(shownQuestions);
    expect(
      data.mainEntity.map((entry: { acceptedAnswer: { text: string } }) => entry.acceptedAnswer.text),
    ).toEqual(shownAnswers);
  });
});
