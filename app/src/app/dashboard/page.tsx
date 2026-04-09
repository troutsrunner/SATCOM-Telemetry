'use client';

import { useState } from 'react';
import { Satellite } from '@/types/satellite';
import LocationInput from '@/components/LocationInput';
import SatelliteSelector from '@/components/SatelliteSelector';
import MetricsDisplay from '@/components/MetricsDisplay';
import OrbitalPlot from '@/components/OrbitalPlot';
import PassTable from '@/components/PassTable';
import MapView from '@/components/MapView';
import { useSatelliteData } from '@/hooks/useSatelliteData';
import { useLocation } from '@/hooks/useLocation';
import { usePassPrediction } from '@/hooks/usePassPrediction';

export default function Dashboard() {
  const [selectedSatellite, setSelectedSatellite] = useState<Satellite | undefined>();
  const { location, setLocation } = useLocation();
  const { data: satelliteData } = useSatelliteData(selectedSatellite, location);
  const { passes, loading: passesLoading } = usePassPrediction(selectedSatellite, location);

  // Generate orbital plot data (simplified - in production, collect historical data)
  const orbitalData = satelliteData ? {
    time: [new Date().toLocaleTimeString()],
    azimuth: [satelliteData.metrics.azimuth],
    elevation: [satelliteData.metrics.elevation]
  } : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SATCOM-Telemetry</h1>
              <p className="text-gray-600">Real-time satellite tracking and telemetry</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LocationInput
            onLocationChange={setLocation}
            currentLocation={location}
          />
          <SatelliteSelector
            onSatelliteSelect={setSelectedSatellite}
            selectedSatellite={selectedSatellite}
          />
        </div>

        {/* Real-time Metrics */}
        <div className="mb-8">
          <MetricsDisplay
            metrics={satelliteData?.metrics}
            satelliteName={selectedSatellite?.name}
            lastUpdate={satelliteData?.lastUpdate}
          />
        </div>

        {/* Charts and Maps */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <OrbitalPlot data={orbitalData} />
          <MapView
            location={location}
            satellitePosition={satelliteData?.position}
          />
        </div>

        {/* Pass Predictions */}
        <div className="mb-8">
          <PassTable passes={passes} loading={passesLoading} />
        </div>
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-500 text-sm">
            SATCOM-Telemetry - Real-time satellite tracking application
          </p>
        </div>
      </footer>
    </div>
  );
}