import { siteDisambiguation } from "@/lib/copy";

/**
 * The one-line "which Bento is this" note, placed in the first screen of the
 * homepage and the docs hub. The sentence itself lives in lib/copy.ts so the
 * page, /llms.txt, and the structured data all quote the same words.
 */
export function DisambiguationNote({ className }: { className?: string }) {
  return (
    <p className={["disambiguation-note", className].filter(Boolean).join(" ")}>
      {siteDisambiguation}
    </p>
  );
}
