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

### Changed
- Replaced the map placeholder with an interactive Leaflet map using OpenStreetMap tiles
- Added a satellite ground track overlay (dashed polyline) to show current travel direction and path
- Updated map behavior to preserve manual pan/zoom instead of auto-recentering on each update

### Fixed
- Fixed theme switching so Light and Dark selection now responds correctly with Tailwind v4 class-based dark mode

## [1.1.0] - 2026-04-09

### Added
- **Real Satellite Data Integration**: Replaced hardcoded demo data with live Celestrak API
- **Enhanced Geocoding**: Switched from demo API to free Nominatim (OpenStreetMap) service
- **TLE Data Caching**: 24-hour cache for satellite TLE data to improve performance
- **Improved Pass Prediction**: Binary search algorithm for more accurate pass start/end times
- **Comprehensive Error Handling**: Error states, retry buttons, and user feedback throughout UI
- **API Validation**: Input validation and detailed error responses for all endpoints
- **Loading States**: Loading indicators and error boundaries in components
- **Jest Testing Framework**: Added test configuration and basic test suite
- **Code Quality**: Fixed ESLint warnings and improved code maintainability

### Changed
- **Satellite Categories**: Now supports all 35+ categories from Celestrak (previously only ISS)
- **Geocoding Service**: No longer requires API keys, uses free Nominatim service
- **Pass Prediction Accuracy**: Improved from 10-minute intervals to 1-minute precision
- **API Responses**: Enhanced with metadata and better error messaging
- **Performance**: Reduced API calls through intelligent caching

### Fixed
- Removed unused imports and variables
- Fixed Tailwind CSS configuration export
- Improved component error handling
- Better TypeScript type safety

### Technical Improvements
- Enhanced satellite position calculations
- More robust TLE parsing with fallbacks
- Better coordinate validation
- Improved mobile responsiveness
- Added comprehensive API documentation updates

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