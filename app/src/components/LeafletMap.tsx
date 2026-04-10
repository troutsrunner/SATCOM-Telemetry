'use client';

import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '@/types/location';
import { Satellite } from '@/types/satellite';
import { parseTLE, getSatellitePosition } from '@/lib/satellite';

/** Only sets the map view the first time a location is provided. */
function InitialViewSetter({ location }: { location?: Location }) {
  const map = useMap();
  const hasSetView = useRef(false);

  useEffect(() => {
    if (location && !hasSetView.current) {
      map.setView([location.latitude, location.longitude], 5);
      hasSetView.current = true;
    }
  }, [map, location]);

  return null;
}

/** Splits an array of lat/lon points into segments at antimeridian crossings. */
function splitAtAntimeridian(points: [number, number][]): [number, number][][] {
  const segments: [number, number][][] = [];
  let current: [number, number][] = [];
  for (let i = 0; i < points.length; i++) {
    if (i > 0 && Math.abs(points[i][1] - points[i - 1][1]) > 180) {
      if (current.length > 1) segments.push(current);
      current = [];
    }
    current.push(points[i]);
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

interface LeafletMapProps {
  location?: Location;
  satellitePosition?: { latitude: number; longitude: number };
  satellite?: Satellite;
}

export default function LeafletMap({ location, satellitePosition, satellite }: LeafletMapProps) {
  const groundTrack = useMemo<[number, number][][]>(() => {
    if (!satellite) return [];
    try {
      const satrec = parseTLE(satellite.tle);
      const now = Date.now();
      const points: [number, number][] = [];
      // 90 min before to 90 min after current time, sampled every 1 min
      for (let i = -90; i <= 90; i++) {
        const pos = getSatellitePosition(satrec, new Date(now + i * 60 * 1000));
        points.push([pos.latitude, pos.longitude]);
      }
      return splitAtAntimeridian(points);
    } catch {
      return [];
    }
  }, [satellite]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%' }}
    >
      <InitialViewSetter location={location} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Satellite ground track — dashed red line */}
      {groundTrack.map((segment, i) => (
        <Polyline
          key={i}
          positions={segment}
          pathOptions={{ color: '#ef4444', weight: 1.5, opacity: 0.7, dashArray: '4 4' }}
        />
      ))}

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
