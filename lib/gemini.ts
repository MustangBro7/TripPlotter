import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Trip, TripLocation, TripConnection } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function parseItinerary(text: string): Promise<Trip> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `You are a travel itinerary parser. Parse the following travel itinerary and extract structured data.

For each location mentioned, provide:
1. The location name (be specific - include landmarks, cities, villages)
2. Approximate GPS coordinates (latitude and longitude) - you know the geography well
3. The date if mentioned (in YYYY-MM-DD format, assume current year 2026 if not specified)
4. Activities or things to do at that location

Also identify travel connections between consecutive locations.

Return ONLY valid JSON in this exact format, no markdown or explanation:
{
  "title": "Trip title based on destinations",
  "startDate": "YYYY-MM-DD or null",
  "locations": [
    {
      "id": "unique_id",
      "name": "Location Name",
      "lat": 21.0285,
      "lng": 105.8542,
      "date": "2026-01-27",
      "activities": ["activity1", "activity2"],
      "order": 0
    }
  ],
  "connections": [
    {
      "fromId": "location_id_1",
      "toId": "location_id_2",
      "travelMode": "bus"
    }
  ]
}

Travel modes can be: bus, train, car, walk, cable-car, flight, boat

Here is the itinerary to parse:

${text}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  // Extract JSON from response (handle potential markdown wrapping)
  let jsonStr = response;
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }
  
  // Clean up the response
  jsonStr = jsonStr.trim();
  
  const parsed = JSON.parse(jsonStr) as Trip;
  
  // Validate and ensure all required fields exist
  if (!parsed.locations || !Array.isArray(parsed.locations)) {
    throw new Error('Invalid response: missing locations array');
  }
  
  // Ensure all locations have required fields
  parsed.locations = parsed.locations.map((loc, idx) => ({
    id: loc.id || `loc_${idx}`,
    name: loc.name || 'Unknown Location',
    lat: typeof loc.lat === 'number' ? loc.lat : 0,
    lng: typeof loc.lng === 'number' ? loc.lng : 0,
    date: loc.date || undefined,
    activities: Array.isArray(loc.activities) ? loc.activities : [],
    order: typeof loc.order === 'number' ? loc.order : idx,
  }));
  
  parsed.connections = parsed.connections || [];
  parsed.title = parsed.title || 'My Trip';
  
  return parsed;
}

export async function generateNaturalLanguageItinerary(trip: Trip): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  // Sort locations by order
  const sortedLocations = [...trip.locations].sort((a, b) => a.order - b.order);
  
  // Build context for the AI
  const locationDetails = sortedLocations.map((loc, idx) => {
    const dateStr = loc.date ? `(${loc.date})` : '';
    const activities = loc.activities.length > 0 
      ? `Activities: ${loc.activities.join(', ')}`
      : '';
    return `${idx + 1}. ${loc.name} ${dateStr}\n   ${activities}`;
  }).join('\n');

  const prompt = `You are a travel writer creating a beautiful, engaging itinerary description. 
Based on the following trip data, write a natural language itinerary that:
1. Is well-organized by day/date
2. Includes helpful travel tips and suggestions
3. Captures the essence and excitement of each destination
4. Uses engaging, vivid language
5. Includes practical information like what to expect

Trip: ${trip.title}
Start Date: ${trip.startDate || 'Flexible'}

Locations and Activities:
${locationDetails}

Write the complete itinerary in a friendly, informative tone. Use markdown formatting for headers and lists.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
