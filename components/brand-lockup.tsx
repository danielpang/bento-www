import Image from "next/image";
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
      <Image
        alt=""
        aria-hidden="true"
        className="brand-glyph"
        height={22}
        src="/bento-logo.svg"
        width={22}
      />
      <span>Bento</span>
    </Link>
  );
}
