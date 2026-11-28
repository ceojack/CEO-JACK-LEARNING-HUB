import { redirect } from "next/navigation";
import { AdminShell } from "./admin-shell";
import { isAdminEmail } from "@/src/utils/supabase/admin";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { createClient } from "@/src/utils/supabase/server";
import { ActiveTimeTracker } from "@/src/components/active-time";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) redirect("/login?next=%2Fadmin");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;
  if (!claims || typeof userId !== "string") redirect("/login?next=%2Fadmin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userId)
    .maybeSingle();

  if (profile?.role !== "admin" || !isAdminEmail(profile.email ?? claims.email)) redirect("/dashboard");
  if (claims.aal !== "aal2") redirect("/auth/mfa?next=%2Fadmin");

  return <><ActiveTimeTracker userId={profile.id} /><AdminShell adminName={profile.full_name || "Admin Jack"} adminEmail={profile.email || String(claims.email ?? "")}>{children}</AdminShell></>;
}
