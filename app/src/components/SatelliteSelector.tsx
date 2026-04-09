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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('stations');

  const loadSatellites = useCallback(async () => {
    setLoading(true);
    try {
      const catalog = await fetchSatelliteCatalog(selectedCategory);
      setSatellites(catalog);
    } catch (error) {
      console.error('Failed to load satellites:', error);
    }
    setLoading(false);
  }, [selectedCategory]);

  useEffect(() => {
    loadSatellites();
  }, [loadSatellites]);

  const filteredSatellites = satellites.filter(satellite =>
    satellite.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Satellite Selection</h2>

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Satellites
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or NORAD ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Satellite List */}
      <div className="max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4">Loading satellites...</div>
        ) : (
          <div className="space-y-2">
            {filteredSatellites.map(satellite => (
              <div
                key={satellite.noradId}
                onClick={() => onSatelliteSelect(satellite)}
                className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                  selectedSatellite?.noradId === satellite.noradId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="font-medium">{satellite.name}</div>
                <div className="text-sm text-gray-600">NORAD ID: {satellite.noradId}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Satellite Info */}
      {selectedSatellite && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h3 className="font-medium text-blue-900">Selected Satellite:</h3>
          <p className="text-blue-800">{selectedSatellite.name}</p>
          <p className="text-sm text-blue-600">NORAD ID: {selectedSatellite.noradId}</p>
        </div>
      )}
    </div>
  );
}