'use client';

import { useState, useCallback } from 'react';
import { Location } from '@/types/location';

export function useLocation() {
  const [location, setLocation] = useState<Location | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const updateLocation = useCallback(async (newLocation: Location) => {
    setLocation(newLocation);
    setError(null);
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(undefined);
    setError(null);
  }, []);

  return {
    location,
    loading,
    error,
    setLocation: updateLocation,
    clearLocation
  };
}