import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { consumeRateLimit } from "@/src/utils/rate-limit";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return NextResponse.json({ saved: false }, { status: 503 });
  const auth = await getAuthenticatedClient(request);
  if (!auth) return NextResponse.json({ saved: false }, { status: 401 });
  const rate = consumeRateLimit(`ai-memory:${auth.userId}`, 30, 10 * 60_000);
  if (!rate.allowed) return NextResponse.json({ saved: false }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const parsed = await readJsonBody(request, 4_096);
  if (parsed.error || !parsed.value || typeof parsed.value !== "object" || Array.isArray(parsed.value)) {
    return NextResponse.json({ saved: false }, { status: 400 });
  }
  const summary = (parsed.value as { summary?: unknown }).summary;
  if (typeof summary !== "string" || !summary.trim()) return NextResponse.json({ saved: false }, { status: 400 });

  try {
    const { data, error } = await auth.supabase
      .from("profiles")
      .update({ jack_ai_memory: summary.trim().slice(0, 800), updated_at: new Date().toISOString() })
      .eq("id", auth.userId)
      .select("id")
      .maybeSingle();
    if (error) {
      console.error("Could not save JACK AI memory:", error);
      return NextResponse.json({ saved: false }, { status: 500 });
    }
    if (!data) {
      console.error("Could not save JACK AI memory: no profile row exists for the signed-in user.");
      return NextResponse.json({ saved: false }, { status: 404 });
    }
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Could not save JACK AI memory:", error);
    return NextResponse.json({ saved: false }, { status: 500 });
  }
}
