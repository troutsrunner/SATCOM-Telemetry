'use client';

import { useState } from 'react';
import { Location } from '@/types/location';
import { UnitSystem } from '@/lib/units';
import { formatAltitude, UNIT_LABELS } from '@/lib/units';
import { getCurrentLocation, geocodeLocation } from '@/lib/geolocation';

interface LocationInputProps {
  onLocationChange: (location: Location) => void;
  currentLocation?: Location;
  unitSystem?: UnitSystem;
}

export default function LocationInput({
  onLocationChange,
  currentLocation,
  unitSystem = 'metric'
}: LocationInputProps) {
  const [manualLat, setManualLat] = useState('');
  const [manualLon, setManualLon] = useState('');
  const [manualAlt, setManualAlt] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const units = UNIT_LABELS[unitSystem];

  const handleGeolocation = async () => {
    setLoading(true);
    setError('');
    try {
      const location = await getCurrentLocation();
      onLocationChange(location);
    } catch {
      setError('Unable to get current location');
    }
    setLoading(false);
  };

  const handleManualInput = () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    const alt = parseFloat(manualAlt);

    if (isNaN(lat) || isNaN(lon) || isNaN(alt)) {
      setError('Please enter valid coordinates');
      return;
    }

    onLocationChange({
      latitude: lat,
      longitude: lon,
      altitude: alt
    });
    setError('');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    try {
      const result = await geocodeLocation(searchQuery);
      onLocationChange({
        latitude: result.latitude,
        longitude: result.longitude,
        altitude: 0,
        name: result.name
      });
    } catch {
      setError('Location not found');
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-md transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Location Input</h2>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Current Location Button */}
      <div className="mb-4">
        <button
          onClick={handleGeolocation}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Getting Location...' : 'Use Current Location'}
        </button>
      </div>

      {/* Search by City/Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Search by City or Address
        </label>
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter city, zip code, or address"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </div>

      {/* Manual Coordinates */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Manual Coordinates
        </label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
            placeholder="Latitude"
            step="0.000001"
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            value={manualLon}
            onChange={(e) => setManualLon(e.target.value)}
            placeholder="Longitude"
            step="0.000001"
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            value={manualAlt}
            onChange={(e) => setManualAlt(e.target.value)}
            placeholder={`Altitude (${units.altitude})`}
            className="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={handleManualInput}
          className="mt-2 bg-purple-500 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Set Coordinates
        </button>
      </div>

      {/* Current Location Display */}
      {currentLocation && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-slate-800 rounded">
          <h3 className="font-medium text-gray-900 dark:text-white">Current Location:</h3>
          <p className="text-gray-900 dark:text-gray-300">Lat: {currentLocation.latitude.toFixed(6)}</p>
          <p className="text-gray-900 dark:text-gray-300">Lon: {currentLocation.longitude.toFixed(6)}</p>
          <p className="text-gray-900 dark:text-gray-300">Alt: {formatAltitude(currentLocation.altitude, unitSystem)} {units.altitude}</p>
          {currentLocation.name && <p className="text-gray-900 dark:text-gray-300">Name: {currentLocation.name}</p>}
        </div>
      )}
    </div>
  );
}