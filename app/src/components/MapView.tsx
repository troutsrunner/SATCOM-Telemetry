'use client';

import { useEffect, useRef } from 'react';
import { Location } from '@/types/location';

interface MapViewProps {
  location?: Location;
  satellitePosition?: { latitude: number; longitude: number };
}

export default function MapView({ location, satellitePosition }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For now, just show coordinates. In production, integrate with Leaflet
    if (mapRef.current) {
      mapRef.current.innerHTML = `
        <div class="text-center p-8 bg-gray-100 rounded">
          <div class="text-2xl mb-4">🌍</div>
          <p class="text-gray-600">Map View</p>
          ${location ? `
            <p class="text-sm mt-2">Observer: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</p>
          ` : ''}
          ${satellitePosition ? `
            <p class="text-sm">Satellite: ${satellitePosition.latitude.toFixed(4)}, ${satellitePosition.longitude.toFixed(4)}</p>
          ` : ''}
        </div>
      `;
    }
  }, [location, satellitePosition]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Location Map</h2>
      <div ref={mapRef} className="h-64 bg-gray-50 rounded">
        {/* Map will be rendered here */}
      </div>
    </div>
  );
}