import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sponsor Application",
  description: "Apply to sponsor CEO JACK LEARNING HUB and support learning in Uganda.",
  alternates: { canonical: "/sponsor-application" },
};

export default function SponsorApplicationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
