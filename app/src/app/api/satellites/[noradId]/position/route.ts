import { NextRequest, NextResponse } from 'next/server';
import { parseTLE, getSatellitePosition, calculateObserverMetrics } from '@/lib/satellite';
import { fetchTLE } from '@/lib/tle';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const noradId = parseInt(searchParams.get('noradId') || '0');
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const alt = parseFloat(searchParams.get('alt') || '0');

  if (!noradId || isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 }
    );
  }

  try {
    const tle = await fetchTLE(noradId);
    const satrec = parseTLE(tle);
    const position = getSatellitePosition(satrec, new Date());
    const metrics = calculateObserverMetrics(position, { latitude: lat, longitude: lon, altitude: alt });

    return NextResponse.json({
      success: true,
      data: {
        position,
        metrics
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to calculate position' },
      { status: 500 }
    );
  }
}