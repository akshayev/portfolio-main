import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SplineBackground } from "@/components/canvas/SplineBackground";
import { CSPostHogProvider } from "@/providers/PostHogProvider";

/**
 * Inter — preloaded with font-display: swap to prevent FOIT.
 * Subsets: latin only (removes unused character sets from bundle).
 * Variable font: single file covers all weights, eliminating per-weight requests.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://akshay.is-a.dev"),
  title: {
    default: "Akshay EV | Full-Stack & AI Agent Engineer",
    template: "%s | Akshay EV",
  },
  description:
    "Executive Spatial UI Portfolio featuring Titanium glassmorphism, 3D WebGL scenes, and Emerald highlights.",
  keywords: [
    "Full-Stack Engineer",
    "AI Agent Engineer",
    "Next.js 15",
    "Spatial Portfolio",
    "React 19",
    "TypeScript",
    "WebGL",
    "Tailwind CSS",
  ],
  authors: [{ name: "Akshay EV", url: "https://akshay.is-a.dev" }],
  creator: "Akshay EV",
  openGraph: {
    title: "Akshay EV | Full-Stack & AI Agent Engineer",
    description:
      "Executive Spatial UI Portfolio featuring Titanium glassmorphism, 3D WebGL scenes, and Emerald highlights.",
    url: "https://akshay.is-a.dev",
    siteName: "Akshay EV Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akshay EV | Full-Stack & AI Agent Engineer",
    description:
      "Executive Spatial UI Portfolio featuring Titanium glassmorphism, 3D WebGL scenes, and Emerald highlights.",
    creator: "@akshayev",
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
    <html lang="en" className={inter.variable}>
      <body className="bg-[#11172A] text-slate-100 antialiased font-sans selection:bg-emerald-500 selection:text-slate-950">
        <CSPostHogProvider>
          {/*
           * SplineBackground: fixed -z-50 behind all content.
           * Internally uses next/dynamic (ssr: false) — the Spline WebGL runtime
           * is excluded from the SSR bundle and deferred until client hydration,
           * ensuring it never blocks FCP of the ExecutiveBar.
           */}
          <SplineBackground />
          {children}
        </CSPostHogProvider>
      </body>
    </html>
  );
}
