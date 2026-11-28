import { NextResponse } from "next/server";
import { adminServiceClient, ADMIN_EMAIL, protectedHeaders, recordAdminActivity, requireAdmin } from "../../_lib";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const { data, error } = await result.auth.supabase.from("profiles").select("id, full_name, email, role, created_at").order("created_at", { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ error: "Users could not be loaded." }, { status: 502 });
  return NextResponse.json({ users: data ?? [] }, { headers: protectedHeaders });
}

export async function POST(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const body = await readJsonBody(request, 2048);
  const value = body.value as { email?: unknown; fullName?: unknown } | undefined;
  const email = typeof value?.email === "string" ? value.email.trim().toLowerCase() : "";
  const fullName = typeof value?.fullName === "string" ? value.fullName.trim() : "";
  if (body.error || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || fullName.length < 2 || fullName.length > 100) {
    return NextResponse.json({ error: "Enter a valid email and a name with at least 2 characters." }, { status: 400 });
  }
  if (email === ADMIN_EMAIL) return NextResponse.json({ error: "The administrator account already exists." }, { status: 409 });
  try {
    const db = adminServiceClient();
    const { data, error } = await db.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } });
    if (error) return NextResponse.json({ error: error.message }, { status: 502 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "user.invited", "user", data.user?.id ?? null);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "User invitations require the server-side Supabase service role key." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const body = await readJsonBody(request, 1024);
  const value = body.value as { userId?: unknown; role?: unknown } | undefined;
  const userId = typeof value?.userId === "string" ? value.userId : "";
  const role = value?.role;
  if (body.error || !/^[0-9a-f-]{36}$/i.test(userId) || role !== "learner" && role !== "admin") return NextResponse.json({ error: "Choose a valid account and role." }, { status: 400 });
  if (userId === result.auth.userId) return NextResponse.json({ error: "You cannot change your own administrator role." }, { status: 400 });
  try {
    const db = adminServiceClient();
    const { data: target, error: targetError } = await db.from("profiles").select("id, email, role").eq("id", userId).maybeSingle();
    if (targetError || !target) return NextResponse.json({ error: "User not found." }, { status: 404 });
    if (role === "admin" && target.email?.toLowerCase() !== ADMIN_EMAIL) return NextResponse.json({ error: "Only the designated Admin Jack account can have the admin role." }, { status: 403 });
    if (target.email?.toLowerCase() === ADMIN_EMAIL && role !== "admin") return NextResponse.json({ error: "Admin Jack’s administrator role is protected." }, { status: 403 });
    const { error } = await db.from("profiles").update({ role }).eq("id", userId);
    if (error) return NextResponse.json({ error: "The user role could not be updated." }, { status: 502 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "user.role_changed", "user", userId, { from: target.role, to: role });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Role changes require the server-side Supabase service role key." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const result = await requireAdmin(request);
  if ("response" in result) return result.response;
  const body = await readJsonBody(request, 1024);
  const userId = (body.value as { userId?: unknown } | undefined)?.userId;
  if (body.error || typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) return NextResponse.json({ error: "Choose a valid user account." }, { status: 400 });
  if (userId === result.auth.userId) return NextResponse.json({ error: "You cannot delete your own administrator profile." }, { status: 400 });
  try {
    const db = adminServiceClient();
    const { data: target, error: targetError } = await db.from("profiles").select("email").eq("id", userId).maybeSingle();
    if (targetError || !target) return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    if (target.email?.toLowerCase() === ADMIN_EMAIL) return NextResponse.json({ error: "The designated administrator profile cannot be deleted here." }, { status: 403 });
    const { error } = await db.from("profiles").delete().eq("id", userId);
    if (error) return NextResponse.json({ error: "The profile could not be deleted. Existing enrollments may need to be removed first." }, { status: 409 });
    await recordAdminActivity(result.auth.supabase, result.auth.userId, "user.profile_deleted", "user", userId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Profile deletion requires the server-side Supabase service role key." }, { status: 503 });
  }
}
