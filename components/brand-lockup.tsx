import Link from "next/link";

interface BrandLockupProps {
  className?: string;
}

export function BrandLockup({ className = "" }: BrandLockupProps) {
  return (
    <Link
      aria-label="Bento home"
      className={`brand-lockup ${className}`.trim()}
      href="/"
    >
      <svg
        aria-hidden="true"
        className="brand-glyph"
        fill="none"
        viewBox="0 0 64 64"
      >
        <rect
          fill="#12161E"
          height="62"
          rx="14"
          stroke="#39414F"
          strokeWidth="2"
          width="62"
          x="1"
          y="1"
        />
        <rect fill="#F97316" height="26" rx="5" width="26" x="10" y="10" />
        <rect fill="#3A4353" height="26" rx="5" width="14" x="40" y="10" />
        <rect fill="#3A4353" height="14" rx="5" width="14" x="10" y="40" />
        <rect fill="#3E77E8" height="14" rx="5" width="26" x="28" y="40" />
      </svg>
      <span>Bento</span>
    </Link>
  );
}
