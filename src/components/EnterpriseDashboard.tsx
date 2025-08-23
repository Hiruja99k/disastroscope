import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  Globe, 
  MapPin, 
  TrendingUp, 
  Users,
  Zap,
  Shield,
  Database,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDisasterLoadingState, useStats } from '@/hooks/useDisasterData';
import { trackEvent } from '@/utils/monitoring';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                ) : (
                  value
                )}
              </p>
              {change !== undefined && (
                <Badge 
                  variant={change >= 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {change >= 0 ? '+' : ''}{change}%
                </Badge>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface SystemStatusProps {
  status: 'operational' | 'degraded' | 'down';
  name: string;
  uptime: string;
}

const SystemStatus: React.FC<SystemStatusProps> = ({ status, name, uptime }) => {
  const statusConfig = {
    operational: { color: 'bg-green-500', text: 'Operational' },
    degraded: { color: 'bg-yellow-500', text: 'Degraded' },
    down: { color: 'bg-red-500', text: 'Down' }
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-muted-foreground">Uptime: {uptime}</p>
        </div>
      </div>
      <Badge variant="outline">{config.text}</Badge>
    </div>
  );
};

export function EnterpriseDashboard() {
  const { isLoading, isError, error } = useDisasterLoadingState();
  const { data: stats } = useStats();
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    network: 78,
    storage: 34
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpu: Math.max(20, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(30, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(50, Math.min(95, prev.network + (Math.random() - 0.5) * 12)),
        storage: Math.max(25, Math.min(60, prev.storage + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    trackEvent('dashboard_tab_changed', { tab: value });
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dashboard Error</h3>
            <p className="text-muted-foreground">
              Unable to load dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time monitoring and analytics for DisastroScope
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Live
          </Badge>
          <Button variant="outline" size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Disasters"
          value={stats?.activeDisasters || 0}
          change={12}
          icon={<AlertTriangle className="h-6 w-6 text-white" />}
          color="bg-red-500"
          loading={isLoading}
        />
        <MetricCard
          title="Predictions Generated"
          value={stats?.totalPredictions || 0}
          change={8}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          loading={isLoading}
        />
        <MetricCard
          title="System Uptime"
          value="99.9%"
          change={0.1}
          icon={<Shield className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="API Response Time"
          value="245ms"
          change={-5}
          icon={<Zap className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Activity
                </CardTitle>
                <CardDescription>
                  Live system activity and user interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '2s ago', event: 'New prediction generated', user: 'User_123' },
                    { time: '5s ago', event: 'Disaster alert triggered', user: 'System' },
                    { time: '12s ago', event: 'Weather data updated', user: 'API' },
                    { time: '18s ago', event: 'User login', user: 'User_456' },
                    { time: '25s ago', event: 'Data export completed', user: 'User_789' }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.user}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  System Performance
                </CardTitle>
                <CardDescription>
                  Current system resource utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: 'CPU Usage', value: systemMetrics.cpu, color: 'bg-blue-500' },
                    { label: 'Memory Usage', value: systemMetrics.memory, color: 'bg-green-500' },
                    { label: 'Network I/O', value: systemMetrics.network, color: 'bg-purple-500' },
                    { label: 'Storage', value: systemMetrics.storage, color: 'bg-orange-500' }
                  ].map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">{metric.label}</span>
                        <span className="text-sm text-muted-foreground">{metric.value.toFixed(1)}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Disaster Trends</CardTitle>
                <CardDescription>
                  Monthly disaster occurrence patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">Chart component would go here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>
                  Most affected areas this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { location: 'California, USA', count: 45, change: 12 },
                    { location: 'Tokyo, Japan', count: 38, change: -5 },
                    { location: 'Sydney, Australia', count: 32, change: 8 },
                    { location: 'London, UK', count: 28, change: -2 },
                    { location: 'Mumbai, India', count: 25, change: 15 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.count}</span>
                        <Badge variant={item.change >= 0 ? "default" : "destructive"} className="text-xs">
                          {item.change >= 0 ? '+' : ''}{item.change}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
                <CardDescription>
                  Current status of all system components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <SystemStatus status="operational" name="API Gateway" uptime="99.9%" />
                  <SystemStatus status="operational" name="Database" uptime="99.8%" />
                  <SystemStatus status="degraded" name="ML Prediction Service" uptime="98.5%" />
                  <SystemStatus status="operational" name="Weather API" uptime="99.7%" />
                  <SystemStatus status="operational" name="Monitoring System" uptime="100%" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Deployments</CardTitle>
                <CardDescription>
                  Latest system updates and deployments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { version: 'v2.1.0', status: 'success', time: '2 hours ago', description: 'Performance optimizations' },
                    { version: 'v2.0.5', status: 'success', time: '1 day ago', description: 'Bug fixes and security updates' },
                    { version: 'v2.0.4', status: 'success', time: '3 days ago', description: 'New ML model deployment' },
                    { version: 'v2.0.3', status: 'success', time: '1 week ago', description: 'UI improvements' }
                  ].map((deployment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{deployment.version}</p>
                        <p className="text-sm text-muted-foreground">{deployment.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {deployment.status}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{deployment.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Current system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { severity: 'high', title: 'High CPU Usage', description: 'CPU usage exceeded 85% threshold', time: '5 minutes ago' },
                  { severity: 'medium', title: 'Database Connection Pool', description: 'Connection pool at 80% capacity', time: '15 minutes ago' },
                  { severity: 'low', title: 'Weather API Latency', description: 'Response time increased by 200ms', time: '1 hour ago' }
                ].map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 border-l-4 rounded-lg ${
                      alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                      'border-blue-500 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={alert.severity === 'high' ? 'destructive' : 
                                  alert.severity === 'medium' ? 'default' : 'secondary'}
                        >
                          {alert.severity}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EnterpriseDashboard;
