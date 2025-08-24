import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import GSAPEnhancedCard from '@/components/GSAPEnhancedCard';
import { useGSAPStagger } from '@/hooks/useGSAPAnimations';
import { 
  Globe, 
  Flame, 
  Zap, 
  Waves, 
  Mountain,
  AlertTriangle,
  TrendingUp,
  Activity,
  Bell,
  Settings,
  Download,
  RefreshCw,
  MapPin,
  Clock,
  Users,
  DollarSign,
  BarChart3,
  Cloud
} from 'lucide-react';
import DisasterMap from '@/components/DisasterMap';
import WeatherDashboard from '@/components/WeatherDashboard';
import { useDisasterEvents, usePredictions, useSensorData, useStats, useApiHealth, useRealTimeUpdates, useFemaDisasters, useEonetEvents } from '@/hooks/useFlaskData';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { events, loading: eventsLoading, refetch: refetchEvents } = useDisasterEvents();
  const { predictions, loading: predictionsLoading, refetch: refetchPredictions } = usePredictions();
  const { sensorData, loading: sensorLoading, refetch: refetchSensors } = useSensorData();
  const { stats, loading: statsLoading } = useStats();
  const { isHealthy, loading: healthLoading } = useApiHealth();
  const { isConnected, lastUpdate } = useRealTimeUpdates();
  const { items: femaDisasters, loading: femaLoading } = useFemaDisasters();
  const { events: eonetEvents, loading: eonetLoading } = useEonetEvents();
  const { toast } = useToast();
  
  // GSAP animations
  const statsRef = useGSAPStagger('.dashboard-stat', 0.1);
  const metricsRef = useGSAPStagger('.metric-card', 0.15);

  // Real-time stats calculation
  const activeEvents = events.filter(e => e.status === 'active' || e.status === 'monitoring');
  const criticalEvents = events.filter(e => 
    e.severity?.toLowerCase().includes('critical') || 
    e.severity?.toLowerCase().includes('extreme') ||
    e.severity?.toLowerCase().includes('category 4') ||
    e.severity?.toLowerCase().includes('category 5')
  );
  const totalAffectedPopulation = events.reduce((sum, event) => 
    sum + (event.affected_population || 0), 0
  );
  const totalEconomicImpact = events.reduce((sum, event) => 
    sum + (event.economic_impact || 0), 0
  );

  const statsData = [
    { 
      label: 'Active Events',
      value: activeEvents.length,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      change: '+2.5%',
      changeType: 'positive'
    },
    { 
      label: 'Critical Events',
      value: criticalEvents.length,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      change: '+1.2%',
      changeType: 'negative'
    },
    { 
      label: 'Total Predictions',
      value: predictions.length,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      change: '+5.8%',
      changeType: 'positive'
    },
    { 
      label: 'Active Sensors',
      value: sensorData.length,
      icon: Zap,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      change: '+0.3%',
      changeType: 'positive'
    }
  ];

  const handleRefresh = async () => {
    try {
      await Promise.all([
        refetchEvents(),
        refetchPredictions(),
        refetchSensors()
      ]);
      toast({
        title: "Data refreshed",
        description: "All data has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isLoading = eventsLoading || predictionsLoading || sensorLoading || statsLoading || healthLoading || femaLoading || eonetLoading;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground font-poppins">Disaster Intelligence Dashboard</h1>
            <p className="text-muted-foreground font-inter">
              Real-time monitoring and analysis of global disaster events with AI-powered weather predictions
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        
        {/* API Health Status */}
        <div className="flex items-center space-x-4 mb-4">
          <Badge variant={isHealthy ? "default" : "destructive"} className="text-xs">
            {isHealthy ? "API Healthy" : "API Unhealthy"}
          </Badge>
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            <Cloud className="w-3 h-3 mr-1" />
            Real Weather Data
          </Badge>
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
            AI Predictions
          </Badge>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              Last update: {new Date(lastUpdate).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading disaster data...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <>
          {/* Statistics Cards */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <GSAPEnhancedCard key={stat.label} className="dashboard-stat p-6" delay={index * 100}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground font-inter">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground font-poppins">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">from last hour</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </GSAPEnhancedCard>
            ))}
          </div>

          {/* Weather Dashboard */}
          <div className="mb-8">
            <WeatherDashboard />
          </div>

          {/* Disaster Map */}
          <div className="mb-6">
            <DisasterMap 
              events={events}
              predictions={predictions}
              height="400px"
            />
          </div>

          {/* Metrics Grid */}
          <div ref={metricsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Recent Events */}
            <GSAPEnhancedCard className="metric-card p-6" delay={200}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground font-poppins">Recent Events</h3>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {activeEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground font-inter">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </GSAPEnhancedCard>

            {/* Ongoing Disasters (OpenFEMA) */}
            <GSAPEnhancedCard className="metric-card p-6" delay={250}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground font-poppins">Ongoing Disasters (FEMA)</h3>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Live</Badge>
              </div>
              <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                {femaDisasters && femaDisasters.length > 0 ? (
                  femaDisasters.slice(0, 12).map((d: any, idx: number) => {
                    const title = d.title || d.incidentType || 'Disaster';
                    const state = d.state || d.place || d.declaredCountyArea || '';
                    const date = d.declarationDate || d.incidentBeginDate || d.declarationDateTime || d.date || null;
                    return (
                      <div key={(d.id ?? d.disasterNumber ?? idx).toString()} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="min-w-0">
                          <p className="font-medium truncate text-foreground font-inter">{title}</p>
                          <p className="text-xs text-muted-foreground truncate">{state}</p>
                        </div>
                        {date && (
                          <span className="text-xs text-muted-foreground ml-3 whitespace-nowrap">{new Date(date).toLocaleDateString()}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No ongoing FEMA disasters detected.</p>
                )}
              </div>
            </GSAPEnhancedCard>

            {/* Ongoing Disasters (NASA EONET) */}
            <GSAPEnhancedCard className="metric-card p-6" delay={275}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground font-poppins">Ongoing Disasters (EONET)</h3>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Live</Badge>
              </div>
              <div className="space-y-3 max-h-[360px] overflow-auto pr-1">
                {eonetEvents && eonetEvents.length > 0 ? (
                  eonetEvents.slice(0, 12).map((ev: any, idx: number) => {
                    const title = ev.title || ev.name || 'Event';
                    const category = (ev.categories && ev.categories[0]?.title) || ev.category || '';
                    const date = (ev.geometries && ev.geometries[0]?.date) || ev.date || null;
                    return (
                      <div key={(ev.id ?? idx).toString()} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                        <div className="min-w-0">
                          <p className="font-medium truncate text-foreground font-inter">{title}</p>
                          <p className="text-xs text-muted-foreground truncate">{category}</p>
                        </div>
                        {date && (
                          <span className="text-xs text-muted-foreground ml-3 whitespace-nowrap">{new Date(date).toLocaleDateString()}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No ongoing EONET disasters detected.</p>
                )}
              </div>
            </GSAPEnhancedCard>

            {/* High Probability Predictions */}
            <GSAPEnhancedCard className="metric-card p-6" delay={300}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-foreground font-poppins">High Probability Predictions</h3>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-4">
                {predictions
                  .filter(p => p.probability > 0.7)
                  .slice(0, 5)
                  .map((prediction) => (
                    <div key={prediction.id} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/30">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground font-inter">{prediction.event_type}</p>
                        <p className="text-sm text-muted-foreground">{prediction.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {(prediction.probability * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">{prediction.timeframe}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </GSAPEnhancedCard>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GSAPEnhancedCard className="p-6" delay={400}>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-foreground font-poppins">Affected Population</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {totalAffectedPopulation.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">People at risk</p>
            </GSAPEnhancedCard>

            <GSAPEnhancedCard className="p-6" delay={500}>
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold text-foreground font-poppins">Economic Impact</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${(totalEconomicImpact / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground mt-1">Estimated damage</p>
            </GSAPEnhancedCard>

            <GSAPEnhancedCard className="p-6" delay={600}>
              <div className="flex items-center space-x-3 mb-4">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-foreground font-poppins">Data Quality</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {sensorData.filter(s => s.data_quality === 'excellent').length}/{sensorData.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Excellent quality sensors</p>
            </GSAPEnhancedCard>
          </div>
        </>
      )}
    </div>
  );
}