import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../_lib";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const checkedAt = new Date().toISOString();
  const [profiles, courses, enrollments] = await Promise.all([
    result.auth.supabase.from("profiles").select("id", { count: "exact", head: true }),
    result.auth.supabase.from("courses").select("id", { count: "exact", head: true }),
    result.auth.supabase.from("enrollments").select("id", { count: "exact", head: true }),
  ]);
  const databaseOnline = !profiles.error && !courses.error && !enrollments.error;
  return NextResponse.json({ database: databaseOnline ? "connected" : "degraded", checkedAt, errors: [profiles.error, courses.error, enrollments.error].filter(Boolean).map((error) => error?.message) }, { headers: protectedHeaders });
}
