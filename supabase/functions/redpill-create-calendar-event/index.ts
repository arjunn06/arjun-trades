// Creates a Google Calendar event for a Red Pill enrolment-call booking.
// Uses Lovable connector gateway for Google Calendar.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";
const TIMEZONE = "Asia/Kolkata";

function parseTo24h(time: string): { h: number; m: number } {
  // "10:00 AM" / "12:00 AM" / "1:00 PM" / "12:00 PM"
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) throw new Error(`Invalid time: ${time}`);
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return { h, m: min };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const GOOGLE_CALENDAR_API_KEY = Deno.env.get("GOOGLE_CALENDAR_API_KEY");
    if (!LOVABLE_API_KEY || !GOOGLE_CALENDAR_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Google Calendar connector not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const { name, contact, preferred_date, preferred_time, trading_experience } = body ?? {};
    if (!name || !contact || !preferred_date || !preferred_time) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { h, m } = parseTo24h(String(preferred_time));
    const startDateTime = `${preferred_date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
    const endH = (h + 1) % 24;
    const endDateTime = `${preferred_date}T${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;

    const event = {
      summary: `Red Pill Enrolment Call — ${name}`,
      description:
        `Applicant: ${name}\nContact: ${contact}\nExperience: ${trading_experience ?? "-"}\n\nBooked via ifvg.in/red-pill`,
      start: { dateTime: startDateTime, timeZone: TIMEZONE },
      end: { dateTime: endDateTime, timeZone: TIMEZONE },
      reminders: { useDefault: true },
    };

    const res = await fetch(`${GATEWAY_URL}/calendars/primary/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });

    const text = await res.text();
    if (!res.ok) {
      console.error("Calendar gateway error", res.status, text);
      return new Response(
        JSON.stringify({ error: "Failed to create event", status: res.status, details: text }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(text, {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
