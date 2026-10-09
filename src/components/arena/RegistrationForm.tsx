import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { z } from "zod";
import { ArrowRight, ArrowUpRight, Check, CheckCircle, Copy, DiscordLogo, Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ARENA, formatINR } from "@/data/arena";
import ShareButton from "./ShareButton";

interface FormState {
  name: string;
  email: string;
  discord: string;
  journey: string;
  utr: string;
  confirm: boolean;
  /** Honeypot. Real people never see or fill this. */
  website: string;
}

const initial: FormState = { name: "", email: "", discord: "", journey: "", utr: "", confirm: false, website: "" };

const baseSchema = z.object({
  name: z.string().trim().min(1, "Add your name").max(100, "Keep it under 100 characters"),
  email: z.string().trim().min(1, "Add your email").email("That email doesn't look right").max(255),
  discord: z.string().trim().min(2, "Add your Discord username").max(64, "Keep it under 64 characters"),
  journey: z.string().trim().max(500, "Keep it under 500 characters"),
  confirm: z.literal(true, { errorMap: () => ({ message: "Tick this box to continue" }) }),
});

const utrSchema = z
  .string()
  .transform((v) => v.replace(/\s+/g, ""))
  .pipe(z.string().regex(/^[A-Za-z0-9]{8,32}$/, "Paste the reference from your UPI app (usually 12 digits)"));

const FIELD_ORDER = ["name", "email", "discord", "utr", "confirm"] as const;
type Field = (typeof FIELD_ORDER)[number];

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-destructive">
      {message}
    </p>
  ) : null;

/** A UPI payment link with the amount filled in, so the payer can't get it wrong. Used for the QR and the phone button. */
const upiLink =
  `upi://pay?pa=${encodeURIComponent(ARENA.upiId)}&pn=${encodeURIComponent(ARENA.payeeName)}` +
  `&am=${ARENA.entryFee}&cu=INR&tn=${encodeURIComponent("Ultimate IFVG Arena entry")}`;

const Done = ({ firstName }: { firstName: string }) => (
  <div className="border border-foreground bg-card p-8 sm:p-10" role="status">
    <CheckCircle className="h-12 w-12 text-primary" weight="fill" aria-hidden="true" />
    <h3 className="type-title mt-6 text-[clamp(2.25rem,5vw,3.25rem)]">Seat held, {firstName}.</h3>
    <p className="mt-4 max-w-md text-[1.0625rem] text-muted-foreground">
      I check every payment by hand against the UPI reference you sent, so your entry shows as confirmed once I've
      matched it.
    </p>
    <p className="mt-6 max-w-md text-[1.0625rem]">
      Join the Discord so you don't miss the dates and rules when they're announced.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Button asChild size="lg">
        <a href={ARENA.discordUrl} target="_blank" rel="noopener noreferrer">
          <DiscordLogo weight="fill" />
          Join Discord
        </a>
      </Button>
      <ShareButton />
    </div>
    <p className="mt-6 text-sm text-muted-foreground">
      Know someone who deserves this shot? Send them the link. That's how the chain grows.
    </p>
  </div>
);

