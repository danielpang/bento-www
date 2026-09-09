"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Enhanced only where the reveal can actually be observed; anywhere else the
// server markup (visible) is the final state.
const subscribeNothing = () => () => undefined;
const canObserve = () => typeof IntersectionObserver !== "undefined";
const notOnServer = () => false;

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Fades a block in the first time it scrolls into view.
 *
 * A CSS transition and an IntersectionObserver, not an animation library:
 * this is the one animated component on pages like pricing and docs, and
 * importing motion for it put the whole library on every page. The server
 * renders the block visible, so content is never hidden without JavaScript;
 * hydration hides it (without a transition, so nothing fades out) and the
 * observer reveals it.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const element = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const enhanced = useSyncExternalStore(subscribeNothing, canObserve, notOnServer);
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    notOnServer,
  );

  useEffect(() => {
    const node = element.current;
    if (!node || !enhanced || inView) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.22 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enhanced, inView]);

  const visible = !enhanced || reduceMotion || inView;
  const style: CSSProperties | undefined =
    delay > 0 && visible && !reduceMotion
      ? { transitionDelay: `${delay}s` }
      : undefined;

  return (
    <div
      className={className ? `reveal ${className}` : "reveal"}
      data-hidden={visible ? undefined : ""}
      ref={element}
      style={style}
    >
      {children}
    </div>
  );
}
