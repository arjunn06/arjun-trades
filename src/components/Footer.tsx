import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { BLUEPRINT_URL } from "@/lib/links";

const explore: { label: string; to?: string; href?: string }[] = [
  { label: "Workshop", to: "/workshop" },
  { label: "Arena", to: "/arena" },
  { label: "Livestream record", to: "/record" },
  { label: "Blogs", to: "/blogs" },
  { label: "The Blueprint", href: BLUEPRINT_URL },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const follow = [
  { label: "YouTube", href: "https://youtube.com/@arjun_ifvg" },
  { label: "Discord", href: "https://discord.gg/SCHeKKCa6c" },
  { label: "Instagram", href: "https://www.instagram.com/arjun_ifvg" },
  { label: "X", href: "https://x.com/arjun_ifvg" },
];

const linkCls =
  "group/f inline-flex items-center gap-1.5 py-1.5 text-[1.0625rem] font-medium text-foreground transition-colors hover:text-primary";

const Footer = () => (
  <footer className="mt-8 border-t border-foreground sm:mt-12">
    <div className="shell grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
      <div className="lg:col-span-6">
        <Link to="/" aria-label="Arjun IFVG, home" className="inline-block">
          <Logo className="h-8 w-8 text-foreground" />
        </Link>
        <p className="type-title mt-8 text-[clamp(2.5rem,5vw,4rem)]">Arjun Trades</p>
        <p className="mt-4 max-w-sm text-muted-foreground">
          ICT, Smart Money Concepts and the iFVG strategy, in plain Tamil, for beginners.
        </p>
      </div>

      <nav aria-label="Footer" className="grid grid-cols-2 gap-10 lg:col-span-5 lg:col-start-8">
        <ul>
          {explore.map((l) => (
            <li key={l.label}>
              {l.to ? (
                <Link to={l.to} className={linkCls}>
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} className={linkCls}>
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>
        <ul>
          {follow.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer me" className={linkCls}>
                {l.label}
                <ArrowUpRight
                  className="h-4 w-4 text-muted-foreground transition-transform group-hover/f:-translate-y-0.5 group-hover/f:translate-x-0.5"
                  weight="bold"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

    <div className="border-t border-border">
      <div className="shell flex flex-col items-start justify-between gap-4 py-5 sm:flex-row sm:items-center">
        <p className="type-label text-muted-foreground">© 2026 Arjun Trades</p>
        <ThemeToggle />
      </div>
    </div>
  </footer>
);

export default Footer;
