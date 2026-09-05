/**
 * Monthly hosted prices, matching the live Bento console billing catalog.
 *
 * Seat rates: Free is $0, Pro is $29 a seat, Business is $59 a seat
 * with a 5-seat floor, Enterprise starts at $110 a seat with a
 * 25-seat floor. Paid overage is $0.90 / $0.80 / $0.65 an agent hour.
 */
export type PricingPlanId = "free" | "pro" | "business" | "enterprise";

export interface PricingPlan {
  id: PricingPlanId;
  name: string;
  summary: string;
  amountUsd: number | null;
  fromPrice: boolean;
  perSeat: boolean;
  minimumSeats: number;
  includedAgentHours: number;
  overageUsdPerAgentHour: number | null;
  memberLimit: number | null;
  featured: boolean;
  ctaLabel: string;
  highlights: string[];
}

export function money(usd: number): string {
  return `$${usd % 1 === 0 ? usd.toFixed(0) : usd.toFixed(2)}`;
}

export function planPriceLabel(plan: PricingPlan): string {
  if (plan.amountUsd === null) return "Contact us";
  if (plan.amountUsd === 0) return "$0";
  const amount = money(plan.amountUsd);
  return plan.fromPrice ? `From ${amount}` : amount;
}

export function planPriceHint(plan: PricingPlan): string {
  if (plan.amountUsd === 0) return "a month";
  if (plan.amountUsd === null) return "priced with sales";
  if (plan.minimumSeats > 1) {
    return `per user a month, ${plan.minimumSeats} seats minimum`;
  }
  return "per user a month";
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    summary: "Try hosted Bento with a small team.",
    amountUsd: 0,
    fromPrice: false,
    perSeat: false,
    minimumSeats: 1,
    includedAgentHours: 5,
    overageUsdPerAgentHour: null,
    memberLimit: 3,
    featured: false,
    ctaLabel: "Sign up",
    highlights: [
      "Up to 3 members",
      "Unlimited cards on the board",
      "5 agent hours a month for the team",
      "Runs pause when the hours are used",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    summary: "Run a pipeline with seats billed as people join.",
    amountUsd: 29,
    fromPrice: false,
    perSeat: true,
    minimumSeats: 1,
    includedAgentHours: 25,
    overageUsdPerAgentHour: 0.9,
    memberLimit: null,
    featured: true,
    ctaLabel: "Start Pro",
    highlights: [
      "Billed per seat",
      "Unlimited cards on the board",
      "25 agent hours a month for the team",
      `Then ${money(0.9)} an agent hour`,
    ],
  },
  {
    id: "business",
    name: "Business",
    summary: "More hours, a seat floor, and a longer paper trail.",
    amountUsd: 59,
    fromPrice: false,
    perSeat: true,
    minimumSeats: 5,
    includedAgentHours: 500,
    overageUsdPerAgentHour: 0.8,
    memberLimit: null,
    featured: false,
    ctaLabel: "Start Business",
    highlights: [
      "Everything in Pro",
      "500 agent hours a month for the team",
      "90 day transcript history and audit log",
      "Priority run queue",
      "Billed for 5 seats minimum",
      `Then ${money(0.8)} an agent hour`,
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    summary: "SSO, your own Fly org, and a plan sized with sales.",
    amountUsd: 110,
    fromPrice: true,
    perSeat: true,
    minimumSeats: 25,
    includedAgentHours: 2000,
    overageUsdPerAgentHour: 0.65,
    memberLimit: null,
    featured: false,
    ctaLabel: "Talk to us",
    highlights: [
      "Everything in Business",
      "2000 agent hours a month for the team",
      "SSO and SCIM",
      "Sandboxes in your own Fly organization",
      "Billed for 25 seats minimum",
      `Then ${money(0.65)} an agent hour`,
    ],
  },
];
