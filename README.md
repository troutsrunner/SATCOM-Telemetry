# SATCOM-Telemetry

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

Real-time satellite tracking and telemetry application. Know where you are, when satellites pass overhead, and track their orbital data in real-time.

## Features

- **Real-time satellite tracking** using live TLE data from Celestrak
- **Location services** with automatic geolocation or manual coordinate input
- **Live metrics** including azimuth, elevation, range, and velocity calculations
- **Interactive orbital visualization** with charts
- **Pass prediction calculations** for satellite visibility
- **Interactive maps** showing satellite positions
- **Multiple satellite categories** (35+ categories supported)
- **Dark mode support** (Light, Dark, Auto options)
- **Unit system selection** (Metric and Imperial measurements)
- **Responsive design** for desktop and mobile devices
- **Error handling** and loading states throughout the app

## Quick Start

### Prerequisites

- Node.js 20.9.0+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/troutsrunner/SATCOM-Telemetry.git
cd SATCOM-Telemetry/app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. Set your location using the location input (automatic geolocation or manual coordinates)
2. Select a satellite from various categories (GPS, weather, communication, etc.)
3. View real-time satellite metrics and orbital information
4. Check pass predictions to see when the satellite will be visible

## Architecture

This application uses modern web technologies:

- **Frontend**: Next.js 16+ with React 19+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Satellite Calculations**: satellite.js library with SGP4/SDP4 propagation
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Chart.js with react-chartjs-2
- **Geocoding**: Nominatim (OpenStreetMap) - no API key required
- **Satellite Data**: Live TLE data from Celestrak
- **Testing**: Jest with jsdom environment

### Data Flow

1. User inputs location (geolocation or manual coordinates via Nominatim geocoding)
2. Satellite catalog is fetched live from Celestrak TLE data sources
3. Real-time orbital calculations using SGP4 propagation
4. Observer metrics calculated (azimuth, elevation, range, velocity)
5. Pass predictions computed with high accuracy
6. Data visualized through interactive components with error handling

## Recent Improvements

### v1.1.0 - Production Ready Release

- **Real Satellite Data**: Replaced demo data with live Celestrak API integration
- **Enhanced Geocoding**: Switched to free Nominatim service (no API keys needed)
- **Improved Pass Prediction**: More accurate calculations with binary search algorithms
- **Error Handling**: Comprehensive error handling and user feedback throughout the app
- **Performance**: TLE data caching (24-hour cache) for better performance
- **Code Quality**: Fixed linting issues and improved code maintainability
- **Testing**: Added Jest testing framework with basic test suite
- **API Improvements**: Better validation, error responses, and metadata

### Key Features Added
- Loading states and retry functionality for failed requests
- Input validation for all API endpoints
- Support for all 35+ satellite categories from Celestrak
- Enhanced satellite position accuracy
- Better mobile responsiveness

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

Please see our Security Policy for information on reporting vulnerabilities.

## Acknowledgments

- satellite.js for orbital calculations
- Celestrak for TLE data sources
- Next.js for the React framework</content>
<parameter name="filePath">/workspaces/SATCOM-Telemetry/README.md# SATCOM-Telemetry

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

Real-time satellite tracking and telemetry application. Know where you are, when satellites pass overhead, and track their orbital data in real-time.

![SATCOM-Telemetry Dashboard](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=SATCOM-Telemetry+Dashboard)

## Features

- **Real-time Satellite Tracking** - Track satellite positions using TLE data
- **Location Services** - Automatic geolocation or manual coordinate input
- **Live Metrics** - Azimuth, elevation, range, and velocity calculations
- **Orbital Visualization** - Interactive charts showing satellite paths
- **Pass Predictions** - Calculate when satellites will be visible
- **Interactive Maps** - Visualize satellite positions on maps
- **Responsive Design** - Works on desktop and mobile devices

## Quick Start

### Prerequisites

- Node.js 20.9.0+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/troutsrunner/SATCOM-Telemetry.git
cd SATCOM-Telemetry/app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Set Your Location**: Use the location input to set your observing position
2. **Select a Satellite**: Choose from various satellite categories (GPS, weather, communication, etc.)
3. **View Real-time Data**: Monitor live satellite metrics and orbital information
4. **Check Pass Predictions**: See when the satellite will next be visible from your location

## Architecture

This application uses modern web technologies:

- **Frontend**: Next.js 14+ with React 18+
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Satellite Calculations**: satellite.js library
- **Maps**: Leaflet with React-Leaflet
- **Charts**: Chart.js with react-chartjs-2

### Data Flow

1. User inputs location (geolocation or manual coordinates)
2. Satellite catalog is fetched from TLE data sources
3. Real-time orbital calculations using SGP4 propagation
4. Observer metrics calculated (azimuth, elevation, range)
5. Data visualized through interactive components

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Security

Please see our [Security Policy](SECURITY.md) for information on reporting vulnerabilities.

## Acknowledgments

