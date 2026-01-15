import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Map, Share2, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Trip Plotter - Visualize Your Trip on Interactive Maps",
  description:
    "Visualize your trip with beautiful interactive maps. Transform travel itineraries into stunning visual journeys with AI-powered trip visualization. Free, no signup required.",
  keywords: [
    "visualize trip",
    "trip visualization",
    "interactive trip map",
    "travel map visualization",
    "itinerary map",
    "visual trip planner",
    "trip map maker",
    "travel route visualization",
    "journey visualization",
    "AI trip visualizer",
  ],
  openGraph: {
    title: "Trip Plotter - Visualize Your Trip on Interactive Maps",
    description:
      "Visualize your trip with beautiful interactive maps. Transform travel itineraries into stunning visual journeys.",
    images: ["/hero-screenshot.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trip Plotter - Visualize Your Trip on Interactive Maps",
    description:
      "Visualize your trip with beautiful interactive maps. Transform travel itineraries into stunning visual journeys.",
    images: ["/hero-screenshot.png"],
  },
};

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Parsing",
    description:
      "Paste any itinerary format and watch AI extract locations instantly.",
  },
  {
    icon: Map,
    title: "Interactive Maps",
    description:
      "Beautiful, zoomable maps that bring your travel plans to life.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your visual itinerary with anyone via a simple link.",
  },
  {
    icon: Globe,
    title: "Works Worldwide",
    description: "Plan trips to any destination across the globe.",
  },
];

export default function LandingPage() {
  return (
    <div className="h-full overflow-y-auto overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/app-logo-zoom-in--t3chat--1.png"
              alt="Trip Plotter Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold">Trip Plotter</span>
          </div>
          <Link
            href="/plan"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Go to App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,200,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,80,200,0.1),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/app-logo-zoom-in--t3chat--1.png"
                alt="Trip Plotter"
                className="h-24 w-24 drop-shadow-2xl"
              />
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
              Visualize Your Trip with
              <span className="block text-primary">
                Beautiful Interactive Maps
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Transform any travel itinerary into a stunning visual journey.
              Powered by AI, designed for adventurers.
            </p>

            {/* CTA Button */}
            <Link
              href="/plan"
              className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
            >
              Let's Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>

            <p className="mt-4 text-sm text-muted-foreground">
              Free forever. No signup required.
            </p>
          </div>

          {/* Hero Screenshot */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-3xl -z-10" />
            <div className="relative rounded-lg overflow-hidden border border-border/50 shadow-2xl shadow-primary/10">
              <img
                src="/hero-screenshot.png"
                alt="Trip Plotter showing a Northern Vietnam adventure with 20 locations plotted on an interactive map"
                className="w-full h-auto"
              />
              {/* Overlay gradient at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to Plan Visually
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Trip Plotter combines AI intelligence with beautiful design to make
            trip planning effortless.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="p-6 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-medium text-muted-foreground mb-8">
            Join{" "}
            <span className="text-foreground font-bold">
              thousands of travelers
            </span>{" "}
            visualizing their adventures
          </p>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div>
              <p className="text-4xl font-bold text-primary">Free</p>
              <p className="text-sm text-muted-foreground">Forever</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">30s</p>
              <p className="text-sm text-muted-foreground">Avg. Time to Map</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">Global</p>
              <p className="text-sm text-muted-foreground">Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Visualize Your Next Adventure?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Paste your itinerary and watch it transform into a beautiful
            interactive map in seconds.
          </p>

          <Link
            href="/plan"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            Let's Get Started
            <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/app-logo-zoom-in--t3chat--1.png"
              alt="Trip Plotter"
              className="h-8 w-8"
            />
            <span className="font-semibold">Trip Plotter</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Visualize your trip with beautiful interactive maps. Free AI-powered
            trip planning.
          </p>
          <Link href="/plan" className="text-sm text-primary hover:underline">
            Open App
          </Link>
        </div>
      </footer>
    </div>
  );
}
