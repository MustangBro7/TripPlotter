'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Trip, TripLocation } from '@/lib/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
const createNumberedIcon = (number: number, isSelected: boolean = false) => {
  const size = isSelected ? 36 : 30;
  const bgColor = isSelected ? '#7c3aed' : '#6366f1';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: ${bgColor};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${isSelected ? '14px' : '12px'};
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transform: translate(-50%, -50%);
      ">
        ${number}
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Component to fit map bounds to markers
function FitBounds({ locations }: { locations: TripLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (locations.length === 0) return;

    const bounds = L.latLngBounds(
      locations.map((loc) => [loc.lat, loc.lng] as L.LatLngTuple)
    );
    
    map.fitBounds(bounds, { 
      padding: [50, 50],
      maxZoom: 12 
    });
  }, [map, locations]);

  return null;
}

interface TripMapProps {
  trip: Trip;
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
}

export function TripMap({ trip, selectedLocationId, onLocationSelect }: TripMapProps) {
  // Sort locations by order
  const sortedLocations = useMemo(
    () => [...trip.locations].sort((a, b) => a.order - b.order),
    [trip.locations]
  );

  // Create polyline coordinates
  const routeCoordinates = useMemo(
    () => sortedLocations.map((loc) => [loc.lat, loc.lng] as L.LatLngTuple),
    [sortedLocations]
  );

  // Default center (Vietnam)
  const defaultCenter: L.LatLngTuple = [21.0285, 105.8542];
  const center = sortedLocations.length > 0 
    ? [sortedLocations[0].lat, sortedLocations[0].lng] as L.LatLngTuple
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={7}
      className="h-full w-full"
      style={{ background: '#1a1a2e' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      <FitBounds locations={sortedLocations} />
      
      {/* Route polyline */}
      {routeCoordinates.length > 1 && (
        <Polyline
          positions={routeCoordinates}
          pathOptions={{
            color: '#a855f7',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
          }}
        />
      )}

      {/* Location markers */}
      {sortedLocations.map((location, index) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={createNumberedIcon(index + 1, selectedLocationId === location.id)}
          eventHandlers={{
            click: () => onLocationSelect?.(location.id),
          }}
        >
          <Popup>
            <div className="min-w-[180px]">
              <h3 className="font-semibold text-base mb-1">{location.name}</h3>
              {location.date && (
                <p className="text-sm text-gray-600 mb-2">{location.date}</p>
              )}
              {location.activities.length > 0 && (
                <ul className="text-sm list-disc list-inside">
                  {location.activities.slice(0, 3).map((activity, i) => (
                    <li key={i} className="truncate">{activity}</li>
                  ))}
                  {location.activities.length > 3 && (
                    <li className="text-gray-500">+{location.activities.length - 3} more</li>
                  )}
                </ul>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
