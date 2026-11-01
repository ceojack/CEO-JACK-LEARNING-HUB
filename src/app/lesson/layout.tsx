import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/src/utils/supabase/server";
import { isSupabaseConfigured } from "@/src/utils/supabase/config";

export const metadata: Metadata = {
  title: "Equivalent Fractions Lesson",
  description: "A short P7 mathematics lesson with a worked example, practice quiz and saved completion.",
};

export const dynamic = "force-dynamic";

export default async function LessonLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (!data?.claims?.sub) redirect("/auth?mode=signin&next=%2Flesson");
  }

  return children;
}
