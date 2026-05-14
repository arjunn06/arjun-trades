import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  promo_consent: z.boolean(),
});

const FreeWorkshop = () => {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", promo_consent: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("workshop_interest").insert(parsed.data);
    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "You're on the list!", description: "We'll email you as soon as the workshop is live." });
  };

  const reset = () => {
    setOpen(false);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", promo_consent: false });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <Clock className="w-3.5 h-3.5" />
            Coming Soon
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display font-bold text-4xl md:text-7xl text-foreground leading-[1.05] mb-6"
          >
            Free <span className="text-primary">Trading Workshop</span>
            <br /> by Arjun IFVG
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            A no-fluff live session unpacking the IFVG model, market structure, and the exact playbook
            I use every week. Be the first to know when seats open.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Button
              size="lg"
              onClick={() => setOpen(true)}
              className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:brightness-110 hover:drop-shadow-[0_10px_30px_rgba(239,68,68,0.35)] hover:scale-[1.03] transition-transform"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              I'm Interested
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              100% free • Limited seats • Replay available to attendees
            </p>
          </motion.div>

          {/* Highlights */}
          <div className="grid sm:grid-cols-3 gap-4 mt-20 text-left">
            {[
              { title: "Live & Interactive", desc: "Join the session live, ask questions in real time." },
              { title: "Real Playbook", desc: "Walk away with the same setups I trade weekly." },
              { title: "Community Access", desc: "Get invited into the private Discord on signup." },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/30 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-display font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : reset())}>
        <DialogContent className="sm:max-w-md">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <DialogTitle className="font-display text-2xl mb-2">You're on the list</DialogTitle>
              <DialogDescription className="mb-6">
                We'll send the workshop details to your inbox the moment it's announced.
              </DialogDescription>
              <Button onClick={reset} className="w-full">Done</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">Save my spot</DialogTitle>
                <DialogDescription>
                  Drop your details and we'll let you know the moment seats open.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    maxLength={255}
                    required
                  />
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <Checkbox
                    checked={form.promo_consent}
                    onCheckedChange={(v) => setForm({ ...form, promo_consent: v === true })}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-muted-foreground leading-snug">
                    I agree to receive promotional mail from Arjun IFVG.
                  </span>
                </label>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Submitting..." : "Notify me"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FreeWorkshop;
