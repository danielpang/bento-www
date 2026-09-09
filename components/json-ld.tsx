/**
 * Renders a schema.org description as an inline JSON-LD script.
 *
 * `<` is escaped so a value containing `</script>` cannot close the tag,
 * which is the one injection the JSON encoding does not already prevent.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
