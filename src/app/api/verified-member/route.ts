import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/src/utils/supabase/auth";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { isVerifiedMemberTheme } from "@/src/utils/verified-member";
import { readJsonBody } from "@/src/utils/read-json";

export const dynamic = "force-dynamic";

const selectCard = "full_name, photo_url, hobby, level, motto, member_id, card_colour, qr_url, is_verified, created_at";

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
}

function toCard(data: Record<string, unknown> | null) {
  if (!data) return null;
  return {
    fullName: data.full_name,
    photoUrl: data.photo_url,
    hobby: data.hobby,
    level: data.level,
    motto: data.motto,
    memberId: data.member_id,
    cardColour: data.card_colour,
    qrUrl: data.qr_url,
    isVerified: data.is_verified,
    createdAt: data.created_at,
  };
}

function createMemberId(year: number) {
  return `CJ-${year}-${String(1000 + Math.floor(Math.random() * 9000))}`;
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: "Account storage is not configured." }, 503);
  const auth = await getAuthenticatedClient(request);
  if (!auth) return json({ error: "Sign in to access your verified member card." }, 401);

  const { data, error } = await auth.supabase
    .from("verified_member_cards")
    .select(selectCard)
    .eq("user_id", auth.userId)
    .maybeSingle();
  if (error) {
    console.error("Could not load verified member card:", error);
    return json({ error: "Verified member cards are not set up yet. Apply the verified member database migration, then try again." }, 503);
  }

  return json({ card: toCard(data as Record<string, unknown> | null) });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return json({ error: "Account storage is not configured." }, 503);
  const auth = await getAuthenticatedClient(request);
  if (!auth) return json({ error: "Sign in to generate a verified member card." }, 401);

  const parsed = await readJsonBody(request, 12_000);
  if (parsed.error === "too_large") return json({ error: "The card details are too large." }, 413);
  if (parsed.error || !parsed.value || typeof parsed.value !== "object") return json({ error: "Send valid card details." }, 400);
  const body = parsed.value as Record<string, unknown>;
  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const photoUrl = typeof body.photoUrl === "string" ? body.photoUrl.trim() : "";
  const hobby = typeof body.hobby === "string" ? body.hobby.trim() : "";
  const level = body.level;
  const motto = typeof body.motto === "string" ? body.motto.trim() : "";
  const theme = body.cardColour;

  if (fullName.length < 2 || fullName.length > 80) return json({ error: "Enter a name between 2 and 80 characters." }, 400);
  if (!/^https:\/\//i.test(photoUrl) || photoUrl.length > 2048) return json({ error: "Upload a photo or choose your profile photo first." }, 400);
  if (!hobby || hobby.length > 60) return json({ error: "Choose or enter a hobby." }, 400);
  if (!(["Beginner", "Intermediate", "Pro", "Master"] as unknown[]).includes(level)) return json({ error: "Choose a learner level." }, 400);
  if (motto.length > 35) return json({ error: "Keep your motto to 35 characters or fewer." }, 400);
  if (!isVerifiedMemberTheme(theme)) return json({ error: "Choose one of the available card colours." }, 400);

  const { data: existing, error: existingError } = await auth.supabase
    .from("verified_member_cards")
    .select("member_id, created_at")
    .eq("user_id", auth.userId)
    .maybeSingle();
  if (existingError) {
    console.error("Could not read existing verified member card:", existingError);
    return json({ error: "Verified member cards are not set up yet. Apply the verified member database migration, then try again." }, 503);
  }

  const year = new Date().getFullYear();
  const requestedId = typeof body.memberId === "string" && /^CJ-\d{4}-\d{4}$/.test(body.memberId) ? body.memberId : "";
  let saveError: { code?: string; message?: string } | null = null;
  let saved: Record<string, unknown> | null = null;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const memberId = typeof existing?.member_id === "string" ? existing.member_id : attempt === 0 && requestedId ? requestedId : createMemberId(year);
    const qrUrl = `https://ceojacklearninghub.com/verified-member/${memberId}`;
    const { data, error } = await auth.supabase
      .from("verified_member_cards")
      .upsert({
        user_id: auth.userId,
        full_name: fullName,
        photo_url: photoUrl,
        hobby,
        level,
        motto,
        member_id: memberId,
        card_colour: theme,
        qr_url: qrUrl,
        is_verified: true,
        created_at: existing?.created_at ?? new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" })
      .select(selectCard)
      .single();
    if (!error) {
      saved = data as Record<string, unknown>;
      saveError = null;
      break;
    }
    saveError = error;
    if (error.code !== "23505" || existing?.member_id) break;
  }

  if (!saved) {
    console.error("Could not save verified member card:", saveError);
    return json({ error: saveError?.message ?? "Your verified card could not be saved. Please try again." }, 500);
  }

  return json({ card: toCard(saved) });
}
