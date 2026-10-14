import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
  description: "Create your CEO JACK LEARNING HUB account or sign in to continue your learning journey.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
