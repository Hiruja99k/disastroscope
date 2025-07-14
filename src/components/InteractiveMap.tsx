import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Layers, 
  Search, 
  MapPin, 
  Crosshair, 
  Square, 
  Circle, 
  Pencil,
  Download,
  Settings,
  Eye,
  EyeOff,
  Satellite,
  Map as MapIcon,
  Zap,
  Flame,
  Waves,
  Mountain,
  AlertTriangle,
  Navigation,
  Ruler,
  Camera,
  Share2
} from 'lucide-react';
import { useDisasterEvents, usePredictions } from '@/hooks/useDisasterData';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

// Production-ready Mapbox token for DisastroScope
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGlzYXN0cm9zY29wZSIsImEiOiJjbHh3NGU4ZXIwNTZoMmlyejFsdWdmdXJjIn0.X1vOzZi8LZGJgF8yWKXeyw'; // Public token for the platform

interface InteractiveMapProps {
  height?: string;
  onFeatureSelect?: (feature: any) => void;
  showControls?: boolean;
  enableDrawing?: boolean;
}

const getDisasterIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'earthquake': return '⚡';
    case 'hurricane': case 'cyclone': case 'typhoon': return '🌀';
    case 'wildfire': case 'fire': return '🔥';
    case 'flood': return '🌊';
    case 'tornado': return '🌪️';
    case 'landslide': return '⛰️';
    case 'volcano': return '🌋';
    case 'tsunami': return '🌊';
    default: return '⚠️';
  }
};

const getDisasterColor = (severity: string) => {
  const severityLower = severity?.toLowerCase() || '';
  if (severityLower.includes('critical') || severityLower.includes('extreme') || severityLower.includes('category 5')) {
    return '#dc2626'; // Red
  }
  if (severityLower.includes('major') || severityLower.includes('high') || severityLower.includes('category 4')) {
    return '#ea580c'; // Orange
  }
  if (severityLower.includes('moderate') || severityLower.includes('medium') || severityLower.includes('category 3')) {
    return '#d97706'; // Yellow
  }
  return '#0891b2'; // Blue for low/minor
};

