import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrepreneurship Hub",
  description: "Develop business thinking, financial literacy and practical opportunities.",
  alternates: { canonical: "/entrepreneurship" },
};

export default function EntrepreneurshipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
