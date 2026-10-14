import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subject",
  description: "Explore a subject inside the Education Hub.",
};

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return children;
}
