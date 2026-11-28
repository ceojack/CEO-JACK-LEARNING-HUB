import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../_lib";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const { data, error } = await result.auth.supabase
    .from("admin_activity_log")
    .select("id,actor_id,action,target_type,target_id,details,created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Activity history is unavailable. Apply the admin activity log migration." }, { status: 502, headers: protectedHeaders });
  return NextResponse.json({ events: data ?? [] }, { headers: protectedHeaders });
}
