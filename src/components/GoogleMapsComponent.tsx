import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Zap, 
  Flame, 
  Waves, 
  Mountain,
  Wind,
  Globe,
  Layers,
  Satellite,
  Map,
  Mountain as Terrain,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/monitoring';

interface DisasterPoint {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  location?: string;
}

interface GoogleMapsComponentProps {
  height?: string;
  showControls?: boolean;
  events?: any[];
  predictions?: any[];
  onMarkerClick?: (point: DisasterPoint) => void;
}

const getDisasterIcon = (type: string, severity: string) => {
  const baseUrl = 'https://maps.google.com/mapfiles/ms/icons/';
  
  switch (type.toLowerCase()) {
    case 'earthquake':
      return `${baseUrl}red-dot.png`;
    case 'hurricane':
      return `${baseUrl}blue-dot.png`;
    case 'wildfire':
      return `${baseUrl}orange-dot.png`;
    case 'flood':
      return `${baseUrl}ltblue-dot.png`;
    case 'tornado':
      return `${baseUrl}yellow-dot.png`;
    case 'landslide':
      return `${baseUrl}green-dot.png`;
    default:
      return severity === 'critical' ? `${baseUrl}red-dot.png` : 
             severity === 'high' ? `${baseUrl}orange-dot.png` : 
             `${baseUrl}green-dot.png`;
  }
};

const getDisasterColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#dc2626';
    case 'high': return '#ea580c';
    case 'medium': return '#ca8a04';
    case 'low': return '#16a34a';
    default: return '#6b7280';
  }
};

export default function GoogleMapsComponent({ 
  height = '600px', 
  showControls = true, 
  events = [], 
  predictions = [],
  onMarkerClick 
}: GoogleMapsComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street' | 'terrain'>('satellite');
  const [layers, setLayers] = useState({
    disasters: true,
    predictions: true,
    weather: false,
    sensors: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loader = new Loader({
          apiKey: 'AIzaSyDyEQ-dM3CiIXm5XwnSVTqCVK9oC633E7E',
          version: 'weekly',
          libraries: ['places']
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeId: google.maps.MapTypeId.SATELLITE,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'administrative',
              elementType: 'geometry',
              stylers: [{ visibility: 'simplified' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry',
              stylers: [{ visibility: 'simplified' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        setIsLoading(false);

        // Add map event listeners
        map.addListener('click', () => {
          trackEvent('map_clicked');
        });

      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps. Please check your internet connection.');
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const mapTypeId = mapStyle === 'satellite' ? google.maps.MapTypeId.SATELLITE :
                     mapStyle === 'terrain' ? google.maps.MapTypeId.TERRAIN :
                     google.maps.MapTypeId.ROADMAP;

    mapInstanceRef.current.setMapTypeId(mapTypeId);
    trackEvent('map_style_changed', { style: mapStyle });
  }, [mapStyle]);

  // Update markers when events or predictions change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const allData = [
      ...(layers.disasters ? events : []),
      ...(layers.predictions ? predictions : [])
    ];

    allData.forEach((item, index) => {
      if (!item.coordinates?.lat || !item.coordinates?.lng) return;

      const position = {
        lat: item.coordinates.lat,
        lng: item.coordinates.lng
      };

      const marker = new google.maps.Marker({
        position,
        map: mapInstanceRef.current,
        title: item.name || item.description || 'Disaster Event',
        icon: {
          url: getDisasterIcon(item.event_type || item.prediction_type || 'disaster', item.severity || 'medium'),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16)
        },
        animation: google.maps.Animation.DROP
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 300px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600;">
              ${item.name || item.description || 'Disaster Event'}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              ${item.location || 'Unknown Location'}
            </p>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <span style="background: ${getDisasterColor(item.severity || 'medium')}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${item.severity || 'Unknown'} Severity
              </span>
              <span style="background: #e5e7eb; color: #374151; padding: 2px 8px; border-radius: 12px; font-size: 12px;">
                ${item.event_type || item.prediction_type || 'Unknown'} Type
              </span>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 12px;">
              Updated: ${new Date(item.timestamp || Date.now()).toLocaleString()}
            </p>
          </div>
        `
      });

      // Add click listener
      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        trackEvent('marker_clicked', { 
          type: item.event_type || item.prediction_type,
          severity: item.severity 
        });
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      markersRef.current.push(marker);
    });

  }, [events, predictions, layers, onMarkerClick]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    trackEvent('map_fullscreen_toggled', { fullscreen: !isFullscreen });
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: 20, lng: 0 });
      mapInstanceRef.current.setZoom(2);
      trackEvent('map_reset_view');
    }
  };

  if (error) {
    return (
      <Card className="p-6">
        <CardContent className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Map Loading Error</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`} style={{ height }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Google Maps...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />

      {/* Controls Panel */}
      <AnimatePresence>
        {showControls && !isLoading && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Map Controls</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>

            {/* Map Style */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Map Style</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={mapStyle === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('satellite')}
                >
                  <Satellite className="h-4 w-4 mr-1" />
                  Satellite
                </Button>
                <Button
                  variant={mapStyle === 'street' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('street')}
                >
                  <Map className="h-4 w-4 mr-1" />
                  Street
                </Button>
                <Button
                  variant={mapStyle === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapStyle('terrain')}
                >
                  <Terrain className="h-4 w-4 mr-1" />
                  Terrain
                </Button>
              </div>
            </div>

            {/* Layers */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Layers</h4>
              <div className="space-y-2">
                {Object.entries(layers).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <Button
                      variant={value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLayers(prev => ({ ...prev, [key]: !value }))}
                    >
                      {value ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset View */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset View
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live Monitoring</span>
          <Badge variant="outline" className="text-xs">
            {events.length + predictions.length} Active
          </Badge>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-medium mb-2">Legend</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs">Critical Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-xs">High Severity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs">Low/Medium</span>
          </div>
        </div>
      </div>
    </div>
  );
}
