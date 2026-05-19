import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MailOpen, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InterestEntry {
  id: string;
  name: string;
  email: string;
  promo_consent: boolean;
  read: boolean;
  created_at: string;
}

const AdminWorkshopInterest = () => {
  const [entries, setEntries] = useState<InterestEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/admin"); return; }
      fetchEntries();
    };
    init();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("workshop_interest")
      .select("*")
      .order("created_at", { ascending: false });
    setEntries(data || []);
    setLoading(false);
  };

  const toggleRead = async (entry: InterestEntry) => {
    const next = !entry.read;
    await supabase.from("workshop_interest").update({ read: next }).eq("id", entry.id);
    setEntries(entries.map(e => e.id === entry.id ? { ...e, read: next } : e));
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await supabase.from("workshop_interest").delete().eq("id", id);
    setEntries(entries.filter(e => e.id !== id));
    toast({ title: "Entry deleted" });
  };

  const unreadCount = entries.filter(e => !e.read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/admin/blogs")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
          <h1 className="font-display font-bold text-lg text-foreground">
            Workshop Interest {unreadCount > 0 && <span className="text-sm text-primary ml-1">({unreadCount} new)</span>}
          </h1>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No interest entries yet</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Promo</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <tr key={e.id} className={`border-b border-border/50 last:border-0 ${!e.read ? "bg-primary/[0.03]" : ""}`}>
                    <td className={`px-4 py-3 ${!e.read ? "font-semibold text-foreground" : "text-foreground"}`}>{e.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <a href={`mailto:${e.email}`} className="hover:text-primary">{e.email}</a>
                    </td>
                    <td className="px-4 py-3">
                      {e.promo_consent
                        ? <span className="inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> Yes</span>
                        : <span className="inline-flex items-center gap-1 text-muted-foreground"><XCircle className="w-4 h-4" /> No</span>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => toggleRead(e)} className="p-2 text-muted-foreground hover:text-foreground transition-colors" title={e.read ? "Mark unread" : "Mark read"}>
                          {e.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4 text-primary" />}
                        </button>
                        <button onClick={() => deleteEntry(e.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkshopInterest;
