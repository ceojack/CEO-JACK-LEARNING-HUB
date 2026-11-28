import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../_lib";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const access = await requireAdmin(request);
  if ("response" in access) return access.response;
  try {
    const db = access.auth.supabase;
    const { data, error } = await db.from("lessons").select("id,course_id,title,order_num,video_url,content").order("order_num").limit(500);
    if (error) throw error;
    const rows = data ?? [];
    const ids = [...new Set(rows.map((x) => x.course_id))];
    const { data: courses } = ids.length ? await db.from("courses").select("id,title").in("id", ids) : { data: [] };
    const map = new Map((courses ?? []).map((c) => [c.id, c.title]));
    return NextResponse.json({ rows: rows.map((x) => ({ ...x, course_title: map.get(x.course_id) ?? "Unknown course" })) }, { headers: protectedHeaders });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load lessons.";
    const missing = /does not exist|could not find the table/i.test(message);
    return NextResponse.json({ rows: [], missing, error: missing ? "The lessons table is not available." : message }, { status: missing ? 200 : 500, headers: protectedHeaders });
  }
}
