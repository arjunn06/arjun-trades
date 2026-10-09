import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye } from "@phosphor-icons/react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

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
      <div className="min-h-[100dvh]">
        <Header />
        <div className="shell max-w-4xl animate-pulse space-y-6 py-16" aria-busy="true" aria-label="Loading post">
          <div className="h-4 w-28 bg-muted" />
          <div className="h-14 w-4/5 bg-muted" />
          <div className="h-14 w-2/5 bg-muted" />
          <div className="aspect-[16/9] w-full bg-muted" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        <main id="main" className="shell flex-grow py-20">
          <h1 className="type-display text-[clamp(3rem,9vw,7rem)]">Post not found</h1>
          <p className="type-lead mt-6 max-w-md text-muted-foreground">
            This post may have been unpublished or the link is wrong.
          </p>
          <Link
            to="/blogs"
            className="mt-8 inline-flex items-center gap-2 font-semibold underline decoration-primary decoration-2 underline-offset-[6px]"
          >
            <ArrowLeft className="h-4 w-4" weight="bold" /> Back to blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
 <Helmet>
  <title>{blog.title} | Arjun IFVG</title>

  <meta
    name="description"
    content={blog.content.replace(/<[^>]*>/g, "").slice(0, 160)}
  />

  <link
    rel="canonical"
    href={`https://ifvg.in/blog/${blog.id}`}
  />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={blog.title} />

  <meta
    property="og:description"
    content={blog.content.replace(/<[^>]*>/g, "").slice(0, 160)}
  />

  <meta
    property="og:url"
    content={`https://ifvg.in/blog/${blog.id}`}
  />

  {blog.cover_image_url && (
    <meta property="og:image" content={blog.cover_image_url} />
  )}

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: blog.title,
      description: blog.content
        .replace(/<[^>]*>/g, "")
        .slice(0, 160),
      image: blog.cover_image_url,
      author: {
        "@type": "Person",
        name: "Arjun S"
      },
      publisher: {
        "@type": "Organization",
        name: "IFVG"
      },
      datePublished: blog.created_at
    })}
  </script>
</Helmet>
      <div className="min-h-[100dvh]">
        <Header />
        <main id="main">
          <article>
            <header className="shell max-w-4xl pb-10 pt-10 sm:pt-14">
              <Link
                to="/blogs"
                className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" weight="bold" />
                Back to blog
              </Link>

              <h1 className="type-title mt-8 text-[clamp(2.5rem,6.5vw,5rem)]">{blog.title}</h1>
              <div className="type-label mt-8 flex items-center gap-6 border-t border-foreground pt-4 text-muted-foreground">
                <time dateTime={blog.created_at}>
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-4 w-4" /> {viewCount} {viewCount === 1 ? "view" : "views"}
                </span>
              </div>
            </header>

            {blog.cover_image_url && (
              <div className="shell">
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="max-h-[560px] w-full object-cover"
                />
              </div>
            )}

            <div className="shell max-w-4xl py-12 sm:py-16">
              <div
                className="article-body max-w-[68ch]"
                dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
              />
            </div>
          </article>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
