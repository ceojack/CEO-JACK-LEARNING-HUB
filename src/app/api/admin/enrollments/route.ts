import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../_lib";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if ("response" in access) return access.response;
  try {
    const db = access.auth.supabase;
    const { data, error } = await db.from("enrollments").select("id,user_id,course_id,enrolled_at").order("enrolled_at", { ascending: false }).limit(500);
    if (error) throw error;
    const rows = data ?? [];
    const users = [...new Set(rows.map((x) => x.user_id))];
    const courses = [...new Set(rows.map((x) => x.course_id))];
    const [profiles, catalog] = await Promise.all([
      users.length ? db.from("profiles").select("id,full_name,email").in("id", users) : Promise.resolve({ data: [], error: null }),
      courses.length ? db.from("courses").select("id,title").in("id", courses) : Promise.resolve({ data: [], error: null }),
    ]);
    const pmap = new Map((profiles.data ?? []).map((p) => [p.id, p]));
    const cmap = new Map((catalog.data ?? []).map((c) => [c.id, c]));
    return NextResponse.json({ rows: rows.map((x) => ({ ...x, profile: pmap.get(x.user_id), course: cmap.get(x.course_id) })) }, { headers: protectedHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load enrollments.";
    const missing = /does not exist|could not find the table/i.test(message);
    return NextResponse.json({ rows: [], missing, error: missing ? "The enrollments table is not available." : message }, { status: missing ? 200 : 500, headers: protectedHeaders });
  }
}
