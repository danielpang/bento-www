import { describe, expect, it } from "vitest";
import {
  money,
  planPriceHint,
  planPriceLabel,
  pricingPlans,
} from "./pricing";

describe("hosted pricing catalog", () => {
  it("lists monthly plans in catalog order", () => {
    expect(pricingPlans.map((plan) => plan.id)).toEqual([
      "free",
      "pro",
      "business",
      "enterprise",
    ]);
    expect(pricingPlans.map((plan) => plan.amountUsd)).toEqual([
      0,
      29,
      29,
      99,
    ]);
    expect(pricingPlans.map((plan) => plan.includedAgentHours)).toEqual([
      5, 25, 500, 2000,
    ]);
    expect(pricingPlans.find((plan) => plan.featured)?.id).toBe("pro");
  });

  it("prints whole-dollar monthly prices the way the console does", () => {
    expect(money(29)).toBe("$29");
    expect(money(2)).toBe("$2");
    expect(planPriceLabel(pricingPlans[0]!)).toBe("$0");
    expect(planPriceLabel(pricingPlans[1]!)).toBe("$29");
    expect(planPriceLabel(pricingPlans[3]!)).toBe("From $99");
    expect(planPriceHint(pricingPlans[1]!)).toBe("per user a month");
    expect(planPriceHint(pricingPlans[2]!)).toBe(
      "per user a month, 5 seats minimum",
    );
  });
});
