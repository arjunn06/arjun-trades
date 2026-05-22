import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { BookOpen, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const interestSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  promo_consent: z.boolean(),
});

const STORAGE_KEY = "workshop_promo_seen_v1";

const WorkshopPromoDialog = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", promo_consent: true });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => {
      setOpen(true);
      sessionStorage.setItem(STORAGE_KEY, "1");
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = interestSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("workshop_interest").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      promo_consent: parsed.data.promo_consent,
    });
    if (error) {
      setSubmitting(false);
      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Add to Resend audience + send welcome email
    const { data: fnData, error: fnError } = await supabase.functions.invoke(
      "workshop-signup-email",
      { body: { name: parsed.data.name, email: parsed.data.email } },
    );
    if (fnError) {
      console.error("workshop-signup-email failed", fnError, fnData);
    } else {
      console.log("workshop-signup-email ok", fnData);
    }

    setSubmitting(false);
    setSubmitted(true);
    toast({
      title: "You're on the list!",
      description: "We'll email you as soon as the workshop is live.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-[420px] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-xl bg-card border-border p-5 sm:p-6">
        <DialogHeader>
          <div className="mx-auto w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <BookOpen className="w-6 h-6" />
          </div>
          <DialogTitle className="text-center font-display text-xl sm:text-2xl leading-tight">
            Free iFVG Workshop
          </DialogTitle>
          <DialogDescription className="text-center text-sm leading-relaxed">
            Live, in-depth ICT + iFVG breakdown with real chart examples and Q&amp;A.
            Drop your details to get notified the moment we open seats.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-foreground font-medium">You're on the list!</p>
            <p className="text-sm text-muted-foreground">
              We'll email you as soon as the workshop is live.
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button asChild>
                <Link to="/workshop" onClick={() => setOpen(false)}>
                  View workshop
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="promo-name">Name</Label>
              <Input
                id="promo-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-email">Email</Label>
              <Input
                id="promo-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
                required
              />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox
                id="promo-consent"
                checked={form.promo_consent}
                onCheckedChange={(c) =>
                  setForm({ ...form, promo_consent: c === true })
                }
              />
              <Label
                htmlFor="promo-consent"
                className="text-xs text-muted-foreground leading-snug font-normal"
              >
                Send me workshop updates and trading tips. No spam.
              </Label>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row sm:space-x-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="w-full sm:flex-1"
              >
                Maybe later
              </Button>
              <Button type="submit" disabled={submitting} className="w-full sm:flex-1">
                {submitting ? "Submitting..." : "Register interest"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopPromoDialog;
