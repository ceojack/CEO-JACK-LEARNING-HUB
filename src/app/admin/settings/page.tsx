import { SettingsClient } from "./settings-client";
import { createClient } from "@/src/utils/supabase/server";
export const metadata = { title: "Admin Settings | CEO JACK Learning Hub", robots: { index: false, follow: false } };
export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from("profiles").select("full_name,email,role").eq("id", user.id).maybeSingle() : { data: null };
  return <SettingsClient profile={profile ?? { full_name: "Admin Jack", email: user?.email ?? "", role: "admin" }} />;
}
