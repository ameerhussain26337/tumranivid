import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  );
}
