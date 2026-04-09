import { NextRequest, NextResponse } from 'next/server';
import { fetchSatelliteCatalog } from '@/lib/tle';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'stations';

    const satellites = await fetchSatelliteCatalog(category);

    return NextResponse.json({
      success: true,
      data: satellites,
      count: satellites.length
    });
  } catch (error) {
    console.error('Error fetching satellites:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch satellites',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}