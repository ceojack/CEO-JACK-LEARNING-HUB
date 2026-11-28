import { NextResponse } from "next/server";
import { protectedHeaders, requireAdmin } from "../_lib";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const db = result.auth.supabase;
  const [usersResult, adminsResult, learnersResult, recentResult, growthResult, coursesResult, enrollmentsResult] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin"),
    db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "learner"),
    db.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("profiles").select("created_at").order("created_at", { ascending: false }).limit(1000),
    db.from("courses").select("id", { count: "exact", head: true }),
    db.from("enrollments").select("id", { count: "exact", head: true }),
  ]);
  if (usersResult.error) return NextResponse.json({ error: "Users could not be loaded. Check the admin profile read policy." }, { status: 502 });
  const users = recentResult.data ?? [];
  const courseMissing = Boolean(coursesResult.error && /relation|table|schema cache|does not exist|could not find/i.test(coursesResult.error.message));
  const enrollmentsMissing = Boolean(enrollmentsResult.error && /relation|table|schema cache|does not exist|could not find/i.test(enrollmentsResult.error.message));
  if (recentResult.error || growthResult.error) return NextResponse.json({ error: "Recent signups could not be loaded." }, { status: 502 });
  const now = new Date();
  const userGrowth = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const count = (growthResult.data ?? []).filter((user) => user.created_at?.slice(0, 7) === key).length;
    return { label: date.toLocaleString("en", { month: "short" }), count };
  });
  return NextResponse.json({
    totals: {
      users: usersResult.count ?? 0,
      admins: adminsResult.count ?? 0,
      learners: learnersResult.count ?? 0,
      courses: coursesResult.error ? 0 : coursesResult.count ?? 0,
      enrollments: enrollmentsResult.error ? 0 : enrollmentsResult.count ?? 0,
      coursesAvailable: !courseMissing,
      enrollmentsAvailable: !enrollmentsMissing,
    },
    recentUsers: users,
    userGrowth,
  }, { headers: protectedHeaders });
}
