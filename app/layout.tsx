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
        {/* Viewport with safe area coverage */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
        
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/app-logo-zoom-in--t3chat--1.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        
        {/* Theme colors - dark to match app */}
        <meta name="theme-color" content="#1a1a1f" />
        <meta name="msapplication-navbutton-color" content="#1a1a1f" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* PWA capable flags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Trip Plotter" />
        
        {/* Prevent zoom on input focus (iOS) */}
        <meta name="format-detection" content="telephone=no" />
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
