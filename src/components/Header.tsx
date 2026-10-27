import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, List } from "@phosphor-icons/react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/Logo";
import { BLUEPRINT_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to?: string; href?: string };

const navItems: NavItem[] = [
  { label: "YouTube", href: "https://youtube.com/@arjun_ifvg" },
  { label: "Workshop", to: "/workshop" },
  { label: "Arena", to: "/arena" },
  { label: "Discord", href: "https://discord.gg/SCHeKKCa6c" },
  { label: "Blogs", to: "/blogs" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact", to: "/contact" },
];

const linkBase =
  "relative inline-flex items-center gap-1 px-3 py-2 text-[0.9375rem] font-medium text-foreground after:absolute after:inset-x-3 after:bottom-0.5 after:h-[2px] after:origin-left after:scale-x-0 after:bg-foreground after:transition-transform after:duration-300 after:ease-out-expo hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 aria-[current=page]:after:bg-primary";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = (to?: string) => !!to && (pathname === to || pathname.startsWith(`${to}/`));

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-foreground focus:px-4 focus:py-3 focus:text-background"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between">
          <Link to="/" aria-label="Arjun IFVG, home" className="flex items-center gap-2.5">
            <Logo className="h-5 w-5 text-foreground" />
            <span className="type-heading hidden text-[1.0625rem] sm:block">Arjun IFVG</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) =>
              item.to ? (
                <Link
                  key={item.label}
                  to={item.to}
                  aria-current={isActive(item.to) ? "page" : undefined}
                  className={linkBase}
                >
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className={linkBase}>
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" weight="bold" />
                </a>
              ),
            )}
            <a
              href={BLUEPRINT_URL}
              className="ml-4 inline-flex h-10 items-center gap-2 bg-primary px-5 text-[0.9375rem] font-semibold text-primary-foreground transition-[background-color,color,transform] duration-200 ease-out-expo hover:bg-foreground hover:text-background active:translate-y-px"
            >
              The Blueprint
            </a>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background lg:hidden"
                aria-label="Open menu"
              >
                <List className="h-6 w-6" weight="bold" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-full max-w-none flex-col border-0 p-0 sm:max-w-none">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <div className="flex h-16 items-center px-5">
                <Logo className="h-5 w-5 text-foreground" />
              </div>
              <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-1 px-5">
                {[{ label: "Home", to: "/" }, ...navItems].map((item, i) => {
                  const cls = cn(
                    "type-title flex items-center justify-between border-b border-border py-4 text-[2.5rem] transition-colors hover:text-primary",
                    isActive(item.to) && "text-primary",
                  );
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {item.to ? (
                        <Link to={item.to} onClick={() => setOpen(false)} className={cls}>
                          {item.label}
                          <ArrowRight className="h-6 w-6" weight="bold" />
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setOpen(false)}
                          className={cls}
                        >
                          {item.label}
                          <ArrowUpRight className="h-6 w-6" weight="bold" />
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </nav>
              <div className="menu-footer p-5 pb-8">
                <a
                  href={BLUEPRINT_URL}
                  className="flex h-14 w-full items-center justify-center gap-2 bg-primary text-base font-semibold text-primary-foreground active:translate-y-px"
                >
                  The Blueprint
                  <ArrowRight className="h-5 w-5" weight="bold" />
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
};

export default Header;
