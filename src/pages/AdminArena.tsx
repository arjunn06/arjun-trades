import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Download, Search, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { ARENA, formatINR } from "@/data/arena";

type Entry = Tables<"arena_registrations">;
type Status = Entry["status"];
type Filter = "all" | Status;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "verified", label: "Verified" },
  { value: "rejected", label: "Rejected" },
];

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500",
  verified: "bg-emerald-500/10 text-emerald-500",
  rejected: "bg-destructive/10 text-destructive",
};

const csvCell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;

const AdminArena = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
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
      fetchEntries();
    };
    init();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("arena_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Couldn't load entries", description: error.message, variant: "destructive" });
    setEntries(data || []);
    setLoading(false);
  };

  const setStatus = async (entry: Entry, status: Status) => {
    const { error } = await supabase.from("arena_registrations").update({ status }).eq("id", entry.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setEntries(entries.map((e) => (e.id === entry.id ? { ...e, status } : e)));
  };

  const deleteEntry = async (entry: Entry) => {
    if (!confirm(`Delete the entry from ${entry.name}?`)) return;
    const { error } = await supabase.from("arena_registrations").delete().eq("id", entry.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setEntries(entries.filter((e) => e.id !== entry.id));
    toast({ title: "Entry deleted" });
  };

  const counts = useMemo(() => {
    const c = { pending: 0, verified: 0, rejected: 0 };
    for (const e of entries) {
      if (e.status in c) c[e.status as "pending" | "verified" | "rejected"]++;
    }
    return c;
  }, [entries]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (filter === "all" || e.status === filter) &&
        (!q ||
          [e.name, e.email, e.discord, e.utr].some((v) => v.toLowerCase().includes(q))),
    );
  }, [entries, filter, query]);

  const exportVerified = () => {
    const rows = entries.filter((e) => e.status === "verified");
    const csv = [
      "name,email,discord,utr,registered",
      ...rows.map((e) =>
        [csvCell(e.name), csvCell(e.email), csvCell(e.discord), csvCell(e.utr), csvCell(e.created_at)].join(","),
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "arena-verified-entries.csv";
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
              Arena Registrations
              {counts.pending > 0 && <span className="ml-1 text-sm text-primary">({counts.pending} pending)</span>}
            </h1>
          </div>
          <button
            onClick={exportVerified}
            disabled={counts.verified === 0}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Verified CSV
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {stat("Verified entries", counts.verified)}
          {stat("Pool", formatINR(counts.verified * ARENA.entryFee), "verified × entry fee")}
          {stat("Pending", counts.pending, "waiting for you to match the payment")}
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
              placeholder="Search name, email, Discord, UTR"
              aria-label="Search registrations"
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
            <p className="py-20 text-center text-muted-foreground">No entries here</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Discord</th>
                    <th className="px-4 py-3">UTR</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((e) => (
                    <tr key={e.id} className="border-b border-border/50 align-top last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-foreground">{e.name}</p>
                        <a href={`mailto:${e.email}`} className="text-muted-foreground hover:text-primary">
                          {e.email}
                        </a>
                        {e.journey && <p className="mt-1 max-w-xs text-xs text-muted-foreground">“{e.journey}”</p>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{e.discord}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {e.utr}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-medium capitalize ${statusStyle[e.status] ?? ""}`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          {e.status !== "verified" && (
                            <button
                              onClick={() => setStatus(e, "verified")}
                              className="p-2 text-muted-foreground transition-colors hover:text-emerald-500"
                              title="Verify (payment matched)"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          {e.status !== "rejected" && (
                            <button
                              onClick={() => setStatus(e, "rejected")}
                              className="p-2 text-muted-foreground transition-colors hover:text-destructive"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteEntry(e)}
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

export default AdminArena;
