import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Skills Hub",
  description: "Build practical technology skills through web development, programming, AI and projects.",
};

export default function DigitalSkillsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
