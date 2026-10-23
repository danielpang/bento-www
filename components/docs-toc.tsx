"use client";

import { useEffect, useState, type MouseEvent } from "react";
import type { DocHeading } from "@/lib/headings";

/**
 * How far below the top of the viewport a heading must pass before its
 * section counts as the one being read: the sticky header plus a margin.
 */
const READING_LINE = 120;

function flatten(items: DocHeading[]): DocHeading[] {
  return items.flatMap((item) => [item, ...item.children]);
}

/** The id of the last heading above the reading line, or null above the first. */
function sectionInView(ids: string[]): string | null {
  const headings = ids
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);
  if (headings.length === 0) return null;

  // At the very bottom the last sections can never reach the line, so the
  // last heading on screen is the one being read.
  const scroller = document.documentElement;
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= scroller.scrollHeight - 2) {
    const onScreen = headings.filter((el) => el.getBoundingClientRect().top < window.innerHeight);
    return onScreen.at(-1)?.id ?? null;
  }

  let current: string | null = null;
  for (const heading of headings) {
    if (heading.getBoundingClientRect().top <= READING_LINE) current = heading.id;
    else break;
  }
  return current;
}

/** Keeps the current link visible inside a sidebar that scrolls on its own. */
function revealInPanel(link: HTMLElement) {
  const panel = link.closest<HTMLElement>("[data-docs-nav-scroll]");
  if (!panel || panel.scrollHeight <= panel.clientHeight) return;
  const linkBox = link.getBoundingClientRect();
  const panelBox = panel.getBoundingClientRect();
  if (linkBox.top < panelBox.top) panel.scrollTop -= panelBox.top - linkBox.top + 8;
  else if (linkBox.bottom > panelBox.bottom) panel.scrollTop += linkBox.bottom - panelBox.bottom + 8;
}

interface DocsTocProps {
  items: DocHeading[];
  /** Accessible name for the list of sections. */
  label: string;
}

/**
 * The current guide's sections. Server rendered as plain anchor links, so it
 * works without JavaScript; once hydrated it marks the section in view and
 * closes the mobile menu it sits in when a link is chosen.
 */
export function DocsToc({ items, label }: DocsTocProps) {
  const [active, setActive] = useState<string | null>(null);
  const [list, setList] = useState<HTMLUListElement | null>(null);

  useEffect(() => {
    const ids = flatten(items).map((item) => item.id);
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setActive(sectionInView(ids)));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, [items]);

  useEffect(() => {
    if (!list || !active) return;
    const link = list.querySelector<HTMLElement>(`a[href="#${CSS.escape(active)}"]`);
    if (link) revealInPanel(link);
  }, [active, list]);

  const onClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    setActive(id);
    const menu = event.currentTarget.closest("details");
    if (menu) menu.open = false;
  };

  const renderItem = (item: DocHeading) => (
    <li key={item.id}>
      <a
        aria-current={active === item.id ? "location" : undefined}
        className={active === item.id ? "is-current" : undefined}
        href={`#${item.id}`}
        onClick={(event) => onClick(event, item.id)}
      >
        {item.text}
      </a>
      {item.children.length > 0 ? <ul>{item.children.map(renderItem)}</ul> : null}
    </li>
  );

  return (
    <ul aria-label={label} className="docs-toc" ref={setList}>
      {items.map(renderItem)}
    </ul>
  );
}
