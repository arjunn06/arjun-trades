import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Calendar, Eye, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Booking {
  id: string;
  name: string;
  contact: string;
  trading_experience: string;
  preferred_date: string;
  preferred_time: string;
  read: boolean;
  created_at: string;
}

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/admin"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!roles?.some(r => r.role === "admin")) { navigate("/admin"); return; }
      fetchBookings();
    };
    checkAuth();
  }, [navigate]);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("red_pill_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setBookings(data as Booking[]);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from("red_pill_bookings").update({ read: true } as any).eq("id", id);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, read: true } : b));
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("red_pill_bookings").delete().eq("id", id);
    if (!error) {
      setBookings(prev => prev.filter(b => b.id !== id));
      toast({ title: "Booking deleted" });
    }
  };

  const unreadCount = bookings.filter(b => !b.read).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Admin
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-foreground">Red Pill Bookings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {bookings.length} total {unreadCount > 0 && `• ${unreadCount} unread`}
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div
                key={b.id}
                className={`rounded-2xl border bg-card p-6 space-y-3 ${!b.read ? "border-primary/30" : "border-border"}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-lg text-foreground">{b.name}</h3>
                      {!b.read && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">New</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{b.contact}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {b.preferred_date} at {b.preferred_time}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!b.read && (
                      <button onClick={() => markRead(b.id)} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Trading Experience</p>
                  <p className="text-sm text-foreground">{b.trading_experience}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted {format(new Date(b.created_at), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
