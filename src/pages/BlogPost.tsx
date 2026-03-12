import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface Blog {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const sessionIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("id, title, content, cover_image_url, created_at")
        .eq("id", id)
        .eq("published", true)
        .single();

      setBlog(data);
      setLoading(false);

      if (data) {
        // Record view
        await supabase.from("blog_views").insert({ blog_id: data.id });

        // Start session tracking
        startTimeRef.current = Date.now();
        const { data: session } = await supabase
          .from("blog_sessions")
          .insert({ blog_id: data.id })
          .select("id")
          .single();
        if (session) sessionIdRef.current = session.id;

        // Get view count
        const { count } = await supabase
          .from("blog_views")
          .select("*", { count: "exact", head: true })
          .eq("blog_id", data.id);
        setViewCount(count || 0);
      }
    };
    fetchBlog();

    // Update session duration on unmount / tab close
    const updateDuration = async () => {
      if (!sessionIdRef.current) return;
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (seconds < 1) return;
      await supabase
        .from("blog_sessions")
        .update({ duration_seconds: seconds })
        .eq("id", sessionIdRef.current);
      sessionIdRef.current = null; // prevent double-update
    };

    const handleBeforeUnload = () => {
      if (!sessionIdRef.current) return;
      const seconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      // Use sendBeacon as last resort for page close
      const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/blog_sessions?id=eq.${sessionIdRef.current}`;
      const headers = {
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      };
      fetch(url, { method: "PATCH", headers, body: JSON.stringify({ duration_seconds: seconds }), keepalive: true }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      updateDuration();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded mt-8" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <h1 className="font-display font-bold text-3xl text-foreground mb-4">Post not found</h1>
          <Link to="/blogs" className="text-primary hover:underline">← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/blogs" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to blog
        </Link>

        <h1 className="font-display font-bold text-3xl md:text-5xl text-foreground mb-4 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <span>{new Date(blog.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-4 h-4" /> {viewCount} {viewCount === 1 ? "view" : "views"}
          </span>
        </div>

        {blog.cover_image_url && (
          <img src={blog.cover_image_url} alt={blog.title} className="w-full rounded-2xl mb-10 object-cover max-h-[500px]" />
        )}

        <div
          className="prose prose-invert prose-lg max-w-none text-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_h2]:text-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h3]:text-foreground"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
        />
      </article>
    </div>
  );
};

export default BlogPost;
