import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Filter,
  Search,
  Eye,
  ChevronDown,
  Calendar,
  Thermometer,
  Wind,
  Droplets,
  Satellite,
  Monitor,
  Brain,
  Shield,
  Target,
  Network,
  Database,
  Radar,
  LineChart,
  PieChart,
  TrendingDown,
  Plus,
  Minus,
  MoreHorizontal,
  ExternalLink,
  Share2,
  FileText,
  Mail,
  Phone,
  Waves as WavesIcon
} from 'lucide-react';
import RealTimeMap from '@/components/RealTimeMap';
import { useDisasterEvents, usePredictions, useSensorData } from '@/hooks/useDisasterData';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export default function EnhancedDashboard() {
  const { events, loading: eventsLoading } = useDisasterEvents();
  const { predictions, loading: predictionsLoading } = usePredictions();
  const { sensorData, loading: sensorLoading } = useSensorData();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Enhanced real-time stats calculation
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

  const filteredEvents = events.filter(event => {
    const matchesFilter = filterType === 'all' || event.event_type.toLowerCase() === filterType;
    const matchesSearch = searchTerm === '' || 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const enhancedStats = [
    { 
      label: 'Active Events', 
      value: activeEvents.length.toString(), 
      change: `+${Math.floor(Math.random() * 20)}%`, 
      icon: Activity,
      description: 'Currently active disasters',
      trend: 'up',
      details: `${Math.floor(Math.random() * 50)} new events this week`
    },
    { 
      label: 'Critical Alerts', 
      value: criticalEvents.length.toString(), 
      change: criticalEvents.length > 2 ? '+high' : 'normal', 
      icon: AlertTriangle,
      description: 'Severe and critical events',
      trend: criticalEvents.length > 2 ? 'up' : 'stable',
      details: `${criticalEvents.length} require immediate attention`
    },
    { 
      label: 'AI Predictions', 
      value: predictions.length.toString(), 
      change: `+${Math.floor(Math.random() * 15)}%`, 
      icon: TrendingUp,
      description: 'Active ML predictions',
      trend: 'up',
      details: `${Math.floor(Math.random() * 100)} new predictions today`
    },
    { 
      label: 'Sensor Network', 
      value: sensorData.length.toString(), 
      change: '+99.7%', 
      icon: Globe,
      description: 'Live monitoring stations',
      trend: 'up',
      details: '50,247 sensors currently online'
    }
  ];

  const systemMetrics = [
    { name: 'API Response Time', value: '125ms', status: 'excellent', target: '<200ms' },
    { name: 'Data Processing', value: '2.3TB/hr', status: 'good', target: '2TB/hr' },
    { name: 'Prediction Accuracy', value: '94.2%', status: 'excellent', target: '>90%' },
    { name: 'System Uptime', value: '99.97%', status: 'excellent', target: '>99.5%' }
  ];

  const alertsByType = [
    { type: 'Hurricane', count: 12, severity: 'high', color: 'text-blue-500' },
    { type: 'Earthquake', count: 8, severity: 'medium', color: 'text-yellow-500' },
    { type: 'Wildfire', count: 15, severity: 'high', color: 'text-red-500' },
    { type: 'Flood', count: 6, severity: 'low', color: 'text-green-500' }
  ];

  const recentActivities = [
    { time: '2 min ago', event: 'Seismic activity detected in Japan (M6.2)', type: 'warning', priority: 'high' },
    { time: '5 min ago', event: 'Wildfire risk updated for California (85% chance)', type: 'destructive', priority: 'critical' },
    { time: '12 min ago', event: 'Flood warning issued for Bangladesh (Level 3)', type: 'primary', priority: 'medium' },
    { time: '18 min ago', event: 'Landslide monitoring activated in Nepal', type: 'secondary', priority: 'low' },
    { time: '25 min ago', event: 'Hurricane Patricia upgraded to Category 4', type: 'destructive', priority: 'critical' },
    { time: '32 min ago', event: 'Drought conditions detected in Australia', type: 'warning', priority: 'medium' }
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

  const exportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export will be ready shortly",
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-[1800px] mx-auto p-6">
        {/* Enhanced Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground font-poppins">
                Global Command Center
              </h1>
              <p className="text-muted-foreground font-inter text-lg">
                Advanced disaster monitoring and AI-powered prediction system
              </p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">Live Data Stream</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Real-time
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last Week</SelectItem>
                  <SelectItem value="30d">Last Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm" className="bg-gradient-primary relative">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({criticalEvents.length})
                {criticalEvents.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                )}
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events, locations, or alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="hurricane">Hurricane</SelectItem>
                <SelectItem value="wildfire">Wildfire</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="tornado">Tornado</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Eye className="h-4 w-4 mr-2" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {enhancedStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <stat.icon className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={`${
                        stat.change.includes('high') ? 'border-destructive/20 text-destructive bg-destructive/10' :
                        stat.change.startsWith('+') ? 'border-success/20 text-success bg-success/10' : 
                        'border-muted text-muted-foreground'
                      }`}>
                        {stat.change}
                      </Badge>
                      <div className="flex items-center mt-1">
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-success mr-1" />
                        ) : stat.trend === 'down' ? (
                          <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                        ) : (
                          <Activity className="h-3 w-3 text-muted-foreground mr-1" />
                        )}
                        <span className="text-xs text-muted-foreground">Trending</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-inter">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground font-poppins mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <p className="text-xs text-primary mt-1">{stat.details}</p>
                  </div>
                </Card>
              </motion.div>
            ))
          </div>
        </motion.div>

        {/* Advanced Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-card">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Live Monitor</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <LineChart className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
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
                    <h2 className="text-2xl font-semibold text-foreground font-poppins">Global Threat Map</h2>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <MapPin className="h-3 w-3 mr-1" />
                        Interactive
                      </Badge>
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Real-time
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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

              {/* Enhanced Threat Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-6 bg-gradient-card border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground font-poppins">Active Threats</h2>
                    <div className="flex items-center space-x-2">
                      <Badge variant="destructive" className="animate-pulse">
                        {activeEvents.length} Active
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {eventsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : filteredEvents.length === 0 ? (
                      <div className="text-center p-8">
                        <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No threats matching your criteria</p>
                      </div>
                    ) : (
                      filteredEvents.slice(0, 8).map((event, index) => {
                        const IconComponent = getEventIcon(event.event_type);
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="border border-border/50 rounded-lg p-4 hover:shadow-card transition-all cursor-pointer group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                event.severity?.toLowerCase().includes('critical') || event.severity?.toLowerCase().includes('extreme')
                                  ? 'bg-destructive/10'
                                  : event.severity?.toLowerCase().includes('major') || event.severity?.toLowerCase().includes('category 4')
                                  ? 'bg-warning/10'
                                  : 'bg-primary/10'
                              }`}>
                                <IconComponent className={`h-6 w-6 ${getStatusColor(event.status)}`} />
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
                                <div className="flex items-center justify-between mt-2">
                                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                    Details
                                  </Button>
                                  <div className="flex space-x-1">
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Share2 className="h-3 w-3" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Bell className="h-3 w-3" />
                                    </Button>
                                  </div>
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

            {/* Additional Overview Sections */}
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              {/* Enhanced Metrics */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">System Performance</h2>
                <div className="space-y-4">
                  {systemMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{metric.name}</span>
                        <Badge variant="outline" className={`
                          ${metric.status === 'excellent' ? 'bg-success/10 text-success border-success/20' :
                            metric.status === 'good' ? 'bg-primary/10 text-primary border-primary/20' :
                            'bg-warning/10 text-warning border-warning/20'}
                        `}>
                          {metric.value}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                      <Progress 
                        value={metric.status === 'excellent' ? 95 : metric.status === 'good' ? 80 : 60} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Alerts by Type */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Alert Distribution</h2>
                <div className="space-y-3">
                  {alertsByType.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          alert.severity === 'high' ? 'bg-destructive' :
                          alert.severity === 'medium' ? 'bg-warning' : 'bg-success'
                        }`}></div>
                        <span className="text-sm font-medium text-foreground">{alert.type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg font-bold ${alert.color}`}>{alert.count}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="p-6 bg-gradient-card border-border/50">
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/30 transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.priority === 'critical' ? 'bg-destructive animate-pulse' :
                        activity.priority === 'high' ? 'bg-warning' :
                        activity.priority === 'medium' ? 'bg-primary' : 'bg-success'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground leading-tight">{activity.event}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="p-6 bg-gradient-card border-border/50">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Live Monitoring Dashboard</h2>
                  <RealTimeMap height="600px" />
                </Card>
              </div>
              <div className="space-y-6">
                {/* Quick Stats for monitoring */}
                <Card className="p-4 bg-gradient-card border-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Network Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Satellites</span>
                      <span className="text-sm text-success">25/25 Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sensors</span>
                      <span className="text-sm text-success">50,247/50,300</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Weather Stations</span>
                      <span className="text-sm text-success">12,456/12,500</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="predictions">
            <div className="text-center py-12">
              <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">AI Predictions Dashboard</h3>
              <p className="text-muted-foreground">Advanced prediction models and analysis coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-12">
              <LineChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">Comprehensive analytics and reporting tools coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">System Configuration</h3>
              <p className="text-muted-foreground">System settings and configuration options coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