const RegistrationForm = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ firstName: string } | null>(null);
  const [copied, setCopied] = useState(false);

  if (done) return <Done {...done} />;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(ARENA.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", description: ARENA.upiId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const next: typeof errors = {};
    const base = baseSchema.safeParse(form);
    if (!base.success) {
      for (const issue of base.error.issues) {
        const key = issue.path[0] as Field;
        if (FIELD_ORDER.includes(key) && !next[key]) next[key] = issue.message;
      }
    }
    const parsedUtr = utrSchema.safeParse(form.utr);
    if (!parsedUtr.success) next.utr = parsedUtr.error.issues[0].message;

    if (!base.success || !parsedUtr.success || Object.keys(next).length > 0) {
      setErrors(next);
      const first = FIELD_ORDER.find((k) => next[k]);
      if (first) document.getElementById(`arena-${first}`)?.focus();
      return;
    }

    const firstName = base.data.name.split(/\s+/)[0];

    // A bot filled the hidden field: look successful, store nothing.
    if (form.website) {
      setDone({ firstName });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("arena_registrations").insert({
      name: base.data.name,
      email: base.data.email,
      discord: base.data.discord,
      journey: base.data.journey || null,
      utr: parsedUtr.data.toUpperCase(),
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        const isUtr = error.message.includes("arena_registrations_utr_key");
        const key = isUtr ? "utr" : "email";
        setErrors({
          [key]: isUtr
            ? "That UPI reference has already been used on another entry."
            : "This email is already registered for the Arena.",
        });
        document.getElementById(`arena-${key}`)?.focus();
        return;
      }
      toast({
        title: "Couldn't register you",
        description: "Please try again in a moment. If it keeps failing, message me on Discord.",
        variant: "destructive",
      });
      return;
    }

    setDone({ firstName });
  };

  const describe = (id: Field, hint?: string) =>
    [errors[id] ? `arena-${id}-error` : null, hint ? `arena-${id}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-foreground bg-card p-6 sm:p-10">
      <p className="type-label rule-mark text-muted-foreground">Registration</p>
      <h3 className="type-title mt-5 text-[clamp(2rem,4vw,2.75rem)]">Take your seat</h3>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="arena-name" className="field-label">
            Name
          </label>
          <input
            id="arena-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            className="field"
          />
          <FieldError id="arena-name" message={errors.name} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="arena-email" className="field-label">
              Email
            </label>
            <input
              id="arena-email"
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com"
              maxLength={255}
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={describe("email")}
              className="field"
            />
            <FieldError id="arena-email" message={errors.email} />
          </div>
          <div>
            <label htmlFor="arena-discord" className="field-label">
              Discord username
            </label>
            <input
              id="arena-discord"
              value={form.discord}
              onChange={(e) => set("discord", e.target.value)}
              placeholder="yourname"
              maxLength={64}
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              aria-invalid={!!errors.discord}
              aria-describedby={describe("discord")}
              className="field"
            />
            <FieldError id="arena-discord" message={errors.discord} />
          </div>
        </div>

        <div>
          <label htmlFor="arena-journey" className="field-label">
            Where are you in your trading journey?{" "}
            <span className="font-normal text-muted-foreground">Optional</span>
          </label>
          <textarea
            id="arena-journey"
            value={form.journey}
            onChange={(e) => set("journey", e.target.value)}
            placeholder="A line or two. Just started, blown a few accounts, still grinding, anything honest."
            maxLength={500}
            rows={3}
            className="field resize-none"
          />
        </div>

        <div className="border border-border bg-background p-5 sm:p-6">
          <p className="type-label text-muted-foreground">STEP 1 · PAY {formatINR(ARENA.entryFee)}</p>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="hidden shrink-0 bg-white p-3 sm:block">
              <QRCodeSVG value={upiLink} size={136} level="M" title={`UPI QR code to pay ${ARENA.payeeName}`} />
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <p className="type-label text-muted-foreground">UPI ID</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2">
                  <code className="type-mono min-w-0 break-all text-[1.0625rem] font-semibold">{ARENA.upiId}</code>
                  <button
                    type="button"
                    onClick={copyUpi}
                    className="inline-flex h-9 shrink-0 items-center gap-1.5 border border-input px-3 text-sm font-medium transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    {copied ? <Check weight="bold" /> : <Copy />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">Shows as {ARENA.payeeName} in your UPI app.</p>
              </div>
              <Button asChild className="w-full sm:hidden">
                <a href={upiLink}>
                  Open UPI app, pay {formatINR(ARENA.entryFee)}
                  <ArrowUpRight weight="bold" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Pay exactly {formatINR(ARENA.entryFee)}. On a computer, scan the code with any UPI app.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <label htmlFor="arena-utr" className="field-label">
              <span className="type-label mr-2 font-medium text-muted-foreground">STEP 2</span>
              UPI reference number (UTR)
            </label>
            <input
              id="arena-utr"
              value={form.utr}
              onChange={(e) => set("utr", e.target.value)}
              placeholder="e.g. 412345678901"
              maxLength={40}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={!!errors.utr}
              aria-describedby={describe("utr", "hint")}
              className="field type-mono"
            />
            <FieldError id="arena-utr" message={errors.utr} />
            <p id="arena-utr-hint" className="mt-2 text-sm text-muted-foreground">
              Open the payment in your UPI app. It's shown as UTR, UPI reference, or UPI transaction ID.
            </p>
          </div>
        </div>

        {/* Honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
          </label>
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <Checkbox
              id="arena-confirm"
              checked={form.confirm}
              onCheckedChange={(v) => set("confirm", v === true)}
              aria-invalid={!!errors.confirm}
              aria-describedby={describe("confirm")}
              className="mt-0.5"
            />
            <span className="text-[0.9375rem] leading-snug text-muted-foreground">
              I understand the Arena is paper trading. Nothing in it is financial advice.
            </span>
          </label>
          <FieldError id="arena-confirm" message={errors.confirm} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-8 w-full sm:w-auto">
        {submitting ? "Registering…" : `I've paid ${formatINR(ARENA.entryFee)}, register me`}
        {!submitting && <ArrowRight weight="bold" />}
      </Button>

      <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Your details are only used to run the Arena. Nobody else can see them.
      </p>
    </form>
  );
};

export default RegistrationForm;
