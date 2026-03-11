import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MailOpen, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactSubmission | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
      if (!roles || roles.length === 0) { navigate("/admin"); return; }
      fetchContacts();
    };
    init();
  }, []);

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  const markAsRead = async (contact: ContactSubmission) => {
    if (!contact.read) {
      await supabase.from("contact_submissions").update({ read: true }).eq("id", contact.id);
      setContacts(contacts.map(c => c.id === contact.id ? { ...c, read: true } : c));
    }
    setSelected(contact);
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    setContacts(contacts.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
    toast({ title: "Message deleted" });
  };

  const unreadCount = contacts.filter(c => !c.read).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/admin/blogs")} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </button>
            <h1 className="font-display font-bold text-lg text-foreground">
              Messages {unreadCount > 0 && <span className="text-sm text-primary ml-1">({unreadCount} new)</span>}
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">No messages yet</p>
        ) : (
          <div className="grid md:grid-cols-[1fr_1.5fr] gap-6">
            {/* List */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {contacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => markAsRead(c)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    selected?.id === c.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/20"
                  } ${!c.read ? "border-l-4 border-l-primary" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!c.read ? "font-semibold text-foreground" : "text-foreground"}`}>{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.subject}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!c.read ? <Mail className="w-3.5 h-3.5 text-primary" /> : <MailOpen className="w-3.5 h-3.5 text-muted-foreground" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Detail */}
            {selected ? (
              <div className="p-6 rounded-xl border border-border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display font-semibold text-xl text-foreground">{selected.subject}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {selected.name} ({selected.email})
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(selected.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => deleteContact(selected.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-foreground leading-relaxed whitespace-pre-wrap">{selected.message}</div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-12 rounded-xl border border-border bg-card text-muted-foreground">
                Select a message to read
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
