import type { JSX } from "react";

// SVG path data is adapted and modified from nexu-io/open-design.
// See THIRD_PARTY_NOTICES.md and licenses/Apache-2.0.txt.
export type AgentName =
  | "Claude Code"
  | "Codex CLI"
  | "Cursor CLI"
  | "OpenCode"
  | "Pi";

type AgentLogoProps = {
  agent: AgentName;
  className?: string;
};

const paths: Record<AgentName, JSX.Element> = {
  "Claude Code": (
    <path
      clipRule="evenodd"
      d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0v-3.1h3V5h17.998zM6 10.949h1.488V8.102H6zm10.51 0H18V8.102h-1.49z"
      fillRule="evenodd"
    />
  ),
  "Codex CLI": (
    <path d="M9.064 3.344a4.6 4.6 0 0 1 2.285-.312q1.5.173 2.673 1.275.016.015.037.021a.1.1 0 0 0 .043 0 4.55 4.55 0 0 1 3.046.275l.047.022.116.057a4.58 4.58 0 0 1 2.188 2.399q.313.765.315 1.595a4.2 4.2 0 0 1-.134 1.223.12.12 0 0 0 .03.115q.89.91 1.183 2.17.433 2.138-.887 3.854l-.136.166a4.55 4.55 0 0 1-2.201 1.388.12.12 0 0 0-.081.076c-.191.551-.383 1.023-.74 1.494-.9 1.187-2.222 1.846-3.711 1.838q-1.78-.009-3.157-1.302a.11.11 0 0 0-.105-.024c-.388.125-.78.143-1.204.138a4.44 4.44 0 0 1-1.945-.466 4.54 4.54 0 0 1-1.61-1.335c-.152-.202-.303-.392-.414-.617a6 6 0 0 1-.37-.961 4.6 4.6 0 0 1-.014-2.298.1.1 0 0 0 .006-.056.1.1 0 0 0-.027-.048 4.5 4.5 0 0 1-1.034-1.651 3.9 3.9 0 0 1-.251-1.192 5.2 5.2 0 0 1 .141-1.6Q3.659 7.92 5.086 6.97q.318-.212.601-.33a6 6 0 0 1 .646-.227.1.1 0 0 0 .065-.066 4.5 4.5 0 0 1 .829-1.615 4.54 4.54 0 0 1 1.837-1.388m3.482 10.565a.637.637 0 0 0 0 1.272h3.636a.637.637 0 1 0 0-1.272zM8.462 9.23a.637.637 0 0 0-1.106.631l1.272 2.224-1.266 2.136a.636.636 0 1 0 1.095.649l1.454-2.455a.64.64 0 0 0 .005-.64z" />
  ),
  "Cursor CLI": (
    <path
      d="M22.106 5.68 12.5.135a1 1 0 0 0-.998 0L1.893 5.68a.84.84 0 0 0-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a1 1 0 0 0 .998 0l9.608-5.547a.84.84 0 0 0 .42-.727V6.407a.84.84 0 0 0-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 0 0-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514"
      fillRule="evenodd"
    />
  ),
  OpenCode: (
    <path d="M16 6H8v12h8zm4 16H4V2h16z" fillRule="evenodd" />
  ),
  Pi: (
    <>
      <path
        d="M165.29 165.29H517.36V400H400V517.36H282.65V634.72H165.29ZM282.65 282.65V400H400V282.65Z"
        fillRule="evenodd"
      />
      <path d="M517.36 400H634.72V634.72H517.36Z" />
    </>
  ),
};

export function AgentLogo({
  agent,
  className,
}: AgentLogoProps): JSX.Element {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      focusable="false"
      viewBox={agent === "Pi" ? "0 0 800 800" : "0 0 24 24"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths[agent]}
    </svg>
  );
}
