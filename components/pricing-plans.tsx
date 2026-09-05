import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import { CtaLink } from "./cta-link";
import {
  planCtaHref,
  planPriceHint,
  planPriceLabel,
  pricingPlans,
  type PricingPlan,
} from "@/lib/pricing";

interface PricingPlansProps {
  signupUrl: string | null;
}

function PlanCard({
  plan,
  signupUrl,
}: {
  plan: PricingPlan;
  signupUrl: string | null;
}) {
  const price = planPriceLabel(plan);

  return (
    <article
      className={
        plan.featured
          ? "pricing-card pricing-card-featured"
          : "pricing-card"
      }
    >
      <header className="pricing-card-head">
        <p
          className={
            plan.featured
              ? "pricing-card-badge"
              : "pricing-card-badge pricing-card-badge-quiet"
          }
        >
          {plan.featured ? "Most teams" : "\u00a0"}
        </p>
        <h2>{plan.name}</h2>
        <p className="pricing-card-price">
          <span>{price}</span>
          <span>{planPriceHint(plan)}</span>
        </p>
        <p className="pricing-card-summary">{plan.summary}</p>
      </header>
      <ul className="pricing-card-features">
        {plan.highlights.map((line) => (
          <li key={line}>
            <Check aria-hidden="true" size={16} weight="bold" />
            {line}
          </li>
        ))}
      </ul>
      <CtaLink
        className="pricing-card-cta"
        href={planCtaHref(plan, signupUrl)}
        variant={plan.featured ? "primary" : "secondary"}
      >
        {plan.ctaLabel}
        <ArrowUpRight aria-hidden="true" size={15} weight="bold" />
      </CtaLink>
    </article>
  );
}

export function PricingPlans({ signupUrl }: PricingPlansProps) {
  return (
    <div className="pricing-grid">
      {pricingPlans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} signupUrl={signupUrl} />
      ))}
    </div>
  );
}
