import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CEO JACK LEARNING HUB",
    template: "%s | CEO JACK LEARNING HUB",
  },
  description: "Learn. Create. Develop. An AI-powered learning platform for education, digital skills, and entrepreneurship.",
  applicationName: "CEO JACK LEARNING HUB",
  metadataBase: new URL("https://ceojacklearninghub.com"),
  openGraph: {
    title: "CEO JACK LEARNING HUB",
    description: "Learn. Create. Develop. An AI-powered learning platform built for the future.",
    url: "https://ceojacklearninghub.com",
    siteName: "CEO JACK LEARNING HUB",
    images: [
      {
        url: "https://ceojacklearninghub.com/assets/images/logo-image.png",
        width: 1200,
        height: 630,
        alt: "CEO JACK LEARNING HUB",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CEO JACK LEARNING HUB",
    description: "Learn. Create. Develop. An AI-powered learning platform",
    images: ["https://ceojacklearninghub.com/assets/images/logo-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700,900&f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}