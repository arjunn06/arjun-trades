import { Helmet } from "react-helmet-async";
import { useState, useCallback } from "react";
import {
  ArrowUpRight,
  Check,
  Copy,
  DiscordLogo,
  InstagramLogo,
  X,
  XLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const SITE_URL = "https://ifvg.in";

const LOGO_PATH =
  "M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z";
const LOGO_SVG = `<svg viewBox="59.7334 56.3828 64.3786 64.3792" xmlns="http://www.w3.org/2000/svg"><path d="${LOGO_PATH}" fill="currentColor"/></svg>`;

const colors = [
  { name: "Signal Red", hsl: "6 72% 46%", hex: "#CA3221", tailwind: "text-primary / bg-primary", usage: "The one accent: the primary action, one emphasised word, active states", light: true },
  { name: "Signal Red (dark)", hsl: "6 80% 58%", hex: "#EA4F3E", tailwind: "text-signal / bg-signal", usage: "The same accent in dark mode and on dark panels", light: false },
  { name: "Ink", hsl: "222 20% 8%", hex: "#101318", tailwind: "text-foreground", usage: "Headings, body text, strong rules", light: false },
  { name: "Paper", hsl: "220 9% 94.5%", hex: "#F0F1F2", tailwind: "bg-background", usage: "Page background in light mode", light: true },
  { name: "Raised paper", hsl: "220 10% 97.5%", hex: "#F8F8F9", tailwind: "bg-card", usage: "Form fields and raised surfaces", light: true },
  { name: "Muted paper", hsl: "220 9% 90%", hex: "#E3E5E8", tailwind: "bg-muted", usage: "Quiet tiles and hover tints", light: true },
  { name: "Muted ink", hsl: "220 8% 36%", hex: "#545963", tailwind: "text-muted-foreground", usage: "Secondary text and captions", light: false },
  { name: "Panel", hsl: "222 22% 7%", hex: "#0E1016", tailwind: "bg-panel", usage: "Always-dark surfaces: photo panels and pricing. Identical in both themes", light: false },
];

const typography = [
  { label: "Display", font: "Mona Sans", size: "44 to 132px", weight: "800, width 76%", line: "0.9", usage: "Hero headlines, page titles" },
  { label: "Title", font: "Mona Sans", size: "40 to 76px", weight: "750, width 82%", line: "0.96", usage: "Section headings" },
  { label: "Heading", font: "Mona Sans", size: "24 to 30px", weight: "700, width 90%", line: "1.05", usage: "Item titles, dialog titles" },
  { label: "Lead", font: "Mona Sans", size: "18 to 21px", weight: "400", line: "1.5", usage: "Intro paragraphs" },
  { label: "Body", font: "Mona Sans", size: "17px", weight: "400", line: "1.6", usage: "Paragraphs, descriptions" },
  { label: "Label", font: "Geist Mono", size: "13px", weight: "500", line: "1.6", usage: "Dates, status, small labels" },
  { label: "Button", font: "Mona Sans", size: "15px", weight: "600", line: "1", usage: "Buttons and nav links" },
];

const socials = [
  { label: "Instagram", handle: "@arjun_ifvg", url: "https://www.instagram.com/arjun_ifvg", Icon: InstagramLogo },
  { label: "YouTube", handle: "@arjun_ifvg", url: "https://youtube.com/@arjun_ifvg", Icon: YoutubeLogo },
  { label: "X (Twitter)", handle: "@arjun_ifvg", url: "https://x.com/arjun_ifvg", Icon: XLogo },
  { label: "Discord", handle: "Join Server", url: "https://discord.gg/SCHeKKCa6c", Icon: DiscordLogo },
];

const dos = [
  "Set the logo in ink on paper, and in paper on dark. The mark takes the text color.",
  "Maintain clear space around the logo of at least 25% of its height on all sides.",
  "Use Signal Red for the one primary action in a view and for a single emphasised word in a headline.",
  "Set headlines in Mona Sans at its narrow widths with tight tracking. Set body text at normal width.",
  "Keep every corner square and let hairlines and whitespace do the grouping.",
];

const donts = [
  "Do not distort, stretch, or rotate the logo.",
  "Do not place the logo on busy or clashing backgrounds.",
  "Do not add a second accent color, gradients, or glows.",
  "Do not use serif fonts or rounded corners.",
  "Do not overcrowd layouts. Maintain breathing room.",
];

const spacing = [
  { px: 8, label: "xs: icons, tight gaps" },
  { px: 16, label: "sm: button padding, inline spacing" },
  { px: 24, label: "md: field padding, gutters" },
  { px: 48, label: "lg: desktop page gutter" },
  { px: 80, label: "xl: space above and below a section" },
];

const CopyButton = ({ text, label }: { text: string; label: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      title={`Copy ${label}`}
    >
      {copied ? <Check size={12} weight="bold" /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="type-title text-[clamp(2.25rem,5vw,3.75rem)]">{children}</h2>
);

const BrandGuidelines = () => {
  return (
    <>
      <Helmet>
        <title>Brand Guidelines | IFVG — Arjun Trades</title>
        <meta
          name="description"
          content="Official brand guidelines for IFVG (Arjun Trades). Logo, colors, typography, and usage rules for partners and creators."
        />
        <link rel="canonical" href={`${SITE_URL}/brand`} />
      </Helmet>

      <Header />

      <main id="main" className="min-h-[100dvh]">
        {/* Hero */}
        <section className="shell pb-12 pt-10 sm:pt-16">
          <h1 className="type-display text-[clamp(5rem,20vw,16rem)]">
            IFVG<span className="text-primary">.</span>in
          </h1>
          <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
            The complete brand identity reference for <strong className="text-foreground">Arjun Trades</strong>. Use
            this guide to keep every touchpoint consistent, from social posts to pitch decks.
          </p>
        </section>

        {/* Brand Overview */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Brand overview</SectionTitle>
            <div className="mt-12 grid gap-12 border-t border-foreground pt-10 md:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h3 className="type-heading mb-3 text-xl">Brand name</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Arjun Trades</strong> is the public-facing identity.{" "}
                    <strong className="text-foreground">IFVG.in</strong> is the digital home. The shorthand{" "}
                    <strong className="text-foreground">IFVG</strong> (Institutional Fair Value Gap) is the strategy
                    signature.
                  </p>
                </div>
                <div>
                  <h3 className="type-heading mb-3 text-xl">Tagline</h3>
                  <p className="leading-relaxed text-muted-foreground">
                    No tagline is prescribed. Let the Red Pill narrative and the trading strategy speak. When needed,
                    use: <em className="text-foreground">"See what the market hides."</em> The site's own line is{" "}
                    <em className="text-foreground">"We don't chase dopamine, we chase patience."</em>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="type-heading mb-3 text-xl">Voice &amp; tone</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Bold &amp; direct:</strong> No fluff. Say what matters.
                  </li>
                  <li>
                    <strong className="text-foreground">Educational:</strong> Teach, don't preach. Every claim is
                    backed by strategy.
                  </li>
                  <li>
                    <strong className="text-foreground">Calm:</strong> Ink on paper, square corners, one red accent,
                    confident language.
                  </li>
                  <li>
                    <strong className="text-foreground">No hype:</strong> Avoid "guaranteed," "100%," or "get rich
                    quick."
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Logo */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Logo</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
              The IFVG mark is a custom geometric monogram. Always use it at full resolution, never below 32px for
              digital or 0.5" for print.
            </p>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {[
                { size: 128, cls: "h-32 w-32", label: "128px, hero", panel: false },
                { size: 64, cls: "h-16 w-16", label: "64px, header", panel: false },
                { size: 32, cls: "h-8 w-8", label: "32px, favicon", panel: false },
                { size: 64, cls: "h-16 w-16", label: "64px, on dark", panel: true },
              ].map((v) => (
                <div key={v.label} className="flex flex-col gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center border border-border",
                      v.panel ? "bg-panel text-panel-foreground" : "bg-card text-foreground",
                    )}
                    style={{ height: v.size + 72 }}
                  >
                    <Logo className={v.cls} />
                  </div>
                  <span className="type-label text-muted-foreground">{v.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 border border-border bg-card p-6">
              <h3 className="type-label mb-4 text-muted-foreground">SVG markup</h3>
              <pre className="overflow-x-auto whitespace-pre-wrap break-all border border-border bg-muted p-4 font-mono text-xs text-muted-foreground sm:text-sm">
                {LOGO_SVG}
              </pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <CopyButton text={LOGO_SVG} label="Copy SVG" />
                <CopyButton text={LOGO_PATH} label="Copy path" />
              </div>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
                The path is unchanged from the original artwork. The viewBox is cropped to the glyph and the fill uses{" "}
                <code className="font-mono">currentColor</code>, so the mark follows the text color in light and dark
                themes.
              </p>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Color palette</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
              Ink, paper, and one signal red. All colors are HSL CSS custom properties. Use the Tailwind semantic
              tokens and never hardcode hex values in components. Dark mode swaps the same tokens: page{" "}
              <code className="font-mono">#0E1013</code>, surface <code className="font-mono">#15171C</code>, text{" "}
              <code className="font-mono">#EBECF0</code>.
            </p>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colors.map((c) => (
                <div key={c.name} className="border border-border">
                  <div className="h-24 w-full border-b border-border" style={{ backgroundColor: c.hex }} />
                  <div className="bg-card p-4">
                    <h4 className="mb-3 text-sm font-semibold">{c.name}</h4>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between gap-2">
                        <span>HSL</span>
                        <div className="flex items-center gap-1.5">
                          <code className="bg-muted px-1.5 py-0.5 font-mono">{c.hsl}</code>
                          <CopyButton text={c.hsl} label="HSL" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Hex</span>
                        <div className="flex items-center gap-1.5">
                          <code className="bg-muted px-1.5 py-0.5 font-mono">{c.hex}</code>
                          <CopyButton text={c.hex} label="Hex" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span>Tailwind</span>
                        <code className="bg-muted px-1.5 py-0.5 font-mono">{c.tailwind}</code>
                      </div>
                    </div>
                    <p className="mt-3 border-t border-border pt-3 text-[0.8125rem] text-muted-foreground">{c.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Typography</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
              One family does the work. <strong className="text-foreground">Mona Sans</strong> is used at its narrow,
              heavy widths for headlines and at normal width for text.{" "}
              <strong className="text-foreground">Geist Mono</strong> is used for dates, status, and small labels.
              Both are self-hosted. Tamil text falls back to Noto Sans Tamil.
            </p>

            <div className="mt-12 overflow-x-auto border border-border">
              <div className="min-w-[720px]">
                <div className="type-label grid grid-cols-12 gap-4 border-b border-border bg-muted px-5 py-3 text-muted-foreground">
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Font</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Weight</div>
                  <div className="col-span-1">Line</div>
                  <div className="col-span-3">Usage</div>
                </div>
                {typography.map((t) => (
                  <div
                    key={t.label}
                    className="grid grid-cols-12 items-center gap-4 border-b border-border px-5 py-4 last:border-b-0"
                  >
                    <div className="col-span-2 text-sm font-semibold">{t.label}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">{t.font}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">{t.size}</div>
                    <div className="col-span-2 text-sm text-muted-foreground">{t.weight}</div>
                    <div className="col-span-1 text-sm text-muted-foreground">{t.line}</div>
                    <div className="col-span-3 text-xs text-muted-foreground">{t.usage}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-10">
              <div>
                <h3 className="type-label mb-3 text-muted-foreground">Display sample</h3>
                <p className="type-display text-[clamp(3rem,8vw,6rem)]">See what the market hides.</p>
              </div>
              <div>
                <h3 className="type-label mb-3 text-muted-foreground">Heading sample</h3>
                <p className="type-heading text-3xl">The Red Pill strategy: iFVG explained</p>
              </div>
              <div>
                <h3 className="type-label mb-3 text-muted-foreground">Body sample</h3>
                <p className="max-w-xl text-muted-foreground">
                  The Institutional Fair Value Gap (iFVG) is the single most reliable footprint that smart money
                  leaves behind. When price leaves a gap and returns to it, that's your edge: not a guess, a
                  structure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Do's & Don'ts */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Usage guidelines</SectionTitle>
            <div className="mt-12 grid gap-12 md:grid-cols-2">
              <div className="border-t border-foreground pt-6">
                <h3 className="type-heading mb-5 flex items-center gap-2 text-2xl">
                  <Check size={24} weight="bold" className="text-primary" />
                  Do
                </h3>
                <ul className="space-y-4">
                  {dos.map((item) => (
                    <li key={item} className="text-[1.0625rem] text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-foreground pt-6">
                <h3 className="type-heading mb-5 flex items-center gap-2 text-2xl">
                  <X size={24} weight="bold" className="text-primary" />
                  Don't
                </h3>
                <ul className="space-y-4">
                  {donts.map((item) => (
                    <li key={item} className="text-[1.0625rem] text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Social media</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
              Always use the exact handles below. Tag @arjun_ifvg on Instagram, YouTube, and X. Discord is invite-only.
            </p>

            <ul className="mt-12 border-b border-foreground">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-6 border-t border-foreground py-5 transition-colors duration-300 hover:bg-foreground hover:text-background"
                  >
                    <span className="flex items-center gap-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-3">
                      <s.Icon size={28} />
                      <span className="type-heading text-2xl">{s.label}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 font-semibold">
                      {s.handle}
                      <ArrowUpRight size={16} weight="bold" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Spacing & Grid */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Spacing &amp; shape</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">
              One container, one gutter, one corner rule. Content sits in a{" "}
              <strong className="text-foreground">1280px</strong> container with 20, 32, and 48px side gutters. Corners
              are always square.
            </p>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              <div className="border border-border bg-card p-6">
                <h3 className="type-heading mb-5 text-xl">Spacing scale</h3>
                <div className="space-y-3">
                  {spacing.map((s) => (
                    <div key={s.px} className="flex items-center gap-4">
                      <div className="h-3 bg-primary" style={{ width: s.px }} />
                      <span className="text-sm text-muted-foreground">
                        {s.px}px, {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-border bg-card p-6">
                <h3 className="type-heading mb-5 text-xl">Corner radius</h3>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 border border-foreground" />
                  <div>
                    <p className="text-sm font-semibold">0px, everywhere</p>
                    <p className="text-sm text-muted-foreground">
                      Buttons, fields, panels, images, and dialogs. Hierarchy comes from type, rules, and whitespace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-16 sm:py-20">
          <div className="shell">
            <SectionTitle>Quick reference card</SectionTitle>
            <p className="type-lead mt-6 max-w-2xl text-muted-foreground">Save this. Everything you need in one glance.</p>

            <div className="mt-12 grid gap-8 border border-foreground bg-card p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
              <div>
                <h4 className="type-label mb-3 text-muted-foreground">Brand</h4>
                <p className="text-sm font-semibold">Arjun Trades</p>
                <p className="text-sm text-muted-foreground">IFVG.in</p>
                <p className="text-sm text-muted-foreground">IFVG</p>
              </div>
              <div>
                <h4 className="type-label mb-3 text-muted-foreground">Colors</h4>
                <p className="text-sm font-semibold text-primary">Signal Red #CA3221</p>
                <p className="text-sm">Ink #101318</p>
                <p className="text-sm text-muted-foreground">Paper #F0F1F2</p>
              </div>
              <div>
                <h4 className="type-label mb-3 text-muted-foreground">Fonts</h4>
                <p className="text-sm font-semibold">Mona Sans</p>
                <p className="text-sm text-muted-foreground">Geist Mono</p>
              </div>
              <div>
                <h4 className="type-label mb-3 text-muted-foreground">Handles</h4>
                <p className="text-sm text-muted-foreground">@arjun_ifvg</p>
                <p className="text-sm text-muted-foreground">youtube.com/@arjun_ifvg</p>
                <p className="text-sm text-muted-foreground">discord.gg/SCHeKKCa6c</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default BrandGuidelines;
