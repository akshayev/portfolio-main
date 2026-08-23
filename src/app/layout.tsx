import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SplineBackground } from "@/components/canvas/SplineBackground";

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
  title: "Titanium & Emerald Spatial UI Portfolio",
  description:
    "Executive Spatial UI Portfolio featuring Titanium glassmorphism & Emerald highlights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#11172A] text-slate-100 antialiased font-sans selection:bg-emerald-500 selection:text-slate-950">
        {/*
         * SplineBackground: fixed -z-50 behind all content.
         * Internally uses next/dynamic (ssr: false) — the Spline WebGL runtime
         * is excluded from the SSR bundle and deferred until client hydration,
         * ensuring it never blocks FCP of the ExecutiveBar.
         */}
        <SplineBackground />
        {children}
      </body>
    </html>
  );
}
