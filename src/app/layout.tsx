import type { Metadata, Viewport } from "next";

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
  themeColor: "#faf7f0",
  colorScheme: "light",
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
