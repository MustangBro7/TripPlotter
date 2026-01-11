import { NextRequest, NextResponse } from 'next/server';
import { parseItinerary } from '@/lib/gemini';
import type { ParsedItineraryResponse } from '@/lib/types';

export async function POST(request: NextRequest): Promise<NextResponse<ParsedItineraryResponse>> {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid itinerary text' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const trip = await parseItinerary(text);
    
    return NextResponse.json({ success: true, trip });
  } catch (error) {
    console.error('Error parsing itinerary:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to parse itinerary' 
      },
      { status: 500 }
    );
  }
}
