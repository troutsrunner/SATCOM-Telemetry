import { NextRequest, NextResponse } from 'next/server';
import { parseTLE, getSatellitePosition, calculateObserverMetrics } from '@/lib/satellite';
import { fetchTLE } from '@/lib/tle';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const noradIdParam = searchParams.get('noradId');
    const latParam = searchParams.get('lat');
    const lonParam = searchParams.get('lon');
    const altParam = searchParams.get('alt');

    const noradId = noradIdParam ? parseInt(noradIdParam) : null;
    const lat = latParam ? parseFloat(latParam) : null;
    const lon = lonParam ? parseFloat(lonParam) : null;
    const alt = altParam ? parseFloat(altParam) : 0;

    if (!noradId || isNaN(noradId) || noradId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid NORAD ID is required' },
        { status: 400 }
      );
    }

    if (lat === null || isNaN(lat) || lat < -90 || lat > 90) {
      return NextResponse.json(
        { success: false, error: 'Valid latitude (-90 to 90) is required' },
        { status: 400 }
      );
    }

    if (lon === null || isNaN(lon) || lon < -180 || lon > 180) {
      return NextResponse.json(
        { success: false, error: 'Valid longitude (-180 to 180) is required' },
        { status: 400 }
      );
    }

    const tle = await fetchTLE(noradId);
    const satrec = parseTLE(tle);
    const position = getSatellitePosition(satrec, new Date());
    const metrics = calculateObserverMetrics(position, { latitude: lat, longitude: lon, altitude: alt });

    return NextResponse.json({
      success: true,
      data: {
        position,
        metrics,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error calculating satellite position:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate position',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}