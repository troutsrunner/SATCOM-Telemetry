# API Documentation

## Overview

SATCOM-Telemetry provides RESTful API endpoints for satellite data and calculations.

## Base URL

```
http://localhost:3000/api
```

## Endpoints

### GET /api/satellites

Retrieve a list of satellites, optionally filtered by category.

#### Query Parameters

- `category` (optional): Filter satellites by category
  - `stations` - Space stations
  - `active` - Active satellites
  - `weather` - Weather satellites
  - `gps-ops` - GPS operational
  - And many more categories...

#### Example Request

```bash
GET /api/satellites?category=stations
```

#### Example Response

```json
{
  "success": true,
  "data": [
    {
      "name": "ISS (ZARYA)",
      "noradId": 25544,
      "category": "stations",
      "tle": {
        "line1": "1 25544U 98067A   24092.50000000  .00000000  00000-0  00000-0 0  9999",
        "line2": "2 25544  51.6400  12.3456 0001000 123.4567 236.7890 15.48900000123456"
      }
    }
  ],
  "count": 31
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Failed to fetch satellites",
  "message": "Network error: Unable to connect to Celestrak API"
}
```
```

### GET /api/location/geocode

Geocode a location string to coordinates using OpenStreetMap Nominatim service.

#### Query Parameters

- `query`: Location query (city, address, zip code) - required, max 100 characters

#### Example Request

```bash
GET /api/location/geocode?query=New%20York%20City
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "name": "New York City, New York, USA",
    "country": "United States"
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Location not found",
  "message": "No results found for the given query"
}
```

### GET /api/satellites/[noradId]/position

Get the current position and observer metrics for a specific satellite.

#### Path Parameters

- `noradId`: NORAD catalog number of the satellite (required, must be positive integer)

#### Query Parameters

- `lat`: Observer latitude (required, -90 to 90 degrees)
- `lon`: Observer longitude (required, -180 to 180 degrees)
- `alt`: Observer altitude in meters (optional, defaults to 0)

#### Example Request

```bash
GET /api/satellites/25544/position?lat=40.7128&lon=-74.0060&alt=10
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "position": {
      "latitude": 42.5,
      "longitude": -75.2,
      "altitude": 408000,
      "velocity": 7600
    },
    "metrics": {
      "azimuth": 180.5,
      "elevation": 45.2,
      "range": 1200000,
      "velocity": 7600
    },
    "timestamp": "2026-04-09T14:30:00.000Z"
  }
}
```

#### Error Responses

```json
{
  "success": false,
  "error": "Valid NORAD ID is required",
  "message": "noradId must be a positive integer"
}
```

```json
{
  "success": false,
  "error": "Valid latitude (-90 to 90) is required"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Rate Limiting

- API endpoints are rate limited to prevent abuse
- Current limits: 100 requests per minute per IP
- Exceeding limits returns HTTP 429 (Too Many Requests)

## Data Sources

- **TLE Data**: Live data from [CelesTrak](https://celestrak.org/) with 24-hour caching
- **Geocoding**: [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) - free, no API key required
- **Calculations**: [satellite.js](https://github.com/shashwatak/satellite-js) library using SGP4/SDP4 propagation algorithms
- **Maps**: OpenStreetMap tiles via Leaflet

## Caching

- TLE data is cached for 24 hours to improve performance and reduce API load
- Cache is automatically refreshed when expired
- Fallback to cached ISS data if Celestrak API is unavailable

## Error Handling

All endpoints include comprehensive error handling:
- Input validation with descriptive error messages
- Network error handling with retry suggestions
- Graceful degradation when external services are unavailable
- Detailed error logging for debugging