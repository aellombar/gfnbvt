import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Baddie Casino",
  description: "An 18+ hands-free pacing game. Adults only.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0710",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
