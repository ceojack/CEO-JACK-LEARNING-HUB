import { AdminOverview } from "./overview-client";
import { createClient } from "@/src/utils/supabase/server";

export const metadata = { title: "Admin Overview | CEO JACK Learning Hub", robots: { index: false, follow: false } };
export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()
    : { data: null };
  return <AdminOverview adminName={profile?.full_name || "Admin Jack"} />;
}
