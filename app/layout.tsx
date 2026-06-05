import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics, MicrosoftClarity } from "./components/Analytics";
import "./globals.css";

const SITE_URL   = "https://media.bouncebackbrian.com";
const GA_ID      = process.env.NEXT_PUBLIC_GA_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  "3B Media Group — Content, Branding & Creative Production",
    template: "%s | 3B Media Group",
  },
  description:
    "Done-for-you media production for entrepreneurs and businesses. Branding, graphics, video, social content, and podcast production — powered by the 3B Ecosystem.",
  keywords: [
    "3B Media Group",
    "media production",
    "content creation",
    "branding services",
    "social media content",
    "video production",
    "podcast production",
    "BounceBackBrian",
    "3B Ecosystem",
    "creative agency",
  ],
  authors:   [{ name: "Brian A Martin", url: "https://bouncebackbrian.com" }],
  creator:   "Brian A Martin",
  openGraph: {
    type:        "website",
    url:          SITE_URL,
    siteName:    "3B Media Group",
    title:       "3B Media Group — Content, Branding & Creative Production",
    description: "Done-for-you media production for entrepreneurs. Part of the 3B Ecosystem by Brian A Martin.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "3B Media Group" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "3B Media Group — Content, Branding & Creative Production",
    description: "Done-for-you media production. Branding, video, social content, podcasts.",
    images:      ["/og-image.png"],
    creator:     "@bouncebackbrian",
  },
  alternates: { canonical: SITE_URL },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
        {GA_ID      && <GoogleAnalytics   id={GA_ID}      />}
        {CLARITY_ID && <MicrosoftClarity  id={CLARITY_ID} />}
      </body>
    </html>
  );
}
