import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started",
  description: "Create your CEO JACK LEARNING HUB account and begin your journey to learn, create, and develop.",
  alternates: { canonical: "/get-started" },
  robots: { index: false, follow: false },
};

export default function GetStartedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
