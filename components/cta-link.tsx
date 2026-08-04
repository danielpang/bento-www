import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface CtaLinkProps
  extends Omit<ComponentPropsWithoutRef<"a">, "href" | "children"> {
  children: ReactNode;
  href: string | null;
  variant?: "primary" | "secondary" | "quiet";
}

export function CtaLink({
  children,
  className = "",
  href,
  variant = "primary",
  ...props
}: CtaLinkProps) {
  const classes = `cta-link cta-link-${variant} ${className}`.trim();

  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={`${classes} cta-link-disabled`}
        role="link"
        title="This destination has not been configured yet"
      >
        {children}
      </span>
    );
  }

  return (
    <a className={classes} href={href} {...props}>
      {children}
    </a>
  );
}
