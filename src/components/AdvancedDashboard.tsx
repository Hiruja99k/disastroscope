import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
  FileText,
  Bug,
  Phone,
  Search
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subDays, subHours, formatDistanceToNow } from 'date-fns';
import DisasterMap from './DisasterMap';
import AdvancedCharts from './AdvancedCharts';
import RealTimeMonitor from './RealTimeMonitor';
import AlertSystem from './AlertSystem';
import EarthquakeMagnitudeMap from './EarthquakeMagnitudeMap';
import LocationMap from './LocationMap';
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations';
import { fetchAllDisasterData, getMockDisasterData, type DisasterEvent, type NotificationItem, type TimelineEvent } from '@/services/disasterDataService';
import { apiService, type GlobalRiskAnalysis } from '@/services/api';
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
  const riskAnimRef = useGSAPAnimations();
  
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
  // Live operational metrics for realism
  const [opsOpen, setOpsOpen] = useState(14);
  const [opsTriage, setOpsTriage] = useState(5);
  const [opsAwaiting, setOpsAwaiting] = useState(3);
  const [slaP1, setSlaP1] = useState(92);
  const [slaP2, setSlaP2] = useState(88);
  const [slaP3, setSlaP3] = useState(96);
  const [serviceTimes, setServiceTimes] = useState({
    usgs: new Date(),
    noaa: new Date(),
    firms: new Date(),
    fema: new Date(),
  });
  const [timeline, setTimeline] = useState<Array<{title:string, source:string, at: Date}>>([
    { title: 'M6.1 aftershock recorded', source: 'Sensor hub', at: new Date() },
    { title: 'Flash flood warning expanded', source: 'NOAA', at: new Date() },
    { title: 'Satellite hotspot cluster detected', source: 'FIRMS', at: new Date() },
  ]);
  const [notif, setNotif] = useState<string[]>([
    'USGS issued aftershock advisory',
    'Satellite hotspot surge detected',
    'Rainband moving inland within 6h',
  ]);
  // Executive mini-charts
  const [sparkAlerts, setSparkAlerts] = useState<number[]>([10,12,9,14,11,15,13]);
  const [distIncidents, setDistIncidents] = useState<number[]>([45,30,25]); // EQ, Flood, Wildfire
  const [healthScore, setHealthScore] = useState<number>(94);
  const [capacityTrend, setCapacityTrend] = useState<number[]>([70,72,71,73,74,75,74,76]);
  const [latencyTrend, setLatencyTrend] = useState<number[]>([48,46,50,47,45,44,46,43]);
  // Multi-hazard risk series (simulated next 24 intervals)
  const seedSeries = (base:number) => Array.from({length: 24}, (_,i)=> Math.max(0, Math.round(base + Math.sin(i/3)*3 + (Math.random()-0.5)*2)));
  const [riskDrought, setRiskDrought] = useState<number[]>(seedSeries(20));
  const [riskStorm, setRiskStorm] = useState<number[]>(seedSeries(35));
  const [riskLandslide, setRiskLandslide] = useState<number[]>(seedSeries(15));
  const [riskTsunami, setRiskTsunami] = useState<number[]>(seedSeries(8));
  const [riskWildfire, setRiskWildfire] = useState<number[]>(seedSeries(28));
  const [hazardMix, setHazardMix] = useState<number[]>([22, 34, 12, 6, 26]); // Drought, Storm, Landslide, Tsunami, Wildfire
  // ML Model performance (dynamic updating series)
  const initialPerf = Array.from({ length: 20 }, (_, i) => 88 + Math.round(Math.sin(i / 2) * 3 + (Math.random() - 0.5) * 2));
  const [mlPerf, setMlPerf] = useState<number[]>(initialPerf);
  
  // Real disaster data state
  const [realDisasters, setRealDisasters] = useState<DisasterEvent[]>([]);
  const [realNotifications, setRealNotifications] = useState<NotificationItem[]>([]);
  const [realTimeline, setRealTimeline] = useState<TimelineEvent[]>([]);
  const [isLoadingDisasterData, setIsLoadingDisasterData] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());
  
  // Advanced Filtering & Data Management
  const [selectedDisasterTypes, setSelectedDisasterTypes] = useState<string[]>([]);
  const [selectedSeverityLevels, setSelectedSeverityLevels] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>({
    start: subDays(new Date(), 7),
    end: new Date()
  });
  const [dataRefreshInterval, setDataRefreshInterval] = useState(30000);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Location-based Risk Analysis State
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
    detailedAddress?: string;
    accuracy?: number;
    locationParts?: string[];
  } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [riskAnalysis, setRiskAnalysis] = useState<any>(null);

  // Global Risk Analysis State
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isAnalyzingGlobal, setIsAnalyzingGlobal] = useState(false);
  const [globalAnalysisError, setGlobalAnalysisError] = useState<string | null>(null);
  const [globalRiskData, setGlobalRiskData] = useState<GlobalRiskAnalysis | null>(null);

  // Debug: Log active tab changes
  useEffect(() => {
    // Tab change logging removed to fix linter error
  }, [activeTab]);

  // Fetch real disaster data (prefer backend when healthy)
  useEffect(() => {
    const fetchDisasterData = async () => {
      setIsLoadingDisasterData(true);
      try {
        const backendHealthy = await apiService.healthCheck();
        if (backendHealthy) {
          // Retrieve events/predictions from backend and adapt to dashboard structures
          const [events, predictions, models] = await Promise.all([
            apiService.getEvents(),
            apiService.getPredictions(),
            apiService.getModels()
          ]);

          const mappedDisasters: DisasterEvent[] = (events || []).map((e: any) => ({
            id: e.id || `event-${Math.random().toString(36).slice(2)}`,
            type: e.event_type || 'Event',
            title: e.name || e.description || 'Disaster Event',
            location: e.location || 'Unknown',
            coordinates: [e.coordinates?.lat ?? 0, e.coordinates?.lng ?? 0],
            severity: (e.severity || 'Medium') as DisasterEvent['severity'],
            status: (e.status || 'Active') as DisasterEvent['status'],
            timestamp: new Date(e.updated_at || e.created_at || Date.now()),
            magnitude: e.magnitude,
            affected: e.affected_population,
            source: e.source || 'Backend',
            description: e.description
          }));

          const notifications: NotificationItem[] = mappedDisasters.slice(0, 5).map(d => ({
            id: `notif-${d.id}`,
            message: `${d.type}: ${d.title} in ${d.location}`,
            type: (d.severity === 'Critical' ? 'critical' : 'alert'),
            timestamp: d.timestamp,
            source: d.source,
            action: d.severity === 'Critical' ? 'Immediate Action Required' : 'Investigate',
            severity: d.severity
          }));

          const timeline: TimelineEvent[] = mappedDisasters.slice(0, 5).map(d => ({
            id: `timeline-${d.id}`,
            title: d.title,
            source: d.source,
            timestamp: d.timestamp,
            type: d.type,
            severity: d.severity
          }));

          setRealDisasters(mappedDisasters);
          setRealNotifications(notifications);
          setRealTimeline(timeline);
          setLastDataUpdate(new Date());
          toast.success('🌍 Connected to backend and updated data', {
            icon: '⚡',
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
          });
        } else {
        const disasterData = await fetchAllDisasterData();
        setRealDisasters(disasterData.disasters);
        setRealNotifications(disasterData.notifications);
        setRealTimeline(disasterData.timeline);
        setLastDataUpdate(new Date());
          toast.success('🌍 Updated data from public sources', {
          icon: '⚡',
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
          });
        }
      } catch (error) {
        console.error('Error fetching disaster data:', error);
        const mockData = getMockDisasterData();
        setRealDisasters(mockData.disasters);
        setRealNotifications(mockData.notifications);
        setRealTimeline(mockData.timeline);
        toast.error('⚠️ Using fallback data - API unavailable', {
          icon: '⚠️',
          style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
        });
      } finally {
        setIsLoadingDisasterData(false);
      }
    };

    fetchDisasterData();
    const interval = setInterval(fetchDisasterData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Subtle drift to make values feel live
  useEffect(() => {
    const clamp = (v:number, min:number, max:number)=> Math.max(min, Math.min(max, v));
    const id = setInterval(() => {
      setOpsOpen(v => clamp(v + Math.round((Math.random()-0.5)*3), 8, 26));
      setOpsTriage(v => clamp(v + Math.round((Math.random()-0.5)*2), 2, 10));
      setOpsAwaiting(v => clamp(v + Math.round((Math.random()-0.5)*2), 1, 8));
      setSlaP1(v => clamp(Math.round(v + (Math.random()-0.5)*2), 85, 98));
      setSlaP2(v => clamp(Math.round(v + (Math.random()-0.5)*2), 80, 96));
      setSlaP3(v => clamp(Math.round(v + (Math.random()-0.5)*2), 90, 99));
      setServiceTimes({
        usgs: new Date(),
        noaa: new Date(Date.now() - (2+Math.floor(Math.random()*4))*60*1000),
        firms: new Date(Date.now() - (3+Math.floor(Math.random()*4))*60*1000),
        fema: new Date(Date.now() - (5+Math.floor(Math.random()*6))*60*1000),
      });
      setTimeline(list => [{ title: 'Telemetry sync complete', source: 'Ingest', at: new Date() }, ...list].slice(0,5));
      setNotif(list => {
        const pool = ['New station calibration applied', 'Wind field shift expected in 3h', 'Crowdsourced report burst nearby'];
        return [pool[Math.floor(Math.random()*pool.length)], ...list].slice(0,3);
      });
      // small charts drift
      setSparkAlerts(arr => {
        const next = [...arr.slice(1), Math.max(5, Math.min(20, Math.round(arr[arr.length-1] + (Math.random()-0.5)*4)) )];
        return next;
      });
      setDistIncidents(([a,b,c]) => {
        const da = Math.max(20, Math.min(60, a + Math.round((Math.random()-0.5)*4)));
        const db = Math.max(15, Math.min(45, b + Math.round((Math.random()-0.5)*3)));
        const dc = Math.max(10, Math.min(40, c + Math.round((Math.random()-0.5)*3)));
        return [da, db, dc];
      });
      setHealthScore(v => Math.max(85, Math.min(99, Math.round(v + (Math.random()-0.5)*2))));
      setCapacityTrend(arr => {
        const last = arr[arr.length-1] ?? 74;
        const next = Math.max(60, Math.min(90, Math.round(last + (Math.random()-0.5)*3)));
        return [...arr.slice(1), next];
      });
      setLatencyTrend(arr => {
        const last = arr[arr.length-1] ?? 44;
        const next = Math.max(30, Math.min(70, Math.round(last + (Math.random()-0.5)*5)));
        return [...arr.slice(1), next];
      });
      // risk series drift
      const drift = (arr:number[], min:number, max:number, step:number) => {
        const last = arr[arr.length-1] ?? (min+max)/2;
        const next = Math.max(min, Math.min(max, Math.round(last + (Math.random()-0.5)*step)));
        return [...arr.slice(1), next];
      };
      setRiskDrought(arr => drift(arr, 5, 45, 3));
      setRiskStorm(arr => drift(arr, 10, 60, 4));
      setRiskLandslide(arr => drift(arr, 5, 35, 3));
      setRiskTsunami(arr => drift(arr, 0, 20, 2));
      setRiskWildfire(arr => drift(arr, 10, 55, 4));
      setHazardMix(([d,s,l,t,w]) => [
        Math.max(10, Math.min(40, d + Math.round((Math.random()-0.5)*3))),
        Math.max(20, Math.min(50, s + Math.round((Math.random()-0.5)*3))),
        Math.max(8, Math.min(30, l + Math.round((Math.random()-0.5)*2))),
        Math.max(3, Math.min(15, t + Math.round((Math.random()-0.5)*2))),
        Math.max(15, Math.min(45, w + Math.round((Math.random()-0.5)*3)))
      ]);
    }, 20000);
    return () => clearInterval(id);
  }, []);

  // ML model performance: dynamic updating every 2s
  useEffect(() => {
    const perfTimer = setInterval(() => {
      setMlPerf(arr => {
        const last = arr[arr.length - 1] ?? 90;
        const next = Math.max(80, Math.min(98, Math.round(last + (Math.random() - 0.5) * 2)));
        return [...arr.slice(1), next];
      });
    }, 2000);
    return () => clearInterval(perfTimer);
  }, []);

  // Location Detection and Risk Analysis Functions
  const testGeolocation = () => {
    console.log('🧪 Testing geolocation API...');
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not supported');
      return;
    }
    
    console.log('✅ Geolocation API available');
    console.log('📍 Testing getCurrentPosition...');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('✅ Geolocation test successful:', position);
        const { latitude, longitude, accuracy } = position.coords;
        console.log('📍 Coordinates:', { latitude, longitude, accuracy });
        console.log('📍 Coordinate validation - Lat valid:', latitude >= -90 && latitude <= 90, 'Lng valid:', longitude >= -180 && longitude <= 180);
        
        // Test Mapbox API directly
        testMapboxAPI(latitude, longitude);
      },
      (error) => {
        console.error('❌ Geolocation test failed:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const testMapboxAPI = async (lat: number, lng: number) => {
    console.log('🧪 Testing Mapbox API with coordinates:', { lat, lng });
    const mapboxToken = 'pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw';
    
    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`;
      console.log('🧪 Mapbox test URL:', url);
      
      const response = await fetch(url);
      console.log('🧪 Mapbox test response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🧪 Mapbox test response:', data);
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0];
          console.log('🧪 Mapbox test feature:', feature);
          toast.success('✅ Mapbox API test successful', {
            icon: '✅',
            style: { borderRadius: '10px', background: '#059669', color: '#fff' },
          });
        } else {
          console.log('🧪 Mapbox test: No features found');
          toast.error('⚠️ Mapbox API test: No features found', {
            icon: '⚠️',
            style: { borderRadius: '10px', background: '#d97706', color: '#fff' },
          });
        }
      } else {
        const errorText = await response.text();
        console.error('🧪 Mapbox test error:', response.status, errorText);
        toast.error('❌ Mapbox API test failed', {
          icon: '❌',
          style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
        });
      }
    } catch (error) {
      console.error('🧪 Mapbox test exception:', error);
      toast.error('❌ Mapbox API test exception', {
        icon: '❌',
        style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
      });
    }
  };

  const handleGlobalRiskAnalysis = async () => {
    if (!globalSearchQuery.trim()) {
      toast.error('Please enter a location to analyze', {
        icon: '⚠️',
        style: { borderRadius: '10px', background: '#d97706', color: '#fff' },
      });
      return;
    }

    setIsAnalyzingGlobal(true);
    setGlobalAnalysisError(null);
    setGlobalRiskData(null);

    try {
      console.log('🌍 Starting global risk analysis for:', globalSearchQuery);
      
      const analysis = await apiService.analyzeGlobalRisk(globalSearchQuery);
      
      if (analysis) {
        setGlobalRiskData(analysis);
        toast.success('✅ Global risk analysis completed', {
          icon: '✅',
          style: { borderRadius: '10px', background: '#059669', color: '#fff' },
        });
        console.log('🌍 Global risk analysis result:', analysis);
      } else {
        throw new Error('Failed to get risk analysis data');
      }
    } catch (error) {
      console.error('🌍 Global risk analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze global risk';
      setGlobalAnalysisError(errorMessage);
      toast.error(`❌ ${errorMessage}`, {
        icon: '❌',
        style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
      });
    } finally {
      setIsAnalyzingGlobal(false);
    }
  };

  const detectUserLocation = async () => {
    console.log('🚀 detectUserLocation function started');
    setIsDetectingLocation(true);
    setAnalysisError(null);
    
    try {
      console.log('🔍 Checking if geolocation is supported...');
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }
      console.log('✅ Geolocation is supported');

      // Use extremely high accuracy settings for precise location with multiple attempts
      let bestPosition: GeolocationPosition | null = null;
      let bestAccuracy = Infinity;
      
      // Try up to 3 times to get the best possible accuracy
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`📍 GPS Attempt ${attempt}/3 - Getting high accuracy location...`);
          
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            console.log(`📍 Starting getCurrentPosition for attempt ${attempt}`);
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,  // Maximum accuracy - uses GPS, cellular, and WiFi
              timeout: 60000,           // 60 seconds for maximum accuracy
              maximumAge: 0             // Always get fresh location
            });
          });

          const { accuracy } = position.coords;
          console.log(`📍 GPS Attempt ${attempt} - Accuracy: ${accuracy}m`);
          
          // Keep the position with the best accuracy
          if (accuracy < bestAccuracy) {
            bestAccuracy = accuracy;
            bestPosition = position;
            console.log(`✅ New best accuracy: ${accuracy}m`);
          }
          
          // If we get excellent accuracy (<10m), we can stop early
          if (accuracy < 10) {
            console.log(`🎯 Excellent accuracy achieved: ${accuracy}m - stopping attempts`);
            break;
          }
          
          // Wait a bit before the next attempt to let GPS settle
          if (attempt < 3) {
            console.log(`⏳ Waiting 2 seconds before next attempt...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
        } catch (attemptError) {
          console.log(`⚠️ GPS Attempt ${attempt} failed:`, attemptError);
          if (attempt === 3) {
            throw attemptError; // Re-throw on final attempt
          }
        }
      }
      
      if (!bestPosition) {
        throw new Error('Failed to get GPS position after multiple attempts');
      }
      
      const { latitude: lat, longitude: lng, accuracy } = bestPosition.coords;
      console.log(`📍 Final GPS Coordinates: ${lat}, ${lng} (Accuracy: ${accuracy}m)`);
      
      // Get detailed address using Mapbox Geocoding API with improved accuracy
      try {
        console.log('🗺️ Starting Mapbox geocoding...');
        const mapboxToken = 'pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw';
        
        // Use a more comprehensive geocoding request to get the most accurate location
        // Note: Mapbox expects coordinates in the format "longitude,latitude" (lng,lat)
        const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&types=address,poi,neighborhood,place,locality,district,region,country&limit=3`;
        console.log('🗺️ Mapbox API URL:', geocodingUrl);
        console.log('🗺️ Coordinates being sent - Lat:', lat, 'Lng:', lng);
        console.log('🗺️ Coordinate validation - Lat valid:', lat >= -90 && lat <= 90, 'Lng valid:', lng >= -180 && lng <= 180);
        
        const response = await fetch(geocodingUrl);
        
        console.log('🗺️ Mapbox response status:', response.status);
        console.log('🗺️ Mapbox response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          console.error('🗺️ Mapbox API error:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('🗺️ Mapbox error details:', errorText);
          
          // Try a simpler geocoding request as fallback
          console.log('🗺️ Trying simpler geocoding request...');
          const simpleUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&limit=1`;
          const simpleResponse = await fetch(simpleUrl);
          
          if (simpleResponse.ok) {
            console.log('🗺️ Simple geocoding request succeeded');
            const simpleData = await simpleResponse.json();
            console.log('🗺️ Simple geocoding response:', simpleData);
            
            if (simpleData.features && simpleData.features.length > 0) {
              const feature = simpleData.features[0];
              const placeName = feature.place_name || feature.text || '';
              
              // Use the place name directly
              const locationParts = placeName.split(',').map(p => p.trim()).filter(p => p).slice(0, 3);
              
              const address = locationParts.join(', ');
              const detailedAddress = locationParts.join(' • ');
              
              console.log('📍 Setting current location with simple address:', { lat, lng, address, detailedAddress });
              
              setCurrentLocation({
                lat,
                lng,
                address,
                detailedAddress,
                accuracy,
                locationParts
              });
              
              console.log('✅ Location successfully set with simple address');
              
              toast.success(`📍 Location detected: ${detailedAddress}`, {
                icon: '📍',
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
              });
              
              return; // Exit early since we got a successful response
            }
          }
          
          throw new Error(`Mapbox API error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('🗺️ Mapbox Geocoding Response:', data);
        
        if (data.features && data.features.length > 0) {
          // Get the most relevant feature (usually the first one)
          const primaryFeature = data.features[0];
          const context = primaryFeature.context || [];
          
          // Extract location components with better logic
          const placeName = primaryFeature.text || '';
          const locality = context.find((c: any) => c.id.startsWith('locality'))?.text || '';
          const district = context.find((c: any) => c.id.startsWith('district'))?.text || '';
          const region = context.find((c: any) => c.id.startsWith('region'))?.text || '';
          const country = context.find((c: any) => c.id.startsWith('country'))?.text || '';
          
          // Build a clean, accurate location string
          const locationParts = [];
          
          // Add the most specific location first (place name or address)
          if (placeName && placeName !== locality && placeName !== district) {
            locationParts.push(placeName);
          }
          
          // Add locality (city/town) if different from place name
          if (locality && !locationParts.includes(locality)) {
            locationParts.push(locality);
          }
          
          // Add district if different from locality
          if (district && !locationParts.includes(district) && district !== locality) {
            locationParts.push(district);
          }
          
          // Add region if different from district
          if (region && !locationParts.includes(region) && region !== district) {
            locationParts.push(region);
          }
          
          // Add country if not already included
          if (country && !locationParts.includes(country)) {
            locationParts.push(country);
          }
          
          // If we don't have enough meaningful parts, use the full place name
          if (locationParts.length < 2) {
            const fullPlaceName = primaryFeature.place_name || '';
            if (fullPlaceName) {
              // Split by comma and take the most relevant parts
              const parts = fullPlaceName.split(',').map(p => p.trim()).filter(p => p);
              locationParts.length = 0; // Clear existing parts
              locationParts.push(...parts.slice(0, 3)); // Take first 3 meaningful parts
            }
          }
          
          // Ensure we have at least 2 meaningful parts
          if (locationParts.length < 2) {
            locationParts.push('Location Detected');
          }
          
          const address = locationParts.join(', ');
          const detailedAddress = locationParts.join(' • ');
          
          console.log('📍 Setting current location with address:', { lat, lng, address, detailedAddress });
          console.log('📍 Location parts:', locationParts);
          
          setCurrentLocation({
            lat,
            lng,
            address,
            detailedAddress,
            accuracy,
            locationParts
          });
          
          console.log('✅ Location successfully set with address');
          
          toast.success(`📍 Precise location detected: ${detailedAddress}`, {
            icon: '📍',
            style: { borderRadius: '10px', background: '#333', color: '#fff' },
          });
        } else {
          // No features found, use fallback
          throw new Error('No location features found in Mapbox response');
        }
        
      } catch (geocodingError) {
        console.error('Reverse geocoding failed:', geocodingError);
        
        // Fallback to coordinates with better formatting
        console.log('📍 Using fallback coordinates display');
        const fallbackAddress = `GPS Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        const fallbackDetailed = `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        setCurrentLocation({
          lat,
          lng,
          address: fallbackAddress,
          detailedAddress: fallbackDetailed,
          accuracy,
          locationParts: ['GPS Coordinates', 'Location Detected']
        });
        
        toast.success(`📍 Location detected (using coordinates)`, {
          icon: '📍',
          style: { borderRadius: '10px', background: '#333', color: '#fff' },
        });
      }
      
    } catch (error) {
      console.error('Location detection failed:', error);
      
      let errorMessage = 'Failed to detect location. Please check your browser permissions.';
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.';
            break;
        }
      }
      
      setAnalysisError(errorMessage);
      toast.error('❌ Location detection failed', {
        icon: '❌',
        style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
      });
    } finally {
      console.log('🏁 detectUserLocation function completed');
      setIsDetectingLocation(false);
    }
  };

  const analyzeLocation = async () => {
    if (!currentLocation) {
      setAnalysisError('Please detect your location first');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    setRiskAnalysis(null);

    try {
      const coordinates = currentLocation;
      const locationName = currentLocation.address;

      console.log('🔍 Starting risk analysis for coordinates:', coordinates);

      // First, test backend connectivity
      const backendHealthy = await apiService.healthCheck();
      if (!backendHealthy) {
        throw new Error('Backend is not responding. Please check if the Railway service is running.');
      }

      console.log('✅ Backend health check passed');

      // Get AI prediction from backend
      console.log('🤖 Fetching AI prediction...');
      const aiPrediction = await apiService.predictDisaster(coordinates.lat, coordinates.lng, locationName);
      
      if (!aiPrediction) {
        throw new Error('Failed to get AI prediction from backend. The prediction endpoint may not be implemented yet.');
      }

      console.log('✅ AI prediction received:', aiPrediction);

      // Get current weather data for the location
      console.log('🌤️ Fetching weather data...');
      const weatherData = await apiService.getCurrentWeatherByCoords(coordinates.lat, coordinates.lng, locationName);
      console.log('✅ Weather data received:', weatherData);
      
      // Get location analysis from backend
      console.log('📍 Fetching location analysis...');
      const locationAnalysis = await apiService.analyzeCoords(coordinates.lat, coordinates.lng);
      console.log('✅ Location analysis received:', locationAnalysis);

      // Process and structure the risk analysis data
      const analysis = {
        location: {
          coordinates,
          address: locationName,
          elevation: locationAnalysis?.elevation,
          soil_type: locationAnalysis?.soil_type,
          land_use: locationAnalysis?.land_use,
          historical_events: locationAnalysis?.historical_events
        },
        weather: weatherData ? {
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          wind_speed: weatherData.wind_speed,
          precipitation: weatherData.precipitation
        } : null,
        flood: {
          risk_level: getRiskLevel(aiPrediction.predictions?.flood || 0),
          probability: Math.round((aiPrediction.predictions?.flood || 0) * 100),
          description: aiPrediction.summaries?.flood || 'Flood risk assessment based on current conditions'
        },
        earthquake: {
          risk_level: getRiskLevel(aiPrediction.predictions?.earthquake || 0),
          probability: Math.round((aiPrediction.predictions?.earthquake || 0) * 100),
          description: aiPrediction.summaries?.earthquake || 'Earthquake risk assessment based on seismic data'
        },
        drought: {
          risk_level: getRiskLevel(aiPrediction.predictions?.drought || 0),
          probability: Math.round((aiPrediction.predictions?.drought || 0) * 100),
          description: aiPrediction.summaries?.drought || 'Drought risk assessment based on climate data'
        },
        composite_risk: getCompositeRiskLevel(aiPrediction.predictions),
        exposure_level: getExposureLevel(locationAnalysis?.population_density),
        confidence_level: getConfidenceLevel(aiPrediction.predictions),
        insights: generateInsights(aiPrediction, weatherData),
        scenarios: generateScenarios(aiPrediction, locationAnalysis),
        resources: generateResources(aiPrediction, locationAnalysis),
        timestamp: new Date().toISOString()
      };

      setRiskAnalysis(analysis);
      toast.success('🔍 Risk analysis completed', {
        icon: '🔍',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
      });

    } catch (error) {
      console.error('❌ Risk analysis failed:', error);
      
      let errorMessage = 'Risk analysis failed';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to backend. Please check your internet connection and try again.';
        } else if (error.message.includes('Backend is not responding')) {
          errorMessage = 'Backend service is unavailable. Please try again later.';
        } else if (error.message.includes('Failed to get AI prediction')) {
          errorMessage = 'AI prediction service is not available. Please check backend implementation.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setAnalysisError(errorMessage);
      toast.error(`❌ ${errorMessage}`, {
        icon: '❌',
        style: { borderRadius: '10px', background: '#dc2626', color: '#fff' },
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Helper functions for risk analysis
  const getRiskLevel = (probability: number): string => {
    if (probability >= 0.7) return 'Critical';
    if (probability >= 0.5) return 'High';
    if (probability >= 0.3) return 'Medium';
    if (probability >= 0.1) return 'Low';
    return 'Very Low';
  };

  const getCompositeRiskLevel = (predictions: any): string => {
    const values = Object.values(predictions || {}).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 'Unknown';
    
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return getRiskLevel(avg);
  };

  const getExposureLevel = (populationDensity?: number): string => {
    if (!populationDensity) return 'Unknown';
    if (populationDensity > 1000) return 'Very High';
    if (populationDensity > 500) return 'High';
    if (populationDensity > 100) return 'Moderate';
    if (populationDensity > 10) return 'Low';
    return 'Very Low';
  };

  const getConfidenceLevel = (predictions: any): string => {
    // Simple confidence calculation based on prediction consistency
    const values = Object.values(predictions || {}).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return 'Unknown';
    
    const variance = values.reduce((acc, val) => acc + Math.pow(val - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length;
    if (variance < 0.01) return 'Very High';
    if (variance < 0.05) return 'High';
    if (variance < 0.1) return 'Medium';
    return 'Low';
  };

  const generateInsights = (prediction: any, weather: any): Array<{title: string, description: string}> => {
    const insights = [];
    
    if (prediction.predictions?.flood > 0.5) {
      insights.push({
        title: 'High Flood Risk Detected',
        description: 'Current weather conditions and historical data suggest elevated flood risk in this area.'
      });
    }
    
    if (prediction.predictions?.earthquake > 0.3) {
      insights.push({
        title: 'Seismic Activity Warning',
        description: 'Seismic sensors indicate increased earthquake probability in this region.'
      });
    }
    
    if (prediction.predictions?.drought > 0.6) {
      insights.push({
        title: 'Drought Conditions',
        description: 'Climate patterns suggest developing drought conditions with potential water scarcity.'
      });
    }
    
    if (weather && weather.precipitation > 50) {
      insights.push({
        title: 'Heavy Precipitation Alert',
        description: 'High rainfall detected which may contribute to flood risk.'
      });
    }
    
    return insights.length > 0 ? insights : [{
      title: 'Low Risk Conditions',
      description: 'Current conditions indicate low disaster risk in this area.'
    }];
  };

  const generateScenarios = (prediction: any, location: any): Array<{name: string, severity: string, description: string}> => {
    const scenarios = [];
    
    if (prediction.predictions?.flood > 0.3) {
      scenarios.push({
        name: 'Flash Flood Scenario',
        severity: prediction.predictions.flood > 0.7 ? 'High' : 'Medium',
        description: 'Rapid flooding due to heavy rainfall and poor drainage conditions.'
      });
    }
    
    if (prediction.predictions?.earthquake > 0.2) {
      scenarios.push({
        name: 'Seismic Event',
        severity: prediction.predictions.earthquake > 0.6 ? 'High' : 'Medium',
        description: 'Potential earthquake with varying magnitude based on fault line proximity.'
      });
    }
    
    if (prediction.predictions?.drought > 0.4) {
      scenarios.push({
        name: 'Water Scarcity',
        severity: prediction.predictions.drought > 0.7 ? 'High' : 'Medium',
        description: 'Extended dry period leading to water shortages and agricultural impacts.'
      });
    }
    
    return scenarios;
  };

  const generateResources = (prediction: any, location: any): Array<{name: string, type: string, description: string}> => {
    const resources = [];
    
    if (prediction.predictions?.flood > 0.3) {
      resources.push({
        name: 'Emergency Response Teams',
        type: 'Response',
        description: 'Flood response teams and evacuation coordination.'
      });
    }
    
    if (prediction.predictions?.earthquake > 0.2) {
      resources.push({
        name: 'Structural Assessment',
        type: 'Assessment',
        description: 'Building safety evaluation and structural integrity checks.'
      });
    }
    
    if (prediction.predictions?.drought > 0.4) {
      resources.push({
        name: 'Water Management',
        type: 'Mitigation',
        description: 'Water conservation measures and alternative water sources.'
      });
    }
    
    return resources;
  };

  // Auto-detect location when component mounts
  useEffect(() => {
    detectUserLocation();
  }, []);

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
      case 'up': 
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': 
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: 
        return <Activity className="h-4 w-4 text-blue-600" />;
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
            <h1 className={`flex items-center gap-2 text-3xl sm:text-4xl font-semibold font-poppins bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 bg-clip-text text-transparent`}>
              <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow">
                <Sparkles className="h-4 w-4" />
              </span>
              DisastroScope
            </h1>
            <div className="h-1 w-36 mt-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-fuchsia-500" />
            <p className={`mt-3 text-sm sm:text-base text-slate-600`}>
              AI-Powered Multi-Hazard Command Center for Prediction, Monitoring & Response
            </p>
            <div className="mt-2 inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-200 text-indigo-700">
              <Rocket className="h-3 w-3" />
              <span>Real-time Intelligence • Predictive Analytics • Executive Insights</span>
            </div>
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
                    <div className="w-24 h-14">
                      <ReactApexChart
                        options={{ chart: { type: 'line', sparkline: { enabled: true } }, stroke: { curve: 'smooth', width: 2 }, colors: ['#ef4444'] } as ApexOptions}
                        series={[{ data: sparkAlerts }]}
                        type="line"
                        height={56}
                      />
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
                    <div className="w-24 h-14">
                      <ReactApexChart
                        options={{ chart: { type: 'radialBar', sparkline: { enabled: true } }, plotOptions: { radialBar: { hollow: { size: '60%' }, dataLabels: { show: false } } }, colors:['#22c55e'] } as ApexOptions}
                        series={[healthScore]}
                        type="radialBar"
                        height={56}
                      />
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
                    <div className="w-24 h-14">
                      <ReactApexChart
                        options={{ chart: { type: 'bar', sparkline: { enabled: true } }, plotOptions: { bar: { columnWidth: '50%' } }, colors:['#3b82f6','#f59e0b','#ef4444'], legend: { show: false } } as ApexOptions}
                        series={[{ data: distIncidents }]}
                        type="bar"
                        height={56}
                      />
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

          

          

          {/* Post-maps: 2-column balanced layout with 8 sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Disasters */}
              <Card className={`dashboard-card ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl transition-all duration-300`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                       <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">All Recent Disasters & Federal Declarations</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={async () => {
                          setIsLoadingDisasterData(true);
                          try {
                            const disasterData = await fetchAllDisasterData();
                            setRealDisasters(disasterData.disasters);
                            setRealNotifications(disasterData.notifications);
                            setRealTimeline(disasterData.timeline);
                            setLastDataUpdate(new Date());
                            toast.success('🌍 Disaster data refreshed', {
                              icon: '⚡',
                              style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                              },
                            });
                          } catch (error) {
                            toast.error('⚠️ Failed to refresh data', {
                              icon: '⚠️',
                              style: {
                                borderRadius: '10px',
                                background: '#dc2626',
                                color: '#fff',
                              },
                            });
                          } finally {
                            setIsLoadingDisasterData(false);
                          }
                        }}
                        disabled={isLoadingDisasterData}
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${isLoadingDisasterData ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Eye className="h-3 w-3 mr-1" />View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoadingDisasterData ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading real disaster data...</span>
                          </div>
                  ) : realDisasters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent disasters detected</p>
                          </div>
                                     ) : (
                     <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                       {(() => {
                         console.log('🔍 Recent Disasters - realDisasters array:', JSON.stringify(realDisasters, null, 2));
                         console.log('🔍 Recent Disasters - disaster types:', realDisasters.map(d => d.type));
                         console.log('🔍 Recent Disasters - all disasters:', realDisasters.map(d => ({ type: d.type, title: d.title, source: d.source })));
                         return realDisasters.map((disaster) => {
                           console.log('🔍 Rendering disaster:', { type: disaster.type, title: disaster.title, source: disaster.source });
                           return (
                           <div key={disaster.id} className={`group flex items-center justify-between p-4 border rounded-xl backdrop-blur bg-white/60 dark:bg-gray-900/40 ${isDarkMode ? 'border-gray-700' : ''}`}>
                        <div className="flex items-center gap-4">
                               <div className={`h-10 w-10 rounded-full grid place-items-center shadow-inner ${disaster.severity==='Critical' ? 'bg-rose-100' : disaster.severity==='High' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                                 <AlertTriangle className={`h-5 w-5 ${disaster.severity==='Critical' ? 'text-rose-600' : disaster.severity==='High' ? 'text-amber-600' : 'text-emerald-600'}`} />
                        </div>
                               <div>
                                 <div className="flex items-center gap-2">
                                   <p className="font-medium">{disaster.title}</p>
                      </div>
                                 <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-500'}`}>{disaster.location}</p>
                                 <p className="text-xs text-blue-600">{disaster.source}</p>
                  </div>
            </div>
                             <div className="flex items-center gap-2">
                               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-muted-foreground'}`}>{(() => {
                                 try {
                                   return format(disaster.timestamp, 'MMM dd, HH:mm');
                                 } catch (error) {
                                   return 'Unknown time';
                                 }
                               })()}</p>
                               <Button size="sm" variant="outline" className="text-xs hidden sm:inline-flex">Details</Button>
                               <Button size="sm" className="text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Acknowledge</Button>
                    </div>
                    </div>
                         );
                           });
                        })()}
                    </div>
                   )}
                  <div className="mt-4 text-xs text-muted-foreground text-center">
                    Last updated: {(() => {
                      try {
                        return format(lastDataUpdate, 'HH:mm:ss');
                      } catch (error) {
                        return 'Unknown';
                      }
                    })()}
                  </div>
                </CardContent>
              </Card>

            {/* AI Risk Forecast */}
              <Card ref={riskAnimRef} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Risk Forecast (Next 24 intervals)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: '420px' }}>
                    <ReactApexChart
                      key="risk-forecast-line"
                      options={{
                        chart: { type: 'line', toolbar: { show: false }, animations: { enabled: false } },
                        stroke: { curve: 'smooth', width: 2 },
                        legend: { position: 'bottom' },
                        xaxis: { categories: Array.from({length: 24}, (_,i)=> `${i}`), tickAmount: 6, labels: { show: true } },
                        yaxis: { min: 0, max: 70 },
                        colors: ['#f59e0b','#0ea5e9','#8b5cf6','#06b6d4','#ef4444'],
                        tooltip: { shared: true, intersect: false }
                      } as ApexOptions}
                      series={[
                        { name: 'Drought', data: riskDrought },
                        { name: 'Storm', data: riskStorm },
                        { name: 'Landslide', data: riskLandslide },
                        { name: 'Tsunami', data: riskTsunami },
                        { name: 'Wildfire', data: riskWildfire },
                      ]}
                      type="line"
                      height={420}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-rose-600" />
                    Notifications
                  </CardTitle>
                                         <div className="text-xs text-muted-foreground">
                       Real-time from USGS, FIRMS, GDACS, NOAA, OpenFEMA
                  </div>
                  </div>
              </CardHeader>
                <CardContent className="space-y-3">
                  {isLoadingDisasterData ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Loading notifications...</span>
                  </div>
                  ) : realNotifications.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Bell className="h-6 w-6 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No active notifications</p>
                  </div>
                  ) : (
                    realNotifications.map((notification) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`h-2 w-2 rounded-full ${
                            notification.severity === 'Critical' ? 'bg-red-500' :
                            notification.severity === 'High' ? 'bg-orange-500' :
                            notification.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`} />
                          <div>
                            <span className={`text-sm ${
                              notification.severity === 'Critical' ? 'text-red-600' :
                              notification.severity === 'High' ? 'text-orange-600' :
                              notification.severity === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                            }`}>{notification.message}</span>
                            <p className="text-xs text-muted-foreground">{notification.source} • {(() => {
                              try {
                                return formatDistanceToNow(notification.timestamp, { addSuffix: true });
                              } catch (error) {
                                return 'recently';
                              }
                            })()}</p>
                    </div>
                  </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="text-xs">{notification.action}</Button>
                    </div>
                  </div>
                    ))
                  )}
              </CardContent>
            </Card>
            {/* Live Incident Timeline */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  Live Incident Timeline
                </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Live from multiple sources
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingDisasterData ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading timeline...</span>
                    </div>
                ) : realTimeline.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No recent incidents</p>
                  </div>
                ) : (
                  <div className="relative pl-4">
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-emerald-400" />
                    <div className="space-y-3">
                      {realTimeline.map((event, index) => (
                        <div key={event.id} className="relative p-3 rounded-lg border bg-background/50 backdrop-blur-sm hover:bg-background transition-colors duration-200">
                          <div className={`absolute -left-1 top-4 h-2 w-2 rounded-full ${
                            event.source === 'USGS' ? 'bg-red-500' :
                            event.source === 'FIRMS' ? 'bg-orange-500' :
                            event.source === 'GDACS' ? 'bg-purple-500' :
                            event.source === 'OpenWeather' ? 'bg-blue-500' : 'bg-gray-500'
                          }`} />
                          <div className="flex items-start justify-between">
                    <div>
                              <div className="font-medium text-foreground">{event.title}</div>
                              <div className="text-muted-foreground text-xs">{event.source} • {(() => {
                                try {
                                  return formatDistanceToNow(event.timestamp, { addSuffix: true });
                                } catch (error) {
                                  return 'recently';
                                }
                              })()}</div>
                    </div>
                  </div>
                    </div>
                      ))}
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
            {/* Geo Risk Matrix */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  Geo Risk Matrix
                </CardTitle>
                <CardDescription>Live regional risk intensity across zones</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const regions = ['West','Central','East'];
                  const riskBands = ['Low','Medium','High'];
                  const values = riskBands.map((band, idx) => ({
                    name: band,
                    data: regions.map((reg, j) => ({ x: reg, y: Math.max(0, Math.min(100, Math.round((hazardMix[j % hazardMix.length] || 20) + (idx*15) + (Math.random()-0.5)*10))) }))
                  }));
                  const options: ApexOptions = {
                    chart: { type: 'heatmap', toolbar: { show: false } },
                    dataLabels: { enabled: true, style: { colors: ['#111'] } },
                    xaxis: { categories: regions },
                    plotOptions: {
                      heatmap: {
                        shadeIntensity: 0.4,
                        colorScale: {
                          ranges: [
                            { from: 0, to: 25, color: '#dcfce7' },
                            { from: 26, to: 50, color: '#fde68a' },
                            { from: 51, to: 75, color: '#fdba74' },
                            { from: 76, to: 100, color: '#fecaca' }
                          ]
                        }
                      }
                    },
                    legend: { position: 'bottom' }
                  };
                  return (
                    <ReactApexChart
                      key="geo-risk-heatmap"
                      options={options}
                      series={values as any}
                      type="heatmap"
                      height={320}
                    />
                  );
                })()}
              </CardContent>
            </Card>
            {/* ML Model Performance - Dynamic Updating Chart */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-emerald-600" />
                  ML Model Performance Update 
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const optionsPerf: ApexOptions = {
                    chart: { type: 'line', animations: { enabled: true, dynamicAnimation: { speed: 800 } }, toolbar: { show: false } },
                    stroke: { curve: 'smooth', width: 2 },
                    dataLabels: { enabled: false },
                    yaxis: [
                      { min: 70, max: 100, labels: { formatter: (v) => `${v}%` }, title: { text: 'Accuracy / F1' } },
                      { opposite: true, title: { text: 'Latency (ms)' } }
                    ],
                    xaxis: { labels: { show: false } },
                    colors: ['#10b981','#6366f1','#f59e0b'],
                    legend: { position: 'bottom' },
                    tooltip: { shared: true, intersect: false }
                  };
                  const f1 = mlPerf.map(v => Math.max(70, Math.min(99, v - 2 + Math.round((Math.random()-0.5)*2))));
                  const latency = mlPerf.map((_,i) => Math.max(120, Math.min(260, 220 - Math.round((mlPerf[i]-80)*3))));
                  const seriesPerf = [
                    { name: 'Accuracy', data: mlPerf, type: 'line' as const },
                    { name: 'F1 Score', data: f1, type: 'line' as const },
                    { name: 'Latency (ms)', data: latency, type: 'line' as const }
                  ];
                  return <ReactApexChart key="ml-perf" options={optionsPerf} series={seriesPerf as any} type="line" height={300} />;
                })()}
              </CardContent>
            </Card>

            {/* Top 5 Ongoing Disasters - Dynamic Loaded Chart style */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  Top 5 Ongoing Disasters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const ongoing = data.disasters
                    .filter(d => String(d.status).toLowerCase() !== 'resolved')
                    .sort((a, b) => (b.affected || 0) - (a.affected || 0))
                    .slice(0, 5);
                  const categoriesTop = ongoing.map(d => d.type);
                  const quarter = ['Q1','Q2','Q3','Q4'];
                  const seriesTop = [
                    { name: 'Q1', data: ongoing.map(() => Math.round(Math.random()*25+50)) },
                    { name: 'Q2', data: ongoing.map(() => Math.round(Math.random()*25+60)) },
                    { name: 'Q3', data: ongoing.map(() => Math.round(Math.random()*25+70)) },
                    { name: 'Q4', data: ongoing.map(() => Math.round(Math.random()*25+80)) },
                  ];
                  const optionsTop: ApexOptions = {
                    chart: { type: 'bar', toolbar: { show: false } },
                    plotOptions: { bar: { columnWidth: '45%', } },
                    dataLabels: { enabled: true },
                    xaxis: { categories: categoriesTop },
                    legend: { position: 'bottom' },
                    colors: ['#f472b6','#60a5fa','#34d399','#fbbf24']
                  };
                  return <ReactApexChart key="top5-dynamic" options={optionsTop} series={seriesTop} type="bar" height={300} />;
                })()}
              </CardContent>
            </Card>

            {/* Severity Levels across categories - 100% Stacked Bar */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Disaster Severity Composition
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const categories = ['Earthquake','Flood','Wildfire','Storm','Tsunami','Volcano'];
                  const low = categories.map(() => Math.round(Math.random()*20+10));
                  const medium = categories.map(() => Math.round(Math.random()*25+20));
                  const high = categories.map(() => Math.round(Math.random()*25+15));
                  const critical = categories.map((_,i) => 100 - low[i] - medium[i] - high[i]);
                  const series = [
                    { name: 'Low', data: low },
                    { name: 'Medium', data: medium },
                    { name: 'High', data: high },
                    { name: 'Critical', data: critical },
                  ];
                  const options: ApexOptions = {
                    chart: { type: 'bar', stacked: true, stackType: '100%', toolbar: { show: false } },
                    xaxis: { categories },
                    legend: { position: 'bottom' },
                    colors: ['#86efac','#fde68a','#fbbf24','#ef4444']
                  };
                  return <ReactApexChart key="severity-100" options={options} series={series} type="bar" height={260} />;
                })()}
              </CardContent>
            </Card>
          </div>

          {/* Bottom Sections: Location Based Analysis & Advanced Analysis */}
          <div className="space-y-6 mt-6">
            {/* Advanced Global Risk Analysis */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Advanced Global Risk Analysis</span>
                </CardTitle>
                <CardDescription>
                  Real-time risk assessment for 7 disaster types: Floods, Landslides, Earthquakes, Cyclones, Wildfires, Tsunamis, Droughts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search and Analysis Controls */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search any location worldwide..."
                        className="w-full px-4 py-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={globalSearchQuery}
                        onChange={(e) => setGlobalSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGlobalRiskAnalysis()}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <Button
                      onClick={handleGlobalRiskAnalysis}
                      disabled={isAnalyzingGlobal || !globalSearchQuery.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isAnalyzingGlobal ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-2" />
                          Analyze Risk
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="hidden md:inline-flex">
                      <Clock className="h-3 w-3 mr-1" />
                      Updated {globalRiskData ? format(new Date(globalRiskData.timestamp), 'HH:mm') : format(new Date(), 'HH:mm')}
                    </Badge>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Analysis Results */}
                {globalRiskData && (
                  <div className="space-y-6">
                    {/* Composite Risk Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-6 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-slate-700 dark:text-slate-300">
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Composite Risk</div>
                        <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{globalRiskData.composite_risk.score}</div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1">{globalRiskData.composite_risk.level}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Trend: {globalRiskData.composite_risk.trend}</div>
                      </div>
                      <div className="p-6 rounded-xl border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 text-slate-700 dark:text-slate-300">
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Location</div>
                        <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{globalRiskData.location.region}</div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">{globalRiskData.location.country}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          {globalRiskData.location.latitude.toFixed(4)}, {globalRiskData.location.longitude.toFixed(4)}
                        </div>
                      </div>
                      <div className="p-6 rounded-xl border bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 text-slate-700 dark:text-slate-300">
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Analysis Period</div>
                        <div className="text-lg font-bold text-amber-700 dark:text-amber-300">{globalRiskData.analysis_period}</div>
                        <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">Real-time Data</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">AI-Powered Models</div>
                      </div>
                      <div className="p-6 rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-slate-700 dark:text-slate-300">
                        <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Disaster Types</div>
                        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">7</div>
                        <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">Comprehensive</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">Global Coverage</div>
                      </div>
                    </div>

                    {/* Disaster Risk Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {Object.entries(globalRiskData.disasters).map(([disasterType, data]) => (
                        <div key={disasterType} className="group relative overflow-hidden rounded-xl border bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300">
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{disasterType}</h4>
                  <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    data.color === 'green' ? 'bg-green-500' :
                                    data.color === 'yellow' ? 'bg-yellow-500' :
                                    data.color === 'orange' ? 'bg-orange-500' :
                                    'bg-red-500'
                                  }`} />
                                  <span className={`text-sm font-medium ${
                                    data.color === 'green' ? 'text-green-600 dark:text-green-400' :
                                    data.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                                    data.color === 'orange' ? 'text-orange-600 dark:text-orange-400' :
                                    'text-red-600 dark:text-red-400'
                                  }`}>
                                    {data.risk_level}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{data.risk_score}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Risk Score</div>
                  </div>
                </div>

                            <div className="space-y-2 mb-4">
                              <div className="text-xs text-gray-600 dark:text-gray-400">{data.description}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400">Probability:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{data.probability}%</span>
                      </div>
                    </div>

                            {/* Risk Factors */}
                            <div className="space-y-1 mb-4">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Factors:</div>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Geographical:</span>
                                  <span className="font-medium">{data.factors.geographical}%</span>
                      </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Seasonal:</span>
                                  <span className="font-medium">{data.factors.seasonal}%</span>
                      </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Historical:</span>
                                  <span className="font-medium">{data.factors.historical}%</span>
                      </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500 dark:text-gray-400">Environmental:</span>
                                  <span className="font-medium">{data.factors.environmental}%</span>
                      </div>
                    </div>
                    </div>

                            {/* Recommendations */}
                            <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Recommendations:</div>
                              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                {data.recommendations.slice(0, 2).map((rec, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-blue-500 mt-0.5">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                    </div>
                    </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {isAnalyzingGlobal && (
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
                      <div className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Analyzing Global Risk</div>
                      <div className="text-sm text-muted-foreground">Processing 7 disaster types with AI models...</div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {globalAnalysisError && (
                  <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                      <AlertCircle className="h-5 w-5" />
                      <span className="font-medium">Analysis Error</span>
                    </div>
                    <div className="text-sm text-red-600 dark:text-red-400 mt-2">{globalAnalysisError}</div>
                  </div>
                )}

                {/* Initial State */}
                {!globalRiskData && !isAnalyzingGlobal && !globalAnalysisError && (
                  <div className="text-center py-12">
                    <Globe className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Global Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Search for any location worldwide to get comprehensive risk analysis for 7 disaster types
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low Risk
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Moderate Risk
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        High Risk
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        Critical Risk
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Advanced Analysis - Location-Based Risk Assessment */}
            <Card className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-xl`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Location-Based Risk Analysis
                </CardTitle>
                <CardDescription>
                  Real-time disaster risk assessment using your location and AI-powered prediction models.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Location Detection & Display */}
                <div className="flex flex-col gap-4">
                  {/* Location Display */}
                  {currentLocation ? (
                    <div className="space-y-3">
                      {/* Minimalistic Location Display Box */}
                      <div className="rounded-xl border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 p-4 shadow-md">
                        {/* Location in words - Minimalistic style matching coordinates */}
                        <div className="mb-3">
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1"> Location Address :</div>
                          <div className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                            {currentLocation.detailedAddress && !currentLocation.detailedAddress.startsWith('Coordinates:') 
                              ? currentLocation.detailedAddress 
                              : currentLocation.address && !currentLocation.address.startsWith('GPS Location')
                                ? currentLocation.address
                                : 'Location detected - Address unavailable'}
                  </div>
                        </div>
                        
                        {/* Coordinates - Minimalistic format */}
                        <div>
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1"> GPS Coordinates :</div>
                          <div className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded border border-gray-200 dark:border-gray-600">
                            Latitude: {currentLocation.lat.toFixed(6)} • Longitude: {currentLocation.lng.toFixed(6)}
                          </div>
                  </div>
                </div>

                      {/* Location Map */}
                      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md">
                        <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>Location Map</span>
                    </div>
                  </div>
                        <LocationMap 
                          latitude={currentLocation.lat}
                          longitude={currentLocation.lng}
                          address={currentLocation.detailedAddress || currentLocation.address}
                          height={180}
                          accuracy={currentLocation.accuracy}
                        />
                    </div>

                      {/* Analyze Button */}
                      <div className="flex justify-center pt-2">
                        <Button 
                          size="lg" 
                          className="flex items-center gap-3 px-10 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                          onClick={analyzeLocation}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            <Sparkles className="h-5 w-5" />
                          )}
                          {isAnalyzing ? 'Analyzing Location...' : 'Analyze Disaster Risk'}
                        </Button>
                  </div>
                  </div>
                  ) : (
                    <div className="text-center space-y-6 py-10">
                      {/* Animated location icon */}
                      <div className="relative mx-auto w-20 h-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <MapPin className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Location Detection Required</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                          We need your precise location to provide accurate disaster risk analysis using AI-powered prediction models.
                        </p>
                        
                        <div className="flex flex-col gap-3 pt-2">
                          <Button 
                            size="lg" 
                            className="flex items-center gap-3 mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => {
                              console.log('🔘 Detect My Location button clicked');
                              detectUserLocation();
                            }}
                            disabled={isDetectingLocation}
                          >
                            {isDetectingLocation ? (
                              <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                              <MapPin className="h-5 w-5" />
                            )}
                            {isDetectingLocation ? 'Detecting Location...' : 'Detect My Location'}
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2 mx-auto text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => {
                              console.log('🧪 Test Geolocation button clicked');
                              testGeolocation();
                            }}
                          >
                            <Settings className="h-4 w-4" />
                            Test Geolocation API
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="flex items-center gap-2 mx-auto text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => {
                              console.log('🔍 Debug current location state');
                              console.log('📍 Current location state:', currentLocation);
                              if (currentLocation) {
                                console.log('📍 Address:', currentLocation.address);
                                console.log('📍 Detailed Address:', currentLocation.detailedAddress);
                                console.log('📍 Coordinates:', currentLocation.lat, currentLocation.lng);
                              }
                            }}
                          >
                            <Bug className="h-4 w-4" />
                            Debug Location
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Analysis Results */}
                {riskAnalysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Flood Risk */}
                      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-blue-600" />
                            Flood Risk
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-700">
                            {riskAnalysis.flood?.risk_level || 'N/A'}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Probability: {riskAnalysis.flood?.probability || 0}%
                        </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {riskAnalysis.flood?.description || 'No flood risk data available'}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Earthquake Risk */}
                      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Activity className="h-4 w-4 text-orange-600" />
                            Earthquake Risk
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-700">
                            {riskAnalysis.earthquake?.risk_level || 'N/A'}
                        </div>
                          <div className="text-xs text-orange-600 mt-1">
                            Probability: {riskAnalysis.earthquake?.probability || 0}%
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {riskAnalysis.earthquake?.description || 'No earthquake risk data available'}
                        </div>
                        </CardContent>
                      </Card>

                      {/* Drought Risk */}
                      <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Sun className="h-4 w-4 text-amber-600" />
                            Drought Risk
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-amber-700">
                            {riskAnalysis.drought?.risk_level || 'N/A'}
                      </div>
                          <div className="text-xs text-amber-600 mt-1">
                            Probability: {riskAnalysis.drought?.probability || 0}%
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {riskAnalysis.drought?.description || 'No drought risk data available'}
                        </div>
                        </CardContent>
                      </Card>
                      </div>

                    {/* Detailed Analysis */}
                    <Card className="border bg-gray-50 dark:bg-gray-900/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">AI Model Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Weather Conditions</div>
                            <div className="space-y-1 text-xs">
                              <div>Temperature: {riskAnalysis.weather?.temperature || 'N/A'}°C</div>
                              <div>Humidity: {riskAnalysis.weather?.humidity || 'N/A'}%</div>
                              <div>Pressure: {riskAnalysis.weather?.pressure || 'N/A'} hPa</div>
                              <div>Wind Speed: {riskAnalysis.weather?.wind_speed || 'N/A'} km/h</div>
                              <div>Precipitation: {riskAnalysis.weather?.precipitation || 'N/A'} mm</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Risk Factors</div>
                            <div className="space-y-1 text-xs">
                              <div>Elevation: {riskAnalysis.location?.elevation || 'N/A'} m</div>
                              <div>Soil Type: {riskAnalysis.location?.soil_type || 'N/A'}</div>
                              <div>Land Use: {riskAnalysis.location?.land_use || 'N/A'}</div>
                              <div>Historical Events: {riskAnalysis.location?.historical_events || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Loading State */}
                {isAnalyzing && (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <div className="text-sm text-muted-foreground">Analyzing location with AI models...</div>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {analysisError && (
                  <div className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Analysis Error</span>
                    </div>
                    <div className="text-sm text-red-600 mt-1">{analysisError}</div>
                  </div>
                )}





                {/* Tabs for content sections */}
                <Tabs defaultValue="insights" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                    <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>
                  <TabsContent value="insights">
                    {riskAnalysis ? (
                      <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 p-4">
                        <div className="text-sm font-medium mb-3">AI-Generated Risk Insights</div>
                        <div className="space-y-3 text-sm">
                          {riskAnalysis.insights?.map((insight: any, index: number) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
                                      <Brain className="h-4 w-4 text-blue-600" />
                                      {insight.title}
                                    </h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                      {insight.description}
                                    </p>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-100 text-blue-700 dark:from-blue-900/20 dark:to-indigo-800/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                                      <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                                      AI Insight
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span className="flex items-center">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      AI Generated
                                    </span>
                                    <span className="flex items-center">
                                      <Target className="h-3 w-3 mr-1" />
                                      Risk Analysis
                                    </span>
                                  </div>
                                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                                    Learn More →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                    <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 h-[360px] grid place-items-center text-sm text-muted-foreground">
                        Run location analysis to see AI insights
                    </div>
                    )}
                  </TabsContent>
                  <TabsContent value="scenarios">
                    {riskAnalysis ? (
                      <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 p-4">
                        <div className="text-sm font-medium mb-3">Risk Scenarios</div>
                        <div className="space-y-3 text-sm">
                          {riskAnalysis.scenarios?.map((scenario: any, index: number) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                      {scenario.name}
                                    </h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                      {scenario.description}
                                    </p>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <div className={`
                                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                                      ${scenario.severity === 'High' 
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 dark:from-red-900/30 dark:to-red-800/30 dark:text-red-300 border border-red-200 dark:border-red-700'
                                        : scenario.severity === 'Medium'
                                        ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 dark:from-orange-900/30 dark:to-orange-800/30 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
                                        : 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900/30 dark:to-yellow-800/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-700'
                                      }
                                    `}>
                                      <div className={`
                                        w-2 h-2 rounded-full mr-2
                                        ${scenario.severity === 'High' 
                                          ? 'bg-red-500 animate-pulse'
                                          : scenario.severity === 'Medium'
                                          ? 'bg-orange-500'
                                          : 'bg-yellow-500'
                                        }
                                      `}></div>
                                      {scenario.severity}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Immediate
                                    </span>
                                    <span className="flex items-center">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Critical
                                    </span>
                                  </div>
                                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                                    View Details →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                    <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 h-[360px] grid place-items-center text-sm text-muted-foreground">
                        Run location analysis to see risk scenarios
                    </div>
                    )}
                  </TabsContent>
                  <TabsContent value="resources">
                    {riskAnalysis ? (
                      <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 p-4">
                        <div className="text-sm font-medium mb-3">Response Resources</div>
                        <div className="space-y-3 text-sm">
                          {riskAnalysis.resources?.map((resource: any, index: number) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg border bg-white dark:bg-gray-800 hover:shadow-md transition-all duration-300">
                              <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                      {resource.name}
                                    </h4>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                      {resource.description}
                                    </p>
                                  </div>
                                  <div className="ml-4 flex-shrink-0">
                                    <div className={`
                                      inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium
                                      ${resource.type === 'Emergency' 
                                        ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 dark:from-red-900/20 dark:to-red-800/20 dark:text-red-300 border border-red-200 dark:border-red-700'
                                        : resource.type === 'Information'
                                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                        : resource.type === 'Support'
                                        ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300 border border-green-200 dark:border-green-700'
                                        : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 dark:from-gray-900/20 dark:to-gray-800/20 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                                      }
                                    `}>
                                      <div className={`
                                        w-2 h-2 rounded-full mr-2
                                        ${resource.type === 'Emergency' 
                                          ? 'bg-red-500'
                                          : resource.type === 'Information'
                                          ? 'bg-blue-500'
                                          : resource.type === 'Support'
                                          ? 'bg-green-500'
                                          : 'bg-gray-500'
                                        }
                                      `}></div>
                                      {resource.type}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      Local
                                    </span>
                                    <span className="flex items-center">
                                      <Phone className="h-3 w-3 mr-1" />
                                      Available 24/7
                                    </span>
                                  </div>
                                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                                    Access Resource →
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                    <div className="rounded-xl border bg-gray-50 dark:bg-gray-900/40 h-[360px] grid place-items-center text-sm text-muted-foreground">
                        Run location analysis to see response resources
                    </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-fuchsia-50 to-pink-50">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Projected Risk</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {riskAnalysis?.composite_risk || 'N/A'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Risk Horizon</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-amber-50 to-yellow-50">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Exposure</div>
                    <div className="mt-2 text-2xl font-semibold">
                      {riskAnalysis?.exposure_level || 'N/A'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Population & Assets</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-sky-50 to-cyan-50">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Confidence</div>
                    <div className="text-2xl font-semibold">
                      {riskAnalysis?.confidence_level || 'N/A'}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">Model Agreement</div>
                  </div>
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
