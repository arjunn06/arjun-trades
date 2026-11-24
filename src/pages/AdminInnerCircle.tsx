import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Download, Search, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type Signup = Tables<"inner_circle_signups">;
type Status = "pending" | "invited" | "rejected";
type Filter = "all" | Status;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Waiting" },
  { value: "invited", label: "Invited" },
  { value: "rejected", label: "Rejected" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  invited: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-destructive/10 text-destructive",
};

const statusLabel: Record<string, string> = { pending: "Waiting", invited: "Invited", rejected: "Rejected" };

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

const AdminInnerCircle = () => {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [query, setQuery] = useState("");
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
      fetchSignups();
    };
    init();
  }, []);

  const fetchSignups = async () => {
    const { data, error } = await supabase
      .from("inner_circle_signups")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Couldn't load sign-ups", description: error.message, variant: "destructive" });
    setSignups(data || []);
    setLoading(false);
  };

  const setStatus = async (signup: Signup, status: Status) => {
    const { error } = await supabase.from("inner_circle_signups").update({ status }).eq("id", signup.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setSignups(signups.map((s) => (s.id === signup.id ? { ...s, status } : s)));
  };

  const deleteSignup = async (signup: Signup) => {
    if (!confirm(`Delete the sign-up from ${signup.name}?`)) return;
    const { error } = await supabase.from("inner_circle_signups").delete().eq("id", signup.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setSignups(signups.filter((s) => s.id !== signup.id));
    toast({ title: "Sign-up deleted" });
  };

  const counts = useMemo(() => {
    const c = { pending: 0, invited: 0, rejected: 0 };
    for (const s of signups) {
      if (s.status in c) c[s.status as Status]++;
    }
    return c;
  }, [signups]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return signups.filter(
      (s) =>
        (filter === "all" || s.status === filter) &&
        (!q || [s.name, s.email, s.discord].some((v) => v.toLowerCase().includes(q))),
    );
  }, [signups, filter, query]);

  const exportCsv = () => {
    const rows = signups.filter((s) => s.status !== "rejected");
    const csv = [
      "name,email,discord,status,signed_up",
      ...rows.map((s) =>
        [csvCell(s.name), csvCell(s.email), csvCell(s.discord), csvCell(s.status), csvCell(s.created_at)].join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "inner-circle-signups.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stat = (label: string, value: string | number, hint?: string) => (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">
              Inner Circle
              {counts.pending > 0 && <span className="ml-1 text-sm text-primary">({counts.pending} waiting)</span>}
            </h1>
          </div>
          <button
            onClick={exportCsv}
            disabled={signups.length === 0}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> CSV
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {stat("Sign-ups", counts.pending + counts.invited, "waiting and invited")}
          {stat("Waiting", counts.pending, "to be invited on Discord")}
          {stat("Invited", counts.invited)}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <label className="relative block sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, Discord"
              aria-label="Search sign-ups"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm"
            />
          </label>
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="py-20 text-center text-muted-foreground">No sign-ups here</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Person</th>
                    <th className="px-4 py-3">Discord</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 align-top last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{s.name}</p>
                        <a href={`mailto:${s.email}`} className="text-muted-foreground hover:text-primary">
                          {s.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.discord}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${statusStyle[s.status] ?? ""}`}>
                          {statusLabel[s.status] ?? s.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {s.status !== "invited" && (
                            <button
                              onClick={() => setStatus(s, "invited")}
                              className="p-2 text-muted-foreground transition-colors hover:text-emerald-500"
                              title="Mark as invited"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {s.status !== "rejected" && (
                            <button
                              onClick={() => setStatus(s, "rejected")}
                              className="p-2 text-muted-foreground transition-colors hover:text-destructive"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteSignup(s)}
                            className="p-2 text-muted-foreground transition-colors hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default AdminInnerCircle;
