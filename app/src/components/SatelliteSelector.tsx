'use client';

import { useState, useEffect, useCallback } from 'react';
import { Satellite } from '@/types/satellite';
import { fetchSatelliteCatalog } from '@/lib/tle';

interface SatelliteSelectorProps {
  onSatelliteSelect: (satellite: Satellite) => void;
  selectedSatellite?: Satellite;
}

export default function SatelliteSelector({ onSatelliteSelect, selectedSatellite }: SatelliteSelectorProps) {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('stations');

  const loadSatellites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const catalog = await fetchSatelliteCatalog(selectedCategory);
      setSatellites(catalog);
    } catch (err) {
      console.error('Failed to load satellites:', err);
      setError(err instanceof Error ? err.message : 'Failed to load satellites');
      setSatellites([]); // Clear satellites on error
    }
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    loadSatellites();
  }, [selectedCategory]);

  const categories = [
    { value: 'stations', label: 'Space Stations' },
    { value: 'active', label: 'Active Satellites' },
    { value: 'weather', label: 'Weather Satellites' },
    { value: 'noaa', label: 'NOAA Satellites' },
    { value: 'goes', label: 'GOES Satellites' },
    { value: 'resource', label: 'Earth Resources' },
    { value: 'sarsat', label: 'Search & Rescue' },
    { value: 'dmc', label: 'Disaster Monitoring' },
    { value: 'tdrss', label: 'Tracking & Data Relay' },
    { value: 'argos', label: 'Argos' },
    { value: 'geo', label: 'Geostationary' },
    { value: 'intelsat', label: 'Intelsat' },
    { value: 'ses', label: 'SES' },
    { value: 'iridium', label: 'Iridium' },
    { value: 'orbcomm', label: 'Orbcomm' },
    { value: 'globalstar', label: 'Globalstar' },
    { value: 'amateur', label: 'Amateur Radio' },
    { value: 'x-comm', label: 'Experimental Comm' },
    { value: 'other-comm', label: 'Other Comm' },
    { value: 'gps-ops', label: 'GPS Operational' },
    { value: 'glo-ops', label: 'Glonass Operational' },
    { value: 'galileo', label: 'Galileo' },
    { value: 'beidou', label: 'Beidou' },
    { value: 'sbas', label: 'SBAS' },
    { value: 'nnss', label: 'NNSS' },
    { value: 'musson', label: 'Musson' },
    { value: 'science', label: 'Space & Earth Science' },
    { value: 'geodetic', label: 'Geodetic' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'education', label: 'Education' },
    { value: 'military', label: 'Military' },
    { value: 'radar', label: 'Radar Calibration' },
    { value: 'cubesat', label: 'CubeSats' },
    { value: 'other', label: 'Other' }
  ];

  const filteredSatellites = satellites.filter(satellite =>
    satellite.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Satellite Selection</h2>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search Satellites
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or NORAD ID"
          className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
        />
      </div>

      {/* Satellite List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">Loading satellites...</div>
        ) : error ? (
          <div className="text-center py-4">
            <div className="text-red-600 dark:text-red-400 mb-2">Error loading satellites</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{error}</div>
            <button
              onClick={loadSatellites}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : filteredSatellites.length === 0 ? (
          <div className="text-center py-4 text-gray-600 dark:text-gray-400">
            No satellites found in this category
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSatellites.map(satellite => (
              <div
                key={satellite.noradId}
                onClick={() => onSatelliteSelect(satellite)}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedSatellite?.noradId === satellite.noradId
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white">{satellite.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">NORAD ID: {satellite.noradId}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Satellite Info */}
      {selectedSatellite && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded transition-colors">
          <h3 className="font-medium text-blue-900 dark:text-blue-200">Selected Satellite:</h3>
          <p className="text-blue-800 dark:text-blue-300">{selectedSatellite.name}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">NORAD ID: {selectedSatellite.noradId}</p>
        </div>
      )}
    </div>
  );
}