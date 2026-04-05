import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Trash2, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface InfoSubmission {
  id: string;
  name: string;
  email: string;
  trading_experience: string;
  learning_preferences: string[];
  class_time: string;
  read: boolean;
  created_at: string;
}

const AdminRedPillInfo = () => {
  const [submissions, setSubmissions] = useState<InfoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) { navigate("/admin"); return; }
      fetchSubmissions();
    };
    checkAuth();
  }, [navigate]);

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("red_pill_info" as any)
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data as any as InfoSubmission[]);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from("red_pill_info" as any).update({ read: true } as any).eq("id", id);
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: true } : s));
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase.from("red_pill_info" as any).delete().eq("id", id);
    if (!error) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      toast({ title: "Submission deleted" });
    }
  };

  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">Red Pill Info Submissions</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {submissions.length} total {unreadCount > 0 && `• ${unreadCount} unread`}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map(s => (
              <div
                key={s.id}
                className={`rounded-2xl border bg-card p-6 space-y-3 ${!s.read ? "border-primary/30" : "border-border"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-lg text-foreground">{s.name}</h3>
                      {!s.read && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">New</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{s.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!s.read && (
                      <button onClick={() => markRead(s.id)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteSubmission(s.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Trading Experience</p>
                  <p className="text-sm text-foreground">{s.trading_experience}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Learning Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {s.learning_preferences.map(pref => (
                      <span key={pref} className="px-2.5 py-1 rounded-full bg-muted text-xs text-foreground">{pref}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Class Time Preference</p>
                  <p className="text-sm text-foreground">{s.class_time}</p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Submitted {format(new Date(s.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRedPillInfo;
