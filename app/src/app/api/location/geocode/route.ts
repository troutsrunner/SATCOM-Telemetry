import { NextRequest, NextResponse } from 'next/server';
import { geocodeLocation } from '@/lib/geolocation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { success: false, error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const result = await geocodeLocation(query);
    return NextResponse.json({
      success: true,
      data: result
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Location not found' },
      { status: 404 }
    );
  }
}