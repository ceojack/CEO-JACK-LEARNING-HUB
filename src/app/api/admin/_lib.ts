import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { ADMIN_EMAIL, isAdminEmail } from "@/src/utils/supabase/admin";
import { getSupabaseConfig, isSupabaseConfigured } from "@/src/utils/supabase/config";

export async function requireAdmin(request: Request) {
  if (!isSupabaseConfigured()) return { response: NextResponse.json({ error: "Supabase is not configured." }, { status: 503 }) } as const;
  const auth = await getAuthenticatedClient(request);
  if (!auth || !isAdminEmail(auth.claims.email) || auth.claims.aal !== "aal2") {
    return { response: NextResponse.json({ error: "Administrator access with 2-Step Verification is required." }, { status: 403 }) } as const;
  }
  const { data: profile, error } = await auth.supabase.from("profiles").select("id, full_name, email, role").eq("id", auth.userId).maybeSingle();
  if (error || profile?.role !== "admin") return { response: NextResponse.json({ error: "Administrator profile is required." }, { status: 403 }) } as const;
  return { auth, profile } as const;
}

export function adminServiceClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const config = getSupabaseConfig();
  if (!key || !config) throw new Error("The server-side Supabase service role key is not configured.");
  return createSupabaseClient(config.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function recordAdminActivity(
  supabase: SupabaseClient,
  actorId: string,
  action: string,
  targetType: string,
  targetId: string | null = null,
  details: Record<string, string | number | boolean | null> = {},
) {
  try {
    await supabase.from("admin_activity_log").insert({ actor_id: actorId, action, target_type: targetType, target_id: targetId, details });
  } catch {
    // Audit logging must not block the admin action itself.
  }
}

export const protectedHeaders = { "Cache-Control": "private, no-store, max-age=0" };
export { ADMIN_EMAIL };
