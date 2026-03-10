import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Blog {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
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
    fetchBlogs();
  };

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("id, title, published, created_at")
      .order("created_at", { ascending: false });

    setBlogs(data || []);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="font-display font-bold text-lg text-foreground">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
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
