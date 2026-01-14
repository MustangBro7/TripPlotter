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
  metadataBase: new URL("https://tripplotter.app"),
  title: {
    default: "Trip Plotter - AI Trip Planner & Itinerary Visualizer",
    template: "%s | Trip Plotter",
  },
  description:
    "Free AI-powered trip planner that transforms your travel itinerary into an interactive map. Plan trips, visualize routes, and share your journey. Best tool for vacation planning and itinerary visualization.",
  keywords: [
    "trip planner",
    "AI trip planner",
    "itinerary planner",
    "travel planner",
    "trip planning app",
    "vacation planner",
    "route planner",
    "itinerary maker",
    "AI travel planner",
    "trip visualizer",
    "itinerary visualization",
    "travel itinerary",
    "trip map",
    "journey planner",
    "travel route map",
    "AI itinerary generator",
    "free trip planner",
    "trip planning tool",
    "vacation itinerary",
    "travel planning app",
    "road trip planner",
    "backpacking planner",
    "travel map maker",
    "trip route visualizer",
  ],
  authors: [{ name: "Trip Plotter" }],
  creator: "Trip Plotter",
  publisher: "Trip Plotter",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/app-logo-zoom-in--t3chat--1.png",
    apple: "/icon-192.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tripplotter.app",
    siteName: "Trip Plotter",
    title: "Trip Plotter - AI Trip Planner & Itinerary Visualizer",
    description:
      "Free AI-powered trip planner that transforms your travel itinerary into an interactive map. Plan trips, visualize routes, and share your journey.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Trip Plotter - AI Trip Planning Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Plotter - AI Trip Planner & Itinerary Visualizer",
    description:
      "Free AI-powered trip planner that transforms your travel itinerary into an interactive map. Plan trips, visualize routes, and share your journey.",
    images: ["/icon-512.png"],
    creator: "@tripplotter",
  },
  category: "Travel",
};

// JSON-LD Structured Data for rich search results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Trip Plotter",
  description:
    "AI-powered trip planner and itinerary visualizer that transforms your travel plans into interactive maps",
  url: "https://tripplotter.app",
  applicationCategory: "TravelApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "AI-powered itinerary parsing",
    "Interactive trip visualization",
    "Route mapping",
    "Share travel plans",
    "Mobile-friendly design",
  ],
  screenshot: "https://tripplotter.app/icon-512.png",
  author: {
    "@type": "Organization",
    name: "Trip Plotter",
    url: "https://tripplotter.app",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
