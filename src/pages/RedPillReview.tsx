import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

const RedPillReview = () => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !rating || !review) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("red_pill_reviews").insert({
      name,
      rating,
      review,
    });
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
          <h1 className="type-display mt-8 text-[clamp(3.5rem,10vw,6.5rem)]">Thank you</h1>
          <p className="type-lead mt-6 text-muted-foreground">Your review has been submitted.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh]">
      {bar}
      <main id="main" className="shell max-w-2xl py-12 sm:py-16">
        <h1 className="type-display text-[clamp(3rem,9vw,5.5rem)]">
          Share your <span className="text-primary">Red Pill</span> experience
        </h1>
        <p className="type-lead mt-6 text-muted-foreground">Your honest feedback helps us improve and inspires others.</p>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label htmlFor="rpr-name" className="field-label">Your name</label>
            <Input id="rpr-name" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
          </div>

          <fieldset>
            <legend className="field-label">Rating</legend>
            <div role="radiogroup" aria-label="Rating" className="flex gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={rating === s}
                  aria-label={`${s} out of 5`}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1.5 transition-transform active:scale-95"
                >
                  <Star
                    className={cn("h-9 w-9 transition-colors", s <= (hover || rating) ? "text-primary" : "text-border")}
                    weight={s <= (hover || rating) ? "fill" : "regular"}
                  />
                </button>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="rpr-review" className="field-label">Your review</label>
            <Textarea
              id="rpr-review"
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience with The Red Pill..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit review"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default RedPillReview;
