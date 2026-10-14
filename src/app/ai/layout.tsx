import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CEO JACK AI",
  description: "Ask questions, explore ideas, and get learning help from CEO JACK AI.",
};

export default function AiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
