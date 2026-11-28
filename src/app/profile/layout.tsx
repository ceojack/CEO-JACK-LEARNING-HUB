import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { isAdminEmail } from "@/src/utils/supabase/admin";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your CEO JACK Learning Hub account and learning profile.",
  alternates: { canonical: "/profile" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Fprofile");
    if (isAdminEmail(data.claims.email) && data.claims.aal !== "aal2") redirect("/auth/mfa?next=%2Fprofile");
    if (data.claims.aal !== "aal2") {
      const { data: profile } = await supabase.from("profiles").select("mfa_enabled").eq("id", String(data.claims.sub)).maybeSingle();
      if (profile?.mfa_enabled) redirect("/auth/mfa?next=%2Fprofile");
    }
  }

  return children;
}
