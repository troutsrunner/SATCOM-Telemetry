export interface Satellite {
  name: string;
  noradId: number;
  tle: {
    line1: string;
    line2: string;
  };
  category: string;
}

export interface SatellitePosition {
  latitude: number;
  longitude: number;
  altitude: number; // km
  velocity: number; // km/s
}

export interface ObserverMetrics {
  azimuth: number; // degrees
  elevation: number; // degrees
  range: number; // km
  velocity: number; // km/s
}

export interface PassEvent {
  startTime: Date;
  endTime: Date;
  maxElevation: number;
  duration: number; // minutes
  azimuthAtMax: number;
}