import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Play,
  Pause,
  Settings,
  Eye,
  TrendingUp,
  TrendingDown,
  Minus,
  Satellite,
  Wifi,
  Signal,
  Zap,
  Shield,
  Database,
  Server,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SensorData {
  name: string;
  value: number;
  unit: string;
  status: 'Normal' | 'Elevated' | 'High' | 'Critical';
  trend: 'up' | 'down' | 'stable';
  change: string;
}

interface RealTimeMonitorProps {
  sensorData: SensorData[];
}

const RealTimeMonitor: React.FC<RealTimeMonitorProps> = ({ sensorData: initialSensorData }) => {
  const [sensorData, setSensorData] = useState<SensorData[]>(initialSensorData);
  const [isLive, setIsLive] = useState(true);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('1h');

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setSensorData(prev => prev.map(sensor => ({
        ...sensor,
        value: sensor.value + (Math.random() - 0.5) * 2,
        change: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(1)}${sensor.unit}`
      })));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'default';
      case 'Elevated': return 'secondary';
      case 'High': return 'default';
      case 'Critical': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Normal': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Elevated': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'High': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSensorIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'temperature': return <Thermometer className="h-5 w-5" />;
      case 'humidity': return <Droplets className="h-5 w-5" />;
      case 'pressure': return <Gauge className="h-5 w-5" />;
      case 'wind speed': return <Wind className="h-5 w-5" />;
      case 'air quality': return <Shield className="h-5 w-5" />;
      case 'seismic activity': return <Activity className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getProgressValue = (value: number, name: string) => {
    // Normalize values for progress bar
    switch (name.toLowerCase()) {
      case 'temperature': return Math.min((value / 50) * 100, 100);
      case 'humidity': return value;
      case 'pressure': return Math.min(((value - 900) / 200) * 100, 100);
      case 'wind speed': return Math.min((value / 100) * 100, 100);
      case 'air quality': return Math.min((value / 500) * 100, 100);
      case 'seismic activity': return Math.min((value / 10) * 100, 100);
      default: return value;
    }
  };

  const getProgressColor = (value: number, name: string) => {
    const progress = getProgressValue(value, name);
    if (progress < 30) return 'bg-green-500';
    if (progress < 60) return 'bg-yellow-500';
    if (progress < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="h-5 w-5" />
                Real-Time Sensor Monitoring
              </CardTitle>
              <CardDescription>
                Live monitoring of environmental and seismic sensors
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">{isLive ? 'Live' : 'Paused'}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLive(!isLive)}
              >
                {isLive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isLive ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-lg font-semibold text-green-600">Operational</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sensors</p>
                <p className="text-lg font-semibold text-blue-600">{sensorData.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Database className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Data Rate</p>
                <p className="text-lg font-semibold text-purple-600">2.4k/s</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensorData.map((sensor) => (
          <motion.div
            key={sensor.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-200 ${
                selectedSensor === sensor.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSensor(selectedSensor === sensor.name ? null : sensor.name)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-full bg-blue-100">
                      {getSensorIcon(sensor.name)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{sensor.name}</CardTitle>
                      <CardDescription>Real-time monitoring</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(sensor.status)}
                    <Badge variant={getStatusColor(sensor.status)}>
                      {sensor.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Value */}
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {sensor.value.toFixed(1)}
                    <span className="text-lg text-gray-500 ml-1">{sensor.unit}</span>
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {getTrendIcon(sensor.trend)}
                    <span className="text-sm text-gray-600">{sensor.change}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Level</span>
                    <span className="font-medium">{getProgressValue(sensor.value, sensor.name).toFixed(0)}%</span>
                  </div>
                  <Progress 
                    value={getProgressValue(sensor.value, sensor.name)} 
                    className="h-2"
                  />
                </div>

                {/* Threshold Indicators */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-gray-500">Normal</span>
                  </div>
                  <div className="text-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-gray-500">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mx-auto mb-1"></div>
                    <span className="text-gray-500">Critical</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed View */}
      <AnimatePresence>
        {selectedSensor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {getSensorIcon(selectedSensor)}
                    {selectedSensor} - Detailed Analysis
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setSelectedSensor(null)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Historical Chart Placeholder */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Historical Trends</h4>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Historical data visualization</p>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Sensor Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sensor ID:</span>
                        <span className="font-medium">SENS-{selectedSensor.toUpperCase().replace(' ', '-')}-001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">Primary Monitoring Station</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Calibration:</span>
                        <span className="font-medium">2024-01-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className="font-medium">±0.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Update Frequency:</span>
                        <span className="font-medium">5 seconds</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeMonitor;
