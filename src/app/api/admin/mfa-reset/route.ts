import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { isAdminEmail } from "@/src/utils/supabase/admin";
import { getSupabaseConfig, isSupabaseConfigured } from "@/src/utils/supabase/config";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const auth = await getAuthenticatedClient(request);
  if (!auth || !isAdminEmail(auth.claims.email) || auth.claims.aal !== "aal2") return NextResponse.json({ error: "Administrator access with 2-Step Verification is required." }, { status: 403 });
  const body = await readJsonBody(request, 512);
  const userId = (body.value as { userId?: unknown } | undefined)?.userId;
  if (body.error || typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) return NextResponse.json({ error: "Choose a valid learner account." }, { status: 400 });
  if (userId === auth.userId) return NextResponse.json({ error: "Administrators cannot turn off their own 2-Step Verification." }, { status: 400 });

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRoleKey) return NextResponse.json({ error: "The server-side Supabase service role key is not configured for administrator MFA resets." }, { status: 503 });

  const config = getSupabaseConfig();
  if (!config) return NextResponse.json({ error: "Backend is not configured." }, { status: 503 });
  const adminClient = createClient(config.url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: learner, error: learnerError } = await adminClient.from("profiles").select("id, role").eq("id", userId).maybeSingle();
  if (learnerError || !learner || learner.role === "admin") return NextResponse.json({ error: "Only learner accounts can be reset." }, { status: 404 });

  const { data: factors, error: factorsError } = await adminClient.auth.admin.mfa.listFactors({ userId });
  if (factorsError) return NextResponse.json({ error: "The learner’s authenticator factors could not be read." }, { status: 502 });
  for (const factor of factors.factors) {
    const { error } = await adminClient.auth.admin.mfa.deleteFactor({ userId, id: factor.id });
    if (error) return NextResponse.json({ error: "A learner authenticator factor could not be removed." }, { status: 502 });
  }

  const { error: profileError } = await adminClient.from("profiles").update({ mfa_enabled: false }).eq("id", userId);
  if (profileError) return NextResponse.json({ error: "Factors were removed, but the learner security status could not be updated." }, { status: 502 });
  return NextResponse.json({ success: true });
}
