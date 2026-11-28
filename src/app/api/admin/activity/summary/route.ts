import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../../_lib";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if ("response" in access) return access.response;
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await access.auth.supabase
    .from("activity_daily")
    .select("user_id,activity_date,active_seconds,last_active_at")
    .eq("activity_date", today)
    .limit(10000);
  if (error) return NextResponse.json({ error: "Active time summary could not be loaded." }, { status: 502, headers: protectedHeaders });
  const rows = data ?? [];
  const recent = rows.filter((row) => Date.now() - new Date(row.last_active_at).getTime() <= 120_000);
  const activeIds = [...new Set(recent.map((row) => row.user_id))];
  const profiles = activeIds.length
    ? await access.auth.supabase.from("profiles").select("id,role").in("id", activeIds)
    : { data: [], error: null };
  if (profiles.error) return NextResponse.json({ error: "Active user roles could not be loaded." }, { status: 502, headers: protectedHeaders });
  return NextResponse.json({
    activeLearners: (profiles.data ?? []).filter((profile) => profile.role === "learner").length,
    activeAdmins: (profiles.data ?? []).filter((profile) => profile.role === "admin").length,
    todaySeconds: rows.reduce((sum, row) => sum + row.active_seconds, 0),
  }, { headers: protectedHeaders });
}
