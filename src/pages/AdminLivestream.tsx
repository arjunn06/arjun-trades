import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink, Minus, Plus, Trash2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { parseRecord, type LivestreamRecordData } from "@/hooks/use-livestream-record";

type Row = Tables<"livestream_results">;

const MIGRATION_FILE = "supabase/migrations/20261016090000_livestream_results.sql";

/** Where an entry came from: the dashboard, the Discord recap bot, or the starting record. */
const SOURCE_LABEL: Record<string, string> = { admin: "Dashboard", discord: "Discord", opening: "Opening record" };

/** Today's date in India (yyyy-mm-dd), which is the day the livestreams are on. */
const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${d}T00:00:00Z`),
  );

const fmtDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));

/** Postgres / PostgREST errors that mean "this table or function isn't in the database yet". */
const isNotSetUp = (e: { code?: string; message?: string }) =>
  e.code === "42P01" ||
  e.code === "42883" ||
  e.code === "PGRST205" ||
  e.code === "PGRST202" ||
  /could not find the (table|function)|does not exist/i.test(e.message ?? "");

const entrySchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
    wins: z.coerce.number({ invalid_type_error: "Wins must be a number" }).int("Wins must be a whole number").min(0).max(1000),
    losses: z.coerce.number({ invalid_type_error: "Losses must be a number" }).int("Losses must be a whole number").min(0).max(1000),
    label: z.string().trim().max(200, "Label is too long"),
  })
  .refine((v) => v.wins + v.losses > 0, { message: "Add at least one win or one loss" });

const AdminLivestream = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [record, setRecord] = useState<LivestreamRecordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ date: todayIST(), wins: "0", losses: "0", label: "" });

  const load = useCallback(async () => {
    const [list, totals] = await Promise.all([
      supabase.from("livestream_results").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.rpc("livestream_record"),
    ]);
    const failure = list.error ?? totals.error;
    if (failure) {
      if (isNotSetUp(failure)) setNeedsSetup(true);
      else toast({ title: "Couldn't load the record", description: failure.message, variant: "destructive" });
    } else {
      setNeedsSetup(false);
      setRows(list.data ?? []);
      setRecord(parseRecord(totals.data));
    }
    setLoading(false);
  }, []);

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
      load();
    };
    init();
  }, [navigate, load]);

  const insert = async (entry: { wins: number; losses: number; date: string; label: string }) => {
    setBusy(true);
    const { error } = await supabase.from("livestream_results").insert({
      wins: entry.wins,
      losses: entry.losses,
      entry_date: entry.date,
      label: entry.label || null,
    });
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't add the entry", description: error.message, variant: "destructive" });
      return false;
    }
    await load();
    return true;
  };

  const quickAdd = async (kind: "win" | "loss") => {
    const ok = await insert({ wins: kind === "win" ? 1 : 0, losses: kind === "loss" ? 1 : 0, date: todayIST(), label: "" });
    if (ok) toast({ title: kind === "win" ? "Win added" : "Loss added", description: "The home page has updated." });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = entrySchema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the entry", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    const ok = await insert({ wins: parsed.data.wins, losses: parsed.data.losses, date: parsed.data.date, label: parsed.data.label });
    if (ok) {
      setForm({ date: todayIST(), wins: "0", losses: "0", label: "" });
      toast({ title: "Entry added", description: "The home page has updated." });
    }
  };

  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

  // Asked in the page, not with window.confirm(): embedded browsers (like the preview pane) block that popup and
  // answer "cancel" instantly, which made delete look broken.
  const confirmDelete = async () => {
    const row = pendingDelete;
    if (!row) return;
    setDeleting(true);
    // .select() returns the rows that were really deleted. Row-level security makes a delete that isn't allowed
    // succeed while removing nothing, so an empty result has to be reported rather than assumed to have worked.
    const { data, error } = await supabase.from("livestream_results").delete().eq("id", row.id).select("id");
    setDeleting(false);
    setPendingDelete(null);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    await load();
    if (!data || data.length === 0) {
      toast({
        title: "Nothing was deleted",
        description: "The entry may already be gone, or this account isn't allowed to delete entries.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Entry deleted", description: "The home page has updated." });
  };

  const total = record ? record.wins + record.losses : 0;
  const rate = record && total > 0 ? Math.round((record.wins / total) * 100) : null;

  const stat = (label: string, value: string, hint?: string) => (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/blogs")}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </button>
            <h1 className="font-display text-lg font-bold text-foreground">Livestream record</h1>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View on home page
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse bg-muted" />
            ))}
          </div>
        ) : needsSetup ? (
          <div className="border border-border bg-card p-6">
            <h2 className="font-display text-lg font-bold">The record isn't set up in the database yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The home page is showing the opening record (88 wins, 40 losses) until this is done. Open the Supabase SQL
              editor, paste in the contents of the file below, run it, then reload this page.
            </p>
            <p className="mt-4 inline-block bg-muted px-3 py-2 font-mono text-sm">{MIGRATION_FILE}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              It creates the table, adds your opening record (88 wins and 40 losses), and is safe to run more than once.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {stat("Wins", record ? String(record.wins) : "-")}
              {stat("Losses", record ? String(record.losses) : "-")}
              {stat("Win rate", rate === null ? "-" : `${rate}%`, record ? `${record.wins} of ${total} trades` : undefined)}
              {stat("Last updated", record?.lastUpdated ? fmtDateTime(record.lastUpdated) : "-", "India time")}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Shown on the home page as taken from all public livestreams since May 2026. The opening record is the first
              entry in the list below.
            </p>

            {/* Quick add, for use during a livestream */}
            <section className="mt-10">
              <h2 className="font-display text-lg font-bold">Add live</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                One tap adds a single trade dated today. The home page updates straight away, even for people already on it.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  onClick={() => quickAdd("win")}
                  disabled={busy}
                  className="inline-flex h-16 items-center justify-center gap-2 bg-primary text-lg font-semibold text-primary-foreground transition-colors hover:bg-foreground hover:text-background active:translate-y-px disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" /> 1 Win
                </button>
                <button
                  onClick={() => quickAdd("loss")}
                  disabled={busy}
                  className="inline-flex h-16 items-center justify-center gap-2 border border-foreground text-lg font-semibold text-foreground transition-colors hover:bg-foreground hover:text-background active:translate-y-px disabled:opacity-50"
                >
                  <Minus className="h-5 w-5" /> 1 Loss
                </button>
              </div>
            </section>

            {/* Full entry */}
            <section className="mt-10">
              <h2 className="font-display text-lg font-bold">Add a day's result</h2>
              <form onSubmit={submit} className="mt-4 border border-border bg-card p-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="ls-date" className="field-label">Date</label>
                    <input
                      id="ls-date"
                      type="date"
                      value={form.date}
                      max={todayIST()}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="field"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="ls-wins" className="field-label">Wins</label>
                    <input
                      id="ls-wins"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={1000}
                      value={form.wins}
                      onChange={(e) => setForm({ ...form, wins: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="ls-losses" className="field-label">Losses</label>
                    <input
                      id="ls-losses"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={1000}
                      value={form.losses}
                      onChange={(e) => setForm({ ...form, losses: e.target.value })}
                      className="field"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label htmlFor="ls-label" className="field-label">Label (optional)</label>
                  <input
                    id="ls-label"
                    value={form.label}
                    maxLength={200}
                    onChange={(e) => setForm({ ...form, label: e.target.value })}
                    placeholder="For your reference, for example the stream or session"
                    className="field"
                  />
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Not shown on the site, but the data is public, so keep it neutral.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-5 inline-flex h-11 items-center gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" /> {busy ? "Adding..." : "Add entry"}
                </button>
              </form>
            </section>

            {/* History */}
            <section className="mt-10">
              <h2 className="font-display text-lg font-bold">Entries</h2>
              {rows.length === 0 ? (
                <p className="mt-4 py-10 text-center text-muted-foreground">No entries yet</p>
              ) : (
                <div className="mt-4 overflow-x-auto border border-border bg-card">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3 text-right">Wins</th>
                        <th className="px-4 py-3 text-right">Losses</th>
                        <th className="px-4 py-3">Source</th>
                        <th className="px-4 py-3">Label</th>
                        <th className="px-4 py-3">Added</th>
                        <th className="px-4 py-3 text-right">
                          <span className="sr-only">Delete</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => (
                        <tr key={r.id} className="border-b border-border last:border-b-0">
                          <td className="whitespace-nowrap px-4 py-3">{fmtDate(r.entry_date)}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{r.wins}</td>
                          <td className="px-4 py-3 text-right tabular-nums">{r.losses}</td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{SOURCE_LABEL[r.source] ?? r.source}</td>
                          <td className="max-w-[16rem] truncate px-4 py-3 text-muted-foreground" title={r.label ?? ""}>
                            {r.label ?? ""}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{fmtDateTime(r.created_at)}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setPendingDelete(r)}
                              className="p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                              title="Delete entry"
                              aria-label={`Delete the entry from ${fmtDate(r.entry_date)}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {rows.length >= 100 && (
                <p className="mt-2 text-xs text-muted-foreground">Showing the latest 100 entries. Totals include all of them.</p>
              )}
            </section>
          </>
        )}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `${plural(pendingDelete.wins, "win", "wins")} and ${plural(pendingDelete.losses, "loss", "losses")} dated ${fmtDate(pendingDelete.entry_date)}. The totals on the home page will drop by that amount.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-foreground hover:text-background"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminLivestream;
