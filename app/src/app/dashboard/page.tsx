'use client';

import { useState } from 'react';
import { Satellite } from '@/types/satellite';
import LocationInput from '@/components/LocationInput';
import SatelliteSelector from '@/components/SatelliteSelector';
import MetricsDisplay from '@/components/MetricsDisplay';
import OrbitalPlot from '@/components/OrbitalPlot';
import PassTable from '@/components/PassTable';
import MapView from '@/components/MapView';
import Settings from '@/components/Settings';
import { useSatelliteData } from '@/hooks/useSatelliteData';
import { useLocation } from '@/hooks/useLocation';
import { usePassPrediction } from '@/hooks/usePassPrediction';
import { useSettings } from '@/hooks/useSettings';

export default function Dashboard() {
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | undefined>();
  const { location, setLocation } = useLocation();
  const { unitSystem } = useSettings();
  const { data: satelliteData } = useSatelliteData(selectedSatellite, location);
  const { passes, loading: passesLoading } = usePassPrediction(selectedSatellite, location);

  // Generate orbital plot data (simplified - in production, collect historical data)
  const orbitalData = satelliteData ? {
    time: [new Date().toLocaleTimeString()],
    azimuth: [satelliteData.metrics.azimuth],
    elevation: [satelliteData.metrics.elevation]
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors">
      <header className="bg-white dark:bg-slate-900 shadow-sm border-b dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SATCOM-Telemetry</h1>
              <p className="text-gray-600 dark:text-gray-400">Real-time satellite tracking and telemetry</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <LocationInput
            onLocationChange={setLocation}
            currentLocation={location}
            unitSystem={unitSystem}
          />
          <SatelliteSelector
            onSatelliteSelect={setSelectedSatellite}
            selectedSatellite={selectedSatellite}
          />
          <Settings />
        </div>

        {/* Real-time Metrics */}
        <div className="mb-8">
          <MetricsDisplay
            metrics={satelliteData?.metrics}
            satelliteName={selectedSatellite?.name}
            lastUpdate={satelliteData?.lastUpdate}
            unitSystem={unitSystem}
          />
        </div>

        {/* Charts and Maps */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <OrbitalPlot data={orbitalData} />
          <MapView
            location={location}
            satellitePosition={satelliteData?.position}
              satellite={selectedSatellite}
          />
        </div>

        {/* Pass Predictions */}
        <div className="mb-8">
          <PassTable passes={passes} loading={passesLoading} />
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t dark:border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            SATCOM-Telemetry - Real-time satellite tracking application
          </p>
        </div>
      </footer>
    </div>
  );
}