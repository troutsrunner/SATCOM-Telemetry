# Changelog

All notable changes to SATCOM-Telemetry will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dark mode support (Light, Dark, Auto options)
- Unit system selection (Metric and Imperial measurements)
- Settings component for user preferences
- Unit conversion utilities for distances, altitudes, and velocities
- Persistent settings storage with Zustand

## [1.0.0] - 2026-04-09

### Added
- Initial release of SATCOM-Telemetry web application
- Real-time satellite tracking with TLE data integration
- Location services with geolocation and manual coordinate input
- Interactive dashboard with live satellite metrics
- Orbital visualization with Chart.js integration
- Pass prediction calculations
- Responsive design with Tailwind CSS
- TypeScript for type safety
- Next.js 14+ framework
- Zustand state management
- TanStack Query for data fetching
- GitHub Actions CI/CD pipeline
- Professional documentation (README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY.md)
- API documentation
- Environment configuration templates
- Issue and PR templates

### Technical Features
- SGP4/SDP4 orbital propagation using satellite.js
- Azimuth, elevation, and range calculations
- Multiple satellite categories support (35+ categories)
- Real-time position updates (5-second refresh)
- Interactive maps with Leaflet placeholder
- API routes for satellite data
- Dark mode with smooth transitions
- Metric/Imperial unit conversion
- Persistent user settings storage