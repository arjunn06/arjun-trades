import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";
import { highlights } from "@/data/testimonials";

// Student highlights are static, so the wall is never empty even if the workshop feedback fails to load.
const studentItems: TestimonialItem[] = highlights.map((t) => ({
  name: t.name,
  role: t.role ?? "Red Pill Student",
  text: t.highlight,
  proof: t.proof && { src: t.proof.src, alt: t.proof.alt },
}));

const TestimonialWall = () => {
  const [workshop, setWorkshop] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    supabase
      .from("workshop_feedback")
      .select("name, rating, feedback")
      .order("created_at", { ascending: false })
      .limit(18)
      .then(({ data }) => {
        if (data) setWorkshop(data.map((d) => ({ name: d.name, rating: d.rating, text: d.feedback, role: "Workshop attendee" })));
      });
  }, []);

  return (
    <Testimonials
      title="Don't just take my word for it"
      subtitle="Real feedback from students and workshop attendees."
      items={[...studentItems, ...workshop]}
      footer={
        <Link
          to="/testimonials"
          className="inline-flex items-center gap-2 font-semibold underline decoration-border decoration-2 underline-offset-[6px] transition-colors hover:decoration-primary"
        >
          Read the full student stories
          <ArrowRight className="h-4 w-4" weight="bold" />
        </Link>
      }
    />
  );
};

export default TestimonialWall;
