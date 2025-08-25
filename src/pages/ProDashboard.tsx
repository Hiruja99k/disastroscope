import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import DisasterMap from '@/components/DisasterMap';
import { apiService, DisasterEvent, Prediction, SensorData } from '@/services/api';
import gsap from 'gsap';
import { BarChart3, Bell, MapPin, RefreshCw, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Filter, ShieldAlert, Activity, Clock, AlertTriangle, Zap, Target, BarChart as BarChartIcon, PieChart as PieChartIcon2, TrendingDown, Users, Globe, Database, Server, Satellite, Radar, Thermometer, Droplets, Wind, Flame, Mountain, CloudRain, Sun, Gauge, BarChart4, ActivitySquare, Shield, Eye, Zap as Lightning, AlertCircle, CheckCircle, XCircle, Layers, Cpu, HardDrive, Network, Wifi, Signal, Battery, Power, Settings, User, BellRing, FileText, Search, Share2, MoreHorizontal, Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, Fullscreen, Lock, Unlock, Key, UserCheck, UserX, UserPlus, Building2, Home, Globe2, Navigation, Compass, Grid3X3, List, Calendar, Timer, CalendarDays, CalendarRange, CalendarCheck, CalendarX, CalendarPlus, CalendarMinus, CalendarClock, CalendarOff } from 'lucide-react';
import ProShell from '@/components/layout/ProShell';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { toast } from 'react-hot-toast';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarGrid,
  PolarRadiusAxis,
  Radar as RadarArea,
  RadarChart as RadarChartComp,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ResponsiveContainer,
  ComposedChart,
  Tooltip,
  Legend,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Lottie from 'lottie-react';
import successAnim from '@/assets/lottie/success.json';
import alertAnim from '@/assets/lottie/alert.json';

