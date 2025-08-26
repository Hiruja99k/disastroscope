import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  AlertTriangle, 
  Globe, 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Users,
  Shield,
  Zap,
  Target,
  Database,
  Server,
  Satellite,
  Radar,
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Mountain,
  CloudRain,
  Sun,
  Gauge,
  Bell,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Layers,
  Navigation,
  Compass,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  Globe2,
  SatelliteDish,
  Wifi,
  Signal,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subDays, subHours } from 'date-fns';
import DisasterMap from './DisasterMap';
import AdvancedCharts from './AdvancedCharts';
import RealTimeMonitor from './RealTimeMonitor';
import AlertSystem from './AlertSystem';

// Advanced mock data for enterprise dashboard
const generateAdvancedData = () => {
  const now = new Date();
  const disasters = [
    { id: 1, type: 'Earthquake', location: 'San Francisco, CA', magnitude: 6.2, severity: 'High', status: 'Active', timestamp: subHours(now, 2), affected: 125000, coordinates: [37.7749, -122.4194] },
    { id: 2, type: 'Flood', location: 'Miami, FL', magnitude: 'Category 3', severity: 'Medium', status: 'Monitoring', timestamp: subHours(now, 4), affected: 89000, coordinates: [25.7617, -80.1918] },
    { id: 3, type: 'Wildfire', location: 'Los Angeles, CA', magnitude: 'Large', severity: 'Critical', status: 'Active', timestamp: subHours(now, 6), affected: 156000, coordinates: [34.0522, -118.2437] },
    { id: 4, type: 'Storm', location: 'New Orleans, LA', magnitude: 'Category 2', severity: 'Medium', status: 'Resolved', timestamp: subDays(now, 1), affected: 67000, coordinates: [29.9511, -90.0715] },
    { id: 5, type: 'Tsunami', location: 'Tokyo, Japan', magnitude: '8.1', severity: 'Critical', status: 'Active', timestamp: subHours(now, 1), affected: 250000, coordinates: [35.6762, 139.6503] },
    { id: 6, type: 'Volcano', location: 'Hawaii, USA', magnitude: 'Eruption', severity: 'High', status: 'Monitoring', timestamp: subHours(now, 3), affected: 45000, coordinates: [19.8968, -155.5828] },
  ];

  const sensorData = [
    { name: 'Temperature', value: 24.5, unit: '°C', status: 'Normal', trend: 'up', change: '+2.1°C' },
    { name: 'Humidity', value: 65, unit: '%', status: 'Normal', trend: 'down', change: '-5%' },
    { name: 'Pressure', value: 1013, unit: 'hPa', status: 'Normal', trend: 'stable', change: '0hPa' },
    { name: 'Wind Speed', value: 12, unit: 'km/h', status: 'Elevated', trend: 'up', change: '+8km/h' },
    { name: 'Air Quality', value: 45, unit: 'AQI', status: 'Good', trend: 'down', change: '-10AQI' },
    { name: 'Seismic Activity', value: 78, unit: 'Richter', status: 'High', trend: 'up', change: '+15Richter' },
  ];

  const performanceMetrics = {
    responseTime: 85,
    accuracy: 94.2,
    uptime: 99.8,
    coverage: 87.5,
    efficiency: 92.1,
    reliability: 96.8
  };

  return { disasters, sensorData, performanceMetrics };
};

const AdvancedDashboard = () => {
  const [data, setData] = useState(generateAdvancedData());
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const dashboardRef = useRef(null);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger animation for cards
      gsap.from('.dashboard-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
      });

      // Floating animation for key metrics
      gsap.to('.floating-metric', {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        stagger: 0.2
      });
    }, dashboardRef);

    return () => ctx.revert();
  }, []);

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setData(generateAdvancedData());
      toast.success('Data refreshed automatically');
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleExport = () => {
    toast.success('Exporting dashboard data...');
    // Export logic here
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.success(isFullscreen ? 'Exited fullscreen' : 'Entered fullscreen');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'destructive';
      case 'monitoring': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <motion.div
      ref={dashboardRef}
      className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DisastroScope Enterprise
          </h1>
          <p className="text-slate-600 mt-2">Advanced Disaster Monitoring & Response System</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Monitoring
          </Badge>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <Satellite className="h-4 w-4" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="maps" className="flex items-center gap-2">
            <Map className="h-4 w-4" />
            Maps
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="dashboard-card floating-metric">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Disasters</p>
                    <p className="text-3xl font-bold text-red-600">{data.disasters.filter(d => d.status === 'Active').length}</p>
                    <div className="flex items-center gap-1 text-sm text-red-600">
                      <TrendingUp className="h-4 w-4" />
                      +2 today
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-red-100">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card floating-metric">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                    <p className="text-3xl font-bold text-green-600">{data.performanceMetrics.responseTime}%</p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      +5% this week
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Zap className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card floating-metric">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                    <p className="text-3xl font-bold text-blue-600">{data.performanceMetrics.accuracy}%</p>
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <TrendingUp className="h-4 w-4" />
                      +2.1% this month
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card floating-metric">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
                    <p className="text-3xl font-bold text-purple-600">{data.performanceMetrics.uptime}%</p>
                    <div className="flex items-center gap-1 text-sm text-purple-600">
                      <CheckCircle className="h-4 w-4" />
                      Operational
                    </div>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <Server className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts and Maps Grid */}
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Disaster Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AdvancedCharts type="trends" />
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  Global Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DisasterMap disasters={data.disasters} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Disasters */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="dashboard-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Recent Disasters
                  </CardTitle>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.disasters.slice(0, 4).map((disaster) => (
                    <motion.div
                      key={disaster.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-red-100">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{disaster.type}</p>
                          <p className="text-sm text-muted-foreground">{disaster.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getSeverityColor(disaster.severity)}>
                          {disaster.severity}
                        </Badge>
                        <Badge variant={getStatusColor(disaster.status)}>
                          {disaster.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {format(disaster.timestamp, 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <RealTimeMonitor sensorData={data.sensorData} />
        </TabsContent>

        {/* Maps Tab */}
        <TabsContent value="maps">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Advanced Disaster Mapping
              </CardTitle>
              <CardDescription>
                Real-time disaster monitoring with advanced visualization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DisasterMap disasters={data.disasters} advanced={true} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <AlertSystem disasters={data.disasters} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AdvancedCharts type="analytics" data={data} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdvancedDashboard;
