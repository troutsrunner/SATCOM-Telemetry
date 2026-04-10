'use client';

import dynamic from 'next/dynamic';
import { Location } from '@/types/location';

const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-50 dark:bg-slate-800 rounded flex items-center justify-center transition-colors">
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading map...</p>
    </div>
  ),
});

interface MapViewProps {
  location?: Location;
  satellitePosition?: { latitude: number; longitude: number };
}

export default function MapView({ location, satellitePosition }: MapViewProps) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location Map</h2>
      <div className="h-64 rounded overflow-hidden">
        <LeafletMap location={location} satellitePosition={satellitePosition} />
      </div>
    </div>
  );
}