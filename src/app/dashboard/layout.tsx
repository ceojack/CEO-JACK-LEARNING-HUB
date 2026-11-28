import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";
import { isAdminEmail } from "@/src/utils/supabase/admin";
import { ActiveTimeTracker } from "@/src/components/active-time";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CEO JACK LEARNING HUB learning space.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let activeUserId: string | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Fdashboard");
    if (isAdminEmail(data.claims.email) && data.claims.aal !== "aal2") redirect("/auth/mfa?next=%2Fdashboard");
    if (data.claims.aal !== "aal2") {
      const { data: profile } = await supabase.from("profiles").select("mfa_enabled").eq("id", String(data.claims.sub)).maybeSingle();
      if (profile?.mfa_enabled) redirect("/auth/mfa?next=%2Fdashboard");
    }
    activeUserId = String(data.claims.sub);
  }

  return <>{activeUserId ? <ActiveTimeTracker userId={activeUserId} /> : null}{children}</>;
}
