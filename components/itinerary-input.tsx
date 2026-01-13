'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Plane, Loader2 } from 'lucide-react';
import { encodeTripToUrl } from '@/lib/url-encoding';

const PLACEHOLDER_TEXT = `27th- Travel from Hanoi to Sapa, stop by Sapa Stone Church and the Love Market
28th - Trek to Muong Hoa Valley, explore Y Linh Ho, Lao Chai, and Ta Van villages
29th - Cable car to Fansipan Mountain or Silver Waterfall and Love Waterfall
30th - Ninh Binh + caves Tour - overnight bus to Cao Bang
31st - Cao Bang → Ban Gioc Waterfall → Nguom Ngao Cave → Khuoi Ky Stone Village
1st - Phong Nam Valley → Eye of God Mountain → Return to Cao Bang, overnight to Hanoi
2nd - Hanoi
3rd - Hanoi (Lan Ha Bay if feeling adventurous)
4th - Hanoi - Departure`;

export function ItineraryInput() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter your itinerary');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (!data.success || !data.trip) {
        throw new Error(data.error || 'Failed to parse itinerary');
      }

      // Encode trip to URL and navigate
      const encoded = encodeTripToUrl(data.trip);
      router.push(`/trip#${encoded}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-3 justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg text-muted-foreground">Parsing your adventure...</span>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <div className="flex items-center justify-center">
          <img 
            src="/app-logo-zoom-in--t3chat--1.png" 
            alt="Trip Plotter Logo" 
            className="h-16 w-16"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Trip Plotter</h1>
        <p className="text-muted-foreground text-lg">
          Paste your itinerary and watch it come to life on an interactive map
        </p>
      </div>

      <div className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER_TEXT}
          className="min-h-[280px] resize-none font-mono text-sm leading-relaxed"
        />

        {error && (
          <div className="text-destructive text-sm bg-destructive/10 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <Button
          onClick={handleSubmit}
          size="lg"
          className="w-full text-lg h-12"
          disabled={!text.trim()}
        >
          <MapPin className="mr-2 h-5 w-5" />
          Plan My Trip
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Just describe your trip with dates, locations, and activities. 
        Our AI will extract everything and plot it on a map.
      </p>
    </div>
  );
}
