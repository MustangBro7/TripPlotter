'use client';

import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Trip, TripLocation } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';

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

// Component to handle opening popups when selection changes
function PopupController({ 
  selectedLocationId, 
  markerRefs 
}: { 
  selectedLocationId?: string | null; 
  markerRefs: React.MutableRefObject<Map<string, L.Marker>>; 
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedLocationId) {
      const marker = markerRefs.current.get(selectedLocationId);
      if (marker) {
        marker.openPopup();
        // Optionally pan to the marker
        const latlng = marker.getLatLng();
        map.panTo(latlng, { animate: true, duration: 0.5 });
      }
    }
  }, [selectedLocationId, markerRefs, map]);

  return null;
}

// Custom popup content component
function PopupContent({ location, index }: { location: TripLocation; index: number }) {
  return (
    <div className="min-w-[220px] p-4">
      {/* Header with number badge and name */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight">{location.name}</h3>
          {location.date && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(parseISO(location.date), 'EEE, MMM d, yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Activities */}
      {location.activities.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activities</p>
          <div className="flex flex-wrap gap-1">
            {location.activities.slice(0, 4).map((activity, i) => (
              <span 
                key={i} 
                className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded"
              >
                {activity}
              </span>
            ))}
            {location.activities.length > 4 && (
              <span className="text-xs text-muted-foreground px-1">
                +{location.activities.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface TripMapProps {
  trip: Trip;
  selectedLocationId?: string | null;
  onLocationSelect?: (locationId: string) => void;
}

export function TripMap({ trip, selectedLocationId, onLocationSelect }: TripMapProps) {
  // Store marker refs for programmatic popup opening
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

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

  // Create a location-to-index map
  const locationIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    sortedLocations.forEach((loc, idx) => map.set(loc.id, idx));
    return map;
  }, [sortedLocations]);

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
      <PopupController selectedLocationId={selectedLocationId} markerRefs={markerRefs} />
      
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
          ref={(marker) => {
            if (marker) {
              markerRefs.current.set(location.id, marker);
            } else {
              markerRefs.current.delete(location.id);
            }
          }}
        >
          <Popup>
            <PopupContent location={location} index={locationIndexMap.get(location.id) ?? index} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
