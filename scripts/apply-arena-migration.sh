#!/usr/bin/env bash
# Creates the Arena registrations table, its security rules and the public entry counter on the Supabase project.
# The SQL is supabase/migrations/20261009090000_arena_registrations.sql and is safe to run more than once.
#
# Your Supabase access token is typed at a hidden prompt. It is never printed, logged, or put in a command line.
# Run it in your own terminal: bash scripts/apply-arena-migration.sh
set -euo pipefail
cd "$(dirname "$0")/.."

REF="$(awk -F'"' '/^project_id/ {print $2}' supabase/config.toml)"
MIGRATION="supabase/migrations/20261009090000_arena_registrations.sql"
RESP="$(mktemp)"
trap 'rm -f "$RESP"' EXIT

say() { printf '\n%s\n' "$*"; }
die() { printf '\n✗ %s\n' "$*" >&2; exit 1; }

# Calls the Supabase management API. The token goes in via a config stream, never in argv. Prints the HTTP status.
api() { # api METHOD PATH [json-body-on-stdin]
  local method="$1" path="$2"
  if [[ "$method" == "GET" ]]; then
    curl -sS -o "$RESP" -w '%{http_code}' -X GET \
      -K <(printf 'header = "Authorization: Bearer %s"\n' "$SUPABASE_ACCESS_TOKEN") \
      "https://api.supabase.com$path" || printf '000'
  else
    curl -sS -o "$RESP" -w '%{http_code}' -X "$method" \
      -K <(printf 'header = "Authorization: Bearer %s"\n' "$SUPABASE_ACCESS_TOKEN") \
      -H 'Content-Type: application/json' --data-binary @- "https://api.supabase.com$path" || printf '000'
  fi
}

say "Arena database setup for Supabase project: $REF"
echo "What you type is not shown, saved, or sent anywhere except Supabase."

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  say "Supabase access token (create one at https://supabase.com/dashboard/account/tokens)."
  printf 'Paste it (hidden), or press Enter to cancel: '
  read -rs SUPABASE_ACCESS_TOKEN; echo
  [[ -z "$SUPABASE_ACCESS_TOKEN" ]] && { say "Cancelled. Nothing was changed."; exit 0; }
fi
# Pasting often drags along spaces, quotes or a trailing newline. Strip them before checking.
SUPABASE_ACCESS_TOKEN="$(printf '%s' "$SUPABASE_ACCESS_TOKEN" | tr -d '[:space:]"'"'"'')"
if [[ ! "$SUPABASE_ACCESS_TOKEN" =~ ^sbp_[A-Za-z0-9]+$ ]]; then
  die "That isn't a Supabase access token. They start with sbp_ (you pasted ${#SUPABASE_ACCESS_TOKEN} characters). Make one at https://supabase.com/dashboard/account/tokens - not an API key or the anon key."
fi
export SUPABASE_ACCESS_TOKEN

code="$(api GET "/v1/projects/$REF")"
case "$code" in
  200) echo "✓ Token works and can see project $REF" ;;
  401) die "Supabase says that token is invalid or expired (HTTP 401). Create a fresh one, copy it right away (it's shown once), and run this again." ;;
  *)   die "That token can't see project $REF (HTTP $code). If this project is managed only through Lovable, ask Lovable to apply $MIGRATION instead." ;;
esac

say "About to apply $MIGRATION to project $REF."
echo "It adds one table (arena_registrations), its security rules, and a count-only public function. It changes nothing else."
printf 'Continue? [y/N] '
read -r yn
[[ "$yn" =~ ^[Yy]$ ]] || { say "Cancelled. Nothing was changed."; exit 0; }

code="$(node -e 'process.stdout.write(JSON.stringify({query: require("fs").readFileSync(process.argv[1], "utf8")}))' "$MIGRATION" \
  | api POST "/v1/projects/$REF/database/query")"
[[ "$code" == "201" || "$code" == "200" ]] || die "The migration failed (HTTP $code): $(head -c 600 "$RESP")"
echo "✓ Migration applied"

# Check it as the public would see it: the counter answers, and the table is there but shows no rows.
ANON="$(grep -o 'eyJ[A-Za-z0-9_.-]*' src/integrations/supabase/client.ts | head -1)"
stats="$(curl -sS -X POST "https://$REF.supabase.co/rest/v1/rpc/arena_stats" -H "apikey: $ANON" -H 'Content-Type: application/json' -d '{}' || true)"
rows="$(curl -sS "https://$REF.supabase.co/rest/v1/arena_registrations?select=id&limit=1" -H "apikey: $ANON" || true)"
[[ "$stats" == *entries* ]] && echo "✓ Public entry counter works ($stats)" || echo "! Counter didn't answer as expected: ${stats:0:200}"
[[ "$rows" == "[]" ]] && echo "✓ Table exists, and the public can't read any rows" || echo "! Unexpected table response: ${rows:0:200}"

say "Done. Registrations on /arena can now be saved. Review them at /admin/arena."
