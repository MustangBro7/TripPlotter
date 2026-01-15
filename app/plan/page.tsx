import { ItineraryInput } from "@/components/itinerary-input";
import {
  FeaturesSection,
  HowItWorksSection,
  UseCasesSection,
  FAQSection,
  CTASection,
  faqJsonLd,
} from "@/components/seo-sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Trip - Trip Plotter",
  description:
    "Create your travel itinerary with AI. Paste your trip details and watch them transform into an interactive map. Free trip planning tool.",
};

export default function PlanPage() {
  return (
    <div className="h-full overflow-auto">
      {/* FAQ Schema JSON-LD for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero Section with Itinerary Input */}
      <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,200,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,80,200,0.06),transparent_50%)]" />
        <div className="relative z-10">
          <ItineraryInput />
        </div>
      </main>

      {/* SEO Content Sections */}
      <FeaturesSection />
      <HowItWorksSection />
      <UseCasesSection />
      <FAQSection />
      <CTASection />

      {/* Footer with SEO keywords */}
      <footer className="py-12 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Trip Plotter</h3>
              <p className="text-sm text-muted-foreground">
                The free AI-powered trip planner and itinerary visualizer.
                Transform your travel plans into interactive maps instantly.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>AI Itinerary Parsing</li>
                <li>Interactive Trip Maps</li>
                <li>Route Visualization</li>
                <li>Trip Sharing</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Use Cases</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Vacation Planning</li>
                <li>Road Trip Routes</li>
                <li>Backpacking Trips</li>
                <li>Business Travel</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>
              Trip Plotter - AI Trip Planner | Itinerary Visualizer | Travel
              Route Mapper
            </p>
            <p className="mt-2">
              Plan your next adventure with the best free trip planning tool
              online.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