- [satellite.js](https://github.com/shashwatak/satellite-js) for orbital calculations
- [Celestrak](https://celestrak.org/) for TLE data sources
- [Next.js](https://nextjs.org/) for the React framework
- **Visualization**: Chart.js with react-chartjs-2 for charts and graphs
- **Maps**: Leaflet with React-Leaflet for location visualization
- **Real-time Updates**: Server-Sent Events (SSE) or WebSocket for live data

#### Key Libraries

- **satellite.js**: Core library for TLE parsing and orbital mechanics calculations
- **geolib**: Geographic calculations and coordinate conversions
- **date-fns**: Date/time manipulation for pass predictions
- **axios**: HTTP client for TLE data fetching

#### Application Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── location/      # Geolocation services
│   │   ├── satellites/    # Satellite data endpoints
│   │   └── passes/        # Pass prediction endpoints
│   ├── dashboard/         # Main dashboard page
│   ├── satellites/        # Satellite selection page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── LocationInput.tsx  # Location input form
│   ├── SatelliteSelector.tsx # Satellite dropdown/search
│   ├── MetricsDisplay.tsx # Real-time metrics
│   ├── OrbitalPlot.tsx    # Azimuth/elevation chart
│   ├── PassTable.tsx      # Upcoming passes table
│   └── MapView.tsx        # Location map
├── lib/                   # Utility functions
│   ├── satellite.ts       # Satellite calculation wrappers
│   ├── geolocation.ts     # Location utilities
│   └── tle.ts             # TLE data management
├── types/                 # TypeScript type definitions
│   ├── satellite.ts       # Satellite-related types
│   ├── location.ts        # Location types
│   └── api.ts             # API response types
└── hooks/                 # Custom React hooks
    ├── useSatelliteData.ts
    ├── useLocation.ts
    └── usePassPrediction.ts
```

### Data Flow and Processing

#### 1. Location Acquisition
- User provides location via form input or browser geolocation
- Coordinates normalized to WGS84 standard
- Observer altitude estimated (default 0m, with option for manual input)

#### 2. Satellite Data Retrieval
- TLE data fetched from Celestrak API endpoints
- Data cached locally with configurable refresh intervals
- Satellite catalog maintained with metadata (name, NORAD ID, category)

#### 3. Real-time Calculations
- Satellite position propagated using SGP4 algorithm
- Observer-to-satellite vector calculations
- Azimuth/elevation computed using spherical trigonometry
- Orbital velocity derived from position derivatives
- Slant range calculated as Euclidean distance

#### 4. Pass Prediction Algorithm
- Satellite ground track simulation over prediction horizon
- Elevation angle monitoring for horizon crossings
- Pass events identified (rise, culmination, set)
- Radio visibility windows calculated based on elevation thresholds

#### 5. Data Visualization Pipeline
- Real-time metrics updated via polling/WebSocket
- Chart data buffered for smooth animation
- Map overlays updated with satellite positions
- Pass predictions displayed in tabular and timeline formats

### API Design

#### REST Endpoints

```
GET  /api/location/geocode?query={city|zip}
POST /api/location/coordinates
GET  /api/satellites/categories
GET  /api/satellites/{noradId}/tle
GET  /api/satellites/{noradId}/position?lat={}&lon={}&alt={}
GET  /api/satellites/{noradId}/passes?lat={}&lon={}&alt={}&days={}
```

#### Real-time Streaming

- Server-Sent Events endpoint for live position updates
- WebSocket connection for bidirectional communication
- Configurable update frequencies (1Hz to 0.1Hz)

### Performance Considerations

#### Optimization Strategies
- TLE data caching with Redis/memory cache
- Calculation result memoization
- Client-side prediction interpolation between server updates
- Progressive loading of satellite catalogs
- Lazy loading of visualization components

#### Scalability
- Horizontal scaling with load balancer
- Database sharding for large satellite catalogs
- CDN for static assets and TLE data
- Rate limiting for API endpoints

### Security and Privacy

#### Data Protection
- No user data storage without consent
- Location data processed client-side where possible
- HTTPS encryption for all communications
- API key management for external services

#### Access Control
- CORS configuration for web client
- Rate limiting to prevent abuse
- Input validation and sanitization

### Deployment and Operations

#### Infrastructure
- Vercel/Netlify for frontend hosting
- Node.js server on cloud platform (AWS/GCP/Azure)
- Database for satellite metadata (PostgreSQL/MongoDB)
- Redis for caching layer

#### Monitoring
- Application performance monitoring (APM)
- Error tracking and alerting
- Usage analytics and metrics
- TLE data freshness monitoring

### Development Workflow

#### Local Development
- Next.js development server
- Hot reloading for rapid iteration
- Mock TLE data for offline development
- Unit and integration tests with Jest

#### Testing Strategy
- Unit tests for calculation functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for real-time updates

### Future Enhancements

#### Advanced Features
- 3D orbital visualization with Three.js
- Satellite constellation tracking
- Doppler shift calculations for radio work
- Integration with radio telescope control systems
- Mobile app companion
- Offline prediction capabilities

#### Technical Improvements
- WebAssembly for high-performance calculations
- Machine learning for prediction accuracy
- Real-time TLE updates via push notifications
- Multi-satellite simultaneous tracking

This blueprint provides a solid foundation for implementing the SATCOM-Telemetry application. The modular architecture allows for incremental development and future scalability.
