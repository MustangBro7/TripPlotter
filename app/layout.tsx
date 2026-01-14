import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Trip Plotter - Visualize Your Adventures",
  description: "Transform your travel itinerary into an interactive map. Plan, edit, and share your journey with ease.",
  keywords: ["travel", "itinerary", "map", "trip planner", "vacation"],
  icons: {
    icon: "/app-logo-zoom-in--t3chat--1.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Trip Plotter - Visualize Your Adventures",
    description: "Transform your travel itinerary into an interactive map. Plan, edit, and share your journey with ease.",
    images: ["/icon-512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Plotter - Visualize Your Adventures",
    description: "Transform your travel itinerary into an interactive map. Plan, edit, and share your journey with ease.",
    images: ["/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/app-logo-zoom-in--t3chat--1.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="theme-color" content="#6D28D9" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
