import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

export const metadata: Metadata = {
  title: "CEO JACK AI",
  description: "Ask questions, explore ideas and get learning help with CEO JACK AI.",
};

export const dynamic = "force-dynamic";

export default async function AiLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Fai");
  }

  return children;
}
