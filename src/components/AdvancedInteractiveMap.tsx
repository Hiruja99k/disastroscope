import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Layers, 
  Filter, 
  Search, 
  AlertTriangle, 
  TrendingUp,
  Globe,
  Satellite,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/monitoring';
import MapTilerMap from '@/components/MapTilerMap';

interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  color: string;
}

interface DisasterPoint {
  id: string;
  lat: number;
  lng: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
}

export function AdvancedInteractiveMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapStyle, setMapStyle] = useState<'satellite' | 'street' | 'terrain'>('satellite');
  const [layers, setLayers] = useState<MapLayer[]>([
    { id: 'disasters', name: 'Active Disasters', visible: true, opacity: 0.8, color: 'red' },
    { id: 'predictions', name: 'AI Predictions', visible: true, opacity: 0.6, color: 'blue' },
    { id: 'weather', name: 'Weather Data', visible: false, opacity: 0.7, color: 'cyan' },
    { id: 'sensors', name: 'Sensor Network', visible: true, opacity: 0.5, color: 'green' }
  ]);
  const [selectedPoint, setSelectedPoint] = useState<DisasterPoint | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Simulated disaster data with real coordinates
  const [disasterPoints, setDisasterPoints] = useState<DisasterPoint[]>([
    {
      id: '1',
      lat: 34.0522,
      lng: -118.2437,
      type: 'Earthquake',
      severity: 'high',
      timestamp: '2024-01-15T10:30:00Z',
      description: 'Magnitude 6.2 earthquake detected in Los Angeles area'
    },
    {
      id: '2',
      lat: 25.7617,
      lng: -80.1918,
      type: 'Hurricane',
      severity: 'critical',
      timestamp: '2024-01-15T09:15:00Z',
      description: 'Hurricane Maria approaching Miami, Florida'
    },
    {
      id: '3',
      lat: 37.7749,
      lng: -122.4194,
      type: 'Wildfire',
      severity: 'medium',
      timestamp: '2024-01-15T08:45:00Z',
      description: 'Wildfire spreading in San Francisco Bay Area'
    },
    {
      id: '4',
      lat: 29.7604,
      lng: -95.3698,
      type: 'Flood',
      severity: 'high',
      timestamp: '2024-01-15T07:30:00Z',
      description: 'Severe flooding in Houston, Texas'
    },
    {
      id: '5',
      lat: 35.6762,
      lng: 139.6503,
      type: 'Earthquake',
      severity: 'critical',
      timestamp: '2024-01-15T06:20:00Z',
      description: 'Major earthquake detected in Tokyo, Japan'
    },
    {
      id: '6',
      lat: 51.5074,
      lng: -0.1278,
      type: 'Storm',
      severity: 'medium',
      timestamp: '2024-01-15T05:10:00Z',
      description: 'Severe storm system over London, UK'
    }
  ]);

  const handleLayerToggle = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
    trackEvent('map_layer_toggled', { layer: layerId });
  };

  const handleOpacityChange = (layerId: string, opacity: number[]) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity: opacity[0] / 100 } : layer
    ));
  };

  const handleMapStyleChange = (style: 'satellite' | 'street' | 'terrain') => {
    setMapStyle(style);
    trackEvent('map_style_changed', { style });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    trackEvent('map_fullscreen_toggled', { fullscreen: !isFullscreen });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityPulse = (severity: string) => {
    return severity === 'critical' ? 'animate-pulse' : '';
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-[600px]'}`}>
      {/* Map Container with Google Maps Embed */}
      <div 
        ref={mapRef}
        className="w-full h-full relative overflow-hidden"
      >
        {/* Use MapTiler as the base */}
        <MapTilerMap 
          width="100%"
          height="100%"
          location=""
          zoom={2}
          mapType="streets"
          className="w-full h-full"
          center={{ lat: 0, lng: 0 }}
          markers={disasterPoints.map(point => ({
            position: { lat: point.lat, lng: point.lng },
            title: `${point.type} - ${point.severity}`,
            type: 'disaster' as const,
            icon: undefined
          }))}
          showControls={false}
        />

        {/* Prediction Zones */}
        {layers.find(l => l.id === 'predictions')?.visible && (
          <div className="absolute inset-0">
            {disasterPoints.map((point) => (
              <div
                key={`prediction-${point.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${((point.lng + 180) / 360) * 100}%`,
                  top: `${((90 - point.lat) / 180) * 100}%`,
                }}
              >
                <div className="w-32 h-32 rounded-full bg-blue-500 opacity-20 animate-pulse" />
                <div className="w-24 h-24 rounded-full bg-blue-400 opacity-30 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-blue-300 opacity-40 animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {/* Weather Overlay */}
        {layers.find(l => l.id === 'weather')?.visible && (
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'2\' fill=\'white\' opacity=\'0.3\'/%3E%3Ccircle cx=\'80\' cy=\'40\' r=\'1.5\' fill=\'white\' opacity=\'0.2\'/%3E%3Ccircle cx=\'40\' cy=\'80\' r=\'2.5\' fill=\'white\' opacity=\'0.4\'/%3E%3C/svg%3E')] animate-pulse" />
          </div>
        )}

        {/* Sensor Network Grid */}
        {layers.find(l => l.id === 'sensors')?.visible && (
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern id="sensorGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <circle cx="5" cy="5" r="0.5" fill="green" opacity="0.6" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#sensorGrid)" />
            </svg>
          </div>
        )}
      </div>

      {/* Controls Panel */}
      <AnimatePresence>
        {showControls && (
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
                onClick={() => setShowControls(false)}
              >
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>

            {/* Map Style Selector */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Map Style</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { id: 'satellite', icon: Satellite, label: 'Satellite' },
                    { id: 'street', icon: Globe, label: 'Street' },
                    { id: 'terrain', icon: MapPin, label: 'Terrain' }
                  ].map((style) => (
                    <Button
                      key={style.id}
                      variant={mapStyle === style.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleMapStyleChange(style.id as any)}
                      className="flex-1"
                    >
                      <style.icon className="h-4 w-4 mr-1" />
                      {style.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Layer Controls */}
              <div>
                <Label className="text-sm font-medium">Layers</Label>
                <div className="space-y-2 mt-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={layer.visible}
                          onCheckedChange={() => handleLayerToggle(layer.id)}
                        />
                        <span className="text-sm">{layer.name}</span>
                      </div>
                      {layer.visible && (
                        <Slider
                          value={[layer.opacity * 100]}
                          onValueChange={(value) => handleOpacityChange(layer.id, value)}
                          max={100}
                          step={10}
                          className="w-20"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {!showControls && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowControls(true)}
            className="bg-white/90 backdrop-blur-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleFullscreen}
          className="bg-white/90 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setSelectedPoint(null);
            trackEvent('map_reset');
          }}
          className="bg-white/90 backdrop-blur-sm"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Selected Point Details */}
      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className={`h-5 w-5 ${getSeverityColor(selectedPoint.severity).replace('bg-', 'text-')}`} />
                    {selectedPoint.type}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPoint(null)}
                  >
                    ×
                  </Button>
                </div>
                <CardDescription>
                  {selectedPoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Severity</span>
                    <Badge 
                      variant={selectedPoint.severity === 'critical' ? 'destructive' : 
                              selectedPoint.severity === 'high' ? 'default' : 'secondary'}
                    >
                      {selectedPoint.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium">
                      {selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Detected</span>
                    <span className="text-sm font-medium">
                      {new Date(selectedPoint.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Analyze
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center"
          >
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading map data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdvancedInteractiveMap;
