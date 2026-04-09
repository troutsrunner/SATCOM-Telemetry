import { Location, GeocodeResult } from '@/types/location';

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          altitude: position.coords.altitude || 0
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

export async function geocodeLocation(query: string): Promise<GeocodeResult> {
  // Using a free geocoding service - in production, use a proper API
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=demo`);
  const data = await response.json();

  if (data.results && data.results.length > 0) {
    const result = data.results[0];
    return {
      latitude: result.geometry.lat,
      longitude: result.geometry.lng,
      name: result.formatted,
      country: result.components.country
    };
  }

  throw new Error('Location not found');
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}