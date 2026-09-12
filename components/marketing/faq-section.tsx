import Link from "next/link";

const faqItems = [
  {
    question: "Is Bento open source?",
    answer: (
      <>
        Yes. You’re free to run the <Link href="/docs/tui">Bento TUI</Link> and{" "}
        <Link href="/docs/web-app">Web UI</Link> locally, or self-host Bento Server for
        your team. If you’d rather use a managed service, <a href="https://usebento.ai">usebento.ai</a>{" "}
        includes a free plan and <Link href="/pricing">paid plans</Link> for higher usage.
      </>
    ),
  },
  {
    question: "Does Bento support BYOK?",
    answer: (
      <>
        Yes. Bring your own API keys from your favourite model providers. Bento does not
        offer model tokens with its free or paid plans.
      </>
    ),
  },
  {
    question: "Why use Bento over running agents directly?",
    answer: (
      <>
        Bento organizes your sessions without losing track of each feature’s status or
        context. Give each agent and pipeline stage a <code>SKILL.md</code>, and you can
        reuse the same instructions instead of repeating prompts.
      </>
    ),
  },
] as const;

export function MarketingFaq() {
  return (
    <section className="marketing-faq" aria-labelledby="marketing-faq-title">
      <div className="site-shell marketing-faq-layout">
        <header className="marketing-faq-intro">
          <span className="marketing-faq-eyebrow">{"// FAQ"}</span>
          <h2 id="marketing-faq-title">
            Questions? <span>We’ve got answers.</span>
          </h2>
          <p>What to know before you run Bento.</p>
        </header>

        <div className="marketing-faq-list">
          {faqItems.map((item, index) => (
            <details className="marketing-faq-item" key={item.question} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <i aria-hidden="true" className="marketing-faq-mark" />
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
