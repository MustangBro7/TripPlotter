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

  const updateLocation = useCallback((locationId: string, updates: Partial<TripLocation>) => {
    updateTrip((prev) => ({
      ...prev,
      locations: prev.locations.map((loc) =>
        loc.id === locationId ? { ...loc, ...updates } : loc
      ),
    }));
  }, [updateTrip]);

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

      // Create connection from last location to new one
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
        locations: [...prev.locations, newLocation],
        connections: newConnections,
      };
    });
  }, [updateTrip]);

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
