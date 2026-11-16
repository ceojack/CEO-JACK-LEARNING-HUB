import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Create your CEO JACK LEARNING HUB account or sign in to continue your learning journey.",
  alternates: { canonical: "/auth" },
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
