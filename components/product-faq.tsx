import { JsonLd } from "@/components/json-ld";
import { productFaq } from "@/lib/faq";
import { faqPageJsonLd } from "@/lib/structured-data";

/**
 * The product questions as a definition list, in the same shape as the
 * questions on /pricing, with FAQPage structured data built from the very
 * list being rendered so the markup and the visible answers cannot drift.
 */
export function ProductFaq({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="product-faq-heading"
      className={["faq-section", className].filter(Boolean).join(" ")}
      id="faq"
    >
      <JsonLd data={faqPageJsonLd(productFaq)} />
      <div className="site-shell">
        <h2 id="product-faq-heading">Questions</h2>
        <dl>
          {productFaq.map((question) => (
            <div key={question.title}>
              <dt>{question.title}</dt>
              <dd>{question.body}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
