import { Helmet } from "react-helmet-async";
import { useState, useCallback } from "react";
import Header from "@/components/Header";
import { Check, Copy, Instagram, Youtube, Twitter, MessageCircle, ArrowUpRight } from "lucide-react";

const SITE_URL = "https://ifvg.in";

const colors = [
  { name: "Primary Red", hsl: "0 85% 55%", hex: "#E53935", tailwind: "text-primary / bg-primary", usage: "CTAs, highlights, primary buttons, links" },
  { name: "Secondary Purple", hsl: "270 95% 65%", hex: "#AB47BC", tailwind: "text-secondary / bg-secondary", usage: "Gradients, badges, accent elements" },
  { name: "Accent Gold", hsl: "45 100% 55%", hex: "#FFC107", tailwind: "text-accent / bg-accent", usage: "Stars, badges, premium highlights" },
  { name: "Background", hsl: "240 10% 4%", hex: "#0A0A0F", tailwind: "bg-background", usage: "Page backgrounds, dark sections" },
  { name: "Surface", hsl: "240 10% 7%", hex: "#101014", tailwind: "bg-card", usage: "Cards, panels, elevated surfaces" },
  { name: "Muted Surface", hsl: "240 10% 12%", hex: "#1B1B21", tailwind: "bg-muted", usage: "Subtle backgrounds, dividers" },
  { name: "Foreground", hsl: "0 0% 98%", hex: "#FAFAFA", tailwind: "text-foreground", usage: "Headings, primary text" },
  { name: "Muted Text", hsl: "240 5% 55%", hex: "#8B8B96", tailwind: "text-muted-foreground", usage: "Body text, captions, descriptions" },
];

const typography = [
  { label: "Display", font: "Clash Display", size: "64px / 4rem", weight: "600", line: "1.1", usage: "Hero headlines, page titles" },
  { label: "H1", font: "Archivo", size: "48px / 3rem", weight: "700", line: "1.15", usage: "Section headings" },
  { label: "H2", font: "Archivo", size: "36px / 2.25rem", weight: "600", line: "1.2", usage: "Sub-section headings" },
  { label: "H3", font: "Archivo", size: "24px / 1.5rem", weight: "600", line: "1.3", usage: "Card titles, labels" },
  { label: "Body", font: "Archivo", size: "16px / 1rem", weight: "400", line: "1.7", usage: "Paragraphs, descriptions" },
  { label: "Caption", font: "Archivo", size: "14px / 0.875rem", weight: "400", line: "1.5", usage: "Meta, timestamps, small text" },
  { label: "Button", font: "Archivo", size: "14px / 0.875rem", weight: "600", line: "1", usage: "Buttons, CTAs, nav links" },
];

const socials = [
  { label: "Instagram", handle: "@arjun_ifvg", url: "https://www.instagram.com/arjun_ifvg", Icon: Instagram },
  { label: "YouTube", handle: "@arjun_ifvg", url: "https://youtube.com/@arjun_ifvg", Icon: Youtube },
  { label: "X (Twitter)", handle: "@arjun_ifvg", url: "https://x.com/arjun_ifvg", Icon: Twitter },
  { label: "Discord", handle: "Join Server", url: "https://discord.gg/SCHeKKCa6c", Icon: MessageCircle },
];

const dos = [
  "Use the logo on dark backgrounds with white fill.",
  "Maintain clear space around the logo — at least 25% of its height on all sides.",
  "Use Primary Red for CTAs, highlights, and key interactive elements.",
  "Pair Archivo for body text with Clash Display for dramatic headlines.",
  "Stick to the 8px grid for spacing, padding, and margins.",
];

const donts = [
  "Do not distort, stretch, or rotate the logo.",
  "Do not place the logo on busy or clashing backgrounds.",
  "Do not use colors outside the approved palette for brand elements.",
  "Do not use serif fonts for UI text or headlines.",
  "Do not overcrowd layouts — maintain breathing room.",
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
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 transition-colors border border-border/50"
      title={`Copy ${label}`}
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
};

