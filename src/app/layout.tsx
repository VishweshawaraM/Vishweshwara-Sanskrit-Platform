import type { Metadata, Viewport } from "next";

import { JsBootstrap } from "@/components/motion/js-bootstrap";

import "./globals.css";

/**
 * Root layout.
 *
 * The <html lang> is English; Sanskrit is marked per-element with lang="sa" so
 * that screen readers, search engines, and font selection all behave correctly.
 */

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Vishweshwara Sanskrit",
    template: "%s · Vishweshwara Sanskrit",
  },
  description:
    "A Digital Gurukula teaching Sanskrit, Krishna Yajurveda, Bhagavad Gītā, " +
    "Advaita Vedānta, and Stotras through the Guru–Śiṣya Paramparā.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#131211",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <JsBootstrap />
        {/* Preloaded because both faces are used above the fold on every page. */}
        <link
          rel="preload"
          href="/fonts/vishweshwara-serif-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/vishweshwara-devanagari-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
