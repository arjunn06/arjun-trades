import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Testimonials, { type TestimonialItem } from "@/components/Testimonials";

const TestimonialWall = () => {
  const [items, setItems] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    supabase
      .from("workshop_feedback")
      .select("name, rating, feedback")
      .order("created_at", { ascending: false })
      .limit(18)
      .then(({ data }) => {
        if (data) setItems(data.map((d) => ({ name: d.name, rating: d.rating, text: d.feedback })));
      });
  }, []);

  return (
    <Testimonials
      title="Don't just take my word for it"
      subtitle="Real feedback from workshop attendees."
      items={items}
    />
  );
};

export default TestimonialWall;
