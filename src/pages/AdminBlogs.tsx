import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, Mail, BarChart3, ChartBar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Blog {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
}

interface BlogMetrics {
  [blogId: string]: number;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [metrics, setMetrics] = useState<BlogMetrics>({});
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) { navigate("/admin"); return; }
    fetchData();
  };

  const fetchData = async () => {
    // Fetch blogs
    const { data: blogsData } = await supabase
      .from("blogs")
      .select("id, title, published, created_at")
      .order("created_at", { ascending: false });

    const blogsList = blogsData || [];
    setBlogs(blogsList);

    // Fetch view counts for all blogs
    if (blogsList.length > 0) {
      const { data: views } = await supabase
        .from("blog_views")
        .select("blog_id");

      const counts: BlogMetrics = {};
      views?.forEach(v => {
        counts[v.blog_id] = (counts[v.blog_id] || 0) + 1;
      });
      setMetrics(counts);
    }

    // Fetch unread contact messages count
    const { count } = await supabase
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .eq("read", false);
    setUnreadMessages(count || 0);

    setLoading(false);
  };

  useEffect(() => { checkAdmin(); }, []);

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from("blogs").update({ published: !published }).eq("id", id);
    setBlogs(blogs.map(b => b.id === id ? { ...b, published: !published } : b));
    toast({ title: !published ? "Published!" : "Unpublished" });
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blogs").delete().eq("id", id);
    setBlogs(blogs.filter(b => b.id !== id));
    toast({ title: "Post deleted" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const totalViews = Object.values(metrics).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display font-bold text-lg text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/contacts")}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              title="Messages"
            >
              <Mail className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/admin/blogs/new")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" /> New Post
            </button>
            <button onClick={handleLogout} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats */}
        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Posts</p>
              <p className="text-2xl font-bold text-foreground">{blogs.length}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Published</p>
              <p className="text-2xl font-bold text-foreground">{blogs.filter(b => b.published).length}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Total Views</p>
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <button
              onClick={() => navigate("/admin/blogs/new")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg"
            >
              <Plus className="w-4 h-4" /> Create your first post
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {blogs.map(blog => (
              <div key={blog.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                <div>
                  <h3 className="font-medium text-foreground">{blog.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(blog.created_at).toLocaleDateString()} · {blog.published ? "Published" : "Draft"}
                    <span className="ml-2 inline-flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {metrics[blog.id] || 0} views
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => togglePublish(blog.id, blog.published)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title={blog.published ? "Unpublish" : "Publish"}>
                    {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteBlog(blog.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
