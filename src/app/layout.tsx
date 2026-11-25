import type { Metadata } from "next";
import { Suspense } from "react";
import { ScrollToTop } from "@/src/components/scroll-to-top";
import { CookieConsent } from "@/src/components/cookie-consent";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
  title: {
    default: "CEO JACK LEARNING HUB | Education, Digital Skills & Entrepreneurship",
    template: "%s | CEO JACK LEARNING HUB",
  },

  description:
    "Explore CEO JACK LEARNING HUB, an online learning platform offering educational resources, digital skills training, technology courses, business education, entrepreneurship guidance and practical learning opportunities for students and aspiring entrepreneurs.",

  keywords: [
    "CEO JACK LEARNING HUB",
    "Online Learning Platform",
    "Education Platform Uganda",
    "Digital Skills Training",
    "Learn Programming Online",
    "Web Development Courses",
    "HTML CSS JavaScript",
    "Python Programming",
    "Entrepreneurship Education",
    "Business Education",
    "Online Education Africa",
    "Digital Literacy",
    "Technology Education",
    "Student Learning Resources",
  ],

  authors: [
    {
      name: "CEO JACK",
      url: "https://ceojacklearninghub.com",
    },
  ],

  creator: "CEO JACK",
  applicationName: "CEO JACK LEARNING HUB",

  metadataBase: new URL("https://ceojacklearninghub.com"),

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "CEO JACK LEARNING HUB | Learn. Create. Develop.",
    description:
      "Discover three learning experiences under one platform: Education, Digital Skills and Entrepreneurship. Access learning resources, develop technology skills and explore business opportunities.",

    url: "https://ceojacklearninghub.com",
    siteName: "CEO JACK LEARNING HUB",
    locale: "en_UG",
    type: "website",

    images: [
      {
        url: "/assets/images/banner.jpeg",
        width: 1096,
        height: 576,
        alt: "CEO JACK LEARNING HUB - Education, Digital Skills and Entrepreneurship",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "CEO JACK LEARNING HUB | Learn. Create. Develop.",
    description:
      "Education, digital skills and entrepreneurship resources. Learn new skills, explore technology and develop your entrepreneurial potential.",

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3891995236976645"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700,900&f[]=clash-display@600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        {children}
        <CookieConsent />
      </body>
      <GoogleAnalytics gaId="G-XY18MCK21Y" />
    </html>
  );
}
