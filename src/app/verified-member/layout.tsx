import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Verified Member",
  description: "Create your CEO JACK Learning Hub verified member card.",
  alternates: { canonical: "/verified-member" },
  robots: { index: false, follow: false },
};

export default function VerifiedMemberLayout({ children }: { children: React.ReactNode }) {
  return children;
}
