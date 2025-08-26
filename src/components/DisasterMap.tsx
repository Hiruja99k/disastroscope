import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  AlertTriangle, 
  Flame, 
  CloudRain, 
  Wind, 
  Mountain,
  Globe,
  Layers,
  ZoomIn,
  ZoomOut,
  Navigation,
  Compass,
  RefreshCw,
  Maximize2,
  Minimize2,
  Settings,
  Filter,
  Eye,
  Info
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Disaster {
  id: number;
  type: string;
  location: string;
  magnitude: string | number;
  severity: string;
  status: string;
  timestamp: Date;
  affected: number;
  coordinates: [number, number];
}

interface DisasterMapProps {
  disasters: Disaster[];
  advanced?: boolean;
  height?: number;
}

const DisasterMap: React.FC<DisasterMapProps> = ({ disasters, advanced = false, height = 400 }) => {
  const [map, setMap] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapboxToken = 'pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw';

  useEffect(() => {
    if (!mapContainer.current) return;

    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      try {
        // Add Mapbox CSS
        const link = document.createElement('link');
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Load Mapbox GL JS
        const script = document.createElement('script');
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        script.onload = () => {
          initializeMap();
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Mapbox:', error);
        toast.error('Failed to load map');
      }
    };

    loadMapbox();
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current || !(window as any).mapboxgl) return;

    const mapboxgl = (window as any).mapboxgl;
    mapboxgl.accessToken = mapboxToken;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [0, 20],
      zoom: 2,
      attributionControl: false
    });

    newMap.on('load', () => {
      addDisasterMarkers(newMap);
    });

    setMap(newMap);
  };

  const addDisasterMarkers = (mapInstance: any) => {
    disasters.forEach((disaster) => {
      // Input coordinates are provided as [lat, lon] in the dashboard data.
      // Mapbox expects [lon, lat]. Flip the order defensively.
      const [lat, lon] = disaster.coordinates;
      const lngLat: [number, number] = [lon, lat];

      const marker = new (window as any).mapboxgl.Marker({
        color: getDisasterColor(disaster.type),
        scale: getDisasterScale(disaster.severity)
      })
        .setLngLat(lngLat)
        .setPopup(
          new (window as any).mapboxgl.Popup({ offset: 25 })
            .setHTML(createPopupContent(disaster))
        )
        .addTo(mapInstance);

      marker.getElement().addEventListener('click', () => {
        setSelectedDisaster(disaster);
      });
    });
  };

  const getDisasterColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'earthquake': return '#ff4444';
      case 'flood': return '#4444ff';
      case 'wildfire': return '#ff8800';
      case 'storm': return '#8888ff';
      case 'tsunami': return '#00aaff';
      case 'volcano': return '#ff4400';
      default: return '#666666';
    }
  };

  const getDisasterScale = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 1.5;
      case 'high': return 1.2;
      case 'medium': return 1.0;
      case 'low': return 0.8;
      default: return 1.0;
    }
  };

  const createPopupContent = (disaster: Disaster) => {
    return `
      <div class="p-4 max-w-xs">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full" style="background-color: ${getDisasterColor(disaster.type)}"></div>
          <h3 class="font-semibold text-lg">${disaster.type}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-2">${disaster.location}</p>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span class="font-medium">Magnitude:</span>
            <span class="ml-1">${disaster.magnitude}</span>
          </div>
          <div>
            <span class="font-medium">Severity:</span>
            <span class="ml-1">${disaster.severity}</span>
          </div>
          <div>
            <span class="font-medium">Status:</span>
            <span class="ml-1">${disaster.status}</span>
          </div>
          <div>
            <span class="font-medium">Affected:</span>
            <span class="ml-1">${disaster.affected.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (map) {
      setTimeout(() => map.resize(), 100);
    }
  };

  const changeMapStyle = (style: string) => {
    setMapStyle(style);
    if (map) {
      map.setStyle(style);
      map.on('style.load', () => {
        addDisasterMarkers(map);
      });
    }
  };

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'earthquake': return <AlertTriangle className="h-4 w-4" />;
      case 'flood': return <CloudRain className="h-4 w-4" />;
      case 'wildfire': return <Flame className="h-4 w-4" />;
      case 'storm': return <Wind className="h-4 w-4" />;
      case 'volcano': return <Mountain className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  if (!advanced) {
    return (
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full rounded-lg overflow-hidden border"
          style={{ height: `${height}px` }}
        />
        {selectedDisaster && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border max-w-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              {getDisasterIcon(selectedDisaster.type)}
              <h3 className="font-semibold">{selectedDisaster.type}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{selectedDisaster.location}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{selectedDisaster.severity}</Badge>
              <Badge variant="outline">{selectedDisaster.status}</Badge>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <Card className={`${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Advanced Disaster Monitoring Map
            </CardTitle>
            <CardDescription>
              Real-time disaster tracking with advanced visualization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapStyle('mapbox://styles/mapbox/satellite-v9')}
            >
              Satellite
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapStyle('mapbox://styles/mapbox/streets-v12')}
            >
              Streets
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => changeMapStyle('mapbox://styles/mapbox/dark-v11')}
            >
              Dark
            </Button>
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map Controls */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <Badge variant="outline">All Types</Badge>
            <Badge variant="outline">All Severities</Badge>
            <Badge variant="outline">Active Only</Badge>
          </div>

          {/* Map Container */}
          <div className="relative">
            <div 
              ref={mapContainer} 
              className="w-full rounded-lg overflow-hidden border"
              style={{ height: `${height}px` }}
            />
            
            {/* Map Overlay Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button size="icon" variant="secondary" className="w-8 h-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="w-8 h-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="w-8 h-8">
                <Navigation className="h-4 w-4" />
              </Button>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border">
              <h4 className="font-semibold mb-2">Disaster Types</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Earthquake</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Flood</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Wildfire</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Storm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disaster List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disasters.map((disaster) => (
              <motion.div
                key={disaster.id}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedDisaster(disaster)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${getDisasterColor(disaster.type)}20` }}
                  >
                    {getDisasterIcon(disaster.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{disaster.type}</h4>
                    <p className="text-sm text-gray-600">{disaster.location}</p>
                  </div>
                  <Badge variant={disaster.status === 'Active' ? 'destructive' : 'outline'}>
                    {disaster.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterMap;
