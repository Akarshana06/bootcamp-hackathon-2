import type { Metadata, Viewport } from "next";
import { GeistSans, GeistMono } from 'geist/font';
import "./globals.css";
import { cn } from "../lib/utils";

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CLINICAL Guide | Grounded SOP Safety Engine",
  description: "High-precision medical protocol assistant with zero-hallucination guardrails.",
  manifest: "/manifest.json",
  icons: {
    icon: "/shield-check.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(
      GeistSans.variable,
      GeistMono.variable,
      "scroll-smooth"
    )}>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        "text-foreground"
      )}>
        {children}
      </body>
    </html>
  );
}