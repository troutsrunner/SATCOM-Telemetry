import * as satellite from 'satellite.js';
import { SatellitePosition, ObserverMetrics, PassEvent } from '@/types/satellite';
import { Location } from '@/types/location';

export function parseTLE(tle: { line1: string; line2: string }) {
  return satellite.twoline2satrec(tle.line1, tle.line2);
}

export function getSatellitePosition(satrec: satellite.SatRec, date: Date): SatellitePosition {
  const positionAndVelocity = satellite.propagate(satrec, date);
  const positionEci = positionAndVelocity.position;

  if (!positionEci) {
    throw new Error('Unable to propagate satellite position');
  }

  const gmst = satellite.gstime(date);
  const positionGd = satellite.eciToGeodetic(positionEci, gmst);

  return {
    latitude: satellite.degreesLat(positionGd.latitude),
    longitude: satellite.degreesLong(positionGd.longitude),
    altitude: positionGd.height / 1000, // convert to km
    velocity: Math.sqrt(
      positionAndVelocity.velocity.x ** 2 +
      positionAndVelocity.velocity.y ** 2 +
      positionAndVelocity.velocity.z ** 2
    ) / 1000 // convert to km/s
  };
}

export function calculateObserverMetrics(
  satellitePos: SatellitePosition,
  observerPos: Location
): ObserverMetrics {
  // Convert to radians
  const satLat = satellitePos.latitude * Math.PI / 180;
  const satLon = satellitePos.longitude * Math.PI / 180;
  const obsLat = observerPos.latitude * Math.PI / 180;
  const obsLon = observerPos.longitude * Math.PI / 180;

  // Calculate differences
  const dLat = satLat - obsLat;
  const dLon = satLon - obsLon;

  // Haversine formula for distance
  const a = Math.sin(dLat/2) ** 2 + Math.cos(obsLat) * Math.cos(satLat) * Math.sin(dLon/2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const range = 6371 * c + satellitePos.altitude; // Earth radius + satellite altitude

  // Calculate azimuth and elevation
  const elevation = Math.asin(
    Math.sin(dLat) * Math.sin(obsLat) +
    Math.cos(dLat) * Math.cos(obsLat) * Math.cos(dLon)
  );

  const azimuth = Math.atan2(
    Math.sin(dLon) * Math.cos(satLat),
    Math.cos(obsLat) * Math.sin(satLat) - Math.sin(obsLat) * Math.cos(satLat) * Math.cos(dLon)
  );

  return {
    azimuth: (azimuth * 180 / Math.PI + 360) % 360,
    elevation: elevation * 180 / Math.PI,
    range,
    velocity: satellitePos.velocity
  };
}

export function predictPasses(
  satrec: satellite.SatRec,
  observerPos: Location,
  startDate: Date,
  days: number = 1
): PassEvent[] {
  const passes: PassEvent[] = [];
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);

  // Simple pass prediction - check every 10 minutes
  let currentTime = new Date(startDate);

  while (currentTime < endDate) {
    const position = getSatellitePosition(satrec, currentTime);
    const metrics = calculateObserverMetrics(position, observerPos);

    if (metrics.elevation > 0) {
      // Find pass start
      let passStart = new Date(currentTime);
      let passEnd = new Date(currentTime);
      let maxElevation = metrics.elevation;
      let azimuthAtMax = metrics.azimuth;

      // Go backwards to find start
      let checkTime = new Date(currentTime);
      while (checkTime > startDate) {
        checkTime.setMinutes(checkTime.getMinutes() - 1);
        const checkPos = getSatellitePosition(satrec, checkTime);
        const checkMetrics = calculateObserverMetrics(checkPos, observerPos);
        if (checkMetrics.elevation <= 0) {
          passStart = new Date(checkTime);
          break;
        }
      }

      // Go forwards to find end
      checkTime = new Date(currentTime);
      while (checkTime < endDate) {
        checkTime.setMinutes(checkTime.getMinutes() + 1);
        const checkPos = getSatellitePosition(satrec, checkTime);
        const checkMetrics = calculateObserverMetrics(checkPos, observerPos);
        if (checkMetrics.elevation <= 0) {
          passEnd = new Date(checkTime);
          break;
        }
        if (checkMetrics.elevation > maxElevation) {
          maxElevation = checkMetrics.elevation;
          azimuthAtMax = checkMetrics.azimuth;
        }
      }

      const duration = (passEnd.getTime() - passStart.getTime()) / (1000 * 60);

      passes.push({
        startTime: passStart,
        endTime: passEnd,
        maxElevation,
        duration,
        azimuthAtMax
      });

      currentTime = new Date(passEnd.getTime() + 10 * 60 * 1000); // Skip 10 minutes
    } else {
      currentTime.setMinutes(currentTime.getMinutes() + 10);
    }
  }

  return passes;
}