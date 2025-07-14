import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Flame, Waves, Wind, Mountain, Globe, RefreshCw } from 'lucide-react';
import { useDisasterEvents, usePredictions } from '@/hooks/useDisasterData';
import { useRealTimeDisasters } from '@/hooks/useRealTimeDisasters';

const getDisasterColor = (type: string, severity: string) => {
  if (severity === 'critical' || severity.includes('Category 4') || severity.includes('Extreme')) {
    return 'bg-destructive';
  }
  if (severity === 'high' || severity.includes('Major') || severity.includes('Category 3')) {
    return 'bg-warning';
  }
  return 'bg-primary';
};

const getEventTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'earthquake':
      return Zap;
    case 'hurricane':
      return Wind;
    case 'wildfire':
      return Flame;
    case 'flood':
      return Waves;
    case 'tornado':
      return Wind;
    case 'landslide':
      return Mountain;
    default:
      return AlertTriangle;
  }
};

// Import the fallback map component
import FallbackMap from './FallbackMap';

// Real map component using FallbackMap
const RealMapComponent = ({ markers }: { markers: any[] }) => {
  return (
    <div className="relative h-full">
      <FallbackMap 
        height="100%" 
        showControls={false} 
      />
      
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border/50 z-10">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Real-Time Data - {markers.length} active threats</span>
          <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
            LIVE
          </Badge>
        </div>
      </div>
    </div>
  );
};

interface RealTimeMapProps {
  height?: string;
  showControls?: boolean;
}

export default function RealTimeMap({ height = '400px', showControls = true }: RealTimeMapProps) {
  const { events } = useDisasterEvents();
  const { predictions } = usePredictions();
  const { isUpdating, lastUpdate, fetchRealDisasters } = useRealTimeDisasters();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  const allMarkers = [
    ...(showEvents ? events.map(event => ({ ...event, type: 'event' })) : []),
    ...(showPredictions ? predictions.map(pred => ({ ...pred, type: 'prediction' })) : [])
  ];

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
              Real-Time Data
            </Badge>
            <span className="text-sm text-muted-foreground">
              {allMarkers.length} active threats
            </span>
            {lastUpdate && (
              <span className="text-xs text-muted-foreground">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchRealDisasters}
              disabled={isUpdating}
            >
              <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant={showEvents ? "default" : "outline"}
              size="sm"
              onClick={() => setShowEvents(!showEvents)}
            >
              Events ({events.length})
            </Button>
            <Button
              variant={showPredictions ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPredictions(!showPredictions)}
            >
              AI Predictions ({predictions.length})
            </Button>
          </div>
        </div>
      )}

      <div style={{ height }} className="rounded-lg overflow-hidden border border-border">
        <RealMapComponent markers={allMarkers} />
      </div>

      {/* Interactive Event List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {allMarkers.slice(0, 6).map((item, index) => {
          const IconComponent = getEventTypeIcon(
            item.type === 'event' ? (item as any).event_type : (item as any).prediction_type
          );
          return (
            <Card 
              key={`${item.type}-${item.id}`}
              className="p-4 hover:shadow-card transition-all cursor-pointer border-border/50"
              onClick={() => setSelectedEvent(item)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getDisasterColor(
                  item.type === 'event' ? (item as any).event_type : (item as any).prediction_type,
                  item.type === 'event' ? (item as any).severity : (item as any).severity_level
                )}`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.type === 'event' ? (item as any).name : `${(item as any).prediction_type} Prediction`}
                  </h4>
                  <p className="text-xs text-muted-foreground truncate">{item.location}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.type === 'event' ? (
                      <Badge variant="outline" className="text-xs">
                        {(item as any).status}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {(item as any).probability}% confidence
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedEvent && (
        <Card className="p-4 bg-card border-border/50 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">
              {selectedEvent.type === 'event' ? selectedEvent.name : `${selectedEvent.prediction_type} Prediction`}
            </h4>
            <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>
              ×
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {selectedEvent.description || `${selectedEvent.type === 'event' ? 'Active disaster event' : 'AI prediction'} in ${selectedEvent.location}`}
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              Location: <span className="font-medium">{selectedEvent.location}</span>
            </div>
            {selectedEvent.type === 'event' ? (
              <>
                <div>
                  Status: <Badge variant="outline" className="text-xs">{selectedEvent.status}</Badge>
                </div>
                <div>
                  Severity: <span className="font-medium">{selectedEvent.severity}</span>
                </div>
                {selectedEvent.economic_impact && (
                  <div>
                    Economic Impact: <span className="font-medium">
                      ${(selectedEvent.economic_impact / 1000000000).toFixed(1)}B
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  Probability: <span className="font-medium">{selectedEvent.probability}%</span>
                </div>
                <div>
                  Confidence: <span className="font-medium">{selectedEvent.confidence_score}%</span>
                </div>
                <div>
                  Model: <span className="font-medium">{selectedEvent.model_name}</span>
                </div>
                <div>
                  Timeframe: <span className="font-medium">
                    {new Date(selectedEvent.timeframe_start).toLocaleDateString()} - {' '}
                    {new Date(selectedEvent.timeframe_end).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}