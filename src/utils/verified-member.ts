export const VERIFIED_MEMBER_THEMES = [
  { id: "royal-black", name: "Royal Black & Gold" },
  { id: "ocean-blue", name: "Ocean Blue" },
  { id: "emerald-green", name: "Emerald Green" },
  { id: "royal-purple", name: "Royal Purple" },
  { id: "sunset-orange", name: "Sunset Orange" },
] as const;

export type VerifiedMemberTheme = (typeof VERIFIED_MEMBER_THEMES)[number]["id"];

export type VerifiedMemberCardData = {
  fullName: string;
  photoUrl: string;
  hobby: string;
  level: string;
  motto: string;
  memberId: string;
  cardColour: VerifiedMemberTheme;
  qrUrl: string;
  createdAt?: string;
};

export function isVerifiedMemberTheme(value: unknown): value is VerifiedMemberTheme {
  return typeof value === "string" && VERIFIED_MEMBER_THEMES.some((theme) => theme.id === value);
}

export function isOwnVerifiedMemberPhotoUrl(photoUrl: string, userId: string, supabaseUrl: string) {
  if (!userId || photoUrl.length > 2048) return false
  try {
    const parsed = new URL(photoUrl)
    const base = new URL(supabaseUrl)
    if (parsed.origin !== base.origin) return false
    if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") return false
    const prefix = `/storage/v1/object/public/verified-member-photos/${encodeURIComponent(userId)}/`
    return parsed.pathname.startsWith(prefix) && !parsed.pathname.includes("..")
  } catch {
    return false
  }
}
