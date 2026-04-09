import { NextRequest, NextResponse } from 'next/server';
import { fetchSatelliteCatalog } from '@/lib/tle';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'stations';

  try {
    const satellites = await fetchSatelliteCatalog(category);
    return NextResponse.json({
      success: true,
      data: satellites
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch satellites' },
      { status: 500 }
    );
  }
}