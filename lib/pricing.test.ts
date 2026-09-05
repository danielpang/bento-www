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
      0, 29, 59, 110,
    ]);
    expect(pricingPlans.map((plan) => plan.minimumSeats)).toEqual([
      1, 1, 5, 25,
    ]);
    expect(pricingPlans.map((plan) => plan.overageUsdPerAgentHour)).toEqual([
      null, 0.9, 0.8, 0.65,
    ]);
    expect(pricingPlans.map((plan) => plan.includedAgentHours)).toEqual([
      5, 25, 500, 2000,
    ]);
    expect(pricingPlans.find((plan) => plan.featured)?.id).toBe("pro");
  });

  it("prints monthly prices the way the console does", () => {
    expect(money(29)).toBe("$29");
    expect(money(59)).toBe("$59");
    expect(money(110)).toBe("$110");
    expect(money(0.9)).toBe("$0.90");
    expect(money(0.8)).toBe("$0.80");
    expect(money(0.65)).toBe("$0.65");
    expect(planPriceLabel(pricingPlans[0]!)).toBe("$0");
    expect(planPriceLabel(pricingPlans[1]!)).toBe("$29");
    expect(planPriceLabel(pricingPlans[2]!)).toBe("$59");
    expect(planPriceLabel(pricingPlans[3]!)).toBe("From $110");
    expect(planPriceHint(pricingPlans[1]!)).toBe("per user a month");
    expect(planPriceHint(pricingPlans[2]!)).toBe(
      "per user a month, 5 seats minimum",
    );
    expect(planPriceHint(pricingPlans[3]!)).toBe(
      "per user a month, 25 seats minimum",
    );
  });
});
