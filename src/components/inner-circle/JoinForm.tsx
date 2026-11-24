import { useState } from "react";
import { z } from "zod";
import { ArrowRight, ArrowUpRight, CheckCircle, DiscordLogo, Lock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { INNER_CIRCLE, formatUSD } from "@/data/innerCircle";

interface FormState {
  name: string;
  email: string;
  discord: string;
  accepted: boolean;
  /** Honeypot. Real people never see or fill this. */
  website: string;
}

const initial: FormState = { name: "", email: "", discord: "", accepted: false, website: "" };

const schema = z.object({
  name: z.string().trim().min(1, "Add your name").max(100, "Keep it under 100 characters"),
  email: z.string().trim().min(1, "Add your email").email("That email doesn't look right").max(255),
  // People often paste it as @name. Discord doesn't want the @, so drop it before checking.
  discord: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@+/, ""))
    .pipe(z.string().min(2, "Add your Discord username").max(64, "Keep it under 64 characters")),
  accepted: z.literal(true, { errorMap: () => ({ message: "Tick this box to continue" }) }),
});

const FIELD_ORDER = ["name", "email", "discord", "accepted"] as const;
type Field = (typeof FIELD_ORDER)[number];

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-destructive">
      {message}
    </p>
  ) : null;

const Done = ({ firstName }: { firstName: string }) => (
  <div className="border border-foreground bg-card p-8 sm:p-10" role="status">
    <CheckCircle className="h-12 w-12 text-primary" weight="fill" aria-hidden="true" />
    <h3 className="type-title mt-6 text-[clamp(2.25rem,5vw,3.25rem)]">You're on the list, {firstName}.</h3>
    <p className="mt-4 max-w-md text-[1.0625rem] text-muted-foreground">
      I'll invite you to the platform and the Inner Circle on Discord, using the username you gave me.
    </p>
    <p className="mt-6 max-w-md text-[1.0625rem]">
      One thing left on your side: make sure you've registered with {INNER_CIRCLE.broker} and deposited at least{" "}
      {formatUSD(INNER_CIRCLE.minDeposit)}. That's what gets you through the door.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Button asChild size="lg">
        <a href={INNER_CIRCLE.discordUrl} target="_blank" rel="noopener noreferrer">
          <DiscordLogo weight="fill" />
          Join the Discord
        </a>
      </Button>
      <Button asChild size="lg" variant="outline">
        <a href={INNER_CIRCLE.brokerUrl} target="_blank" rel="noopener noreferrer">
          Open {INNER_CIRCLE.broker}
          <ArrowUpRight weight="bold" />
        </a>
      </Button>
    </div>
  </div>
);

const JoinForm = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ firstName: string } | null>(null);

  if (done) return <Done {...done} />;

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        if (FIELD_ORDER.includes(key) && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      const first = FIELD_ORDER.find((k) => next[k]);
      if (first) document.getElementById(`ic-${first}`)?.focus();
      return;
    }

    const firstName = parsed.data.name.split(/\s+/)[0];

    // A bot filled the hidden field: look successful, store nothing.
    if (form.website) {
      setDone({ firstName });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("inner_circle_signups").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      discord: parsed.data.discord,
      disclaimer_accepted: true,
    });
    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setErrors({ email: "This email is already on the list." });
        document.getElementById("ic-email")?.focus();
        return;
      }
      toast({
        title: "Couldn't sign you up",
        description: "Please try again in a moment. If it keeps failing, message me on Discord.",
        variant: "destructive",
      });
      return;
    }

    setDone({ firstName });
  };

  const describe = (id: Field) => (errors[id] ? `ic-${id}-error` : undefined);

  return (
    <form onSubmit={handleSubmit} noValidate className="border border-foreground bg-card p-6 sm:p-10">
      <p className="type-label rule-mark text-muted-foreground">Join</p>
      <h3 className="type-title mt-5 text-[clamp(2rem,4vw,2.75rem)]">Request your invite</h3>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="ic-name" className="field-label">
            Name
          </label>
          <input
            id="ic-name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Your full name"
            maxLength={100}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={describe("name")}
            className="field"
          />
          <FieldError id="ic-name" message={errors.name} />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="ic-email" className="field-label">
              Email
            </label>
            <input
              id="ic-email"
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
            <FieldError id="ic-email" message={errors.email} />
          </div>
          <div>
            <label htmlFor="ic-discord" className="field-label">
              Discord username
            </label>
            <input
              id="ic-discord"
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
            <FieldError id="ic-discord" message={errors.discord} />
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
              id="ic-accepted"
              checked={form.accepted}
              onCheckedChange={(v) => set("accepted", v === true)}
              aria-invalid={!!errors.accepted}
              aria-describedby={describe("accepted")}
              className="mt-0.5"
            />
            <span className="text-[0.9375rem] leading-snug text-muted-foreground">
              I understand this challenge is for educational purposes only.
            </span>
          </label>
          <FieldError id="ic-accepted" message={errors.accepted} />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={submitting} className="mt-8 w-full sm:w-auto">
        {submitting ? "Sending…" : "Join the Inner Circle"}
        {!submitting && <ArrowRight weight="bold" />}
      </Button>

      <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Your details are only used to invite you to the platform and the Inner Circle. Nobody else can see them.
      </p>
    </form>
  );
};

export default JoinForm;
