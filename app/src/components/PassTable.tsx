'use client';

import { PassEvent } from '@/types/satellite';

interface PassTableProps {
  passes?: PassEvent[];
  loading?: boolean;
}

export default function PassTable({ passes, loading }: PassTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Passes</h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          Calculating passes...
        </div>
      </div>
    );
  }

  if (!passes || passes.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Passes</h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No passes found. Select a satellite and location to predict passes.
        </div>
      </div>
    );
  }

  const formatTime = (date: Date) => {
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Upcoming Passes</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                End Time
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Max Elevation
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Azimuth at Max
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-slate-700">
            {passes.map((pass, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatTime(pass.startTime)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatTime(pass.endTime)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {formatDuration(pass.duration)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    pass.maxElevation > 45 ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                    pass.maxElevation > 20 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                    'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}>
                    {pass.maxElevation.toFixed(1)}°
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {pass.azimuthAtMax.toFixed(1)}°
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>
          <strong>Legend:</strong> Green = Excellent pass (&gt;45°), Yellow = Good pass (20-45°), Red = Poor pass (&lt;20°)
        </p>
      </div>
    </div>
  );
}