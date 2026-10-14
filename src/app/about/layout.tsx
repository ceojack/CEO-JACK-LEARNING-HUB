import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about CEO JACK LEARNING HUB, its mission, philosophy and vision.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
