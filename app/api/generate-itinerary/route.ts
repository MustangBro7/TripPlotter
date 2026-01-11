import { NextRequest, NextResponse } from 'next/server';
import { generateNaturalLanguageItinerary } from '@/lib/gemini';
import type { Trip, GenerateItineraryResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<GenerateItineraryResponse>> {
  try {
    const body = await request.json();
    const { trip } = body as { trip: Trip };

    if (!trip || !trip.locations) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid trip data' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const itinerary = await generateNaturalLanguageItinerary(trip);
    
    return NextResponse.json({ success: true, itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate itinerary' 
      },
      { status: 500 }
    );
  }
}
