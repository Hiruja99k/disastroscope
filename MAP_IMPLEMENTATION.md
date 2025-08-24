# Disaster Map Implementation

## Overview

The DisastroScope application now features a fresh, lightweight MapTiler-based disaster map that displays real-time disaster events and AI predictions with clear visual distinction.

## Features

### 🗺️ MapTiler Integration
- **Streets Style**: Clean, modern map interface using MapTiler's streets style
- **Lightweight**: Optimized for performance with minimal dependencies
- **Responsive**: Adapts to different screen sizes and orientations
- **User-Friendly**: Intuitive interface without overwhelming controls

### 🎯 Disaster Visualization
- **Color-Coded Markers**: Each disaster type has a distinct color for easy identification
  - 🔴 **Red**: Wildfires
  - 🔵 **Blue**: Floods
  - 🟣 **Purple**: Earthquakes
  - 🟢 **Green**: Storms/Hurricanes/Tornadoes
  - 🟠 **Orange**: Droughts
  - 🟤 **Brown**: Landslides
  - ⚫ **Gray**: Unknown types

### 🔮 Prediction Markers
- **Amber/Yellow**: AI predictions with probability indicators
- **Lightning Icon**: Distinct visual for prediction markers
- **Probability Display**: Shows prediction confidence in popups

### 📱 Interactive Features
- **Hover Effects**: Markers scale and highlight on hover
- **Detailed Popups**: Rich information cards with event details
- **Real-time Updates**: Live data integration with disaster events
- **Sample Data**: Fallback data for testing and demonstration

## Technical Implementation

### MapTiler API Key
```
DOCOM2xq5hJddM7rfMdp
```

### Component Structure
```tsx
<DisasterMap 
  events={disasterEvents}
  predictions={aiPredictions}
  height="500px"
  className="custom-styles"
/>
```

### Key Features
- **Dynamic Script Loading**: MapTiler GL JS loaded on-demand
- **Error Handling**: Graceful fallbacks for loading failures
- **TypeScript Support**: Full type safety with proper interfaces
- **Performance Optimized**: Efficient marker rendering and event handling

## Usage

### Basic Implementation
```tsx
import DisasterMap from '@/components/DisasterMap';

function Dashboard() {
  return (
    <DisasterMap 
      events={events}
      predictions={predictions}
      height="500px"
    />
  );
}
```

### With Custom Styling
```tsx
<DisasterMap 
  events={events}
  predictions={predictions}
  height="600px"
  className="rounded-lg shadow-lg"
/>
```

## Data Structure

### Disaster Event Interface
```typescript
interface DisasterEvent {
  id: string;
  name: string;
  event_type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location: string;
  timestamp: string;
  status: string;
}
```

### Prediction Interface
```typescript
interface Prediction {
  id: string;
  event_type: string;
  severity: string;
  latitude: number;
  longitude: number;
  location: string;
  probability: number;
  timeframe: string;
}
```

## Benefits

1. **Clean Design**: Removed complex controls for a streamlined experience
2. **Fast Loading**: Lightweight implementation with minimal overhead
3. **Clear Visualization**: Distinct colors and icons for easy identification
4. **Responsive**: Works seamlessly across all device sizes
5. **Maintainable**: Simple, well-structured codebase
6. **Extensible**: Easy to add new disaster types and features

## Migration Notes

- Removed old map components: `InteractiveMap`, `RealTimeMap`, `AdvancedInteractiveMap`, `FallbackMap`, `MapboxInput`
- Replaced with single `DisasterMap` component
- Updated all dashboard and map pages to use new component
- Maintained backward compatibility with existing data structures
