import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const LEARNING_OPTIONS = [
  "Basics of trading from scratch",
  "Refine my strategy (Already know basics)",
  "Learn Smart Money concepts",
  "Learn IFVG Strategy",
  "Improve my psychology",
];

const TIME_OPTIONS = [
  "Weekends",
  "Weekdays at night",
  "I don't need classes, I just need the personal training",
];

const RedPillInfo = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tradingExperience, setTradingExperience] = useState("");
  const [learningPreferences, setLearningPreferences] = useState<string[]>([]);
  const [classTime, setClassTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const togglePreference = (pref: string) => {
    setLearningPreferences(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !tradingExperience || learningPreferences.length === 0 || !classTime) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("red_pill_info" as any).insert({
      name,
      email,
      trading_experience: tradingExperience,
      learning_preferences: learningPreferences,
      class_time: classTime,
    } as any);

    setSubmitting(false);
    if (error) {
      toast({ title: "Something went wrong", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  const bar = (
    <header className="border-b border-border">
      <div className="shell flex h-16 items-center">
        <Link to="/" aria-label="Arjun IFVG, home">
          <Logo className="h-5 w-5 text-foreground" />
        </Link>
      </div>
    </header>
  );

  if (submitted) {
    return (
      <div className="min-h-[100dvh]">
        {bar}
        <main id="main" className="shell max-w-2xl py-20">
          <CheckCircle className="h-14 w-14 text-primary" weight="fill" />
          <h1 className="type-display mt-8 text-[clamp(3.5rem,10vw,6.5rem)]">You're in</h1>
          <p className="type-lead mt-6 text-muted-foreground">
            We've received your details. We'll reach out to you soon with next steps.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      {bar}
      <main id="main" className="shell max-w-2xl py-12 sm:py-16">
        <h1 className="type-display text-[clamp(3rem,9vw,5.5rem)]">
          <span className="block">The Red Pill</span>
          <span className="block text-primary">Get started</span>
        </h1>
        <p className="type-lead mt-6 text-muted-foreground">Fill in your details so we can personalize your training.</p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label htmlFor="rpi-name" className="field-label">Name</label>
            <Input id="rpi-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required />
          </div>

          <div>
            <label htmlFor="rpi-email" className="field-label">Email (for trading journal access)</label>
            <Input id="rpi-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
          </div>

          <div>
            <label htmlFor="rpi-exp" className="field-label">Write about your trading experience briefly.</label>
            <Textarea
              id="rpi-exp"
              value={tradingExperience}
              onChange={e => setTradingExperience(e.target.value)}
              placeholder="Tell us about your trading journey..."
              rows={4}
              required
            />
          </div>

          <fieldset>
            <legend className="field-label">Learning preference</legend>
            <div className="space-y-2">
              {LEARNING_OPTIONS.map(option => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 border border-border bg-card p-4 transition-colors hover:border-foreground"
                >
                  <Checkbox
                    checked={learningPreferences.includes(option)}
                    onCheckedChange={() => togglePreference(option)}
                  />
                  <span className="text-[0.9375rem]">{option}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label id="rpi-time-label" className="field-label">What time you'll be free for classes</label>
            <Select value={classTime} onValueChange={setClassTime}>
              <SelectTrigger aria-labelledby="rpi-time-label">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RedPillInfo;
