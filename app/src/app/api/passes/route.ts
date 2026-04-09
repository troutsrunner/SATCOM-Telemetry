import { NextRequest, NextResponse } from 'next/server';
import { parseTLE, predictPasses } from '@/lib/satellite';
import { fetchTLE } from '@/lib/tle';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const noradId = parseInt(searchParams.get('noradId') || '0');
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lon = parseFloat(searchParams.get('lon') || '0');
  const alt = parseFloat(searchParams.get('alt') || '0');
  const days = parseInt(searchParams.get('days') || '1');

  if (!noradId || isNaN(lat) || isNaN(lon)) {
    return NextResponse.json(
      { success: false, error: 'Invalid parameters' },
      { status: 400 }
    );
  }

  try {
    const tle = await fetchTLE(noradId);
    const satrec = parseTLE(tle);
    const observerPos = { latitude: lat, longitude: lon, altitude: alt };
    const passes = predictPasses(satrec, observerPos, new Date(), days);

    return NextResponse.json({
      success: true,
      data: {
        passes: passes.map(pass => ({
          startTime: pass.startTime.toISOString(),
          endTime: pass.endTime.toISOString(),
          maxElevation: pass.maxElevation,
          duration: pass.duration,
          azimuthAtMax: pass.azimuthAtMax
        }))
      }
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to predict passes' },
      { status: 500 }
    );
  }
}