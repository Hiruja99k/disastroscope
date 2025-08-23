import React, { useEffect, useRef, useState } from 'react';
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface OpenStreetMapComponentProps {
  height?: string;
  showControls?: boolean;
  events?: any[];
  predictions?: any[];
  onMarkerClick?: (point: DisasterPoint) => void;
}

// Fix Leaflet icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getDisasterIcon = (type: string, severity: string) => {
  const getColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#ca8a04';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const color = getColor(severity);
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        ${type.charAt(0).toUpperCase()}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
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

export default function OpenStreetMapComponent({ 
  height = '600px', 
  showControls = true, 
  events = [], 
  predictions = [],
  onMarkerClick 
}: OpenStreetMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
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

  // Initialize OpenStreetMap
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!mapRef.current) return;

        // Create map instance with better defaults
        const map = L.map(mapRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: false,
          attributionControl: true,
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          tap: true,
          trackResize: true,
          worldCopyJump: true,
          maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
          maxBoundsViscosity: 1.0,
        });

        // Add zoom control
        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        // Add attribution control
        L.control.attribution({
          position: 'bottomright'
        }).addTo(map);

        // Add tile layers with better providers
        const tileLayers = {
          satellite: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19,
            subdomains: 'abcd'
          }),
          street: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            subdomains: 'abc'
          }),
          terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
            maxZoom: 17,
            subdomains: 'abc'
          })
        };

        // Add default layer (satellite)
        tileLayers.satellite.addTo(map);
        mapInstanceRef.current = map;

        // Store tile layers for later use
        (map as any).tileLayers = tileLayers;

        // Add map event listeners
        map.on('click', () => {
          trackEvent('map_clicked');
        });

        map.on('load', () => {
          setIsLoading(false);
        });

        // Set loading to false after a short delay to ensure map is ready
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error loading OpenStreetMap:', err);
        setError('Failed to load map. Please check your internet connection.');
        setIsLoading(false);
      }
    };

    initMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map style when mapStyle changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    const tileLayers = (map as any).tileLayers;

    // Remove all existing tile layers
    Object.values(tileLayers).forEach((layer: any) => {
      map.removeLayer(layer);
    });

    // Add new tile layer
    const newLayer = tileLayers[mapStyle];
    if (newLayer) {
      newLayer.addTo(map);
    }

    trackEvent('map_style_changed', { style: mapStyle });
  }, [mapStyle]);

  // Update markers when events or predictions change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => map.removeLayer(marker));
    markersRef.current = [];

    const allData = [
      ...(layers.disasters ? events : []),
      ...(layers.predictions ? predictions : [])
    ];

    allData.forEach((item, index) => {
      if (!item.coordinates?.lat || !item.coordinates?.lng) return;

      const position = [item.coordinates.lat, item.coordinates.lng] as [number, number];

      const marker = L.marker(position, {
        icon: getDisasterIcon(item.event_type || item.prediction_type || 'disaster', item.severity || 'medium'),
        interactive: true,
        draggable: false,
        autoPan: false,
        riseOnHover: true,
        riseOffset: 250
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; max-width: 320px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-weight: 600; font-size: 16px;">
            ${item.name || item.description || 'Disaster Event'}
          </h3>
          <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
            ${item.location || 'Unknown Location'}
          </p>
          <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
            <span style="background: ${getDisasterColor(item.severity || 'medium')}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              ${item.severity || 'Unknown'} Severity
            </span>
            <span style="background: #e5e7eb; color: #374151; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500;">
              ${item.event_type || item.prediction_type || 'Unknown'} Type
            </span>
          </div>
          <p style="margin: 0; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 8px;">
            Updated: ${new Date(item.timestamp || Date.now()).toLocaleString()}
          </p>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: 'custom-popup'
      });

      // Add click listener
      marker.on('click', () => {
        trackEvent('marker_clicked', { 
          type: item.event_type || item.prediction_type,
          severity: item.severity 
        });
        if (onMarkerClick) {
          onMarkerClick(item);
        }
      });

      // Add hover effects
      marker.on('mouseover', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1.1)');
      });

      marker.on('mouseout', function() {
        this.getElement()?.style.setProperty('transform', 'scale(1)');
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

  }, [events, predictions, layers, onMarkerClick]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    trackEvent('map_fullscreen_toggled', { fullscreen: !isFullscreen });
  };

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([20, 0], 2);
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
            <p className="text-muted-foreground">Loading Interactive Map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ cursor: 'grab' }} />

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

      {/* Custom CSS for markers and popups */}
      <style jsx>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
