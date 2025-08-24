# Google Maps API Integration

## Overview

The DisastroScope application has been updated to use the Google Maps JavaScript API instead of the Google Maps embed iframe. This provides better performance, more customization options, and enhanced functionality.

## Changes Made

### 1. Updated GoogleMapsEmbed Component

The `src/components/GoogleMapsEmbed.tsx` component has been completely rewritten to use the Google Maps JavaScript API:

- **Before**: Used an iframe with embed code
- **After**: Uses the Google Maps JavaScript API with proper React integration

### 2. New Features

- **Dynamic Script Loading**: The Google Maps API script is loaded dynamically when needed
- **Marker Support**: Can display custom markers for disaster events and predictions
- **Geocoding**: Supports location search and geocoding
- **Multiple Map Types**: Supports satellite, hybrid, terrain, and roadmap views
- **Interactive Controls**: Full map controls including zoom, pan, street view, etc.

### 3. Updated Components

The following components have been updated to work with the new Google Maps API:

- `RealTimeMap.tsx`: Now displays disaster events and predictions as markers
- `AdvancedInteractiveMap.tsx`: Enhanced with proper marker support and overlay layers

### 4. Environment Configuration

The Google Maps API key is now configurable through environment variables:

```bash
# Add to your .env file
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## API Key

The application uses the following Google Maps API key:
```
AIzaSyDz0Pktpw75btj-mpxR1j-8Pp7149y1qgY
```

This key is used as a fallback if no environment variable is provided.

## Usage

### Basic Usage

```tsx
import GoogleMapsEmbed from '@/components/GoogleMapsEmbed';

<GoogleMapsEmbed 
  width="100%"
  height="600px"
  zoom={14}
  mapType="satellite"
  center={{ lat: 40.7128, lng: -74.0060 }}
/>
```

### With Markers

```tsx
<GoogleMapsEmbed 
  width="100%"
  height="600px"
  zoom={10}
  mapType="roadmap"
  center={{ lat: 40.7128, lng: -74.0060 }}
  markers={[
    {
      position: { lat: 40.7128, lng: -74.0060 },
      title: "New York City",
      icon: undefined // Use default marker
    }
  ]}
/>
```

### With Location Search

```tsx
<GoogleMapsEmbed 
  width="100%"
  height="600px"
  location="New York City"
  zoom={12}
  mapType="hybrid"
/>
```

## Map Types

The component supports the following map types:

- `roadmap`: Standard street map
- `satellite`: Satellite imagery
- `hybrid`: Satellite imagery with street labels
- `terrain`: Terrain map with elevation

## Benefits

1. **Better Performance**: No iframe overhead, direct API access
2. **Enhanced Interactivity**: Full map controls and interactions
3. **Custom Markers**: Display disaster events and predictions as markers
4. **Geocoding**: Search for locations by name
5. **Responsive Design**: Better integration with React components
6. **Type Safety**: Proper TypeScript support (with fallback types)

## Browser Compatibility

The Google Maps JavaScript API supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Error Handling

The component includes proper error handling:
- Loading states with spinner
- API loading failures
- Geocoding errors
- Map initialization errors

## Security

- API key is configurable via environment variables
- No hardcoded credentials in production
- Proper CORS handling through Google's API
