import type { Metadata, Viewport } from "next";
import { Anton, Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/** Heavy condensed display type — headlines are meant to feel printed. */
const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

/** Angular body face; reads like Japanese equipment UI. */
const body = Chakra_Petch({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/** Everything numeric: timecodes, BPM, chip counts, save codes. */
const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BADDIE CASINO — after hours",
  description: "An 18+ hands-free pacing game. Adults only.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-dvh antialiased`}
      >
        {children}
        {/* Analog artefacts sit above everything and ignore pointer events. */}
        <div aria-hidden className="grain" />
        <div aria-hidden className="scanlines" />
      </body>
    </html>
  );
}
