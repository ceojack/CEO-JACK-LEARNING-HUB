import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CEO JACK Uganda | The Business Coach & The Founder of CEO JACK Learning Hub",
    template: "%s | CEO JACK Uganda",
  },
  description: "CEO Jack is a business coach and entrepreneur based in Kampala, Uganda. Founder of CEO JACK Learning Hub, teaching business, leadership and digital skills to young entrepreneurs.",
  keywords: ["CEO JACK", "CEO JACK Uganda", "CEO Jack Kampala", "CEO Jack Uganda Business Coach", "JACK Learning Hub", "Business Coach Uganda"],
  authors: [{ name: "CEO JACK", url: "https://ceojacklearninghub.com" }],
  creator: "CEO JACK",
  applicationName: "CEO JACK LEARNING HUB",
  metadataBase: new URL("https://ceojacklearninghub.com"),
  openGraph: {
    title: "CEO JACK Uganda | Business Coach & Founder of CEO JACK LEARNING HUB",
    description: "CEO Jack is a business coach and founder of CEO JACK LEARNING HUB in Kampala, Uganda. Learn business, leadership and digital skills.",
    url: "https://ceojacklearninghub.com",
    siteName: "CEO JACK LEARNING HUB",
    locale: "en_UG",
    images: [
      {
        url: "/assets/images/banner.jpeg",
        width: 1096,
        height: 576,
        alt: "CEO JACK LEARNING HUB — Learn. Create. Develop.",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CEO JACK Uganda | Business Coach & Founder",
    description: "CEO Jack is a business coach in Kampala, Uganda. Founder of CEO JACK Learning Hub.",
    images: ["/assets/images/banner.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
