import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subject",
  description: "Explore a subject inside the Education Hub.",
  alternates: { canonical: "/subject" },
  robots: { index: false, follow: false },
};

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
