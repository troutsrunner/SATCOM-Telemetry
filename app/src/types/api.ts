export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TleResponse {
  name: string;
  line1: string;
  line2: string;
}

export interface PositionResponse {
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  metrics: {
    azimuth: number;
    elevation: number;
    range: number;
    velocity: number;
  };
}

export interface PassesResponse {
  passes: Array<{
    startTime: string;
    endTime: string;
    maxElevation: number;
    duration: number;
    azimuthAtMax: number;
  }>;
}