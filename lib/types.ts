export interface TripLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  date?: string; // ISO date string (YYYY-MM-DD)
  activities: string[];
  order: number;
}

export interface TripConnection {
  fromId: string;
  toId: string;
  travelMode?: 'bus' | 'train' | 'car' | 'walk' | 'cable-car' | 'flight' | 'boat';
}

export interface Trip {
  title: string;
  startDate?: string;
  locations: TripLocation[];
  connections: TripConnection[];
}

export interface ParsedItineraryResponse {
  success: boolean;
  trip?: Trip;
  error?: string;
}

export interface GenerateItineraryResponse {
  success: boolean;
  itinerary?: string;
  error?: string;
}
