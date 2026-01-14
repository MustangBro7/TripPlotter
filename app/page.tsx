import { ItineraryInput } from '@/components/itinerary-input';

export default function HomePage() {
  return (
    <main className="h-full min-h-full flex items-center justify-center p-6 overflow-auto bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,80,200,0.08),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(120,80,200,0.06),transparent_50%)]" />
      <div className="relative z-10">
        <ItineraryInput />
      </div>
    </main>
  );
}
