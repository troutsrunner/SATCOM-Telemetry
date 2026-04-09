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
      const isDark = document.documentElement.classList.contains('dark');
      const bgClass = isDark ? 'bg-slate-800' : 'bg-gray-100';
      const textClass = isDark ? 'text-gray-400' : 'text-gray-600';
      const smTextClass = isDark ? 'text-gray-300' : 'text-gray-600';
      
      mapRef.current.innerHTML = `
        <div class="text-center p-8 ${bgClass} rounded">
          <div class="text-2xl mb-4">🌍</div>
          <p class="${textClass}">Map View</p>
          ${location ? `
            <p class="text-sm mt-2 ${smTextClass}">Observer: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}</p>
          ` : ''}
          ${satellitePosition ? `
            <p class="text-sm ${smTextClass}">Satellite: ${satellitePosition.latitude.toFixed(4)}, ${satellitePosition.longitude.toFixed(4)}</p>
          ` : ''}
        </div>
      `;
    }
  }, [location, satellitePosition]);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location Map</h2>
      <div ref={mapRef} className="h-64 bg-gray-50 dark:bg-slate-800 rounded transition-colors">
        {/* Map will be rendered here */}
      </div>
    </div>
  );
}