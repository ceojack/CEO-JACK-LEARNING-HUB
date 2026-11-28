import { ResetPasswordForm } from "@/src/components/password-recovery";

// Keep the legacy callback destination working for reset links already sent to users.
export default function LegacyUpdatePasswordPage() {
  return <ResetPasswordForm />;
}
