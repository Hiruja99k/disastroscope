import React, { useState, useEffect, useRef } from 'react';
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
  Square,
  Sparkles,
  Crown,
  Star,
  Award,
  Rocket,
  Zap as Lightning,
  Palette,
  Moon,
  Sun as SunIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subDays, subHours } from 'date-fns';
import DisasterMap from './DisasterMap';
import AdvancedCharts from './AdvancedCharts';
import RealTimeMonitor from './RealTimeMonitor';
import AlertSystem from './AlertSystem';
import EarthquakeMagnitudeMap from './EarthquakeMagnitudeMap';

// Advanced mock data for enterprise dashboard
const generateAdvancedData = () => {
  const now = new Date();
  const disasters = [
    { id: 1, type: 'Earthquake', location: 'San Francisco, CA', magnitude: 6.2, severity: 'High', status: 'Active', timestamp: subHours(now, 2), affected: 125000, coordinates: [37.7749, -122.4194] as [number, number] },
    { id: 2, type: 'Flood', location: 'Miami, FL', magnitude: 'Category 3', severity: 'Medium', status: 'Monitoring', timestamp: subHours(now, 4), affected: 89000, coordinates: [25.7617, -80.1918] as [number, number] },
    { id: 3, type: 'Wildfire', location: 'Los Angeles, CA', magnitude: 'Large', severity: 'Critical', status: 'Active', timestamp: subHours(now, 6), affected: 156000, coordinates: [34.0522, -118.2437] as [number, number] },
    { id: 4, type: 'Storm', location: 'New Orleans, LA', magnitude: 'Category 2', severity: 'Medium', status: 'Resolved', timestamp: subDays(now, 1), affected: 67000, coordinates: [29.9511, -90.0715] as [number, number] },
    { id: 5, type: 'Tsunami', location: 'Tokyo, Japan', magnitude: '8.1', severity: 'Critical', status: 'Active', timestamp: subHours(now, 1), affected: 250000, coordinates: [35.6762, 139.6503] as [number, number] },
    { id: 6, type: 'Volcano', location: 'Hawaii, USA', magnitude: 'Eruption', severity: 'High', status: 'Monitoring', timestamp: subHours(now, 3), affected: 45000, coordinates: [19.8968, -155.5828] as [number, number] },
  ];

  const sensorData = [
    { name: 'Temperature', value: 24.5, unit: '°C', status: 'Normal' as const, trend: 'up' as const, change: '+2.1°C' },
    { name: 'Humidity', value: 65, unit: '%', status: 'Normal' as const, trend: 'down' as const, change: '-5%' },
    { name: 'Pressure', value: 1013, unit: 'hPa', status: 'Normal' as const, trend: 'stable' as const, change: '0hPa' },
    { name: 'Wind Speed', value: 12, unit: 'km/h', status: 'Elevated' as const, trend: 'up' as const, change: '+8km/h' },
    { name: 'Air Quality', value: 45, unit: 'AQI', status: 'Normal' as const, trend: 'down' as const, change: '-10AQI' },
    { name: 'Seismic Activity', value: 78, unit: 'Richter', status: 'High' as const, trend: 'up' as const, change: '+15Richter' },
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const dashboardRef = useRef(null);

  // Debug: Log active tab changes
  useEffect(() => {
    // Tab change logging removed to fix linter error
  }, [activeTab]);

  // Auto-refresh data with enhanced feedback
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setData(generateAdvancedData());
      toast.success('🔄 Data refreshed automatically', {
        icon: '⚡',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleExport = () => {
    toast.success('📊 Exporting dashboard data...', {
      icon: '🚀',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.success(isFullscreen ? '📱 Exited fullscreen' : '🖥️ Entered fullscreen', {
      icon: '✨',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(isDarkMode ? '☀️ Switched to light mode' : '🌙 Switched to dark mode', {
      icon: '🎨',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
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
    <div
      ref={dashboardRef}
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      } ${isFullscreen ? 'fixed inset-0 z-50' : 'p-6'}`}
    >
       {/* Enhanced Particle Effects */}
       {/* Particle effects removed for cleaner dashboard experience */}

       {/* Floating geometric shapes */}
       {/* Floating shapes removed for cleaner dashboard experience */}

      {/* Header with 3D effect */}
      <div 
        className="flex justify-between items-center mb-8"
      >
        <div className="relative">
          <h1 
            className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            DisastroScope Enterprise
          </h1>
          <p 
            className={`mt-2 text-lg ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}
          >
            Advanced Disaster Monitoring & Response System
          </p>
          <div
            className="absolute -top-2 -right-2"
          >
            <Crown className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1 bg-gradient-to-r from-green-400 to-blue-500 text-white border-0"
          >
            <div className="live-indicator w-2 h-2 bg-green-400 rounded-full"></div>
            <Activity className="h-3 w-3" />
            Live Monitoring
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`${autoRefresh ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white border-0' : ''} transition-all duration-300`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </Button>
          </div>
          
          <div>
            <Button variant="outline" onClick={handleExport} className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div>
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <SunIcon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
          
          <div>
            <Button variant="outline" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div
          className="grid w-full grid-cols-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg"
        >
          <TabsList className={`grid w-full grid-cols-5 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <TabsTrigger value="overview" className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all duration-300">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white transition-all duration-300">
              <Satellite className="h-4 w-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="maps" className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
              <Map className="h-4 w-4" />
              Maps
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all duration-300">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white transition-all duration-300">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics with enhanced styling */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400/10 to-red-600/10 rounded-lg"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>Active Disasters</p>
                      <p className="text-4xl font-bold text-red-600">{data.disasters.filter(d => d.status === 'Active').length}</p>
                      <div className="flex items-center gap-1 text-sm text-red-600">
                        <TrendingUp className="h-4 w-4" />
                        +2 today
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-full bg-red-100"
                    >
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-lg"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>Response Time</p>
                      <p className="text-4xl font-bold text-green-600">{data.performanceMetrics.responseTime}%</p>
                      <div className="flex items-center gap-1 text-sm text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        +5% this week
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-full bg-green-100"
                    >
                      <Zap className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-lg"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>Prediction Accuracy</p>
                      <p className="text-4xl font-bold text-blue-600">{data.performanceMetrics.accuracy}%</p>
                      <div className="flex items-center gap-1 text-sm text-blue-600">
                        <TrendingUp className="h-4 w-4" />
                        +2.1% this month
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-full bg-blue-100"
                    >
                      <Target className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardContent className="p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-lg"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>System Uptime</p>
                      <p className="text-4xl font-bold text-purple-600">{data.performanceMetrics.uptime}%</p>
                      <div className="flex items-center gap-1 text-sm text-purple-600">
                        <CheckCircle className="h-4 w-4" />
                        Operational
                      </div>
                    </div>
                    <div 
                      className="p-3 rounded-full bg-purple-100"
                    >
                      <Server className="h-8 w-8 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts and Maps Grid with enhanced styling */}
          <div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    Disaster Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AdvancedCharts type="trends" />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-green-600" />
                    Global Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DisasterMap disasters={data.disasters} />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Earthquake Magnitude Map - Now visible in Overview tab */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-red-600" />
                  Global Earthquake Magnitude Distribution
                </CardTitle>
                <CardDescription>
                  Real-time seismic activity monitoring and historical earthquake data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EarthquakeMagnitudeMap height={600} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Disasters with enhanced styling */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Recent Disasters
                  </CardTitle>
                  <div>
                    <Button size="sm" variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.disasters.slice(0, 4).map((disaster, index) => (
                    <div
                      key={disaster.id}
                      className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${isDarkMode ? 'border-gray-700 hover:from-gray-700 hover:to-gray-600' : 'hover:shadow-lg'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div 
                          className="p-2 rounded-full bg-red-100"
                        >
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{disaster.type}</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>{disaster.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={getSeverityColor(disaster.severity)}>
                          {disaster.severity}
                        </Badge>
                        <Badge variant={getStatusColor(disaster.status)}>
                          {disaster.status}
                        </Badge>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>
                          {format(disaster.timestamp, 'MMM dd, HH:mm')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring">
          <RealTimeMonitor sensorData={data.sensorData} />
        </TabsContent>

        {/* Maps Tab */}
        <TabsContent value="maps">
          <div className="space-y-6">
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
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
            
            {/* Earthquake Magnitude Map */}
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Global Earthquake Magnitude Distribution
                </CardTitle>
                <CardDescription>
                  Real-time seismic activity monitoring and historical earthquake data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EarthquakeMagnitudeMap height={500} />
              </CardContent>
            </Card>
          </div>
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
    </div>
  );
};

export default AdvancedDashboard;
