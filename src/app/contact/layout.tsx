import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact CEO JACK LEARNING HUB with questions, feedback, ideas or collaboration enquiries.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
