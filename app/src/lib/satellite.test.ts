import { describe, it, expect } from '@jest/globals';
import { parseTLE, getSatellitePosition, calculateObserverMetrics } from '../lib/satellite';

// Sample ISS TLE data for testing
const sampleTLE = {
  line1: '1 25544U 98067A   24092.50000000  .00000000  00000-0  00000-0 0  9999',
  line2: '2 25544  51.6400  12.3456 0001000 123.4567 236.7890 15.48900000123456'
};

const testDate = new Date('2024-04-09T12:00:00Z');

describe('Satellite Calculations', () => {
  it('should parse TLE correctly', () => {
    const satrec = parseTLE(sampleTLE);
    expect(satrec).toBeDefined();
    expect(satrec.satnum).toBe(25544);
  });

  it('should calculate satellite position', () => {
    const satrec = parseTLE(sampleTLE);
    const position = getSatellitePosition(satrec, testDate);

    expect(position).toBeDefined();
    expect(typeof position.latitude).toBe('number');
    expect(typeof position.longitude).toBe('number');
    expect(typeof position.altitude).toBe('number');
    expect(typeof position.velocity).toBe('number');

    // ISS altitude should be around 400-500 km
    expect(position.altitude).toBeGreaterThan(300);
    expect(position.altitude).toBeLessThan(600);
  });

  it('should calculate observer metrics', () => {
    const satrec = parseTLE(sampleTLE);
    const position = getSatellitePosition(satrec, testDate);
    const observerPos = { latitude: 40.7128, longitude: -74.0060, altitude: 0 };

    const metrics = calculateObserverMetrics(position, observerPos);

    expect(metrics).toBeDefined();
    expect(typeof metrics.azimuth).toBe('number');
    expect(typeof metrics.elevation).toBe('number');
    expect(typeof metrics.range).toBe('number');
    expect(typeof metrics.velocity).toBe('number');

    // Azimuth should be 0-360 degrees
    expect(metrics.azimuth).toBeGreaterThanOrEqual(0);
    expect(metrics.azimuth).toBeLessThanOrEqual(360);

    // Elevation should be -90 to 90 degrees
    expect(metrics.elevation).toBeGreaterThanOrEqual(-90);
    expect(metrics.elevation).toBeLessThanOrEqual(90);
  });

  it('should validate coordinates', () => {
    const { validateCoordinates } = require('../lib/geolocation');

    expect(validateCoordinates(40.7128, -74.0060)).toBe(true);
    expect(validateCoordinates(91, 0)).toBe(false);
    expect(validateCoordinates(0, 181)).toBe(false);
    expect(validateCoordinates(-91, 0)).toBe(false);
    expect(validateCoordinates(0, -181)).toBe(false);
  });
});