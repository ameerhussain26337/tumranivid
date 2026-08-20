
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  verification: {
    google: "eLYrIKS_bJQJW5EcBKLoITxGHtO27nRbCt1_wdcSHII",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),

  title: {
    default: "TumraniVid - Social Video Downloader",
    template: "%s | TumraniVid",
  },

  description:
    "TumraniVid is a fast and simple social video downloader for supported public Instagram, Facebook, TikTok and YouTube videos.",

  keywords: [
    "video downloader",
    "social video downloader",
    "Instagram video downloader",
    "Facebook video downloader",
    "TikTok video downloader",
    "YouTube video downloader",
    "download Instagram videos",
    "download Facebook videos",
    "download TikTok videos",
    "download YouTube videos",
    "TumraniVid",
  ],

  authors: [
    {
      name: "TumraniVid",
    },
  ],

  creator: "TumraniVid",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "TumraniVid - Social Video Downloader",
    description:
      "Fast and simple social video downloader for supported public videos.",
    type: "website",
    siteName: "TumraniVid",
  },

  twitter: {
    card: "summary_large_image",
    title: "TumraniVid - Social Video Downloader",
    description:
      "Fast and simple social video downloader for supported public videos.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
	<head>
  <script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6946299173054730"
    crossOrigin="anonymous"
  />
 </head>
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>

        <footer className="border-t bg-gray-50">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-600">
                © {new Date().getFullYear()} TumraniVid. All rights reserved.
              </p>

              <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
                <a
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  About
                </a>

                <a
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Contact
                </a>

                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Privacy Policy
                </a>

                <a
                  href="/terms"
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Terms
                </a>

                <a
                  href="/disclaimer"
                  className="text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Disclaimer
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
