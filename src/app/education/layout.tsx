import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education Hub",
  description: "Explore classes, subjects, lessons and learning resources with CEO JACK LEARNING HUB.",
};

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
