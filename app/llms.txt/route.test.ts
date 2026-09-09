import { describe, expect, it } from "vitest";
import { listDocs } from "@/lib/docs";
import { pricingPlans } from "@/lib/pricing";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("serves a plain-text one-pager that caches publicly", async () => {
    const response = GET();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(response.headers.get("cache-control")).toContain("public");

    const text = await response.text();
    expect(text.startsWith("# Bento\n\n> ")).toBe(true);
    expect(text).toMatch(/^## Product$/m);
    expect(text).toMatch(/^## Docs$/m);
    expect(text).toMatch(/^## Optional$/m);
  });

  it("links every key URL on the marketing origin", async () => {
    const text = await GET().text();
    for (const path of ["", "/docs", "/docs/concepts", "/pricing", "/changelog", "/terms", "/license"]) {
      expect(text).toContain(`](http://localhost:3000${path})`);
    }
    for (const doc of listDocs()) {
      expect(text).toContain(`](http://localhost:3000/docs/${doc.slug}): ${doc.description}`);
    }
  });

  it("restates the pricing catalog without inventing numbers", async () => {
    const text = await GET().text();
    expect(text).toContain("- Free: $0, up to 3 members, 5 agent hours a month for the team.");
    expect(text).toContain("- Pro: $29 per seat a month, 25 agent hours a month for the team, then $0.90 an agent hour.");
    expect(text).toContain("- Business: $59 per seat a month, 5 seats minimum, 500 agent hours a month for the team, then $0.80 an agent hour.");
    expect(text).toContain("- Enterprise: From $110 per seat a month, 25 seats minimum, 2000 agent hours a month for the team, then $0.65 an agent hour.");
    expect(pricingPlans).toHaveLength(4);
    expect(text).not.toMatch(/[—–]/);
  });
});
