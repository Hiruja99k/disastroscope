import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Flame, 
  Waves, 
  Zap, 
  Mountain,
  CloudRain,
  Wind
} from 'lucide-react';

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

interface DisasterMapProps {
  events?: DisasterEvent[];
  predictions?: Prediction[];
  height?: string;
  className?: string;
}

// Sample data for testing when no real data is provided
const sampleEvents: DisasterEvent[] = [
  {
    id: '1',
    name: 'California Wildfire',
    event_type: 'Wildfire',
    severity: 'High',
    latitude: 34.0522,
    longitude: -118.2437,
    location: 'Los Angeles, CA',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: '2',
    name: 'Florida Hurricane',
    event_type: 'Hurricane',
    severity: 'Critical',
    latitude: 25.7617,
    longitude: -80.1918,
    location: 'Miami, FL',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'active'
  },
  {
    id: '3',
    name: 'Texas Flood',
    event_type: 'Flood',
    severity: 'Medium',
    latitude: 29.7604,
    longitude: -95.3698,
    location: 'Houston, TX',
    timestamp: '2024-01-15T08:45:00Z',
    status: 'active'
  }
];

const samplePredictions: Prediction[] = [
  {
    id: '1',
    event_type: 'Earthquake',
    severity: 'Medium',
    latitude: 37.7749,
    longitude: -122.4194,
    location: 'San Francisco, CA',
    probability: 0.75,
    timeframe: 'Next 48 hours'
  },
  {
    id: '2',
    event_type: 'Storm',
    severity: 'High',
    latitude: 40.7128,
    longitude: -74.0060,
    location: 'New York, NY',
    probability: 0.85,
    timeframe: 'Next 24 hours'
  }
];

// Disaster type to color mapping
const getDisasterColor = (type: string): string => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('fire') || typeLower.includes('wildfire')) return '#dc2626'; // Red
  if (typeLower.includes('flood') || typeLower.includes('water')) return '#2563eb'; // Blue
  if (typeLower.includes('earthquake') || typeLower.includes('quake')) return '#7c3aed'; // Purple
  if (typeLower.includes('storm') || typeLower.includes('hurricane') || typeLower.includes('tornado')) return '#059669'; // Green
  if (typeLower.includes('drought')) return '#d97706'; // Orange
  if (typeLower.includes('landslide')) return '#92400e'; // Brown
  return '#6b7280'; // Gray for unknown types
};

// Disaster type to icon mapping
const getDisasterIcon = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower.includes('fire') || typeLower.includes('wildfire')) return Flame;
  if (typeLower.includes('flood') || typeLower.includes('water')) return Waves;
  if (typeLower.includes('earthquake') || typeLower.includes('quake')) return Zap;
  if (typeLower.includes('storm') || typeLower.includes('hurricane') || typeLower.includes('tornado')) return Wind;
  if (typeLower.includes('drought')) return CloudRain;
  if (typeLower.includes('landslide')) return Mountain;
  return AlertTriangle;
};

