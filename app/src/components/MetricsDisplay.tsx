'use client';

import { ObserverMetrics } from '@/types/satellite';
import { UnitSystem } from '@/lib/units';
import { formatAltitude, formatDistance, formatVelocity, formatAngle, UNIT_LABELS } from '@/lib/units';

interface MetricsDisplayProps {
  metrics?: ObserverMetrics;
  satelliteName?: string;
  lastUpdate?: Date;
  unitSystem?: UnitSystem;
}

export default function MetricsDisplay({
  metrics,
  satelliteName,
  lastUpdate,
  unitSystem = 'metric'
}: MetricsDisplayProps) {
  if (!metrics) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Satellite Metrics</h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Select a satellite and location to view metrics
        </div>
      </div>
    );
  }

  const units = UNIT_LABELS[unitSystem];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Satellite Metrics {satelliteName && ` - ${satelliteName}`}
      </h2>

      {lastUpdate && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatAngle(metrics.azimuth)}°
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Azimuth</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatAngle(metrics.elevation)}°
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Elevation</div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            {metrics.elevation > 0 ? 'Visible' : 'Below Horizon'}
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatDistance(metrics.range, unitSystem)} {units.distance}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Slant Range</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {formatVelocity(metrics.velocity, unitSystem)} {units.velocity}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Orbital Velocity</div>
        </div>
      </div>

      {/* Visual indicators */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900 dark:text-white">Elevation</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{formatAngle(metrics.elevation)}°</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(0, Math.min(100, (metrics.elevation + 10) * 5))}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}