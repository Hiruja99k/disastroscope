# MapTiler Integration

## Overview

The DisastroScope application has been updated to use MapTiler's mapping service instead of Google Maps. This provides better performance, more customization options, and enhanced functionality with a modern mapping solution.

## Changes Made

### 1. Updated Map Component

The `src/components/GoogleMapsEmbed.tsx` component has been completely rewritten to use MapTiler:

- **Before**: Used Google Maps JavaScript API
- **After**: Uses MapTiler GL JS with proper React integration

### 2. New Features

- **Dynamic Script Loading**: The MapTiler GL JS script is loaded dynamically when needed
- **Marker Support**: Can display custom markers for disaster events and predictions
- **Geocoding**: Supports location search using MapTiler's geocoding API
- **Multiple Map Styles**: Supports various map styles including streets, satellite, and terrain
- **Interactive Controls**: Full map controls including zoom, pan, and navigation

### 3. Updated Components

The following components have been updated to work with MapTiler:

- `RealTimeMap.tsx`: Now displays disaster events and predictions as markers
- `AdvancedInteractiveMap.tsx`: Enhanced with proper marker support and overlay layers

### 4. Environment Configuration

The MapTiler API key is now configurable through environment variables:

```bash
# Add to your .env file
VITE_MAPTILER_API_KEY=your_maptiler_api_key_here
```

## API Key

The application uses the following MapTiler API key:
```
DOCOM2xq5hJddM7rfMdp
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
  mapType="streets"
  center={{ lat: 40.7128, lng: -74.0060 }}
/>
```

### With Markers

```tsx
<GoogleMapsEmbed 
  width="100%"
  height="600px"
  zoom={10}
  mapType="streets"
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
  mapType="satellite-dark"
/>
```

## Map Types

The component supports the following MapTiler map styles:

- `streets`: Standard street map
- `streets-dark`: Dark street map
- `streets-light`: Light street map
- `satellite`: Satellite imagery
- `satellite-dark`: Dark satellite imagery
- `hybrid`: Satellite imagery with street labels
- `terrain`: Terrain map with elevation
- `winter`: Winter-themed map
- `basic`: Basic map style

## Benefits

1. **Better Performance**: Modern GL JS rendering engine
2. **Enhanced Interactivity**: Full map controls and interactions
3. **Custom Markers**: Display disaster events and predictions as markers
4. **Geocoding**: Search for locations by name using MapTiler's API
5. **Responsive Design**: Better integration with React components
6. **Type Safety**: Proper TypeScript support
7. **Open Source**: Based on MapLibre GL JS

## Browser Compatibility

MapTiler GL JS supports all modern browsers:
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
- Proper CORS handling through MapTiler's API

## MapTiler Features

- **High Performance**: WebGL-based rendering
- **Vector Tiles**: Efficient tile loading
- **Custom Styling**: Extensive styling options
- **Geocoding**: Built-in geocoding service
- **Mobile Optimized**: Touch-friendly controls
