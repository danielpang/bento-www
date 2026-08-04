"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function Reveal({
  children,
  className,
  delay = 0,
}: RevealProps) {
  const element = useRef<HTMLDivElement>(null);
  const inView = useInView(element, { amount: 0.22, once: true });
  const reduceMotion = useReducedMotion();
  const enhanced = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const visible = !enhanced || reduceMotion || inView;

  return (
    <motion.div
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      className={className}
      initial={false}
      ref={element}
      transition={{
        delay: visible && !reduceMotion ? delay : 0,
        duration: reduceMotion ? 0 : 0.58,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
