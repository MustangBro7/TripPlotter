'use client';

import { useMemo, useState } from 'react';
import { format, parseISO, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Trip, TripLocation } from '@/lib/types';

interface CalendarViewProps {
  trip: Trip;
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
}

export function CalendarView({ trip, selectedLocationId, onLocationSelect }: CalendarViewProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  // Get all dates that have locations
  const locationsByDate = useMemo(() => {
    const map = new Map<string, TripLocation[]>();
    trip.locations.forEach((loc) => {
      if (loc.date) {
        const dateKey = loc.date;
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, loc]);
      }
    });
    return map;
  }, [trip.locations]);

  // Get the date range for the trip
  const tripDates = useMemo(() => {
    const dates = trip.locations
      .filter((loc) => loc.date)
      .map((loc) => parseISO(loc.date!));
    
    if (dates.length === 0) return [];
    
    dates.sort((a, b) => a.getTime() - b.getTime());
    
    return eachDayOfInterval({
      start: dates[0],
      end: dates[dates.length - 1],
    });
  }, [trip.locations]);

  // Find the selected date from selected location
  const selectedDate = useMemo(() => {
    if (!selectedLocationId) return undefined;
    const location = trip.locations.find((loc) => loc.id === selectedLocationId);
    return location?.date ? parseISO(location.date) : undefined;
  }, [selectedLocationId, trip.locations]);

  // Determine which dates have activities
  const modifiers = useMemo(() => {
    const hasActivity: Date[] = [];
    locationsByDate.forEach((_, dateKey) => {
      hasActivity.push(parseISO(dateKey));
    });
    return { hasActivity };
  }, [locationsByDate]);

  const modifiersStyles = {
    hasActivity: {
      backgroundColor: 'hsl(var(--primary) / 0.15)',
      borderRadius: '6px',
    },
  };

  return (
    <div className="space-y-3">
      {/* Header with toggle */}
      <button 
        className="flex items-center justify-between w-full text-left"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <h3 className="font-medium text-sm text-foreground">Trip Calendar</h3>
        {showCalendar ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {/* Collapsible Calendar */}
      {showCalendar && (
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return;
              const dateKey = format(date, 'yyyy-MM-dd');
              const locationsOnDate = locationsByDate.get(dateKey);
              if (locationsOnDate && locationsOnDate.length > 0) {
                onLocationSelect?.(locationsOnDate[0].id);
              }
            }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="!bg-transparent"
          />
        </div>
      )}

      {/* Trip Days - Always visible */}
      {tripDates.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Trip Days</h4>
          <div className="space-y-1">
            {tripDates.map((date) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const locationsOnDate = locationsByDate.get(dateKey) || [];
              const isSelected = selectedDate && isSameDay(date, selectedDate);

              return (
                <button
                  key={dateKey}
                  className={`w-full text-left text-xs p-2.5 rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    if (locationsOnDate.length > 0) {
                      onLocationSelect?.(locationsOnDate[0].id);
                    }
                  }}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold whitespace-nowrap">
                      {format(date, 'EEE, MMM d')}
                    </span>
                    {locationsOnDate.length > 0 && (
                      <span className={`truncate ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {locationsOnDate.map((l) => l.name).join(' → ')}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
