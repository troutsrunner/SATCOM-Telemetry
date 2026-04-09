import { Satellite } from '@/types/satellite';

export async function fetchTLE(noradId: number): Promise<{ line1: string; line2: string }> {
  // For demo, using a sample TLE. In production, fetch from Celestrak
  // const response = await fetch(`${CELESTRAK_BASE_URL}?CATNR=${noradId}&FORMAT=TLE`);
  // const text = await response.text();
  // Parse the TLE...

  // Sample TLE for ISS (NORAD ID: 25544)
  if (noradId === 25544) {
    return {
      line1: '1 25544U 98067A   24092.50000000  .00000000  00000-0  00000-0 0  9999',
      line2: '2 25544  51.6400  12.3456 0001000 123.4567 236.7890 15.48900000123456'
    };
  }

  throw new Error('TLE not found for this satellite');
}

export async function fetchSatelliteCatalog(category?: string): Promise<Satellite[]> {
  // In production, fetch from Celestrak and parse
  // For demo, return sample data
  return [
    {
      name: 'ISS (ZARYA)',
      noradId: 25544,
      category: category || 'stations',
      tle: await fetchTLE(25544)
    }
  ];
}

export function isTLEValid(tle: { line1: string; line2: string }): boolean {
  // Basic validation
  return tle.line1.startsWith('1 ') && tle.line2.startsWith('2 ') &&
         tle.line1.length >= 69 && tle.line2.length >= 69;
}