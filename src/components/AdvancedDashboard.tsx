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
  Sun as SunIcon,
  Brain,
  FileText
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
  const [dashboardRef] = useState(useRef(null));
  
  // Advanced Enterprise Features
  const [criticalAlerts, setCriticalAlerts] = useState(3);
  const [systemHealth, setSystemHealth] = useState(98.5);
  const [activeUsers, setActiveUsers] = useState(127);
  const [dataLatency, setDataLatency] = useState(45);
  const [securityLevel, setSecurityLevel] = useState('high');
  const [complianceStatus, setComplianceStatus] = useState('compliant');
  const [lastBackup, setLastBackup] = useState(new Date());
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [aiPredictions, setAiPredictions] = useState(89.2);
  const [threatLevel, setThreatLevel] = useState('medium');
  
  // Advanced Filtering & Data Management
  const [selectedDisasterTypes, setSelectedDisasterTypes] = useState<string[]>([]);
  const [selectedSeverityLevels, setSelectedSeverityLevels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: subDays(new Date(), 7),
    end: new Date()
  });
  const [dataRefreshInterval, setDataRefreshInterval] = useState(30000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
      className={`min-h-screen transition-all duration-500 bg-white bg-animated-minimal ${isFullscreen ? 'fixed inset-0 z-50' : 'pt-20 p-6'}`}
    >
       {/* Enhanced Particle Effects */}
       {/* Particle effects removed for cleaner dashboard experience */}

       {/* Floating geometric shapes */}
       {/* Floating shapes removed for cleaner dashboard experience */}

      {/* Header with a cleaner, professional style */}
      <div className="mb-8 pt-2">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 gap-4">
          <div>
            <h1 className={`text-3xl sm:text-4xl font-semibold font-poppins bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
              DisastroScope
            </h1>
            <p className={`mt-2 text-sm sm:text-base text-slate-600`}>
              Advanced Disaster Monitoring & Response System
            </p>
            {/* Subtle status chips */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                System {systemHealth}%
              </div>
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Security {securityLevel}
              </div>
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Compliance {complianceStatus}
              </div>
              <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-slate-700'}`}>
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Threat {threatLevel}
              </div>
            </div>
          </div>

          

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            {criticalAlerts > 0 && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm ${isDarkMode ? 'border-red-900 text-red-300 bg-red-950/40' : 'border-red-200 text-red-700 bg-red-50'}`}>
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">{criticalAlerts} Critical</span>
              </div>
            )}

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs ${isDarkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-slate-700'}`}>
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <Activity className="h-3 w-3" />
              Live • {activeUsers} users
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="text-sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleExport} className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className="text-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                {maintenanceMode ? 'Maintenance' : 'Settings'}
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-sm">
                {isDarkMode ? <SunIcon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-sm">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 mt-8">
        {/* Advanced Enterprise Controls */}
        <div className="space-y-4">
          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showAdvancedFilters ? 'Hide' : 'Show'} Filters
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Refresh:</span>
                <select
                  value={dataRefreshInterval}
                  onChange={(e) => setDataRefreshInterval(Number(e.target.value))}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value={15000}>15s</option>
                  <option value={30000}>30s</option>
                  <option value={60000}>1m</option>
                  <option value={300000}>5m</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Time Range:</span>
                <select
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="1h">Last Hour</option>
                  <option value="24h">Last 24 Hours</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </div>
          </div>
          
          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Disaster Types</label>
                  <div className="space-y-2">
                    {['Earthquake', 'Flood', 'Wildfire', 'Storm', 'Tsunami', 'Volcano'].map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedDisasterTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDisasterTypes([...selectedDisasterTypes, type]);
                            } else {
                              setSelectedDisasterTypes(selectedDisasterTypes.filter(t => t !== type));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Severity Levels</label>
                  <div className="space-y-2">
                    {['Critical', 'High', 'Medium', 'Low'].map(severity => (
                      <label key={severity} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSeverityLevels.includes(severity)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSeverityLevels([...selectedSeverityLevels, severity]);
                            } else {
                              setSelectedSeverityLevels(selectedSeverityLevels.filter(s => s !== severity));
                            }
                          }}
                          className="rounded"
                        />
                        <span className="text-sm">{severity}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full text-sm border rounded px-3 py-2"
                  >
                    <option value="global">Global</option>
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="africa">Africa</option>
                    <option value="south-america">South America</option>
                  </select>
                  
                  <div className="mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        setSelectedDisasterTypes([]);
                        setSelectedSeverityLevels([]);
                        setSelectedRegion('global');
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full">
          <TabsList className={`w-full flex flex-wrap gap-2 p-0 bg-transparent border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <TabsTrigger 
              value="overview" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="whitespace-nowrap">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="monitoring" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <Satellite className="h-4 w-4" />
              <span className="whitespace-nowrap">Monitoring</span>
            </TabsTrigger>
            <TabsTrigger 
              value="maps" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <Map className="h-4 w-4" />
              <span className="whitespace-nowrap">Maps</span>
            </TabsTrigger>
            <TabsTrigger 
              value="alerts" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <Bell className="h-4 w-4" />
              <span className="whitespace-nowrap">Alerts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <PieChart className="h-4 w-4" />
              <span className="whitespace-nowrap">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="enterprise" 
              className="relative -mb-px rounded-none flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base hover:bg-gray-50 dark:hover:bg-gray-800 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:after:absolute data-[state=active]:after:inset-x-0 data-[state=active]:after:-bottom-px data-[state=active]:after:h-0.5 data-[state=active]:after:bg-slate-900 dark:data-[state=active]:after:bg-white"
            >
              <Crown className="h-4 w-4" />
              <span className="whitespace-nowrap">Enterprise</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Enterprise Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg border-l-4 border-l-red-500`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                    <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Requires immediate attention</div>
              </CardContent>
            </Card>
            
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg border-l-4 border-l-green-500`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">System Health</p>
                    <p className="text-2xl font-bold text-green-600">{systemHealth}%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Optimal performance</div>
              </CardContent>
            </Card>
            
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg border-l-4 border-l-blue-500`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">AI Predictions</p>
                    <p className="text-2xl font-bold text-blue-600">{aiPredictions}%</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Accuracy rate</div>
              </CardContent>
            </Card>
            
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-lg border-l-4 border-l-purple-500`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-purple-600">{activeUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">Real-time connections</div>
              </CardContent>
            </Card>
          </div>

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

          {/* Wildfire Map - embedded external source (Map of Fire) */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Global Wildfire Distribution Monitoring
                </CardTitle>
                <CardDescription>
                Harness and utilize the NASA FIRMS data to monitor, analyze, and gain actionable insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.mapofire.com/"
                    title="Wildfire Map"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Temperature Distribution - embedded Ventusky (placed right after wildfire map) */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  Global Temperature Distribution
                </CardTitle>
                <CardDescription>
                  Interactive global 2m air temperature visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=11.2;80.8;4&l=temperature-2m"
                    title="Global Temperature Distribution"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Precipitation Index */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  Global Precipitation Index
                </CardTitle>
                <CardDescription>
                  3-hour accumulated precipitation visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=8.3;82.8;4&l=rain-3h"
                    title="Global Precipitation Index"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Cloud Covering Measurement */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-sky-500" />
                  Global Cloud Covering Measurement
                </CardTitle>
                <CardDescription>
                  Total cloud cover visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=7.6;80.7;4&l=clouds-total"
                    title="Global Cloud Covering Measurement"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Hurricane Monitoring */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5 text-teal-500" />
                  Global Hurricane Monitoring
                </CardTitle>
                <CardDescription>
                  10m wind field visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=7.6;80.7;4&l=wind-10m"
                    title="Global Hurricane Monitoring"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Air Pressure Distribution */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-amber-600" />
                  Air Pressure Distribution
                </CardTitle>
                <CardDescription>
                  Mean sea-level pressure visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=7.6;80.7;4&l=pressure"
                    title="Air Pressure Distribution"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Thunderstorm Monitoring */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightning className="h-5 w-5 text-purple-600" />
                  Global Thunderstorm Monitoring
                </CardTitle>
                <CardDescription>
                  Convective Available Potential Energy (CAPE) visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=7.6;80.7;4&l=cape"
                    title="Global Thunderstorm Monitoring"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ocean Wave Height Measurement */}
          <div>
            <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl hover:shadow-2xl transition-all duration-300`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cyan-600" />
                  Ocean Wave Height Measurement
                </CardTitle>
                <CardDescription>
                  Global ocean wave height visualization (Ventusky)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full rounded-lg overflow-hidden border" style={{ height: `600px` }}>
                  <iframe
                    src="https://www.ventusky.com/?p=7.6;80.7;4&l=wave"
                    title="Ocean Wave Height Measurement"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
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

        {/* Enterprise Tab */}
        <TabsContent value="enterprise">
          <div className="space-y-6">
            {/* System Health & Compliance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Security Level</span>
                    <Badge variant="default" className="bg-green-500">{securityLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium">Compliance Status</span>
                    <Badge variant="default" className="bg-blue-500">{complianceStatus}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Threat Level</span>
                    <Badge variant="default" className="bg-orange-500">{threatLevel}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium">Data Latency</span>
                    <span className="font-mono">{dataLatency}ms</span>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-green-600" />
                    System Administration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Last Backup</span>
                    <span className="text-sm text-muted-foreground">{format(lastBackup, 'MMM dd, HH:mm')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Maintenance Mode</span>
                    <Badge variant={maintenanceMode ? "destructive" : "default"}>
                      {maintenanceMode ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">Active Users</span>
                    <span className="font-mono">{activeUsers}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">AI Predictions</span>
                    <span className="font-mono">{aiPredictions}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Monitoring & AI Insights */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights & Predictions
                </CardTitle>
                <CardDescription>
                  Advanced machine learning algorithms providing real-time disaster prediction and risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{aiPredictions}%</div>
                    <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring Coverage</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">&lt;1min</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Audit Trail */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Compliance & Audit Trail
                </CardTitle>
                <CardDescription>
                  Complete audit trail and compliance monitoring for enterprise requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">ISO 27001 Compliance</p>
                        <p className="text-sm text-muted-foreground">Information Security Management</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">GDPR Compliance</p>
                        <p className="text-sm text-muted-foreground">Data Protection Regulation</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Compliant</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">SOC 2 Type II</p>
                        <p className="text-sm text-muted-foreground">Security Operations Center</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-500">Compliant</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDashboard;
