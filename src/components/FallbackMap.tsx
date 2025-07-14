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
import { useDisasterEvents, usePredictions } from '@/hooks/useDisasterData';

interface FallbackMapProps {
  height?: string;
  showControls?: boolean;
}

const getDisasterColor = (severity: string) => {
  const severityLower = severity?.toLowerCase() || '';
  if (severityLower.includes('critical') || severityLower.includes('extreme')) {
    return 'bg-destructive';
  }
  if (severityLower.includes('major') || severityLower.includes('high')) {
    return 'bg-warning';
  }
  return 'bg-primary';
};

const getEventIcon = (type: string) => {
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

export default function FallbackMap({ height = '400px', showControls = true }: FallbackMapProps) {
  const { events } = useDisasterEvents();
  const { predictions } = usePredictions();

  const allData = [
    ...events.map(e => ({ ...e, type: 'event' })),
    ...predictions.map(p => ({ ...p, type: 'prediction' }))
  ];

  return (
    <div style={{ height }} className="relative">
      {/* World Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background rounded-lg border border-border">
        <div className="relative w-full h-full overflow-hidden rounded-lg">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-8 h-full">
              {Array.from({ length: 96 }).map((_, i) => (
                <div key={i} className="border border-muted"></div>
              ))}
            </div>
          </div>
          
          {/* Continental Outlines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl">
              {/* North America */}
              <div className="absolute top-1/4 left-1/6 w-16 h-20 border-2 border-muted rounded-tl-3xl rounded-br-2xl opacity-30"></div>
              
              {/* South America */}
              <div className="absolute top-1/2 left-1/4 w-8 h-16 border-2 border-muted rounded-t-lg rounded-b-3xl opacity-30"></div>
              
              {/* Europe */}
              <div className="absolute top-1/4 left-1/2 w-12 h-12 border-2 border-muted rounded-lg opacity-30"></div>
              
              {/* Africa */}
              <div className="absolute top-1/3 left-1/2 w-10 h-20 border-2 border-muted rounded-t-2xl rounded-b-lg opacity-30"></div>
              
              {/* Asia */}
              <div className="absolute top-1/6 right-1/4 w-20 h-16 border-2 border-muted rounded-2xl opacity-30"></div>
              
              {/* Australia */}
              <div className="absolute bottom-1/4 right-1/4 w-12 h-8 border-2 border-muted rounded-xl opacity-30"></div>
            </div>
          </div>

          {/* Disaster Markers */}
          <div className="absolute inset-0">
            {allData.slice(0, 12).map((item, index) => {
              const IconComponent = getEventIcon(
                item.type === 'event' ? (item as any).event_type : (item as any).prediction_type
              );
              
              // Generate random but consistent positions
              const left = ((index * 73) % 80) + 10;
              const top = ((index * 47) % 60) + 20;
              
              return (
                <div
                  key={`${item.type}-${item.id}-${index}`}
                  className="absolute group cursor-pointer"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <div className={`w-6 h-6 rounded-full border-2 border-background flex items-center justify-center animate-pulse ${
                    item.type === 'event' 
                      ? getDisasterColor((item as any).severity)
                      : 'bg-primary'
                  }`}>
                    <IconComponent className="h-3 w-3 text-background" />
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-2 min-w-40 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <p className="text-xs font-medium text-popover-foreground">
                      {item.type === 'event' ? (item as any).name : `${(item as any).prediction_type} Prediction`}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Live Monitoring</span>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                {allData.length} Active
              </Badge>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
            <h4 className="text-sm font-medium text-foreground mb-2">Legend</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
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

          {/* Center Message */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6">
              <Globe className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold text-foreground">Global Disaster Monitoring</h3>
              <p className="text-sm text-muted-foreground">Real-time threat visualization system</p>
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground mt-4">
                <div className="flex items-center space-x-1">
                  <Satellite className="h-3 w-3" />
                  <span>Satellite Data</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Navigation className="h-3 w-3" />
                  <span>GPS Tracking</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3" />
                  <span>Live Updates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}