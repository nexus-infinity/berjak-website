import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Burj | Tower of Trade",
  description:
    "Burj — a landmark in metals and minerals trading. Elevated structure, clear signal, measured execution since 1954.",
  keywords: [
    "metals trading",
    "minerals",
    "ferrous metals",
    "non-ferrous metals",
    "commodities",
    "Melbourne",
    "Australia",
  ],
  authors: [{ name: "Burj" }],
  openGraph: {
    title: "Burj | Tower of Trade",
    description:
      "A landmark in metals and minerals trading. Elevated structure, clear signal, measured execution.",
    type: "website",
    locale: "en_AU",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} bg-background`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
