import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Feedback {
  id: string;
  name: string;
  rating: number;
  feedback: string;
  created_at: string;
}

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/admin"); return; }
      fetchFeedback();
    };
    init();
  }, []);

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from("workshop_feedback")
      .select("*")
      .order("created_at", { ascending: false });
    setFeedbacks((data as Feedback[]) || []);
    setLoading(false);
  };

  const deleteFeedback = async (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    await supabase.from("workshop_feedback").delete().eq("id", id);
    setFeedbacks(feedbacks.filter(f => f.id !== id));
    toast({ title: "Feedback deleted" });
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/blogs")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <h1 className="font-display font-bold text-lg text-foreground">
              Workshop Feedback
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        {!loading && feedbacks.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm">
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Responses</p>
              <p className="text-2xl font-bold text-foreground">{feedbacks.length}</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-foreground flex items-center gap-1">
                {avgRating} <Star className="w-4 h-4 text-primary fill-primary" />
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : feedbacks.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No feedback yet</p>
        ) : (
          <div className="space-y-3">
            {feedbacks.map(f => (
              <div key={f.id} className="p-5 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-semibold text-foreground">{f.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < f.rating ? "text-primary fill-primary" : "text-muted-foreground/30"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.feedback}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {new Date(f.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => deleteFeedback(f.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors shrink-0">
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

export default AdminFeedback;