export default function ProDashboard() {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamTick, setStreamTick] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'power2.out' } });
    if (headerRef.current) {
      tl.from(headerRef.current, { y: 20, opacity: 0 });
    }
    if (sectionRef.current) {
      tl.from(sectionRef.current.children, { y: 24, opacity: 0, stagger: 0.08 }, '<');
    }
  }, []);

  // Simulated streaming updates for charts
  useEffect(() => {
    const t = setInterval(() => setStreamTick((n) => (n + 1) % 1000), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const asArray = (data: any, key: string) => {
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data[key])) return data[key];
      return [] as any[];
    };

    const load = async () => {
      setLoading(true);
      try {
        const [ev, pr] = await Promise.all([
          apiService.getEvents(),
          apiService.getPredictions(),
        ]);
        setEvents(asArray(ev, 'events'));
        setPredictions(asArray(pr, 'predictions'));
        // sensors optional endpoint
        try {
          const resp = await fetch((import.meta.env.VITE_API_BASE_URL || 'https://web-production-47673.up.railway.app').replace(/\/$/, '') + '/api/sensors');
          if (resp.ok) {
            const data = await resp.json();
            setSensors(asArray(data, 'sensors'));
          }
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const criticalEvents = useMemo(() => (events || []).filter(e => (e.severity || '').toLowerCase().includes('critical')), [events]);

  const sales = 12875;
  const riskNow = 0.62; // 0-1 risk index
  const riskDelta = 0.04; // change vs last period
  const projectData = [
    { year: '2014', done: 80, new: 20, late: 10 },
    { year: '2015', done: 120, new: 30, late: 14 },
    { year: '2016', done: 210, new: 40, late: 16 },
    { year: '2017', done: 172, new: 25, late: 12 },
    { year: '2018', done: 165, new: 28, late: 15 },
    { year: '2019', done: 140, new: 18, late: 9 },
    { year: '2020', done: 155, new: 22, late: 11 },
  ];

  const tasksData = [
    { name: 'Late', value: 20, fill: 'hsl(var(--destructive))' },
    { name: 'New', value: 40, fill: 'hsl(var(--primary))' },
    { name: 'In Progress', value: 60, fill: 'hsl(var(--secondary-foreground))' },
    { name: 'Done', value: 80, fill: 'hsl(var(--muted-foreground))' },
  ];

  // Multi-series predictions chart with disaster-specific colors
  const predictionSeries = [
    { month: 'Jan', flood: 20 + (streamTick % 5), landslide: 12, cyclone: 8, drought: 15 },
    { month: 'Feb', flood: 28, landslide: 10, cyclone: 12, drought: 16 },
    { month: 'Mar', flood: 25, landslide: 13, cyclone: 15, drought: 18 },
    { month: 'Apr', flood: 31 + (streamTick % 3), landslide: 15, cyclone: 12, drought: 20 },
    { month: 'May', flood: 35, landslide: 16, cyclone: 17, drought: 22 },
    { month: 'Jun', flood: 30 + (streamTick % 4), landslide: 18, cyclone: 20, drought: 24 },
  ];

  const severityPie = [
    { name: 'Critical', value: 8, color: '#ef4444' },
    { name: 'High', value: 15, color: '#f97316' },
    { name: 'Medium', value: 24, color: '#f59e0b' },
    { name: 'Low', value: 32, color: '#22c55e' },
  ];

  const regions = [
    { region: 'North', risks: 72, sla: 92 },
    { region: 'South', risks: 54, sla: 88 },
    { region: 'East', risks: 63, sla: 90 },
    { region: 'West', risks: 41, sla: 95 },
  ];

  const ops = Array.from({ length: 5 }).map((_, i) => ({
    id: 1300 + i * 11,
    name: 'Operation text goes here',
    status: [70, 40, 50, 30, 50][i],
    value: [77, 12, 43, 42, 65][i],
  }));

  const LegendCard = () => (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Disaster Legend</h3>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#3b82f6]"></span> Flood</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8B5E3C]"></span> Landslide</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f97316]"></span> Cyclone</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#f59e0b]"></span> Drought</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#ef4444]"></span> Wildfire</div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#22c55e]"></span> Storm</div>
      </div>
    </Card>
  );

  const QuickActions = () => (
    <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Quick Actions</h3>
        <Badge variant="secondary">Admin</Badge>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" className="justify-center"><Download className="h-4 w-4 mr-2"/>Export</Button>
        <Button variant="secondary" className="justify-center"><Filter className="h-4 w-4 mr-2"/>Filter</Button>
        <Button variant="secondary" className="justify-center" onClick={()=>location.reload()}><RefreshCw className="h-4 w-4 mr-2"/>Refresh</Button>
      </div>
    </Card>
  );

  const performanceMetrics = [
    { metric: 'Response Time', current: 2.3, target: 2.0, unit: 'min', trend: 'up' },
    { metric: 'Accuracy Rate', current: 94.2, target: 95.0, unit: '%', trend: 'up' },
    { metric: 'Uptime', current: 99.87, target: 99.9, unit: '%', trend: 'down' },
    { metric: 'Data Freshness', current: 1.2, target: 1.0, unit: 'min', trend: 'up' },
  ];

  // Advanced disaster monitoring data
  const disasterTypes = [
    { type: 'Flood', icon: Droplets, color: '#3b82f6', count: 24, severity: 'High', trend: 'up' },
    { type: 'Landslide', icon: Mountain, color: '#8B5E3C', count: 18, severity: 'Medium', trend: 'stable' },
    { type: 'Cyclone', icon: Wind, color: '#f97316', count: 12, severity: 'Critical', trend: 'up' },
    { type: 'Drought', icon: Sun, color: '#f59e0b', count: 31, severity: 'Low', trend: 'down' },
    { type: 'Wildfire', icon: Flame, color: '#ef4444', count: 15, severity: 'High', trend: 'up' },
    { type: 'Storm', icon: CloudRain, color: '#22c55e', count: 28, severity: 'Medium', trend: 'stable' },
  ];

  const realTimeMetrics = [
    { name: 'Active Alerts', value: 47, change: '+12%', trend: 'up', color: 'text-red-500' },
    { name: 'Response Time', value: '2.3s', change: '-8%', trend: 'down', color: 'text-green-500' },
    { name: 'Coverage Area', value: '89.2%', change: '+3%', trend: 'up', color: 'text-blue-500' },
    { name: 'Prediction Accuracy', value: '94.7%', change: '+2%', trend: 'up', color: 'text-purple-500' },
  ];

  const sensorNetwork = [
    { id: 'S001', type: 'Weather', status: 'Online', location: 'North Region', lastUpdate: '2m ago', battery: 87 },
    { id: 'S002', type: 'Seismic', status: 'Online', location: 'East Region', lastUpdate: '1m ago', battery: 92 },
    { id: 'S003', type: 'Hydrological', status: 'Offline', location: 'South Region', lastUpdate: '15m ago', battery: 23 },
    { id: 'S004', type: 'Atmospheric', status: 'Online', location: 'West Region', lastUpdate: '3m ago', battery: 78 },
    { id: 'S005', type: 'Satellite', status: 'Online', location: 'Orbit', lastUpdate: 'Live', battery: 95 },
  ];

  const advancedAnalytics = [
    { metric: 'Risk Correlation', value: 0.87, description: 'Flood-Landslide correlation coefficient' },
    { metric: 'Prediction Horizon', value: '72h', description: 'Maximum reliable prediction window' },
    { metric: 'False Positive Rate', value: '3.2%', description: 'Alert accuracy metric' },
    { metric: 'Coverage Efficiency', value: '94.8%', description: 'Geographic coverage optimization' },
  ];

  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Real-time monitoring functions
  const handleAlertAction = (alertId: number, action: string) => {
    toast.success(`${action} action triggered for alert ${alertId}`);
  };

  const refreshData = () => {
    toast.success('Data refreshed successfully');
    // In production, this would trigger API calls
  };

  const triageAlerts = [
    { id: 1, type: 'Flood', location: 'North Region', priority: 'Critical', time: '2m ago', status: 'Active' },
    { id: 2, type: 'Landslide', location: 'East Region', priority: 'High', time: '5m ago', status: 'Investigating' },
    { id: 3, type: 'Cyclone', location: 'South Region', priority: 'Medium', time: '12m ago', status: 'Resolved' },
    { id: 4, type: 'Drought', location: 'West Region', priority: 'Low', time: '25m ago', status: 'Monitoring' },
  ];

  const incidentTimeline = [
    { id: 1, event: 'Flood Alert Triggered', time: '10:30 AM', status: 'Resolved', severity: 'High' },
    { id: 2, event: 'Landslide Detection', time: '09:15 AM', status: 'Active', severity: 'Critical' },
    { id: 3, event: 'Cyclone Warning', time: '08:45 AM', status: 'Resolved', severity: 'Medium' },
    { id: 4, event: 'Drought Monitor', time: '08:00 AM', status: 'Monitoring', severity: 'Low' },
  ];

  const riskMatrix = [
    { region: 'North', flood: 85, landslide: 45, cyclone: 30, drought: 20, wildfire: 15, storm: 60 },
    { region: 'South', flood: 60, landslide: 70, cyclone: 80, drought: 35, wildfire: 25, storm: 75 },
    { region: 'East', flood: 75, landslide: 80, cyclone: 45, drought: 50, wildfire: 40, storm: 55 },
    { region: 'West', flood: 40, landslide: 30, cyclone: 25, drought: 75, wildfire: 60, storm: 35 },
  ];

  return (
    <>
      <ProShell title="Disaster Monitoring Dashboard">
        <motion.div
          ref={sectionRef}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-sm text-muted-foreground mb-2">Overall Sales</div>
            <div className="text-4xl font-bold">${sales.toLocaleString()}</div>
            <div className="text-xs text-emerald-600 mt-1">+12% compared to last year</div>
            <div className="mt-4 space-y-2 text-sm">
              {[
                { label: 'March', value: 60 },
                { label: 'April', value: 40 },
                { label: 'May', value: 50 },
                { label: 'June', value: 70 },
              ].map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className="w-16 text-muted-foreground">{m.label}</div>
                  <div className="flex-1 h-2 rounded bg-muted relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-full bg-primary/70" style={{ width: `${m.value}%` }} />
                  </div>
                  <div className="w-10 text-right text-muted-foreground">{m.value}%</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 lg:col-span-1 lg:col-start-2 lg:col-end-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-sm text-muted-foreground mb-2">My Projects</div>
            <ChartContainer
              config={{ done: { label: 'Done', color: 'hsl(var(--primary))' }, new: { label: 'New', color: 'hsl(var(--chart-2, 210 98% 50%))' }, late: { label: 'Late', color: 'hsl(var(--destructive))' } }}
              className="aspect-[2.8/1]"
            >
              <BarChart data={projectData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="done" fill="var(--color-done)" radius={[4,4,0,0]} />
                <Bar dataKey="new" fill="var(--color-new)" radius={[4,4,0,0]} />
                <Bar dataKey="late" fill="var(--color-late)" radius={[4,4,0,0]} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-sm text-muted-foreground mb-2">My Tasks</div>
            <ChartContainer config={{ tasks: { label: 'Tasks', color: 'hsl(var(--primary))' } }} className="aspect-square">
              <RadialBarChart innerRadius={40} outerRadius={90} data={tasksData} startAngle={90} endAngle={-270}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" background cornerRadius={6} />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              </RadialBarChart>
            </ChartContainer>
          </Card>
        </motion.div>

        {/* Executive KPI Strip with anomaly highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'AI Risk Score', value: 76 + (streamTick % 3), suffix: '%', tone: 'text-red-500' },
            { label: 'Forecast Confidence', value: 93 - (streamTick % 2), suffix: '%', tone: 'text-emerald-500' },
            { label: 'Active Regions', value: 12 + (streamTick % 2), suffix: '', tone: 'text-blue-500' },
            { label: 'Anomalies Detected', value: 3 + (streamTick % 2), suffix: '', tone: 'text-amber-600' },
          ].map((k) => (
            <Card key={k.label} className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="text-xs text-muted-foreground mb-1">{k.label}</div>
              <div className={`text-2xl font-bold ${k.tone}`}>
                <CountUp end={k.value} suffix={k.suffix as any} />
              </div>
            </Card>
          ))}
        </div>

        {/* Overall Risk Index */}
        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="text-sm text-muted-foreground mb-2">Overall Risk Index</div>
            <div className="text-4xl font-bold text-red-500">
              <CountUp end={Math.round(riskNow*100)} suffix="%" />
            </div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${riskDelta >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {riskDelta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3"/>}
              {Math.abs(riskDelta*100).toFixed(1)}% vs last period
            </div>
            <div className="mt-4">
              <ChartContainer config={{ flood: { label: 'Flood', color: '#3b82f6' }, landslide: { label: 'Landslide', color: '#8B5E3C' }, cyclone: { label: 'Cyclone', color: '#f97316' }, drought: { label: 'Drought', color: '#f59e0b' } }}>
                <LineChart data={predictionSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="flood" stroke="var(--color-flood)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="landslide" stroke="var(--color-landslide)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cyclone" stroke="var(--color-cyclone)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="drought" stroke="var(--color-drought)" strokeWidth={2} dot={false} />
                  <ChartLegend content={<ChartLegendContent />} />
                </LineChart>
              </ChartContainer>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Multi-series Predictions Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Advanced Disaster Predictions</h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Activity className="h-3 w-3" /> AI Powered
                </Badge>
                <Button variant="outline" size="sm" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <ChartContainer
              config={{
                flood: { label: 'Flood', color: 'hsl(210 98% 50%)' },
                landslide: { label: 'Landslide', color: 'hsl(30 50% 40%)' },
                cyclone: { label: 'Cyclone', color: 'hsl(30 90% 50%)' },
                drought: { label: 'Drought', color: 'hsl(50 90% 50%)' },
              }}
              className="aspect-[2.8/1]"
            >
              <ComposedChart data={predictionSeries}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area type="monotone" dataKey="flood" fill="hsl(210 98% 50% / 0.1)" stroke="hsl(210 98% 50%)" strokeWidth={2} />
                <Area type="monotone" dataKey="landslide" fill="hsl(30 50% 40% / 0.1)" stroke="hsl(30 50% 40%)" strokeWidth={2} />
                <Area type="monotone" dataKey="cyclone" fill="hsl(30 90% 50% / 0.1)" stroke="hsl(30 90% 50%)" strokeWidth={2} />
                <Area type="monotone" dataKey="drought" fill="hsl(50 90% 50% / 0.1)" stroke="hsl(50 90% 50%)" strokeWidth={2} />
              </ComposedChart>
            </ChartContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Live Threat Map</h2>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Interactive
              </Badge>
            </div>
            <DisasterMap events={events as any} predictions={predictions as any} height="460px" />
          </Card>

          <div className="space-y-6">
            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">System Health</h3>
                <Badge variant="outline">Operational</Badge>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>API Uptime</span><span>99.8%</span></div>
                  <Progress value={98} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Data Freshness</span><span>Live</span></div>
                  <Progress value={95} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>Prediction Accuracy</span><span>87%</span></div>
                  <Progress value={87} />
                </div>
              </div>
            </Card>

            <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Critical Alerts</h3>
                <Badge variant="destructive">{criticalEvents.length}</Badge>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(criticalEvents.slice(0,6)).map((e) => (
                  <div key={e.id} className="border rounded p-2 flex items-center justify-between hover:bg-muted/30 transition-colors duration-200">
                    <div>
                      <div className="font-medium text-sm">{e.event_type} • {e.location}</div>
                      <div className="text-xs text-muted-foreground">severity: {e.severity}</div>
                    </div>
                    <Button size="icon" variant="ghost"><Bell className="h-4 w-4" /></Button>
                  </div>
                ))}
                {criticalEvents.length === 0 && (
                  <div className="text-sm text-muted-foreground">No critical alerts.</div>
                )}
              </div>
            </Card>

            <LegendCard />
            <QuickActions />
          </div>
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="sensors">Sensors</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="text-sm text-muted-foreground mb-1">Total Events</div>
                  <div className="text-2xl font-bold">{events.length}</div>
                </Card>
                <Card className="p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="text-sm text-muted-foreground mb-1">Active Predictions</div>
                  <div className="text-2xl font-bold flex items-center gap-2">{predictions.length}<TrendingUp className="h-4 w-4 text-primary" /></div>
                </Card>
                <Card className="p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="text-sm text-muted-foreground mb-1">Online Sensors</div>
                  <div className="text-2xl font-bold">{sensors.length}</div>
                </Card>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold mb-3">Latest Operations</div>
                <Card className="backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="w-64">Status</TableHead>
                        <TableHead className="w-24 text-right">Value</TableHead>
                        <TableHead className="w-32 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ops.map(o => (
                        <TableRow key={o.id} className="hover:bg-muted/30 transition-colors duration-200">
                          <TableCell>{o.id}</TableCell>
                          <TableCell className="text-muted-foreground">{o.name}</TableCell>
                          <TableCell>
                            <div className="h-2 rounded bg-muted relative overflow-hidden">
                              <div className="absolute left-0 top-0 h-full bg-primary/70" style={{ width: `${o.status}%` }} />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline" className="px-2">{o.value}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" className="hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors duration-200"><Eye className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="hover:bg-orange-100 dark:hover:bg-orange-950/30 transition-colors duration-200"><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" className="text-destructive hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors duration-200"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="predictions">
              <div className="grid md:grid-cols-2 gap-3">
                {(predictions || []).slice(0,8).map(p => (
                  <Card key={p.id} className="p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{p.event_type}</div>
                      <Badge variant="outline">{Math.round((p.probability||0)*100)}%</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{p.location}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sensors">
              <div className="grid md:grid-cols-2 gap-3">
                {(sensors || []).slice(0,8).map(s => (
                  <Card key={s.id} className="p-4 backdrop-blur-sm bg-white/60 dark:bg-gray-900/60 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{s.station_name || s.id}</div>
                      <Badge variant="outline">{s.sensor_type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{s.location}</div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
        {/* Command Center & Hazard Trends (compact, no empty space) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                Command Center
              </h3>
              <Badge variant="secondary">Quick Actions</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button variant="secondary" className="justify-center">
                <ShieldAlert className="h-4 w-4 mr-2" /> Critical
              </Button>
              <Button variant="secondary" className="justify-center">
                <CloudRain className="h-4 w-4 mr-2" /> Floods
              </Button>
              <Button variant="secondary" className="justify-center">
                <Flame className="h-4 w-4 mr-2" /> Wildfire
              </Button>
              <Button variant="secondary" className="justify-center" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" /> Refresh
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="justify-center">Last 24h</Badge>
              <Badge variant="outline" className="justify-center">Global</Badge>
            </div>
            {/* Lottie status (alerts) */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10"><Lottie animationData={alertAnim as any} loop autoplay /></div>
                <div className="text-xs">Live Alerts</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10"><Lottie animationData={successAnim as any} loop autoplay /></div>
                <div className="text-xs">Deployments</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 lg:col-span-2 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Hazard Trends (Mini)</h3>
              <Badge variant="outline">Sparklines</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: 'flood', label: 'Flood', color: 'hsl(210 98% 50%)' },
                { key: 'landslide', label: 'Landslide', color: 'hsl(30 50% 40%)' },
                { key: 'cyclone', label: 'Cyclone', color: 'hsl(30 90% 50%)' },
                { key: 'drought', label: 'Drought', color: 'hsl(50 90% 50%)' },
              ].map((h) => (
                <div key={h.key} className="rounded-lg border p-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">{h.label}</div>
                    <Badge variant="secondary">7d</Badge>
                  </div>
                  <ChartContainer config={{}} className="h-20">
                    <AreaChart data={predictionSeries}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" hide />
                      <YAxis hide domain={[0, 'dataMax + 10']} />
                      <Area type="monotone" dataKey={h.key as any} stroke={h.color} fill={`${h.color} / 0.15`} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Enterprise widgets row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Severity Breakdown</h3>
            </div>
            <ChartContainer config={{}} className="aspect-square">
              <PieChart>
                <Pie dataKey="value" data={severityPie} innerRadius={50} outerRadius={80} paddingAngle={6}>
                  {severityPie.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Regional KPIs</h3>
            </div>
            <div className="space-y-3">
              {regions.map(r => (
                <div key={r.region} className="grid grid-cols-5 items-center gap-2 text-sm">
                  <div className="col-span-1 font-medium">{r.region}</div>
                  <div className="col-span-3">
                    <div className="h-2 rounded bg-muted relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-amber-500/80" style={{ width: `${r.risks}%` }} />
                    </div>
                  </div>
                  <div className="col-span-1 text-right text-muted-foreground">{r.risks}%</div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">SLA Compliance</h3>
            </div>
            <ChartContainer config={{}} className="aspect-[2.5/1]">
              <AreaChart data={regions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="region" />
                <YAxis domain={[0,100]} />
                <Area dataKey="sla" type="monotone" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.25)" />
                <ChartTooltip content={<ChartTooltipContent />} />
              </AreaChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Advanced Enterprise Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Alert Triage Panel
              </h3>
              <Badge variant="destructive">{triageAlerts.filter(a => a.priority === 'Critical').length}</Badge>
            </div>
            <div className="space-y-3">
              {triageAlerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      alert.priority === 'Critical' ? 'bg-red-500' :
                      alert.priority === 'High' ? 'bg-orange-500' :
                      alert.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <div className="font-medium text-sm">{alert.type} • {alert.location}</div>
                      <div className="text-xs text-muted-foreground">{alert.time} • {alert.status}</div>
                    </div>
                  </div>
                  <Badge variant={alert.priority === 'Critical' ? 'destructive' : 'secondary'}>
                    {alert.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Incident Timeline
              </h3>
              <Badge variant="outline">Live</Badge>
            </div>
            <div className="space-y-3">
              {incidentTimeline.map(incident => (
                <div key={incident.id} className="flex items-center gap-3 p-2 hover:bg-muted/30 rounded-lg transition-colors duration-200">
                  <div className={`w-2 h-2 rounded-full ${
                    incident.severity === 'Critical' ? 'bg-red-500' :
                    incident.severity === 'High' ? 'bg-orange-500' :
                    incident.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{incident.event}</div>
                    <div className="text-xs text-muted-foreground">{incident.time} • {incident.status}</div>
                  </div>
                  <Badge variant={incident.status === 'Active' ? 'destructive' : 'secondary'}>
                    {incident.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Next-gen Visualization Suite */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* 3D-styled Perspective Map (visual tilt) */}
          <Card className="p-0 overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" /> 3D Terrain Preview
              </h3>
              <Badge variant="outline">Perspective</Badge>
            </div>
            <div className="p-4">
              <div className="[perspective:1200px]">
                <div className="rounded-xl border overflow-hidden shadow-xl [transform:rotateX(18deg)] [transform-origin:50%_0]">
                  <DisasterMap events={events as any} predictions={predictions as any} height="300px" />
                </div>
              </div>
            </div>
          </Card>

          {/* Radar Analysis */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Radar Analysis</h3>
              <Badge variant="secondary">Multivariate</Badge>
            </div>
            <ChartContainer config={{}} className="aspect-square">
              <RadarChartComp cx="50%" cy="50%" outerRadius="80%" data={[
                { key: 'Flood', A: 82, B: 65 },
                { key: 'Landslide', A: 58, B: 72 },
                { key: 'Cyclone', A: 74, B: 61 },
                { key: 'Drought', A: 63, B: 55 },
                { key: 'Wildfire', A: 69, B: 60 },
                { key: 'Storm', A: 77, B: 66 },
              ]}>
                <PolarGrid />
                <PolarAngleAxis dataKey="key" />
                <PolarRadiusAxis angle={45} domain={[0, 100]} />
                <RadarArea name="Current" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.35} />
                <RadarArea name="Baseline" dataKey="B" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                <Legend />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChartComp>
            </ChartContainer>
          </Card>

          {/* Network Graph (inline SVG force-style) */}
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Sensor/Region Network</h3>
              <Badge variant="outline">Graph</Badge>
            </div>
            <div className="relative w-full h-[360px]">
              <svg viewBox="0 0 600 360" className="w-full h-full">
                {/* links */}
                {[
                  [0,1],[0,2],[1,3],[2,3],[3,4],[2,5],[4,5],[1,5]
                ].map((pair, i) => {
                  const nodes = [
                    { x: 90, y: 80 },
                    { x: 220, y: 60 },
                    { x: 200, y: 180 },
                    { x: 340, y: 120 },
                    { x: 460, y: 200 },
                    { x: 520, y: 100 },
                  ];
                  const a = nodes[pair[0]]; const b = nodes[pair[1]];
                  return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="currentColor" className="text-muted-foreground/60" strokeWidth="2" />
                })}
                {/* nodes */}
                {[
                  { x: 90, y: 80, label: 'S-01' },
                  { x: 220, y: 60, label: 'S-02' },
                  { x: 200, y: 180, label: 'REG-N' },
                  { x: 340, y: 120, label: 'REG-E' },
                  { x: 460, y: 200, label: 'REG-S' },
                  { x: 520, y: 100, label: 'S-05' },
                ].map((n, i) => (
                  <g key={i}>
                    <circle cx={n.x} cy={n.y} r="10" className="fill-primary/80" />
                    <text x={n.x + 14} y={n.y + 4} className="text-xs fill-foreground">{n.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </Card>
        </div>

        {/* Risk Matrix and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Risk Heatmatrix
              </h3>
              <Badge variant="outline">Regional Analysis</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Region</th>
                    <th className="text-center p-2">Flood</th>
                    <th className="text-center p-2">Landslide</th>
                    <th className="text-center p-2">Cyclone</th>
                    <th className="text-center p-2">Drought</th>
                    <th className="text-center p-2">Wildfire</th>
                    <th className="text-center p-2">Storm</th>
                  </tr>
                </thead>
                <tbody>
                  {riskMatrix.map(row => (
                    <tr key={row.region} className="border-b hover:bg-muted/30 transition-colors duration-200">
                      <td className="p-2 font-medium">{row.region}</td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-6 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.flood > 70 ? 'bg-red-600' : row.flood > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.flood}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-6 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.landslide > 70 ? 'bg-red-600' : row.landslide > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.landslide}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-8 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.cyclone > 70 ? 'bg-red-600' : row.cyclone > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.cyclone}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-6 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.drought > 70 ? 'bg-red-600' : row.drought > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.drought}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-6 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.wildfire > 70 ? 'bg-red-600' : row.wildfire > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.wildfire}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-8 h-6 rounded text-xs text-white flex items-center justify-center transition-transform duration-200 hover:scale-110 ${
                          row.storm > 70 ? 'bg-red-600' : row.storm > 50 ? 'bg-orange-500' : 'bg-green-500'
                        }`}>{row.storm}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-emerald-500" />
                Performance Metrics
              </h3>
              <Badge variant="outline">Real-time</Badge>
            </div>
            <div className="space-y-4">
              {performanceMetrics.map(metric => (
                <div key={metric.metric} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded-lg transition-colors duration-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{metric.metric}</span>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{metric.current}{metric.unit}</span>
                    <span className="text-xs text-muted-foreground">/ {metric.target}{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* System Status Overview */}
        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              System Status Overview
            </h3>
            <Badge variant="outline">All Systems Operational</Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors duration-200 cursor-pointer group">
              <Database className="h-8 w-8 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-sm font-medium">Database</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors duration-200 cursor-pointer group">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-sm font-medium">API Gateway</div>
              <div className="text-xs text-muted-foreground">Healthy</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-colors duration-200 cursor-pointer group">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-sm font-medium">User Services</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors duration-200 cursor-pointer group">
              <Zap className="h-8 w-8 mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
              <div className="text-sm font-medium">ML Engine</div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
          </div>
        </Card>

        {/* Advanced Disaster Monitoring Dashboard */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {realTimeMetrics.map((metric, index) => (
            <motion.div key={metric.name} variants={itemVariants}>
              <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-muted-foreground">{metric.name}</h3>
                  <div className={`text-xs font-medium ${metric.color}`}>
                    {metric.change}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">
                  <CountUp end={parseFloat(metric.value.toString().replace('%', ''))} suffix={metric.value.toString().includes('%') ? '%' : metric.value.toString().includes('s') ? 's' : ''} />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                  {metric.trend === 'up' ? 'Increasing' : 'Decreasing'}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Disaster Type Analysis & Sensor Network */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Radar className="h-5 w-5 text-blue-500" />
                Disaster Type Analysis
              </h3>
              <Badge variant="outline">Real-time</Badge>
            </div>
            <div className="space-y-4">
              {disasterTypes.map((disaster) => {
                const IconComponent = disaster.icon;
                return (
                  <motion.div 
                    key={disaster.type}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: disaster.color + '20' }}>
                        <IconComponent className="h-5 w-5" style={{ color: disaster.color }} />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{disaster.type}</div>
                        <div className="text-xs text-muted-foreground">{disaster.severity} severity</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">{disaster.count}</div>
                      <Badge variant={disaster.trend === 'up' ? 'destructive' : disaster.trend === 'down' ? 'default' : 'secondary'}>
                        {disaster.trend}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Satellite className="h-5 w-5 text-green-500" />
                Sensor Network Status
              </h3>
              <Badge variant="outline">{sensorNetwork.filter(s => s.status === 'Online').length}/{sensorNetwork.length} Online</Badge>
            </div>
            <div className="space-y-3">
              {sensorNetwork.map((sensor) => (
                <motion.div 
                  key={sensor.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${sensor.status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="font-medium text-sm">{sensor.id} • {sensor.type}</div>
                      <div className="text-xs text-muted-foreground">{sensor.location} • {sensor.lastUpdate}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-muted-foreground">Battery</div>
                    <div className="w-16 h-2 rounded bg-muted relative overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full rounded transition-all duration-300 ${
                          sensor.battery > 80 ? 'bg-green-500' : sensor.battery > 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`} 
                        style={{ width: `${sensor.battery}%` }} 
                      />
                    </div>
                    <div className="text-xs font-medium">{sensor.battery}%</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Advanced Analytics & Correlation Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ActivitySquare className="h-5 w-5 text-purple-500" />
                Advanced Analytics
              </h3>
              <Badge variant="outline">ML Powered</Badge>
            </div>
            <div className="space-y-4">
              {advancedAnalytics.map((analytic) => (
                <motion.div 
                  key={analytic.metric}
                  className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-all duration-200"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{analytic.metric}</span>
                    <span className="text-lg font-bold text-primary">{analytic.value}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{analytic.description}</div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-emerald-500" />
                Risk Correlation Matrix
              </h3>
              <Badge variant="outline">Statistical</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Hazard</th>
                    <th className="text-center p-2">Flood</th>
                    <th className="text-center p-2">Landslide</th>
                    <th className="text-center p-2">Cyclone</th>
                    <th className="text-center p-2">Drought</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { hazard: 'Flood', flood: 1.00, landslide: 0.87, cyclone: 0.45, drought: -0.32 },
                    { hazard: 'Landslide', flood: 0.87, landslide: 1.00, cyclone: 0.23, drought: -0.18 },
                    { hazard: 'Cyclone', flood: 0.45, landslide: 0.23, cyclone: 1.00, drought: -0.56 },
                    { hazard: 'Drought', flood: -0.32, landslide: -0.18, cyclone: -0.56, drought: 1.00 },
                  ].map((row) => (
                    <tr key={row.hazard} className="border-b hover:bg-muted/30 transition-colors duration-200">
                      <td className="p-2 font-medium">{row.hazard}</td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-12 h-6 rounded text-xs text-white flex items-center justify-center ${
                          Math.abs(row.flood) > 0.7 ? 'bg-blue-600' : Math.abs(row.flood) > 0.4 ? 'bg-blue-400' : 'bg-gray-400'
                        }`}>{row.flood.toFixed(2)}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-12 h-6 rounded text-xs text-white flex items-center justify-center ${
                          Math.abs(row.landslide) > 0.7 ? 'bg-blue-600' : Math.abs(row.landslide) > 0.4 ? 'bg-blue-400' : 'bg-gray-400'
                        }`}>{row.landslide.toFixed(2)}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-12 h-6 rounded text-xs text-white flex items-center justify-center ${
                          Math.abs(row.cyclone) > 0.7 ? 'bg-blue-600' : Math.abs(row.cyclone) > 0.4 ? 'bg-blue-400' : 'bg-gray-400'
                        }`}>{row.cyclone.toFixed(2)}</div>
                      </td>
                      <td className="p-2 text-center">
                        <div className={`inline-block w-12 h-6 rounded text-xs text-white flex items-center justify-center ${
                          Math.abs(row.drought) > 0.7 ? 'bg-blue-600' : Math.abs(row.drought) > 0.4 ? 'bg-blue-400' : 'bg-gray-400'
                        }`}>{row.drought.toFixed(2)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Enhanced Action Panel */}
        <Card className="p-6 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Disaster Response Control Center
            </h3>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors duration-200 cursor-pointer border-2 border-red-200 dark:border-red-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-600" />
              <div className="text-sm font-medium">Emergency Mode</div>
              <div className="text-xs text-muted-foreground">Activate</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors duration-200 cursor-pointer border-2 border-blue-200 dark:border-blue-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Satellite className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Deploy Sensors</div>
              <div className="text-xs text-muted-foreground">Network</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors duration-200 cursor-pointer border-2 border-green-200 dark:border-green-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Alert Teams</div>
              <div className="text-xs text-muted-foreground">Response</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-colors duration-200 cursor-pointer border-2 border-purple-200 dark:border-purple-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">AI Analysis</div>
              <div className="text-xs text-muted-foreground">Predict</div>
            </motion.div>
          </div>
        </Card>
      </ProShell>
      <Toaster position="top-right" />
    </>
  );
}


