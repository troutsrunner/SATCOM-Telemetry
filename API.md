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
  ]
}
```

### GET /api/location/geocode

Geocode a location string to coordinates.

#### Query Parameters

- `q`: Location query (city, address, zip code)

#### Example Request

```bash
GET /api/location/geocode?q=New%20York%20City
```

#### Example Response

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "name": "New York City, NY, USA"
}
```

### GET /api/satellites/[noradId]/position

Get the current position of a specific satellite.

#### Path Parameters

- `noradId`: NORAD catalog number of the satellite

#### Query Parameters

- `latitude`: Observer latitude (required)
- `longitude`: Observer longitude (required)
- `altitude`: Observer altitude in meters (optional, defaults to 0)

#### Example Request

```bash
GET /api/satellites/25544/position?latitude=40.7128&longitude=-74.0060
```

#### Example Response

```json
{
  "position": {
    "latitude": 42.5,
    "longitude": -75.2,
    "altitude": 408000
  },
  "metrics": {
    "azimuth": 180.5,
    "elevation": 45.2,
    "range": 1200000,
    "velocity": 7600
  },
  "lastUpdate": "2024-04-09T14:30:00.000Z"
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

- **TLE Data**: Provided by CelesTrak and Space-Track.org
- **Geocoding**: Uses OpenStreetMap Nominatim service
- **Calculations**: Powered by satellite.js library using SGP4/SDP4 propagation

## Authentication

Currently, no authentication is required for API access. This may change in future versions for enhanced security.