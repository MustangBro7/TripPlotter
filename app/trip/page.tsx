'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTrip } from '@/hooks/use-trip';
import { TripMapWrapper } from '@/components/trip-map-wrapper';
import { TripSidebar } from '@/components/trip-sidebar';
import { ResizableSidebar } from '@/components/resizable-sidebar';
import { BottomSheet } from '@/components/bottom-sheet';
import { ShareButton } from '@/components/share-button';
import { ItineraryModal } from '@/components/itinerary-modal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function TripPage() {
  const {
    trip,
    isLoading,
    updateLocation,
    addLocation,
    removeLocation,
  } = useTrip();

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
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
    );
  }

  // No trip data
  if (!trip) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-md">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-2xl font-bold">No Trip Found</h1>
          <p className="text-muted-foreground">
            It looks like you haven&apos;t created a trip yet, or the link is invalid.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Create a New Trip
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Floating Header */}
        <header className="absolute top-0 left-0 right-0 z-20 p-3 pointer-events-none">
          <div className="flex items-center justify-between">
            <Link 
              href="/" 
              className="pointer-events-auto flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg border border-border/50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>

            <div className="pointer-events-auto flex items-center gap-2">
              <div className="bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50 flex">
                <ShareButton trip={trip} />
              </div>
              <div className="bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border/50">
                <ItineraryModal trip={trip} />
              </div>
            </div>
          </div>
        </header>

        {/* Full Screen Map */}
        <div className="flex-1">
          <TripMapWrapper
            trip={trip}
            selectedLocationId={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
          />
        </div>

        {/* Bottom Sheet */}
        <BottomSheet peekHeight={260} minHeight={72}>
          <TripSidebar
            trip={trip}
            selectedLocationId={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
            onLocationUpdate={updateLocation}
            onLocationDelete={removeLocation}
            onLocationAdd={addLocation}
            isMobile={true}
          />
        </BottomSheet>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-12 border-b border-border/50 flex items-center justify-between px-4 flex-shrink-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          
          <div className="h-4 w-px bg-border" />
          
          <h1 className="font-semibold text-sm truncate max-w-md">
            {trip.title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <ShareButton trip={trip} />
          <ItineraryModal trip={trip} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Resizable Sidebar */}
        <ResizableSidebar defaultWidth={360} minWidth={300} maxWidth={500}>
          <TripSidebar
            trip={trip}
            selectedLocationId={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
            onLocationUpdate={updateLocation}
            onLocationDelete={removeLocation}
            onLocationAdd={addLocation}
          />
        </ResizableSidebar>

        {/* Map */}
        <div className="flex-1 relative">
          <TripMapWrapper
            trip={trip}
            selectedLocationId={selectedLocationId}
            onLocationSelect={setSelectedLocationId}
          />
        </div>
      </div>
    </div>
  );
}
