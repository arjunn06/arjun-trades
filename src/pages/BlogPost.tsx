import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
    };
    fetchBlog();
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
        <p className="text-muted-foreground mb-8">
          {new Date(blog.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        {blog.cover_image_url && (
          <img
            src={blog.cover_image_url}
            alt={blog.title}
            className="w-full rounded-2xl mb-10 object-cover max-h-[500px]"
          />
        )}

        <div
          className="prose prose-invert prose-lg max-w-none text-foreground [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_h2]:text-foreground [&_h2]:font-display [&_h2]:font-semibold [&_h3]:text-foreground"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
};

export default BlogPost;
