'use client';

import { useState, useCallback } from 'react';
import type { Trip } from '@/lib/types';

function hashTrip(trip: Trip): string {
  // Create a simple hash of the trip data for caching
  const str = JSON.stringify({
    locations: trip.locations.map((l) => ({
      name: l.name,
      date: l.date,
      activities: l.activities,
    })),
  });
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `itinerary_${hash}`;
}

export function useItineraryCache() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<string | null>(null);

  const getCachedItinerary = useCallback((trip: Trip): string | null => {
    if (typeof window === 'undefined') return null;
    const key = hashTrip(trip);
    return sessionStorage.getItem(key);
  }, []);

  const cacheItinerary = useCallback((trip: Trip, itinerary: string): void => {
    if (typeof window === 'undefined') return;
    const key = hashTrip(trip);
    sessionStorage.setItem(key, itinerary);
  }, []);

  const generateItinerary = useCallback(async (trip: Trip): Promise<string> => {
    // Check cache first
    const cached = getCachedItinerary(trip);
    if (cached) {
      setGeneratedItinerary(cached);
      return cached;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip }),
      });

      const data = await response.json();
      
      if (!data.success || !data.itinerary) {
        throw new Error(data.error || 'Failed to generate itinerary');
      }

      // Cache the result
      cacheItinerary(trip, data.itinerary);
      setGeneratedItinerary(data.itinerary);
      return data.itinerary;
    } finally {
      setIsGenerating(false);
    }
  }, [getCachedItinerary, cacheItinerary]);

  const clearCache = useCallback((trip: Trip): void => {
    if (typeof window === 'undefined') return;
    const key = hashTrip(trip);
    sessionStorage.removeItem(key);
    setGeneratedItinerary(null);
  }, []);

  return {
    isGenerating,
    generatedItinerary,
    generateItinerary,
    clearCache,
  };
}
