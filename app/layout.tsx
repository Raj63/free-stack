import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Free Tier Stack Builder — Production-Ready Infrastructure for $0",
  description:
    "Curated free-tier stacks for SaaS, AI apps, and startups. Explore the best free infrastructure for hosting, databases, auth, analytics, security, and more.",
  keywords: [
    "free tier",
    "infrastructure",
    "SaaS stack",
    "startup stack",
    "cloud infrastructure",
    "serverless",
    "dev tools",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
