import { Fragment } from "react";
import Image from "next/image";
import { ChangelogVideoFigure } from "@/components/changelog-video";
import { InstallCommand } from "@/components/install-command";
import type { ChangelogEntry } from "@/lib/changelog";
import { formatChangelogInline } from "./changelog-inline";

interface ChangelogEntryContentProps {
  entry: ChangelogEntry;
}

export function ChangelogEntryContent({ entry }: ChangelogEntryContentProps) {
  return (
    <>
      {entry.paragraphs.map((paragraph, index) => (
        <Fragment key={paragraph}>
          <p>{formatChangelogInline(paragraph)}</p>
          {index === 0 && entry.media ? (
            entry.media.type === "video" ? (
              <ChangelogVideoFigure media={entry.media} />
            ) : (
              <figure className="changelog-entry-media">
                {/* Unoptimized so an animated GIF keeps animating. */}
                <Image
                  alt={entry.media.alt}
                  height={entry.media.height}
                  src={entry.media.src}
                  unoptimized
                  width={entry.media.width}
                />
              </figure>
            )
          ) : null}
        </Fragment>
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
