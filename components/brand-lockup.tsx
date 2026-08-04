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
      <span aria-hidden="true" className="brand-glyph">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>Bento</span>
    </Link>
  );
}
