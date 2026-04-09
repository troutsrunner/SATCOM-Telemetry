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

  // Check every minute for better accuracy
  let currentTime = new Date(startDate);
  const intervalMinutes = 1; // Check every minute

  while (currentTime < endDate) {
    const position = getSatellitePosition(satrec, currentTime);
    const metrics = calculateObserverMetrics(position, observerPos);

    if (metrics.elevation > 0) {
      // Find pass start (go back until elevation <= 0)
      let passStart = new Date(currentTime);
      let searchTime = new Date(currentTime);

      // Binary search for more precise start time
      let low = new Date(currentTime.getTime() - 30 * 60 * 1000); // 30 minutes back
      let high = new Date(currentTime);

      for (let i = 0; i < 10; i++) { // 10 iterations for precision
        const mid = new Date((low.getTime() + high.getTime()) / 2);
        const midPos = getSatellitePosition(satrec, mid);
        const midMetrics = calculateObserverMetrics(midPos, observerPos);

        if (midMetrics.elevation > 0) {
          high = mid;
        } else {
          low = mid;
        }
      }
      passStart = high;

      // Find pass end (go forward until elevation <= 0)
      let passEnd = new Date(currentTime);
      low = new Date(currentTime);
      high = new Date(currentTime.getTime() + 30 * 60 * 1000); // 30 minutes forward

      for (let i = 0; i < 10; i++) {
        const mid = new Date((low.getTime() + high.getTime()) / 2);
        const midPos = getSatellitePosition(satrec, mid);
        const midMetrics = calculateObserverMetrics(midPos, observerPos);

        if (midMetrics.elevation > 0) {
          low = mid;
        } else {
          high = mid;
        }
      }
      passEnd = low;

      // Calculate max elevation during the pass
      let maxElevation = 0;
      let azimuthAtMax = 0;
      const passDuration = passEnd.getTime() - passStart.getTime();
      const steps = Math.min(50, Math.max(10, Math.floor(passDuration / (60 * 1000)))); // At least 10 steps, max 50

      for (let i = 0; i <= steps; i++) {
        const checkTime = new Date(passStart.getTime() + (passDuration * i) / steps);
        const checkPos = getSatellitePosition(satrec, checkTime);
        const checkMetrics = calculateObserverMetrics(checkPos, observerPos);

        if (checkMetrics.elevation > maxElevation) {
          maxElevation = checkMetrics.elevation;
          azimuthAtMax = checkMetrics.azimuth;
        }
      }

      const duration = (passEnd.getTime() - passStart.getTime()) / (1000 * 60);

      // Only include passes longer than 1 minute and with elevation > 5 degrees
      if (duration > 1 && maxElevation > 5) {
        passes.push({
          startTime: passStart,
          endTime: passEnd,
          maxElevation,
          duration,
          azimuthAtMax
        });
      }

      // Skip to end of this pass plus 5 minutes
      currentTime = new Date(passEnd.getTime() + 5 * 60 * 1000);
    } else {
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
  }

  return passes;
}