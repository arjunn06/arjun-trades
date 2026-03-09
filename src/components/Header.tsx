import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, Youtube } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import NewsletterSheet from "@/components/NewsletterSheet";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center"
        >
          <img
            src="src/assets/logo.svg"
            alt="Arjun Trades logo"
            className="h-7 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="https://youtube.com/@arjun_ifvg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            YouTube
          </a>
          <Link
            to="/mentorship"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Mentorship
          </Link>
          <a
            href="https://discord.gg/SCHeKKCa6c"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Discord
          </a>
          <NewsletterSheet>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Newsletter
            </button>
          </NewsletterSheet>
          <Link
            to="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              className="md:hidden p-2 text-foreground"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <nav className="flex flex-col gap-6 mt-8">
              <Link to="/" onClick={() => setIsOpen(false)} className="text-lg font-medium text-foreground">
                Home
              </Link>
              <a
                href="https://youtube.com/@arjun_ifvg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground"
              >
                YouTube
              </a>
              <Link to="/mentorship" onClick={() => setIsOpen(false)} className="text-lg font-medium text-foreground">
                Mentorship
              </Link>
              <a
                href="https://discord.gg/SCHeKKCa6c"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-foreground"
              >
                Discord
              </a>
              <NewsletterSheet>
                <button onClick={() => setIsOpen(false)} className="text-lg font-medium text-foreground text-left">
                  Newsletter
                </button>
              </NewsletterSheet>
              <Link to="/contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-foreground">
                Contact
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