export default function DisasterMap({ 
  events = [], 
  predictions = [], 
  height = '500px',
  className = ''
}: DisasterMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const MAPTILER_API_KEY = 'DOCOM2xq5hJddM7rfMdp';

  // Use sample data if no real data is provided
  const displayEvents = events.length > 0 ? events : sampleEvents;
  const displayPredictions = predictions.length > 0 ? predictions : samplePredictions;

  useEffect(() => {
    // Load MapTiler GL JS
    const loadMapTiler = () => {
      try {
        if (window.maplibregl) {
          setIsLoaded(true);
          setIsLoading(false);
          return;
        }

        // Load MapTiler GL JS CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        document.head.appendChild(link);

        // Load MapTiler GL JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/maplibre-gl@3.6.2/dist/maplibre-gl.js';
        script.async = true;
        script.onload = () => {
          setIsLoaded(true);
          setIsLoading(false);
        };
        script.onerror = () => {
          setLoadError('Failed to load MapTiler library');
          setIsLoading(false);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading MapTiler:', error);
        setLoadError('Failed to load MapTiler library');
        setIsLoading(false);
      }
    };

    loadMapTiler();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    try {
      // Initialize map with streets style
      const mapOptions = {
        container: mapRef.current,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_API_KEY}`,
        center: [0, 20] as [number, number], // Default center
        zoom: 2,
        attributionControl: false,
        boxZoom: true,
        doubleClickZoom: true,
        dragPan: true,
        dragRotate: false, // Disable rotation for simplicity
        keyboard: true,
        scrollZoom: true,
        touchZoomRotate: true
      };

    try {
      mapInstanceRef.current = new window.maplibregl.Map(mapOptions);

      mapInstanceRef.current.on('load', () => {
        console.log('Map loaded successfully');
        console.log('Adding markers for events:', displayEvents.length);
        console.log('Adding markers for predictions:', displayPredictions.length);
        // Add all disaster events as markers
        displayEvents.forEach(event => {
          // Validate coordinates before adding marker
          if (typeof event.latitude !== 'number' || typeof event.longitude !== 'number' ||
              isNaN(event.latitude) || isNaN(event.longitude) ||
              event.latitude < -90 || event.latitude > 90 ||
              event.longitude < -180 || event.longitude > 180) {
            console.warn(`Invalid coordinates for event ${event.name}: lat=${event.latitude}, lng=${event.longitude}`);
            return; // Skip this marker
          }

          const color = getDisasterColor(event.event_type);
          const IconComponent = getDisasterIcon(event.event_type);
          
          // Create marker element
          const markerEl = document.createElement('div');
          markerEl.className = 'disaster-marker';
          markerEl.style.width = '24px';
          markerEl.style.height = '24px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = color;
          markerEl.style.border = '3px solid white';
          markerEl.style.cursor = 'pointer';
          markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          markerEl.style.transition = 'all 0.2s ease';
          markerEl.style.display = 'flex';
          markerEl.style.alignItems = 'center';
          markerEl.style.justifyContent = 'center';
          markerEl.title = `${event.name} - ${event.severity}`;

          // Add icon to marker
          const iconEl = document.createElement('div');
          iconEl.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`;
          markerEl.appendChild(iconEl);

          // Add hover effect
          markerEl.addEventListener('mouseenter', () => {
            markerEl.style.transform = 'scale(1.2)';
            markerEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          });

          markerEl.addEventListener('mouseleave', () => {
            markerEl.style.transform = 'scale(1)';
            markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          });

          // Create popup
          const popup = new window.maplibregl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
          }).setHTML(`
            <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${color}; border: 2px solid white;"></div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  ${event.name}
                </h3>
              </div>
              <div style="margin-bottom: 8px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: capitalize;">
                  ${event.event_type}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                  ${event.location}
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #9ca3af;">
                  ${new Date(event.timestamp).toLocaleDateString()}
                </span>
                <span style="font-size: 12px; padding: 2px 8px; border-radius: 12px; background-color: ${color}20; color: ${color}; font-weight: 500;">
                  ${event.severity}
                </span>
              </div>
            </div>
          `);

          // Add marker to map
          new window.maplibregl.Marker({ element: markerEl })
            .setLngLat([event.longitude, event.latitude])
            .setPopup(popup)
            .addTo(mapInstanceRef.current);
        });

        // Add all predictions as markers (yellow/orange color)
        displayPredictions.forEach(prediction => {
          // Validate coordinates before adding marker
          if (typeof prediction.latitude !== 'number' || typeof prediction.longitude !== 'number' ||
              isNaN(prediction.latitude) || isNaN(prediction.longitude) ||
              prediction.latitude < -90 || prediction.latitude > 90 ||
              prediction.longitude < -180 || prediction.longitude > 180) {
            console.warn(`Invalid coordinates for prediction ${prediction.event_type}: lat=${prediction.latitude}, lng=${prediction.longitude}`);
            return; // Skip this marker
          }
          const markerEl = document.createElement('div');
          markerEl.className = 'prediction-marker';
          markerEl.style.width = '20px';
          markerEl.style.height = '20px';
          markerEl.style.borderRadius = '50%';
          markerEl.style.backgroundColor = '#f59e0b'; // Amber for predictions
          markerEl.style.border = '3px solid white';
          markerEl.style.cursor = 'pointer';
          markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          markerEl.style.transition = 'all 0.2s ease';
          markerEl.style.display = 'flex';
          markerEl.style.alignItems = 'center';
          markerEl.style.justifyContent = 'center';
          markerEl.title = `Prediction: ${prediction.event_type} - ${(prediction.probability * 100).toFixed(0)}%`;

          // Add prediction icon
          const iconEl = document.createElement('div');
          iconEl.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
          markerEl.appendChild(iconEl);

          // Add hover effect
          markerEl.addEventListener('mouseenter', () => {
            markerEl.style.transform = 'scale(1.2)';
            markerEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
          });

          markerEl.addEventListener('mouseleave', () => {
            markerEl.style.transform = 'scale(1)';
            markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          });

          // Create popup
          const popup = new window.maplibregl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            maxWidth: '300px'
          }).setHTML(`
            <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #f59e0b; border: 2px solid white;"></div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                  AI Prediction
                </h3>
              </div>
              <div style="margin-bottom: 8px;">
                <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: capitalize;">
                  ${prediction.event_type}
                </p>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">
                  ${prediction.location}
                </p>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 12px; color: #9ca3af;">
                  ${prediction.timeframe}
                </span>
                <span style="font-size: 12px; padding: 2px 8px; border-radius: 12px; background-color: #f59e0b20; color: #d97706; font-weight: 500;">
                  ${(prediction.probability * 100).toFixed(0)}% probability
                </span>
              </div>
            </div>
          `);

          // Add marker to map
          new window.maplibregl.Marker({ element: markerEl })
            .setLngLat([prediction.longitude, prediction.latitude])
            .setPopup(popup)
            .addTo(mapInstanceRef.current);
        });
      });

      mapInstanceRef.current.on('error', (error: any) => {
        console.error('Map error:', error);
        setLoadError('Map initialization failed');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Failed to initialize map');
    }
  }, [isLoaded, displayEvents, displayPredictions]);

  if (loadError) {
    return (
      <Card className={`p-6 ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm text-red-600">Map Error: {loadError}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className={`p-6 ${className}`} style={{ height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading disaster map...</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`} style={{ height }}>
      <div className="p-4 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-900">Global Disaster Map</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Real-time
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Disasters ({displayEvents.filter(e => 
                typeof e.latitude === 'number' && typeof e.longitude === 'number' &&
                !isNaN(e.latitude) && !isNaN(e.longitude) &&
                e.latitude >= -90 && e.latitude <= 90 &&
                e.longitude >= -180 && e.longitude <= 180
              ).length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span>Predictions ({displayPredictions.filter(p => 
                typeof p.latitude === 'number' && typeof p.longitude === 'number' &&
                !isNaN(p.latitude) && !isNaN(p.longitude) &&
                p.latitude >= -90 && p.latitude <= 90 &&
                p.longitude >= -180 && p.longitude <= 180
              ).length})</span>
            </div>
          </div>
        </div>
      </div>
      <div 
        ref={mapRef}
        className="w-full"
        style={{ height: `calc(${height} - 80px)` }}
      />
    </Card>
  );
}
