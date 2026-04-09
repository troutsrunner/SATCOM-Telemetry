# Changelog

All notable changes to SATCOM-Telemetry will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

### Technical Features
- SGP4/SDP4 orbital propagation using satellite.js
- Azimuth, elevation, and range calculations
- Multiple satellite categories support
- Real-time position updates
- Interactive maps with Leaflet
- API routes for satellite data

## [0.1.0] - 2024-04-09

### Added
- Project initialization with Next.js and TypeScript
- Basic component structure
- Satellite data models and types
- Location input and geolocation functionality
- Satellite selection interface
- Orbital calculation utilities
- Project documentation (README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT)
- CI/CD pipeline with GitHub Actions
- TypeScript compilation fixes

### Fixed
- TypeScript compilation errors in hooks and components
- Missing return statements in custom hooks
- Chart.js ref typing issues
- API route parameter handling