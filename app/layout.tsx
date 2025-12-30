import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Technical medical fonts
const geistSans = Geist({
  variable: "--font-geist-sans",  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#10b981", // Emerald 500
  width: "device-width",  initialScale: 1,
};

export const metadata: Metadata = {
  title: "CLINICAL GUARD v2.0 | Grounded SOP Safety Engine",
  description: "High-precision medical protocol assistant with zero-hallucination guardrails.",
  manifest: "/manifest.json",
  icons: {
    icon: "/shield-check.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="selection:bg-emerald-500/30 selection:text-emerald-900">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased font-sans bg-[#fcfdfe] text-slate-900",
          "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-emerald-500/20"
        )}
      >
        {/* Futuristic Clinical Background Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Subtle Precision Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          
          {/* Medical Light Glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-400/5 blur-[150px] rounded-full" />
        </div>

        {/* Clinical Scanline Effect (Subtle) */}
        <div className="fixed inset-0 -z-5 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

        {/* Main Content Wrapper */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>

        {/* Global Safety Footer */}
        <footer className="fixed bottom-4 right-8 z-50 pointer-events-none">
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md border border-slate-200/50 px-4 py-2 rounded-2xl shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Security Protocol</span>
              <span className="text-[10px] font-mono font-bold text-emerald-600">AES-256 Grounding Active</span>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}