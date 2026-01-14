import {
  Sparkles,
  Map,
  Share2,
  Zap,
  Globe,
  Clock,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Itinerary Parsing",
    description:
      "Simply paste your travel plans in any format. Our AI instantly extracts locations, dates, and activities to build your trip.",
  },
  {
    icon: Map,
    title: "Interactive Trip Visualization",
    description:
      "See your entire journey on a beautiful interactive map. Visualize routes, distances, and the flow of your adventure.",
  },
  {
    icon: Share2,
    title: "Easy Trip Sharing",
    description:
      "Share your itinerary with travel companions via a simple link. Everyone stays on the same page, literally.",
  },
  {
    icon: Zap,
    title: "Instant Route Planning",
    description:
      "From vacation planning to road trips, get your route mapped out in seconds. No manual pin dropping required.",
  },
  {
    icon: Globe,
    title: "Works Worldwide",
    description:
      "Plan trips anywhere in the world. Our AI understands locations globally, from major cities to hidden gems.",
  },
  {
    icon: Clock,
    title: "Save Hours of Planning",
    description:
      "Stop switching between tabs and apps. Transform any itinerary into a visual map in under 30 seconds.",
  },
];

const steps = [
  {
    step: "01",
    title: "Paste Your Itinerary",
    description:
      "Copy your travel plans from emails, notes, or anywhere else. Our AI trip planner accepts any format—dates, bullet points, paragraphs, you name it.",
  },
  {
    step: "02",
    title: "AI Extracts Everything",
    description:
      "Our itinerary parser uses advanced AI to identify locations, dates, times, and activities. It understands context and handles messy formats gracefully.",
  },
  {
    step: "03",
    title: "Visualize on Interactive Map",
    description:
      "Watch your trip come to life on an interactive map. See your route, edit locations, add stops, and perfect your travel itinerary visually.",
  },
  {
    step: "04",
    title: "Share & Collaborate",
    description:
      "Generate a shareable link for your travel companions. Everyone can view the trip visualization and stay coordinated throughout the journey.",
  },
];

const useCases = [
  {
    title: "Vacation Planning",
    description:
      "Planning a family vacation or romantic getaway? Visualize your itinerary to ensure you're not backtracking and maximize your time at each destination.",
  },
  {
    title: "Road Trip Routes",
    description:
      "Map out your road trip stops, see the full route at a glance, and discover if you're missing any must-see attractions along the way.",
  },
  {
    title: "Backpacking Adventures",
    description:
      "Perfect for multi-city backpacking trips. Keep track of hostels, landmarks, and travel days across countries and continents.",
  },
  {
    title: "Business Travel",
    description:
      "Visualize meeting locations, hotel stays, and airport connections. Share with colleagues or assistants for seamless coordination.",
  },
  {
    title: "Group Travel Coordination",
    description:
      "Planning a trip with friends? Share the visual itinerary so everyone knows the plan. No more endless group chat confusion.",
  },
  {
    title: "Travel Content Creation",
    description:
      "Bloggers and content creators can showcase their journey visually. Perfect for travel vlogs, blog posts, and social media.",
  },
];

const faqs = [
  {
    question: "How does the AI trip planner work?",
    answer:
      "Simply paste your travel itinerary in any format—text, bullet points, paragraphs, or even copied from emails. Our AI analyzes the content, extracts locations, dates, and activities, then plots everything on an interactive map automatically.",
  },
  {
    question: "Is Trip Plotter free to use?",
    answer:
      "Yes! Trip Plotter is completely free. You can create unlimited trip visualizations, share them with anyone, and access all features without any cost or account required.",
  },
  {
    question: "What formats does the itinerary parser support?",
    answer:
      "Our AI is flexible and understands most formats: numbered lists, bullet points, paragraphs, travel agency itineraries, copied emails, notes apps content, and more. Just paste and let the AI handle the rest.",
  },
  {
    question: "Can I edit the trip after it's created?",
    answer:
      "Absolutely! Once your trip is visualized, you can edit location names, adjust dates, add new stops, remove locations, and reorder your itinerary directly on the map interface.",
  },
  {
    question: "How do I share my trip with others?",
    answer:
      "Click the share button to generate a unique link to your trip. Anyone with the link can view your itinerary visualization—no account needed. Perfect for sharing with travel companions.",
  },
  {
    question: "Does Trip Plotter work for international travel?",
    answer:
      "Yes! Trip Plotter works worldwide. Our AI recognizes locations globally, from major international cities to small towns, landmarks, hotels, restaurants, and points of interest in any country.",
  },
  {
    question: "Is my travel data private and secure?",
    answer:
      "Your trip data is encoded directly in the URL—we don't store your itineraries on any server. Only people with your specific link can see your trip, and you control who you share it with.",
  },
  {
    question: "Can I use Trip Plotter on mobile devices?",
    answer:
      "Yes! Trip Plotter is fully responsive and works great on phones and tablets. You can even add it to your home screen for app-like access. Plan and view your trips on any device.",
  },
];

// JSON-LD for FAQ rich snippets
export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export function FeaturesSection() {
  return (
    <section className="py-20 px-6" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Why Choose Our AI Trip Planner?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The smartest way to visualize and plan your travel itinerary.
            Powered by AI, designed for travelers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group p-6 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section
      className="py-20 px-6 bg-muted/30"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            How Trip Plotter Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From messy travel notes to beautiful interactive maps in seconds.
            No sign-up required.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <article
              key={step.step}
              className="flex gap-6 items-start p-6 rounded-lg bg-card/50 border border-border/50"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {step.step}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCasesSection() {
  return (
    <section className="py-20 px-6" aria-labelledby="use-cases-heading">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="use-cases-heading"
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Perfect for Every Type of Trip
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Whether you're planning a weekend getaway or a multi-month adventure,
            Trip Plotter helps you visualize your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <article
              key={useCase.title}
              className="p-6 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <h3 className="text-lg font-semibold mb-2">{useCase.title}</h3>
              <p className="text-muted-foreground text-sm">
                {useCase.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section
      className="py-20 px-6 bg-muted/30"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our AI trip planner and itinerary
            visualizer.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group p-6 rounded-lg border border-border/50 bg-card/50 hover:border-primary/30 transition-colors"
            >
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                <ChevronDown className="h-5 w-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
              </summary>
              <p className="mt-4 text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 px-6" aria-labelledby="cta-heading">
      <div className="max-w-3xl mx-auto text-center">
        <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Visualize Your Next Adventure?
        </h2>
        <p className="text-muted-foreground text-lg mb-8">
          Join thousands of travelers who use Trip Plotter to plan and share
          their journeys. Free forever, no account required.
        </p>
        <p className="text-sm text-muted-foreground">
          Scroll up and paste your itinerary to get started instantly.
        </p>
      </div>
    </section>
  );
}
