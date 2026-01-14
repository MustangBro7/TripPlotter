'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Trip, TripLocation, TripConnection } from '@/lib/types';
import { getTripFromHash, updateUrlHash, generateId } from '@/lib/url-encoding';

export function useTrip() {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);
  const skipNextUrlUpdate = useRef(false);

  // Load trip from URL hash on mount
  useEffect(() => {
    const tripFromUrl = getTripFromHash();
    setTrip(tripFromUrl);
    setIsLoading(false);
    isInitialLoad.current = false;

    // Listen for hash changes (back/forward navigation)
    const handleHashChange = () => {
      skipNextUrlUpdate.current = true;
      const newTrip = getTripFromHash();
      setTrip(newTrip);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync URL when trip changes (outside of render)
  useEffect(() => {
    if (isInitialLoad.current || !trip) return;
    
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false;
      return;
    }

    updateUrlHash(trip);
  }, [trip]);

  const updateTrip = useCallback((updater: (prev: Trip) => Trip) => {
    setTrip((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  }, []);

  const setTripDirect = useCallback((newTrip: Trip) => {
    setTrip(newTrip);
  }, []);

  // Helper function to sort locations by date and rebuild connections
  const sortLocationsByDate = useCallback((locations: TripLocation[]): { locations: TripLocation[]; connections: TripConnection[] } => {
    // Separate locations with and without dates
    const withDates = locations.filter(loc => loc.date);
    const withoutDates = locations.filter(loc => !loc.date);

    // Sort locations with dates by date (earliest first)
    const sortedWithDates = [...withDates].sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return a.date.localeCompare(b.date);
    });

    // Maintain relative order for locations without dates (by current order)
    const sortedWithoutDates = [...withoutDates].sort((a, b) => a.order - b.order);

    // Combine: dated locations first, then undated locations
    const sorted = [...sortedWithDates, ...sortedWithoutDates];

    // Reassign order values
    const reordered = sorted.map((loc, idx) => ({ ...loc, order: idx }));

    // Rebuild connections based on new order
    const newConnections: TripConnection[] = [];
    for (let i = 0; i < reordered.length - 1; i++) {
      newConnections.push({
        fromId: reordered[i].id,
        toId: reordered[i + 1].id,
      });
    }

    return { locations: reordered, connections: newConnections };
  }, []);

  const updateLocation = useCallback((locationId: string, updates: Partial<TripLocation>) => {
    updateTrip((prev) => {
      // Update the location
      const updatedLocations = prev.locations.map((loc) =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      );

      // If date was updated (set or removed), reorder by date
      if ('date' in updates) {
        const { locations: sortedLocations, connections: newConnections } = sortLocationsByDate(updatedLocations);
        return {
          ...prev,
          locations: sortedLocations,
          connections: newConnections,
        };
      }

      return {
        ...prev,
        locations: updatedLocations,
      };
    });
  }, [updateTrip, sortLocationsByDate]);

  const addLocation = useCallback((location: Omit<TripLocation, 'id' | 'order'>) => {
    updateTrip((prev) => {
      const newOrder = prev.locations.length > 0
        ? Math.max(...prev.locations.map((l) => l.order)) + 1
        : 0;
      
      const newLocation: TripLocation = {
        ...location,
        id: generateId(),
        order: newOrder,
      };

      // Add the new location to the list
      const updatedLocations = [...prev.locations, newLocation];

      // If the new location has a date, reorder all locations by date
      if (location.date) {
        const { locations: sortedLocations, connections: newConnections } = sortLocationsByDate(updatedLocations);
        return {
          ...prev,
          locations: sortedLocations,
          connections: newConnections,
        };
      }

      // If no date, add to end and create connection from last location
      const newConnections = [...prev.connections];
      if (prev.locations.length > 0) {
        const lastLocation = prev.locations.reduce((a, b) => 
          a.order > b.order ? a : b
        );
        newConnections.push({
          fromId: lastLocation.id,
          toId: newLocation.id,
        });
      }

      return {
        ...prev,
        locations: updatedLocations,
        connections: newConnections,
      };
    });
  }, [updateTrip, sortLocationsByDate]);

  const removeLocation = useCallback((locationId: string) => {
    updateTrip((prev) => ({
      ...prev,
      locations: prev.locations.filter((loc) => loc.id !== locationId),
      connections: prev.connections.filter(
        (conn) => conn.fromId !== locationId && conn.toId !== locationId
      ),
    }));
  }, [updateTrip]);

  const reorderLocations = useCallback((fromIndex: number, toIndex: number) => {
    updateTrip((prev) => {
      const sorted = [...prev.locations].sort((a, b) => a.order - b.order);
      const [moved] = sorted.splice(fromIndex, 1);
      sorted.splice(toIndex, 0, moved);
      
      // Reassign order values
      const reordered = sorted.map((loc, idx) => ({ ...loc, order: idx }));
      
      // Rebuild connections based on new order
      const newConnections: TripConnection[] = [];
      for (let i = 0; i < reordered.length - 1; i++) {
        newConnections.push({
          fromId: reordered[i].id,
          toId: reordered[i + 1].id,
        });
      }
      
      return {
        ...prev,
        locations: reordered,
        connections: newConnections,
      };
    });
  }, [updateTrip]);

  const updateTripTitle = useCallback((title: string) => {
    updateTrip((prev) => ({ ...prev, title }));
  }, [updateTrip]);

  return {
    trip,
    isLoading,
    setTrip: setTripDirect,
    updateTrip,
    updateLocation,
    addLocation,
    removeLocation,
    reorderLocations,
    updateTripTitle,
  };
}
