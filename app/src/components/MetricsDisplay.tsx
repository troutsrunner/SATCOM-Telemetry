'use client';

import { ObserverMetrics } from '@/types/satellite';

interface MetricsDisplayProps {
  metrics?: ObserverMetrics;
  satelliteName?: string;
  lastUpdate?: Date;
}

export default function MetricsDisplay({ metrics, satelliteName, lastUpdate }: MetricsDisplayProps) {
  if (!metrics) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Satellite Metrics</h2>
        <div className="text-center text-gray-500 py-8">
          Select a satellite and location to view metrics
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        Satellite Metrics {satelliteName && ` - ${satelliteName}`}
      </h2>

      {lastUpdate && (
        <div className="text-sm text-gray-500 mb-4">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.azimuth.toFixed(1)}°
          </div>
          <div className="text-sm text-gray-600">Azimuth</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics.elevation.toFixed(1)}°
          </div>
          <div className="text-sm text-gray-600">Elevation</div>
          <div className="text-xs text-gray-500">
            {metrics.elevation > 0 ? 'Visible' : 'Below Horizon'}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {metrics.range.toFixed(0)} km
          </div>
          <div className="text-sm text-gray-600">Slant Range</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {metrics.velocity.toFixed(2)} km/s
          </div>
          <div className="text-sm text-gray-600">Orbital Velocity</div>
        </div>
      </div>

      {/* Visual indicators */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Elevation</span>
          <span className="text-sm text-gray-600">{metrics.elevation.toFixed(1)}°</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, (metrics.elevation + 10) * 5))}%`
            }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-10°</span>
          <span>0°</span>
          <span>10°</span>
        </div>
      </div>

      {/* Azimuth compass */}
      <div className="mt-6">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-2 border-gray-300 rounded-full">
              <div
                className="absolute w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-500 transform -translate-x-1/2"
                style={{
                  top: '4px',
                  left: '50%',
                  transform: `translateX(-50%) rotate(${metrics.azimuth}deg)`
                }}
              ></div>
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">N</div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold">S</div>
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs font-bold">W</div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs font-bold">E</div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Azimuth: {metrics.azimuth.toFixed(1)}°
          </div>
        </div>
      </div>
    </div>
  );
}