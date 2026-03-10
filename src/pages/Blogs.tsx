import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" as const }
  })
};

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, content, cover_image_url, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      setBlogs(data || []);
      setLoading(false);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display font-bold text-4xl md:text-6xl text-foreground mb-4">Blog</h1>
          <p className="text-muted-foreground text-lg mb-12 max-w-xl">
            Trading insights, market analysis, and lessons from the journey.
          </p>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-border bg-card animate-pulse h-80" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-20">No blog posts yet. Stay tuned!</p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogs.map((blog, i) => (
                <motion.div key={blog.id} variants={fadeUp} custom={i}>
                  <Link to={`/blog/${blog.id}`} className="group block">
                    <div className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
                      {blog.cover_image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.cover_image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <p className="text-xs text-muted-foreground mb-2">
                          {new Date(blog.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                        <h3 className="font-display font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {blog.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
