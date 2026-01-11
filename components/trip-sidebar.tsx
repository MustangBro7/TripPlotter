'use client';

import { useMemo } from 'react';
import { LocationCard } from './location-card';
import { CalendarView } from './calendar-view';
import { AddLocationForm } from './add-location-form';
import type { Trip, TripLocation } from '@/lib/types';

interface TripSidebarProps {
  trip: Trip;
  selectedLocationId: string | null;
  onLocationSelect: (locationId: string) => void;
  onLocationUpdate: (locationId: string, updates: Partial<TripLocation>) => void;
  onLocationDelete: (locationId: string) => void;
  onLocationAdd: (location: Omit<TripLocation, 'id' | 'order'>) => void;
  isMobile?: boolean;
}

export function TripSidebar({
  trip,
  selectedLocationId,
  onLocationSelect,
  onLocationUpdate,
  onLocationDelete,
  onLocationAdd,
  isMobile = false,
}: TripSidebarProps) {
  const sortedLocations = useMemo(
    () => [...trip.locations].sort((a, b) => a.order - b.order),
    [trip.locations]
  );

  return (
    <div className={`h-full flex flex-col ${isMobile ? '' : 'border-r border-border/50'}`}>
      {/* Header */}
      <div className={`flex-shrink-0 ${isMobile ? 'px-5 pb-4' : 'p-5 border-b border-border/50'}`}>
        <h2 className="font-semibold text-base truncate">{trip.title}</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {trip.locations.length} location{trip.locations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className={`flex-1 overflow-y-auto overscroll-contain ${isMobile ? 'px-4' : 'px-4'}`}>
        <div className="space-y-6 pb-8">
          {/* Calendar View */}
          <section>
            <CalendarView
              trip={trip}
              selectedLocationId={selectedLocationId}
              onLocationSelect={onLocationSelect}
            />
          </section>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Locations List */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm text-foreground">Locations</h3>
              <span className="text-xs text-muted-foreground">{sortedLocations.length} stops</span>
            </div>

            <div className="space-y-2.5">
              {sortedLocations.map((location, index) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  index={index}
                  isSelected={selectedLocationId === location.id}
                  onSelect={() => onLocationSelect(location.id)}
                  onUpdate={(updates) => onLocationUpdate(location.id, updates)}
                  onDelete={() => onLocationDelete(location.id)}
                />
              ))}
            </div>

            <div className="pt-2">
              <AddLocationForm onAdd={onLocationAdd} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
