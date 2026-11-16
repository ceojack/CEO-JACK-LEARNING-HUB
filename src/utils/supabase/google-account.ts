import { createClient } from "@/src/utils/supabase/client";

export async function switchToGoogleAccount(nextPath = "/dashboard") {
  const supabase = createClient();
  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) console.error("Could not clear the previous Supabase session before Google account selection:", signOutError);

  const safeNextPath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
  const callbackUrl = new URL("/auth/callback", window.location.origin);
  callbackUrl.searchParams.set("next", safeNextPath);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: { prompt: "select_account" },
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) throw error;
}
