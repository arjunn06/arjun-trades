import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";

const RedPillReviewsWall = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    supabase
      .from("red_pill_reviews")
      .select("name, rating, review")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(18)
      .then(({ data }) => {
        if (data) setItems(data.map((d) => ({ name: d.name, rating: d.rating, text: d.review })));
      });
  }, []);

  return (
    <Testimonials
      title="Real students, real feedback."
      subtitle="Honest words from students inside The Red Pill."
      items={items}
    />
  );
};

export default RedPillReviewsWall;
