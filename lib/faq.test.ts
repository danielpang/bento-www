import { describe, expect, it } from "vitest";
import { productFaq } from "./faq";

describe("product FAQ", () => {
  it("opens by defining Bento at usebento.ai as an agent pipeline", () => {
    const [first] = productFaq;
    expect(first.title).toBe("What is Bento (usebento.ai)?");
    expect(first.body).toContain("agent pipeline");
    expect(first.body).toMatch(/gate/);
    expect(first.body).toMatch(/sandbox/);
    expect(first.body).toMatch(/pull request/);
  });

  it("names the products people confuse with Bento", () => {
    const entry = productFaq.find((question) => /bentonow/.test(question.title));
    expect(entry).toBeDefined();
    expect(entry!.body).toMatch(/^No\./);
    expect(entry!.body).toContain("getbento.sh");
    expect(entry!.body).toContain("usebento.ai");
  });

  it("covers handing work between agents and where agents run", () => {
    const titles = productFaq.map((question) => question.title);
    expect(titles).toContain("Can one coding agent hand a feature to a different one?");
    expect(titles).toContain("Where do the agents run?");
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("keeps prohibited dash characters out of the answers", () => {
    for (const question of productFaq) {
      expect(question.title).not.toMatch(/[—–]/);
      expect(question.body).not.toMatch(/[—–]/);
      expect(question.body.length).toBeGreaterThan(40);
    }
  });
});
