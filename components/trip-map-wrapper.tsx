'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { Trip } from '@/lib/types';

// Dynamically import the map to avoid SSR issues with Leaflet
const TripMap = dynamic(
  () => import('./trip-map').then((mod) => mod.TripMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-muted/50">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
          <div className="flex gap-2 justify-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>
    ),
  }
);

interface TripMapWrapperProps {
  trip: Trip;
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
}

export function TripMapWrapper(props: TripMapWrapperProps) {
  return <TripMap {...props} />;
}
