export interface Location {
  latitude: number;
  longitude: number;
  altitude: number; // meters
  name?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  name: string;
  country?: string;
}