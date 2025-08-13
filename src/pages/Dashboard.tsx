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
  BarChart3
} from 'lucide-react';
import RealTimeMap from '@/components/RealTimeMap';
import { useDisasterEvents, usePredictions, useSensorData } from '@/hooks/useMockData';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { events, loading: eventsLoading } = useDisasterEvents();
  const { predictions, loading: predictionsLoading } = usePredictions();
  const { sensorData, loading: sensorLoading } = useSensorData();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
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

  const stats = [
    { 
      label: 'Active Events', 
      value: activeEvents.length.toString(), 
      change: `+${Math.floor(Math.random() * 20)}%`, 
      icon: Activity,
      description: 'Currently active disasters'
    },
    { 
      label: 'Critical Alerts', 
      value: criticalEvents.length.toString(), 
      change: criticalEvents.length > 2 ? '+high' : 'normal', 
      icon: AlertTriangle,
      description: 'Severe and critical events'
    },
    { 
      label: 'AI Predictions', 
      value: predictions.length.toString(), 
      change: `+${Math.floor(Math.random() * 15)}%`, 
      icon: TrendingUp,
      description: 'Active ML predictions'
    },
    { 
      label: 'Sensor Network', 
      value: sensorData.length.toString(), 
      change: '+99.7%', 
      icon: Globe,
      description: 'Live monitoring stations'
    }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-destructive';
      case 'critical': return 'text-destructive';
      case 'monitoring': return 'text-warning';
      case 'predicted': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const refreshData = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data refreshed",
      description: "Latest information loaded successfully",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-poppins">Global Monitoring Dashboard</h1>
              <p className="text-muted-foreground font-inter">Real-time disaster tracking and AI-powered prediction system</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">Live Data</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({criticalEvents.length})
              </Button>
            </div>
          </div>

          {/* Enhanced Stats Grid with GSAP */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <GSAPEnhancedCard key={stat.label} className="dashboard-stat p-6 bg-gradient-card" delay={index * 100}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <Badge variant="outline" className={`${
                    stat.change.includes('high') ? 'border-destructive/20 text-destructive bg-destructive/10' :
                    stat.change.startsWith('+') ? 'border-success/20 text-success bg-success/10' : 
                    'border-muted text-muted-foreground'
                  }`}>
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-inter">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground font-poppins mb-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </GSAPEnhancedCard>
            ))}
          </div>

          {/* Key Metrics Summary with GSAP */}
          <div ref={metricsRef} className="grid md:grid-cols-3 gap-6 mb-8">
            <GSAPEnhancedCard className="metric-card p-6 bg-gradient-card" delay={0}>
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Population Impact</h3>
              </div>
              <p className="text-2xl font-bold text-foreground font-poppins">
                {(totalAffectedPopulation / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">People in affected areas</p>
            </GSAPEnhancedCard>
            
            <GSAPEnhancedCard className="metric-card p-6 bg-gradient-card" delay={150}>
              <div className="flex items-center space-x-3 mb-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Economic Impact</h3>
              </div>
              <p className="text-2xl font-bold text-foreground font-poppins">
                ${(totalEconomicImpact / 1000000000).toFixed(1)}B
              </p>
              <p className="text-sm text-muted-foreground">Estimated economic losses</p>
            </GSAPEnhancedCard>
            
            <GSAPEnhancedCard className="metric-card p-6 bg-gradient-card" delay={300}>
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">System Performance</h3>
              </div>
              <p className="text-2xl font-bold text-success font-poppins">99.7%</p>
              <p className="text-sm text-muted-foreground">Uptime & accuracy rate</p>
            </GSAPEnhancedCard>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Real-Time Map */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground font-poppins">Global Threat Map</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <MapPin className="h-3 w-3 mr-1" />
                    Interactive
                  </Badge>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Clock className="h-3 w-3 mr-1" />
                    Real-time
                  </Badge>
                </div>
              </div>
              
              {eventsLoading ? (
                <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <RefreshCw className="h-8 w-8 text-primary mx-auto animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading real-time data...</p>
                  </div>
                </div>
              ) : (
                <RealTimeMap height="400px" />
              )}
            </Card>
          </motion.div>

          {/* Live Threats Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground font-poppins">Active Threats</h2>
                <Badge variant="destructive" className="animate-pulse">
                  {activeEvents.length} Active
                </Badge>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {eventsLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : activeEvents.length === 0 ? (
                  <div className="text-center p-8">
                    <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active threats detected</p>
                  </div>
                ) : (
                  activeEvents.slice(0, 6).map((event, index) => {
                    const IconComponent = getEventIcon(event.event_type);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="border border-border/50 rounded-lg p-4 hover:shadow-card transition-all cursor-pointer"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            event.severity?.toLowerCase().includes('critical') || event.severity?.toLowerCase().includes('extreme')
                              ? 'bg-destructive/10'
                              : event.severity?.toLowerCase().includes('major') || event.severity?.toLowerCase().includes('category 4')
                              ? 'bg-warning/10'
                              : 'bg-primary/10'
                          }`}>
                            <IconComponent className={`h-5 w-5 ${getStatusColor(event.status)}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="text-sm font-medium text-foreground truncate font-poppins">
                                {event.name}
                              </h3>
                              <Badge 
                                variant={event.status === 'active' ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {event.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 font-inter">{event.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-foreground">
                                {event.magnitude || event.severity}
                              </span>
                              {event.affected_population && (
                                <span className="text-xs text-muted-foreground">
                                  {(event.affected_population / 1000000).toFixed(1)}M affected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/10">
                View All Events ({events.length})
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', event: 'Seismic activity detected in Japan', type: 'warning' },
                  { time: '5 min ago', event: 'Wildfire risk updated for California', type: 'destructive' },
                  { time: '12 min ago', event: 'Flood warning issued for Bangladesh', type: 'primary' },
                  { time: '18 min ago', event: 'Landslide monitoring activated in Nepal', type: 'secondary' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/30">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'warning' ? 'bg-warning' :
                      activity.type === 'destructive' ? 'bg-destructive' :
                      activity.type === 'primary' ? 'bg-primary' :
                      'bg-secondary'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
              <div className="space-y-4">
                {[
                  { system: 'Satellite Network', status: 'Operational', uptime: '99.9%' },
                  { system: 'AI Prediction Engine', status: 'Operational', uptime: '99.7%' },
                  { system: 'Data Processing', status: 'Operational', uptime: '99.8%' },
                  { system: 'Alert System', status: 'Operational', uptime: '100%' }
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded">
                    <div>
                      <p className="text-sm font-medium text-foreground">{system.system}</p>
                      <p className="text-xs text-muted-foreground">Uptime: {system.uptime}</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {system.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}