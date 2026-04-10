'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/location';

interface MapUpdaterProps {
  center: [number, number];
  zoom: number;
}

function MapUpdater({ center, zoom }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  return null;
}

interface LeafletMapProps {
  location?: Location;
  satellitePosition?: { latitude: number; longitude: number };
}

export default function LeafletMap({ location, satellitePosition }: LeafletMapProps) {
  const center: [number, number] = location
    ? [location.latitude, location.longitude]
    : [20, 0];
  const zoom = location ? 8 : 2;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <MapUpdater center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <CircleMarker
          center={[location.latitude, location.longitude]}
          radius={8}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.8 }}
        >
          <Popup>
            <strong>Observer</strong><br />
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            {location.name ? <><br />{location.name}</> : null}
          </Popup>
        </CircleMarker>
      )}
      {satellitePosition && (
        <CircleMarker
          center={[satellitePosition.latitude, satellitePosition.longitude]}
          radius={8}
          pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }}
        >
          <Popup>
            <strong>Satellite</strong><br />
            {satellitePosition.latitude.toFixed(4)}, {satellitePosition.longitude.toFixed(4)}
          </Popup>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
