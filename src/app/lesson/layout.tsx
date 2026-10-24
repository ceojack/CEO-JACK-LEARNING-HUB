import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equivalent Fractions Lesson",
  description: "A short P7 mathematics lesson with a worked example, practice quiz and saved completion.",
};

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
