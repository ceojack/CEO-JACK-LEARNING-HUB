import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return NextResponse.json({ error: "Sign in to record activity." }, { status: 401 });

  const body = await request.json().catch(() => ({})) as { timezoneOffset?: unknown };
  const suppliedOffset = typeof body.timezoneOffset === "number" && Number.isFinite(body.timezoneOffset) ? body.timezoneOffset : 0;
  const timezoneOffset = Math.max(-840, Math.min(840, Math.trunc(suppliedOffset)));
  const now = new Date();
  const activityDate = new Date(now.getTime() - timezoneOffset * 60_000).toISOString().slice(0, 10);
  const table = auth.supabase.from("activity_daily");
  let { data: row, error } = await table.select("active_seconds,last_active_at").eq("user_id", auth.userId).eq("activity_date", activityDate).maybeSingle();
  if (error) return NextResponse.json({ error: "Active time could not be saved." }, { status: 502 });

  if (!row) {
    const { error: insertError } = await table.insert({ user_id: auth.userId, activity_date: activityDate, active_seconds: 0, last_active_at: now.toISOString() });
    if (insertError && insertError.code !== "23505") return NextResponse.json({ error: "Active time could not be started." }, { status: 502 });
    const refreshed = await table.select("active_seconds,last_active_at").eq("user_id", auth.userId).eq("activity_date", activityDate).maybeSingle();
    row = refreshed.data;
    error = refreshed.error;
  }
  if (error || !row) return NextResponse.json({ error: "Active time could not be read." }, { status: 502 });

  const lastActive = new Date(row.last_active_at).getTime();
  const elapsed = Math.floor((now.getTime() - lastActive) / 1000);
  const creditedSeconds = elapsed > 0 && elapsed <= 75 ? elapsed : 0;
  const update = await table.update({ active_seconds: row.active_seconds + creditedSeconds, last_active_at: now.toISOString() })
    .eq("user_id", auth.userId)
    .eq("activity_date", activityDate)
    .eq("last_active_at", row.last_active_at)
    .select("active_seconds")
    .maybeSingle();

  return NextResponse.json({ saved: !update.error, creditedSeconds: update.data ? creditedSeconds : 0 }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
