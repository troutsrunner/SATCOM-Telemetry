'use client';

import { useState, useEffect } from 'react';
import { Satellite, PassEvent } from '@/types/satellite';
import { Location } from '@/types/location';
import { parseTLE, predictPasses } from '@/lib/satellite';

export function usePassPrediction(satellite?: Satellite, location?: Location, days: number = 1) {
  const [passes, setPasses] = useState<PassEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const calculatePassesLocal = async () => {
      if (!satellite || !location) {
        setPasses([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const satrec = parseTLE(satellite.tle);
        const startDate = new Date();
        const predictedPasses = predictPasses(satrec, location, startDate, days);
        setPasses(predictedPasses);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to predict passes');
      }

      setLoading(false);
    };

    calculatePassesLocal();
  }, [satellite, location, days]);

  return { passes, loading, error };
}
