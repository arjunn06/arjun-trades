import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star } from "lucide-react";

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

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-md">
          <CheckCircle className="w-16 h-16 text-primary mx-auto" />
          <h2 className="font-display text-2xl font-bold text-foreground">Thank you!</h2>
          <p className="text-muted-foreground">Your review has been submitted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Share Your <span className="text-primary">Red Pill</span> Experience
          </h1>
          <p className="text-muted-foreground">Your honest feedback helps us improve and inspires others.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Your Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= (hover || rating)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-3">
            <label className="text-sm font-semibold text-foreground block">Your Review</label>
            <Textarea
              value={review}
              onChange={e => setReview(e.target.value)}
              placeholder="Share your experience with The Red Pill..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RedPillReview;
