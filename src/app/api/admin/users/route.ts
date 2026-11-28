import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { isAdminEmail } from "@/src/utils/supabase/admin";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const auth = await getAuthenticatedClient(request);
  if (!auth || !isAdminEmail(auth.claims.email) || auth.claims.aal !== "aal2") return NextResponse.json({ error: "Administrator access with 2-Step Verification is required." }, { status: 403 });

  const { data, error } = await auth.supabase
    .from("profiles")
    .select("id, email, full_name, role, mfa_enabled")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Learner accounts could not be loaded." }, { status: 500 });
  return NextResponse.json({ users: data.filter((user) => user.role !== "admin") }, { headers: { "Cache-Control": "private, no-store" } });
}
