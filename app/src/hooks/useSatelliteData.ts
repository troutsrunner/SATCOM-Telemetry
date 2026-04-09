'use client';

import { useState, useEffect, useRef } from 'react';
import { Satellite, SatellitePosition, ObserverMetrics } from '@/types/satellite';
import { Location } from '@/types/location';
import { parseTLE, getSatellitePosition, calculateObserverMetrics } from '@/lib/satellite';

interface SatelliteData {
  position: SatellitePosition;
  metrics: ObserverMetrics;
  lastUpdate: Date;
}

export function useSatelliteData(satellite?: Satellite, location?: Location) {
  const [data, setData] = useState<SatelliteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasValidDeps = useRef(false);

  useEffect(() => {
    const currentlyValid = !!(satellite && location);
    if (hasValidDeps.current && !currentlyValid) {
      // Dependencies became invalid, clear data
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setData(null);
    }
    hasValidDeps.current = currentlyValid;

    if (!currentlyValid) {
      setLoading(false);
      setError(null);
      return;
    }

    const calculateData = () => {
      setLoading(true);
      setError(null);

      try {
        const satrec = parseTLE(satellite.tle);
        const now = new Date();
        const position = getSatellitePosition(satrec, now);
        const metrics = calculateObserverMetrics(position, location);

        setData({
          position,
          metrics,
          lastUpdate: now
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to calculate satellite data');
      }

      setLoading(false);
    };

    calculateData();

    // Update every 5 seconds
    const interval = setInterval(calculateData, 5000);

    return () => clearInterval(interval);
  }, [satellite, location]);

  return { data, loading, error };
}
