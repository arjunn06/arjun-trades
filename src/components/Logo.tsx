import { cn } from "@/lib/utils";

/** The IFVG monogram. Path is unchanged from the original brand asset. The viewBox is cropped to the glyph and the fill follows the text colour. */
const Logo = ({ className }: { className?: string }) => (
  <svg
    viewBox="59.7334 56.3828 64.3786 64.3792"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("h-8 w-8", className)}
    role="img"
    aria-label="IFVG"
  >
    <path
      d="M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z"
      fill="currentColor"
    />
  </svg>
);

export default Logo;
