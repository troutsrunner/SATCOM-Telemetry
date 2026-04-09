import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@/lib/geolocation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    const result = await geocodeLocation(query.trim());
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Location not found',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 404 }
    );
  }
}