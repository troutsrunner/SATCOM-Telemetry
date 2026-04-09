// Unit conversion utilities for SATCOM-Telemetry

export type UnitSystem = 'metric' | 'imperial';

export interface UnitLabels {
  altitude: string;
  distance: string;
  velocity: string;
  temperature?: string;
}

export const UNIT_LABELS: Record<UnitSystem, UnitLabels> = {
  metric: {
    altitude: 'm',
    distance: 'km',
    velocity: 'km/s',
  },
  imperial: {
    altitude: 'ft',
    distance: 'mi',
    velocity: 'mph',
  },
};

// Conversion functions
export const conversions = {
  // Distance conversions
  metersToFeet: (meters: number): number => meters * 3.28084,
  feetToMeters: (feet: number): number => feet / 3.28084,

  kilometersToMiles: (km: number): number => km * 0.621371,
  milesToKilometers: (miles: number): number => miles / 0.621371,

  // Velocity conversions
  kmPerSecToMph: (kmps: number): number => kmps * 2236.94,
  mphToKmPerSec: (mph: number): number => mph / 2236.94,

  kmPerSecToFtPerSec: (kmps: number): number => kmps * 3280.84,
  ftPerSecToKmPerSec: (ftps: number): number => ftps / 3280.84,
};

// Format numbers with appropriate precision
export function formatNumber(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

// Convert and format altitude
export function formatAltitude(meters: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    return formatNumber(conversions.metersToFeet(meters));
  }
  return formatNumber(meters);
}

// Convert and format distance
export function formatDistance(kilometers: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    return formatNumber(conversions.kilometersToMiles(kilometers), 1);
  }
  return formatNumber(kilometers, 1);
}

// Convert and format velocity
export function formatVelocity(kmPerSec: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    return formatNumber(conversions.kmPerSecToMph(kmPerSec), 2);
  }
  return formatNumber(kmPerSec, 2);
}

// Convert and format elevation/azimuth (always in degrees)
export function formatAngle(degrees: number): string {
  return formatNumber(degrees, 1);
}