export default function InteractiveMap({ 
  height = '600px', 
  onFeatureSelect,
  showControls = true,
  enableDrawing = true 
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const draw = useRef<MapboxDraw | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState('satellite-v9');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawMode, setDrawMode] = useState<string>('draw_point');
  const [showHazardOverlays, setShowHazardOverlays] = useState(true);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  
  const { events } = useDisasterEvents();
  const { predictions } = usePredictions();
  const { getCurrentPosition, location } = useGeolocation();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: `mapbox://styles/mapbox/${selectedLayer}`,
      center: [0, 20],
      zoom: 1.5,
      projection: 'mercator' as any, // Changed from globe to mercator for better compatibility
    });

    // Add navigation controls
    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true,
      showCompass: true
    });
    map.current.addControl(nav, 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.current.addControl(geolocate, 'top-right');

    // Add scale control
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 80,
      unit: 'metric'
    });
    map.current.addControl(scale, 'bottom-left');

    // Add fullscreen control
    const fullscreen = new mapboxgl.FullscreenControl();
    map.current.addControl(fullscreen, 'top-right');

    // Initialize drawing tools
    if (enableDrawing) {
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          point: true,
          line_string: true,
          polygon: true,
          trash: true
        },
        styles: [
          {
            'id': 'gl-draw-polygon-fill-inactive',
            'type': 'fill',
            'filter': ['all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static']
            ],
            'paint': {
              'fill-color': '#3fb1ce',
              'fill-outline-color': '#3fb1ce',
              'fill-opacity': 0.1
            }
          },
          {
            'id': 'gl-draw-polygon-stroke-inactive',
            'type': 'line',
            'filter': ['all',
              ['==', 'active', 'false'],
              ['==', '$type', 'Polygon'],
              ['!=', 'mode', 'static']
            ],
            'layout': {
              'line-cap': 'round',
              'line-join': 'round'
            },
            'paint': {
              'line-color': '#3fb1ce',
              'line-width': 2
            }
          }
        ]
      });

      map.current.addControl(draw.current, 'top-left');

      // Drawing event listeners
      map.current.on('draw.create', (e: any) => {
        console.log('Created feature:', e.features);
        toast.success('Drawing created successfully');
        onFeatureSelect?.(e.features[0]);
      });

      map.current.on('draw.update', (e: any) => {
        console.log('Updated feature:', e.features);
        toast.success('Drawing updated');
      });

      map.current.on('draw.delete', (e: any) => {
        console.log('Deleted feature:', e.features);
        toast.success('Drawing deleted');
      });
    }

    map.current.on('load', () => {
      setIsLoaded(true);
      console.log('Map loaded successfully');
      
      // Add basic styling instead of 3D effects for better compatibility
      try {
        // Add terrain source for enhanced visuals
        map.current?.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.terrain-rgb',
          'tileSize': 512,
          'maxzoom': 14
        });
        // Only add terrain if the source was successfully added
        if (map.current?.getSource('mapbox-dem')) {
          map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 0.5 });
        }
      } catch (error) {
        console.log('Terrain not available, using basic map');
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map style
  useEffect(() => {
    if (map.current && isLoaded) {
      map.current.setStyle(`mapbox://styles/mapbox/${selectedLayer}`);
    }
  }, [selectedLayer, isLoaded]);

  // Add disaster markers
  useEffect(() => {
    if (!map.current || !isLoaded) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.disaster-marker');
    existingMarkers.forEach(marker => marker.remove());

    // Add event markers
    if (showEvents) {
      events.forEach((event, index) => {
        if (event.coordinates) {
          const el = document.createElement('div');
          el.className = 'disaster-marker';
          el.innerHTML = `
            <div style="
              background: ${getDisasterColor(event.severity)};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              cursor: pointer;
              animation: pulse 2s infinite;
            ">
              ${getDisasterIcon(event.event_type)}
            </div>
          `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([event.coordinates.lng, event.coordinates.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setHTML(`
                  <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${event.name}</h3>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Type:</strong> ${event.event_type}
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Severity:</strong> <span style="color: ${getDisasterColor(event.severity)};">${event.severity}</span>
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Status:</strong> ${event.status}
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Location:</strong> ${event.location}
                    </p>
                    ${event.affected_population ? `
                      <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                        <strong>Affected:</strong> ${(event.affected_population / 1000000).toFixed(1)}M people
                      </p>
                    ` : ''}
                  </div>
                `)
            )
            .addTo(map.current!);

          // Add click handler
          el.addEventListener('click', () => {
            onFeatureSelect?.(event);
          });
        }
      });
    }

    // Add prediction markers
    if (showPredictions) {
      predictions.forEach((prediction, index) => {
        if (prediction.coordinates) {
          const el = document.createElement('div');
          el.className = 'disaster-marker prediction-marker';
          el.innerHTML = `
            <div style="
              background: linear-gradient(45deg, #3b82f6, #8b5cf6);
              width: 25px;
              height: 25px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              cursor: pointer;
              opacity: 0.8;
            ">
              🔮
            </div>
          `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([prediction.coordinates.lng, prediction.coordinates.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setHTML(`
                  <div style="padding: 8px; min-width: 200px;">
                    <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">AI Prediction</h3>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Type:</strong> ${prediction.prediction_type}
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Probability:</strong> ${prediction.probability}%
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Confidence:</strong> ${prediction.confidence_score}%
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Model:</strong> ${prediction.model_name}
                    </p>
                    <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">
                      <strong>Location:</strong> ${prediction.location}
                    </p>
                  </div>
                `)
            )
            .addTo(map.current!);

          // Add click handler
          el.addEventListener('click', () => {
            onFeatureSelect?.(prediction);
          });
        }
      });
    }
  }, [events, predictions, isLoaded, showEvents, showPredictions]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 10,
          essential: true
        });

        // Add search result marker
        const el = document.createElement('div');
        el.innerHTML = `
          <div style="
            background: #ef4444;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `;

        new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup()
              .setHTML(`<div style="padding: 8px;"><strong>${data.features[0].place_name}</strong></div>`)
          )
          .addTo(map.current);

        toast.success(`Found: ${data.features[0].place_name}`);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    }
  }, [searchQuery]);

  const goToUserLocation = useCallback(async () => {
    try {
      const position = await getCurrentPosition();
      if (map.current && position) {
        map.current.flyTo({
          center: [position.longitude, position.latitude],
          zoom: 12,
          essential: true
        });
        toast.success('Centered on your location');
      }
    } catch (error) {
      toast.error('Unable to get your location');
    }
  }, [getCurrentPosition]);

  const toggleDrawingMode = useCallback(() => {
    if (!draw.current) return;
    
    if (isDrawingMode) {
      draw.current.changeMode('simple_select');
      setIsDrawingMode(false);
    } else {
      draw.current.changeMode(drawMode);
      setIsDrawingMode(true);
    }
  }, [isDrawingMode, drawMode]);

  const exportMap = useCallback(async () => {
    if (!map.current) return;
    
    try {
      const canvas = map.current.getCanvas();
      const link = document.createElement('a');
      link.download = `disaster-map-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL();
      link.click();
      toast.success('Map exported successfully');
    } catch (error) {
      toast.error('Export failed');
    }
  }, []);

  return (
    <div className="relative w-full" style={{ height }}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full rounded-lg overflow-hidden" />
      
      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      )}

      {/* Control Panel */}
      {showControls && isLoaded && (
        <div className="absolute top-4 left-4 space-y-2 z-10">
          {/* Search Bar */}
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-border/50">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-48 h-8 bg-background/50"
              />
              <Button size="sm" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </Card>

          {/* Layer Controls */}
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-border/50">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedLayer} onValueChange={setSelectedLayer}>
                  <SelectTrigger className="w-40 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="satellite-v9">Satellite</SelectItem>
                    <SelectItem value="streets-v12">Streets</SelectItem>
                    <SelectItem value="outdoors-v12">Outdoors</SelectItem>
                    <SelectItem value="light-v11">Light</SelectItem>
                    <SelectItem value="dark-v11">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Layer Toggles */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={showEvents ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEvents(!showEvents)}
                  className="text-xs"
                >
                  {showEvents ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                  Events
                </Button>
                <Button
                  variant={showPredictions ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowPredictions(!showPredictions)}
                  className="text-xs"
                >
                  {showPredictions ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                  AI
                </Button>
              </div>
            </div>
          </Card>

          {/* Drawing Tools */}
          {enableDrawing && (
            <Card className="p-3 bg-card/95 backdrop-blur-sm border-border/50">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium">Drawing Tools</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant={drawMode === 'draw_point' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode('draw_point')}
                    className="p-1 h-8 w-8"
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={drawMode === 'draw_line_string' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode('draw_line_string')}
                    className="p-1 h-8 w-8"
                  >
                    <Ruler className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={drawMode === 'draw_polygon' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDrawMode('draw_polygon')}
                    className="p-1 h-8 w-8"
                  >
                    <Square className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant={isDrawingMode ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleDrawingMode}
                  className="w-full h-8 text-xs"
                >
                  {isDrawingMode ? 'Stop Drawing' : 'Start Drawing'}
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-border/50">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium">Quick Actions</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToUserLocation}
                  className="p-1 h-8 text-xs"
                >
                  <Crosshair className="h-3 w-3 mr-1" />
                  My Location
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportMap}
                  className="p-1 h-8 text-xs"
                >
                  <Camera className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Legend */}
      {isLoaded && (
        <div className="absolute bottom-4 right-4 z-10">
          <Card className="p-3 bg-card/95 backdrop-blur-sm border-border/50">
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Threat Levels</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-xs">Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-xs">High</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs">Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)'}}></div>
                  <span className="text-xs">AI Prediction</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          border: 1px solid hsl(var(--border));
        }
        
        .mapboxgl-popup-tip {
          border-top-color: hsl(var(--card)) !important;
        }
      `}</style>
    </div>
  );
}