import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle,
  TrendingUp,
  Zap,
  RefreshCw,
  MapPin,
  Globe,
  Flame,
  Waves,
  Wind
} from 'lucide-react';
import DisasterMap from '@/components/DisasterMap';
import MapErrorBoundary from '@/components/MapErrorBoundary';

// Simple data fetching without complex hooks
const useSimpleData = () => {
  const [events, setEvents] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://web-production-47673.up.railway.app';
      
      // Fetch events
      const eventsResponse = await fetch(`${baseUrl}/api/events`);
      if (eventsResponse.ok) {
        const eventsData = await eventsResponse.json();
        setEvents(eventsData.events || []);
      }
      
      // Fetch predictions
      const predictionsResponse = await fetch(`${baseUrl}/api/predictions`);
      if (predictionsResponse.ok) {
        const predictionsData = await predictionsResponse.json();
        setPredictions(predictionsData.predictions || []);
      }
    } catch (err) {
      console.error('Data fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { events, predictions, loading, error, refetch: fetchData };
};

export default function Dashboard() {
  const { events, predictions, loading, error, refetch } = useSimpleData();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Update timestamp every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'monitoring');
  const criticalEvents = events.filter(e => 
    e.severity?.toLowerCase().includes('critical') || 
    e.severity?.toLowerCase().includes('extreme')
  );

  const statsData = [
    { 
      label: 'Active Events',
      value: activeEvents.length,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Critical Events',
      value: criticalEvents.length,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    { 
      label: 'Total Predictions',
      value: predictions.length,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'System Status',
      value: 'Online',
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <Card className="p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Connection
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Disaster Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time disaster monitoring and AI-powered predictions
          </p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Live Data Stream</span>
            </div>
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
            <Button onClick={refetch} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </Card>
            ))}
          </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Global Disaster Map</h2>
                <Badge variant="outline">
                  {events.length} Events, {predictions.length} Predictions
              </Badge>
            </div>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading map data...</span>
                </div>
              ) : (
                <MapErrorBoundary>
                  <DisasterMap 
                    events={events}
                    predictions={predictions}
                    height="500px"
                  />
                </MapErrorBoundary>
              )}
            </Card>
          </div>

          {/* Events List */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No events to display
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {events.slice(0, 8).map((event) => (
                    <div key={event.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">{event.name}</h4>
                        <Badge 
                          variant={event.severity?.toLowerCase().includes('critical') ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                      {event.severity}
                    </Badge>
                  </div>
                      <p className="text-xs text-muted-foreground mb-1">{event.location}</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {event.event_type} • {event.magnitude}
                        </span>
                      </div>
              </div>
                  ))}
                        </div>
              )}
            </Card>

            {/* Predictions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Predictions</h3>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
                  ))}
                      </div>
              ) : predictions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No predictions available
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {predictions.slice(0, 6).map((prediction) => (
                    <div key={prediction.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{prediction.event_type}</h4>
                        <Badge variant="outline" className="text-xs">
                          {(prediction.probability * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{prediction.location}</p>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {prediction.timeframe}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
              )}
            </Card>
          </div>
              </div>
          </div>
    </div>
  );
}