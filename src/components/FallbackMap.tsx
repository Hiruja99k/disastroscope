import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Flame, 
  Zap, 
  Waves, 
  Mountain,
  AlertTriangle,
  MapPin,
  Satellite,
  Navigation,
  Activity
} from 'lucide-react';
import { DisasterEvent, Prediction } from '@/services/api';

interface FallbackMapProps {
  height?: string;
  showControls?: boolean;
  events?: DisasterEvent[];
  predictions?: Prediction[];
}

const getDisasterColor = (severity: string | undefined) => {
  if (!severity) return 'bg-primary';
  const severityLower = severity.toLowerCase();
  if (severityLower.includes('critical') || severityLower.includes('extreme')) {
    return 'bg-destructive';
  }
  if (severityLower.includes('major') || severityLower.includes('high')) {
    return 'bg-warning';
  }
  return 'bg-primary';
};

const getEventIcon = (type: string | undefined) => {
  if (!type) return AlertTriangle;
  
  switch (type.toLowerCase()) {
    case 'earthquake': return Zap;
    case 'hurricane': return Waves;
    case 'wildfire': return Flame;
    case 'flood': return Waves;
    case 'tornado': return Mountain;
    case 'landslide': return Mountain;
    default: return AlertTriangle;
  }
};

export default function FallbackMap({ height = '400px', showControls = true, events = [], predictions = [] }: FallbackMapProps) {
  const allData = [
    ...events.map(e => ({ ...e, type: 'event' })),
    ...predictions.map(p => ({ ...p, type: 'prediction' }))
  ];

  // Convert lat/lng to map coordinates (simple projection)
  const latLngToMapPosition = (lat: number, lng: number) => {
    // Simple equirectangular projection
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div style={{ height }} className="relative">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-blue-950/30 rounded-lg border border-border">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-24 grid-rows-12 h-full">
              {Array.from({ length: 288 }).map((_, i) => (
                <div key={i} className="border border-blue-200 dark:border-blue-800"></div>
              ))}
            </div>
          </div>
          
          {/* Continental Outlines */}
          <div className="absolute inset-0">
            {/* North America */}
            <div className="absolute top-[15%] left-[15%] w-[25%] h-[35%] border-2 border-blue-300 dark:border-blue-700 rounded-tl-3xl rounded-br-2xl opacity-20"></div>
            
            {/* South America */}
            <div className="absolute top-[45%] left-[20%] w-[12%] h-[40%] border-2 border-blue-300 dark:border-blue-700 rounded-t-lg rounded-b-3xl opacity-20"></div>
            
            {/* Europe */}
            <div className="absolute top-[20%] left-[45%] w-[18%] h-[25%] border-2 border-blue-300 dark:border-blue-700 rounded-lg opacity-20"></div>
            
            {/* Africa */}
            <div className="absolute top-[25%] left-[45%] w-[15%] h-[45%] border-2 border-blue-300 dark:border-blue-700 rounded-t-2xl rounded-b-lg opacity-20"></div>
            
            {/* Asia */}
            <div className="absolute top-[10%] left-[55%] w-[35%] h-[40%] border-2 border-blue-300 dark:border-blue-700 rounded-2xl opacity-20"></div>
            
            {/* Australia */}
            <div className="absolute top-[60%] left-[70%] w-[20%] h-[15%] border-2 border-blue-300 dark:border-blue-700 rounded-xl opacity-20"></div>
          </div>

          {/* Disaster Markers with Real Coordinates */}
          <div className="absolute inset-0">
            {allData.map((item, index) => {
              const eventType = item.type === 'event' ? (item as any).event_type : (item as any).prediction_type;
              const IconComponent = getEventIcon(eventType);
              
              // Use real coordinates if available, otherwise generate realistic positions
              let position;
              if (item.coordinates && item.coordinates.lat && item.coordinates.lng) {
                position = latLngToMapPosition(item.coordinates.lat, item.coordinates.lng);
              } else {
                // Fallback to realistic positions based on location
                const location = item.location?.toLowerCase() || '';
                if (location.includes('miami') || location.includes('florida')) {
                  position = { x: 25, y: 35 };
                } else if (location.includes('los angeles') || location.includes('california')) {
                  position = { x: 15, y: 30 };
                } else if (location.includes('san francisco')) {
                  position = { x: 12, y: 28 };
                } else if (location.includes('new orleans') || location.includes('louisiana')) {
                  position = { x: 28, y: 40 };
                } else if (location.includes('oklahoma')) {
                  position = { x: 30, y: 32 };
                } else if (location.includes('seattle') || location.includes('washington')) {
                  position = { x: 12, y: 25 };
                } else if (location.includes('houston') || location.includes('texas')) {
                  position = { x: 28, y: 38 };
                } else {
                  // Random but consistent position
                  position = { x: ((index * 73) % 80) + 10, y: ((index * 47) % 60) + 20 };
                }
              }
              
              return (
                <div
                  key={`${item.type}-${item.id}-${index}`}
                  className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  {/* Pulsing Ring */}
                  <div className={`absolute inset-0 w-8 h-8 rounded-full ${
                    item.type === 'event' 
                      ? getDisasterColor((item as any).severity)
                      : 'bg-primary'
                  } opacity-20 animate-ping`}></div>
                  
                  {/* Main Marker */}
                  <div className={`relative w-6 h-6 rounded-full border-2 border-background flex items-center justify-center shadow-lg ${
                    item.type === 'event' 
                      ? getDisasterColor((item as any).severity)
                      : 'bg-primary'
                  }`}>
                    <IconComponent className="h-3 w-3 text-background" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-3 min-w-48 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-lg">
                    <div className="flex items-start space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        item.type === 'event' 
                          ? getDisasterColor((item as any).severity)
                          : 'bg-primary'
                      }`}>
                        <IconComponent className="h-2 w-2 text-background" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-popover-foreground">
                          {item.type === 'event' ? (item as any).name || 'Unknown Event' : `${(item as any).prediction_type || 'Unknown'} Prediction`}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.location || 'Unknown Location'}</p>
                        {item.type === 'event' && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {(item as any).severity || 'Unknown'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {(item as any).status || 'Unknown'}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">Live Monitoring</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                {allData.length} Active
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Critical Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-xs text-muted-foreground">Major Events</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Predictions</span>
              </div>
            </div>
          </div>

          {/* Real-time Data Indicator */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>Real-Time Data - {allData.length} active threats</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                LIVE
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}