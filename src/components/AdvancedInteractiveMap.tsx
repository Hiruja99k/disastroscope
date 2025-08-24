import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  AlertTriangle, 
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/utils/monitoring';
import MapTilerMap from '@/components/MapTilerMap';



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
  const [selectedPoint, setSelectedPoint] = useState<DisasterPoint | null>(null);

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



  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };



  return (
    <div className="relative h-[600px]">
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

      
    </div>
  );
}

export default AdvancedInteractiveMap;
