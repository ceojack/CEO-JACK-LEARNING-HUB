import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await getAuthenticatedClient(request);
  if (!auth) return NextResponse.json({ error: "Sign in to view active time." }, { status: 401 });
  const suppliedOffset = Number(new URL(request.url).searchParams.get("timezoneOffset"));
  const timezoneOffset = Number.isFinite(suppliedOffset) ? Math.max(-840, Math.min(840, Math.trunc(suppliedOffset))) : 0;
  const today = new Date(Date.now() - timezoneOffset * 60_000).toISOString().slice(0, 10);
  const { data, error } = await auth.supabase.from("activity_daily").select("activity_date,active_seconds,last_active_at").eq("user_id", auth.userId).order("activity_date", { ascending: false }).limit(3650);
  if (error) return NextResponse.json({ error: "Active time could not be loaded." }, { status: 502 });
  const rows = data ?? [];
  return NextResponse.json({
    todaySeconds: rows.find((row) => row.activity_date === today)?.active_seconds ?? 0,
    totalSeconds: rows.reduce((total, row) => total + row.active_seconds, 0),
  }, { headers: { "Cache-Control": "private, no-store, max-age=0" } });
}
