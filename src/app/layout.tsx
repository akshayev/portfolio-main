import type { Metadata } from "next";
import "./globals.css";
import { SplineBackground } from "@/components/canvas/SplineBackground";

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
    <html lang="en">
      <body className="bg-[#11172A] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {/*
         * SplineBackground: fixed -z-50 behind all content.
         * Wraps the Spline WebGL canvas + titanium vignette overlay.
         * Pointer events pass through to foreground interactive elements.
         */}
        <SplineBackground />
        {children}
      </body>
    </html>
  );
}
