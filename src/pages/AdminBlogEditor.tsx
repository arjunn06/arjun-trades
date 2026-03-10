import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminBlogEditor = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkAndLoad = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");

      if (!roles || roles.length === 0) { navigate("/admin"); return; }

      if (isEditing && id) {
        const { data } = await supabase.from("blogs").select("*").eq("id", id).single();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setCoverUrl(data.cover_image_url || "");
          setPublished(data.published);
        }
      }
    };
    checkAndLoad();
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;

    const { error } = await supabase.storage.from("blog-images").upload(fileName, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(fileName);
    setCoverUrl(publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Missing fields", description: "Title and content are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      cover_image_url: coverUrl || null,
      published,
      author_id: user.id,
      updated_at: new Date().toISOString(),
    };

    if (isEditing && id) {
      const { error } = await supabase.from("blogs").update(blogData).eq("id", id);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post updated!" });
        navigate("/admin/blogs");
      }
    } else {
      const { error } = await supabase.from("blogs").insert(blogData);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Post created!" });
        navigate("/admin/blogs");
      }
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/admin/blogs")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
              Publish
            </label>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Cover image */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Cover Image</label>
          {coverUrl && (
            <img src={coverUrl} alt="Cover" className="w-full h-48 object-cover rounded-xl mb-3" />
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>

        {/* Title */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-3xl font-display font-bold bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Content (HTML supported)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your post content here... HTML tags are supported."
            rows={20}
            className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminBlogEditor;
