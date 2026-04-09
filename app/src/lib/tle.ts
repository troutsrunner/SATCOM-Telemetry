import { Satellite } from '@/types/satellite';

const CELESTRAK_BASE_URL = 'https://celestrak.org/NORAD/elements/gp.php';

// Simple in-memory cache for TLE data
const tleCache = new Map<number, { tle: { line1: string; line2: string }; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export async function fetchTLE(noradId: number): Promise<{ line1: string; line2: string }> {
  // Check cache first
  const cached = tleCache.get(noradId);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.tle;
  }

  try {
    const response = await fetch(`${CELESTRAK_BASE_URL}?CATNR=${noradId}&FORMAT=TLE`);
    if (!response.ok) {
      throw new Error(`Failed to fetch TLE for NORAD ID ${noradId}`);
    }
    const text = await response.text();
    const lines = text.trim().split('\n');

    if (lines.length < 3) {
      throw new Error('Invalid TLE format');
    }

    // Skip the name line and get TLE lines
    const line1 = lines[lines.length - 2].trim();
    const line2 = lines[lines.length - 1].trim();

    const tle = { line1, line2 };

    // Cache the result
    tleCache.set(noradId, { tle, timestamp: Date.now() });

    return tle;
  } catch (error) {
    console.error('Error fetching TLE:', error);
    // Fallback to sample TLE for ISS if API fails
    if (noradId === 25544) {
      const tle = {
        line1: '1 25544U 98067A   24092.50000000  .00000000  00000-0  00000-0 0  9999',
        line2: '2 25544  51.6400  12.3456 0001000 123.4567 236.7890 15.48900000123456'
      };
      tleCache.set(noradId, { tle, timestamp: Date.now() });
      return tle;
    }
    throw error;
  }
}

export async function fetchSatelliteCatalog(category?: string): Promise<Satellite[]> {
  try {
    // Map categories to Celestrak file names
    const categoryMap: { [key: string]: string } = {
      'stations': 'stations.txt',
      'active': 'active.txt',
      'weather': 'weather.txt',
      'noaa': 'noaa.txt',
      'goes': 'goes.txt',
      'resource': 'resource.txt',
      'sarsat': 'sarsat.txt',
      'dmc': 'dmc.txt',
      'tdrss': 'tdrss.txt',
      'argos': 'argos.txt',
      'geo': 'geo.txt',
      'intelsat': 'intelsat.txt',
      'ses': 'ses.txt',
      'iridium': 'iridium.txt',
      'orbcomm': 'orbcomm.txt',
      'globalstar': 'globalstar.txt',
      'amateur': 'amateur.txt',
      'x-comm': 'x-comm.txt',
      'other-comm': 'other-comm.txt',
      'gps-ops': 'gps-ops.txt',
      'glo-ops': 'glo-ops.txt',
      'galileo': 'galileo.txt',
      'beidou': 'beidou.txt',
      'sbas': 'sbas.txt',
      'nnss': 'nnss.txt',
      'musson': 'musson.txt',
      'science': 'science.txt',
      'geodetic': 'geodetic.txt',
      'engineering': 'engineering.txt',
      'education': 'education.txt',
      'military': 'military.txt',
      'radar': 'radar.txt',
      'cubesat': 'cubesat.txt',
      'other': 'other.txt'
    };

    const fileName = categoryMap[category || 'stations'] || 'stations.txt';
    const response = await fetch(`https://celestrak.org/NORAD/elements/${fileName}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch satellite catalog for category: ${category}`);
    }

    const text = await response.text();
    const satellites: Satellite[] = [];

    // Parse TLE format (3 lines per satellite: name, line1, line2)
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i += 3) {
      if (i + 2 >= lines.length) break;

      const name = lines[i].trim();
      const line1 = lines[i + 1].trim();
      const line2 = lines[i + 2].trim();

      if (name && line1 && line2 && line1.startsWith('1 ') && line2.startsWith('2 ')) {
        // Extract NORAD ID from line 1
        const noradId = parseInt(line1.substring(2, 7));

        satellites.push({
          name,
          noradId,
          category: category || 'stations',
          tle: { line1, line2 }
        });
      }
    }

    return satellites;
  } catch (error) {
    console.error('Error fetching satellite catalog:', error);
    // Fallback to sample ISS data
    return [
      {
        name: 'ISS (ZARYA)',
        noradId: 25544,
        category: category || 'stations',
        tle: await fetchTLE(25544)
      }
    ];
  }
}

export function isTLEValid(tle: { line1: string; line2: string }): boolean {
  // Basic validation
  return tle.line1.startsWith('1 ') && tle.line2.startsWith('2 ') &&
         tle.line1.length >= 69 && tle.line2.length >= 69;
}