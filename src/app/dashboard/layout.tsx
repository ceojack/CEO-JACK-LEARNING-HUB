import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your CEO JACK LEARNING HUB learning space.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