const LogoVariant = ({ size, label, bg }: { size: number; label: string; bg?: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="flex items-center justify-center rounded-xl border border-border/40"
      style={{
        width: size + 40,
        height: size + 40,
        background: bg || "hsl(240 10% 7%)",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z"
          fill={bg === "#FAFAFA" ? "#0A0A0F" : "white"}
        />
      </svg>
    </div>
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
  </div>
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

      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="relative pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
          </div>
          <div className="max-w-5xl mx-auto text-center relative">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              Brand Guidelines
            </span>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight mb-6">
              <span className="text-foreground">IFVG</span>
              <span className="text-primary">.</span>
              <span className="text-foreground">in</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The complete brand identity reference for <strong className="text-foreground">Arjun Trades</strong>.
              Use this guide to keep every touchpoint consistent — from social posts to pitch decks.
            </p>
          </div>
        </section>

        {/* Brand Overview */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-10">Brand Overview</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Brand Name</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  <strong className="text-foreground">Arjun Trades</strong> is the public-facing identity. 
                  <strong className="text-foreground"> IFVG.in</strong> is the digital home. 
                  The shorthand <strong className="text-foreground">IFVG</strong> (Institutional Fair Value Gap) is the strategy signature.
                </p>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Tagline</h3>
                <p className="text-muted-foreground leading-relaxed">
                  No tagline is prescribed — let the Red Pill narrative and the trading strategy speak.
                  When needed, use: <em className="text-foreground">"See what the market hides."</em>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Voice &amp; Tone</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span><strong className="text-foreground">Bold &amp; Direct:</strong> No fluff. Say what matters.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span><strong className="text-foreground">Educational:</strong> Teach, don't preach. Every claim is backed by strategy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span><strong className="text-foreground">Energetic:</strong> Dark theme, sharp edges, confident language.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">&#8226;</span>
                    <span><strong className="text-foreground">No Hype:</strong> Avoid "guaranteed," "100%," or "get rich quick."</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Logo */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Logo</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The IFVG mark is a custom geometric monogram. Always use it at full resolution — never below 32px for digital or 0.5" for print.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              <LogoVariant size={128} label="128px — Hero" />
              <LogoVariant size={64} label="64px — Header" />
              <LogoVariant size={32} label="32px — Favicon" />
              <LogoVariant size={64} label="64px — Light BG" bg="#FAFAFA" />
            </div>

            <div className="rounded-xl border border-border/40 bg-card p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">SVG Markup</h3>
              <pre className="text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-pre font-mono bg-muted/50 rounded-lg p-4 border border-border/30">
{`<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z" fill="white"/>
</svg>`}
              </pre>
              <div className="flex flex-wrap gap-2 mt-4">
                <CopyButton text='<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z" fill="white"/></svg>' label="Copy SVG" />
                <CopyButton text="M59.7334 120.762L75.8281 104.667L91.9227 88.5722L108.017 72.4775H124.112V120.762H108.017V96.6195L83.8754 120.762H59.7334ZM124.112 72.4775H108.017L124.112 56.3828V72.4775Z" label="Copy Path" />
              </div>
            </div>
          </div>
        </section>

        {/* Colors */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Color Palette</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              All colors are defined as HSL CSS custom properties. Use Tailwind semantic tokens — never hardcode hex values in components.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {colors.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-border/40 overflow-hidden group"
                >
                  <div
                    className="h-24 w-full"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="p-4 bg-card">
                    <h4 className="font-semibold text-sm mb-1">{c.name}</h4>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>HSL</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{c.hsl}</code>
                          <CopyButton text={c.hsl} label="HSL" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Hex</span>
                        <div className="flex items-center gap-1.5">
                          <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{c.hex}</code>
                          <CopyButton text={c.hex} label="Hex" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Tailwind</span>
                        <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{c.tailwind}</code>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-3 pt-3 border-t border-border/30">{c.usage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Typography</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The type system uses <strong className="text-foreground">Clash Display</strong> for display headlines and <strong className="text-foreground">Archivo</strong> for everything else. Both are loaded via Google Fonts.
            </p>

            <div className="rounded-xl border border-border/40 overflow-hidden">
              <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-muted/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border/30">
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Font</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-1">Weight</div>
                <div className="col-span-2">Line Height</div>
                <div className="col-span-3">Usage</div>
              </div>
              {typography.map((t) => (
                <div
                  key={t.label}
                  className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border/20 items-center hover:bg-muted/20 transition-colors"
                >
                  <div className="col-span-2 font-semibold text-sm">{t.label}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{t.font}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{t.size}</div>
                  <div className="col-span-1 text-sm text-muted-foreground">{t.weight}</div>
                  <div className="col-span-2 text-sm text-muted-foreground">{t.line}</div>
                  <div className="col-span-3 text-xs text-muted-foreground">{t.usage}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Display Sample</h3>
                <p
                  className="text-foreground"
                  style={{ fontFamily: "Clash Display, system-ui, sans-serif", fontSize: "3rem", fontWeight: 600, lineHeight: 1.1 }}
                >
                  See what the market hides.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Heading Sample</h3>
                <p
                  className="text-foreground"
                  style={{ fontFamily: "Archivo, system-ui, sans-serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.15 }}
                >
                  The Red Pill Strategy — iFVG Explained
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Body Sample</h3>
                <p
                  className="text-muted-foreground"
                  style={{ fontFamily: "Archivo, system-ui, sans-serif", fontSize: "1rem", fontWeight: 400, lineHeight: 1.7 }}
                >
                  The Institutional Fair Value Gap (iFVG) is the single most reliable footprint 
                  that smart money leaves behind. When price leaves a gap and returns to it, 
                  that's your edge — not a guess, a structure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Do's & Don'ts */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-10">Usage Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <Check size={20} />
                  Do
                </h3>
                <ul className="space-y-3">
                  {dos.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-emerald-400 mt-0.5 shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <span className="text-lg leading-none">&times;</span>
                  Don't
                </h3>
                <ul className="space-y-3">
                  {donts.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-red-400 mt-0.5 shrink-0">&times;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Social Media</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Always use the exact handles below. Tag @arjun_ifvg on Instagram, YouTube, and X. Discord is invite-only.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border/40 bg-card p-5 hover:border-primary/30 hover:bg-card/80 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <s.Icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <ArrowUpRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{s.label}</h4>
                  <p className="text-xs text-muted-foreground">{s.handle}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Spacing & Grid */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Spacing &amp; Grid</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              The design system is built on an <strong className="text-foreground">8px base grid</strong>. All padding, margins, and component gaps should be multiples of 8px.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/40 bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Base Unit: 8px</h3>
                <div className="space-y-3">
                  {[
                    { px: 8, label: "xs — icons, tight gaps" },
                    { px: 16, label: "sm — button padding, inline spacing" },
                    { px: 24, label: "md — card padding, section gutters" },
                    { px: 32, label: "lg — section padding" },
                    { px: 48, label: "xl — hero spacing, major breaks" },
                    { px: 64, label: "2xl — page sections" },
                  ].map((s) => (
                    <div key={s.px} className="flex items-center gap-4">
                      <div className="h-3 rounded-full bg-primary/80" style={{ width: s.px }} />
                      <span className="text-sm text-muted-foreground">{s.px}px — {s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
                <div className="space-y-4">
                  {[
                    { val: "0.5rem (8px)", label: "sm — tags, pills, small buttons", className: "rounded-sm" },
                    { val: "0.75rem (12px)", label: "DEFAULT — cards, panels, buttons", className: "rounded-lg" },
                    { val: "1rem (16px)", label: "lg — modals, large cards", className: "rounded-xl" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-4">
                      <div className={`h-10 w-10 border border-primary/40 ${r.className}`} />
                      <div>
                        <p className="text-sm font-medium">{r.val}</p>
                        <p className="text-xs text-muted-foreground">{r.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section className="py-16 px-4 sm:px-6 border-t border-border/30 pb-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold mb-4">Quick Reference Card</h2>
            <p className="text-muted-foreground mb-10 max-w-2xl">
              Save this. Everything you need in one glance.
            </p>

            <div className="rounded-xl border border-border/40 bg-card p-6 sm:p-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Brand</h4>
                <p className="text-sm font-medium">Arjun Trades</p>
                <p className="text-sm text-muted-foreground">IFVG.in</p>
                <p className="text-sm text-muted-foreground">IFVG</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Primary Colors</h4>
                <p className="text-sm font-medium text-primary">Red — #E53935</p>
                <p className="text-sm text-secondary">Purple — #AB47BC</p>
                <p className="text-sm text-accent">Gold — #FFC107</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Fonts</h4>
                <p className="text-sm font-medium">Clash Display</p>
                <p className="text-sm text-muted-foreground">Archivo</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Handles</h4>
                <p className="text-sm text-muted-foreground">@arjun_ifvg</p>
                <p className="text-sm text-muted-foreground">youtube.com/@arjun_ifvg</p>
                <p className="text-sm text-muted-foreground">discord.gg/SCHeKKCa6c</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default BrandGuidelines;
