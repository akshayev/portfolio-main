import type { Metadata } from "next";
import "./globals.css";
import { LiquidBackground } from "@/components/canvas/LiquidBackground";

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
        {/* Fixed fluid background — rendered behind everything */}
        <LiquidBackground />
        {children}
      </body>
    </html>
  );
}
