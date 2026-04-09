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
  // Using Nominatim (OpenStreetMap) geocoding service - free and no API key required
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
  );

  if (!response.ok) {
    throw new Error('Geocoding service unavailable');
  }

  const data = await response.json();

  if (data && data.length > 0) {
    const result = data[0];
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      name: result.display_name,
      country: result.address?.country || 'Unknown'
    };
  }

  throw new Error('Location not found');
}

export function validateCoordinates(lat: number, lon: number): boolean {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}