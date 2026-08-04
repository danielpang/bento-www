import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteConfig.siteUrl,
  title: {
    default: "Bento | Orchestrate the whole build",
    template: "%s | Bento",
  },
  description:
    "Coordinate coding agents through every product stage, then step in only when your judgment is needed.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Bento | Orchestrate the whole build",
    description:
      "A command center for the agents building your product.",
    siteName: "Bento",
    type: "website",
    url: siteConfig.siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Bento | Orchestrate the whole build",
    description:
      "A command center for the agents building your product.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetBrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
