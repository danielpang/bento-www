import { InstallCommand } from "@/components/install-command";
import type { ChangelogEntry } from "@/lib/changelog";
import { formatChangelogInline } from "./changelog-inline";

interface ChangelogEntryContentProps {
  entry: ChangelogEntry;
}

export function ChangelogEntryContent({ entry }: ChangelogEntryContentProps) {
  return (
    <>
      {entry.paragraphs.map((paragraph) => (
        <p key={paragraph}>{formatChangelogInline(paragraph)}</p>
      ))}
      {entry.sections ? (
        <div className="changelog-entry-sections">
          {entry.sections.map((section) => (
            <section className="changelog-entry-section" key={section.title}>
              <h3>{section.title}</h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{formatChangelogInline(paragraph)}</p>
              ))}
              {section.installCommand ? (
                <InstallCommand label="Copy and run in your terminal" />
              ) : null}
              {section.points ? (
                <ul className="changelog-entry-points">
                  {section.points.map((point) => (
                    <li key={point.label}>
                      <strong>{point.label}</strong>
                      <span>{formatChangelogInline(point.body)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      ) : null}
    </>
  );
}
