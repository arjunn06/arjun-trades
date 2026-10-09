import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TextLinkProps {
  children: ReactNode;
  to?: string;
  href?: string;
  /** For `href`: navigate in the same tab (own properties) instead of opening a new one. */
  sameTab?: boolean;
  className?: string;
}

const base =
  "group/link inline-flex items-center gap-2 font-semibold text-foreground underline decoration-border decoration-2 underline-offset-[6px] transition-colors hover:decoration-primary";

/** Tertiary action: underlined text with an arrow that nudges on hover. `to` is internal, `href` opens a new tab. */
const TextLink = ({ children, to, href, sameTab, className }: TextLinkProps) => {
  if (to) {
    return (
      <Link to={to} className={cn(base, className)}>
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/link:translate-x-1" weight="bold" />
      </Link>
    );
  }
  if (sameTab) {
    return (
      <a href={href} className={cn(base, className)}>
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/link:translate-x-1" weight="bold" />
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn(base, className)}>
      {children}
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
        weight="bold"
      />
    </a>
  );
};

export default TextLink;
