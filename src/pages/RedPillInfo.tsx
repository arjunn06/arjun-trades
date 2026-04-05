import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">You're in!</h2>
          <p className="text-muted-foreground">We've received your details. We'll reach out to you soon with next steps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            The Red Pill — <span className="text-primary">Get Started</span>
          </h1>
          <p className="text-muted-foreground">Fill in your details so we can personalize your training.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Email (for trading journal access)</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Trading Experience */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Write about your trading experience briefly.</label>
            <Textarea
              value={tradingExperience}
              onChange={e => setTradingExperience(e.target.value)}
              placeholder="Tell us about your trading journey..."
              rows={4}
              required
            />
          </div>

          {/* Learning Preference */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <label className="text-sm font-semibold text-foreground block">Learning Preference</label>
            {LEARNING_OPTIONS.map(option => (
              <label
                key={option}
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={learningPreferences.includes(option)}
                  onCheckedChange={() => togglePreference(option)}
                />
                <span className="text-sm text-foreground">{option}</span>
              </label>
            ))}
          </div>

          {/* Class Time */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">What time you'll be free for classes</label>
            <Select value={classTime} onValueChange={setClassTime}>
              <SelectTrigger>
                <SelectValue placeholder="-Select-" />
              </SelectTrigger>
              <SelectContent>
                {TIME_OPTIONS.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RedPillInfo;
