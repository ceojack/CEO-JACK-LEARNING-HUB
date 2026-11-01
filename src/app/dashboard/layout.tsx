import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CEO JACK LEARNING HUB learning space.",
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Fdashboard");
  }

  return children;
}
