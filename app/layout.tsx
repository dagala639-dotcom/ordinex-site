import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Ordinex | Hospitality & Fuel Operations Platform",
  description:
    "Modern POS and operations software for restaurants, bars, lounges, hotels, cafés, and fuel stations.",
  applicationName: "Ordinex",
  keywords: [
    "Ordinex",
    "POS Kenya",
    "Restaurant POS",
    "Bar POS",
    "Fuel Station POS",
    "Hospitality software",
    "Cashier POS",
    "Kitchen Display System",
    "Waiter tablets",
    "M-Pesa POS",
  ],
  authors: [{ name: "Ordinex" }],
  creator: "Ordinex",
  publisher: "Ordinex",
  icons: {
    icon: "/logo/ordinex-logo.jpeg",
    shortcut: "/logo/ordinex-logo.jpeg",
    apple: "/logo/ordinex-logo.jpeg",
  },
  openGraph: {
    title: "Ordinex | Hospitality & Fuel Operations Platform",
    description:
      "Modern POS and operations software for restaurants, bars, lounges, hotels, cafés, and fuel stations.",
    siteName: "Ordinex",
    images: [
      {
        url: "/logo/ordinex-logo.jpeg",
        width: 1200,
        height: 630,
        alt: "Ordinex Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ordinex | Hospitality & Fuel Operations Platform",
    description:
      "Modern POS and operations software for restaurants, bars, lounges, hotels, cafés, and fuel stations.",
    images: ["/logo/ordinex-logo.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}