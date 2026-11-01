import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Personalize your CEO JACK LEARNING HUB experience.",
};

export const dynamic = "force-dynamic";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Fonboarding");
  }

  return children;
}
