
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CEO JACK LEARNING HUB",
    template: "%s | CEO JACK LEARNING HUB",
  },
  description:
    "Learn. Create. Develop. An AI-powered learning platform for education, digital skills, and entrepreneurship.",
  applicationName: "CEO JACK LEARNING HUB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
