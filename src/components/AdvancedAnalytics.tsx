import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  AlertTriangle, 
  Brain, 
  Globe, 
  Clock, 
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
  Download,
  Settings,
  Eye,
  Filter,
  Calendar,
  Thermometer,
  Wind,
  CloudRain,
  Flame,
  Waves,
  Mountain
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdvancedAnalyticsProps {
  events?: any[];
  predictions?: any[];
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))', 
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--success))'
];

export default function AdvancedAnalytics({ events = [], predictions = [] }: AdvancedAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedChartType, setSelectedChartType] = useState('line');
  const [isLoading, setIsLoading] = useState(false);

  // Generate sample data for charts
  const generateTimeSeriesData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        earthquakes: Math.floor(Math.random() * 20) + 5,
        wildfires: Math.floor(Math.random() * 15) + 3,
        floods: Math.floor(Math.random() * 12) + 2,
        hurricanes: Math.floor(Math.random() * 8) + 1,
        tsunamis: Math.floor(Math.random() * 3) + 0
      });
    }
    return data;
  };

  const generateRegionalData = () => {
    return [
      { region: 'Pacific', high: 45, medium: 32, low: 18, total: 95 },
      { region: 'Atlantic', high: 28, medium: 41, low: 25, total: 94 },
      { region: 'Mediterranean', high: 15, medium: 28, low: 35, total: 78 },
      { region: 'Indian Ocean', high: 38, medium: 29, low: 20, total: 87 },
      { region: 'Arctic', high: 8, medium: 15, low: 42, total: 65 }
    ];
  };

  const generateDisasterTypeData = () => {
    return [
      { name: 'Earthquakes', value: 35, color: COLORS[0] },
      { name: 'Wildfires', value: 28, color: COLORS[1] },
      { name: 'Floods', value: 22, color: COLORS[2] },
      { name: 'Hurricanes', value: 10, color: COLORS[3] },
      { name: 'Tsunamis', value: 5, color: COLORS[4] }
    ];
  };

  const [timeSeriesData] = useState(generateTimeSeriesData());
  const [regionalData] = useState(generateRegionalData());
  const [disasterTypeData] = useState(generateDisasterTypeData());

  const renderChart = () => {
    switch (selectedChartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="earthquakes" 
                stroke={COLORS[0]} 
                strokeWidth={2}
                dot={{ fill: COLORS[0], strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="wildfires" 
                stroke={COLORS[1]} 
                strokeWidth={2}
                dot={{ fill: COLORS[1], strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="floods" 
                stroke={COLORS[2]} 
                strokeWidth={2}
                dot={{ fill: COLORS[2], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="region" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="high" stackId="a" fill={COLORS[3]} />
              <Bar dataKey="medium" stackId="a" fill={COLORS[4]} />
              <Bar dataKey="low" stackId="a" fill={COLORS[5]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="earthquakes" 
                stackId="1"
                stroke={COLORS[0]} 
                fill={COLORS[0] + '40'}
              />
              <Area 
                type="monotone" 
                dataKey="wildfires" 
                stackId="1"
                stroke={COLORS[1]} 
                fill={COLORS[1] + '40'}
              />
              <Area 
                type="monotone" 
                dataKey="floods" 
                stackId="1"
                stroke={COLORS[2]} 
                fill={COLORS[2] + '40'}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={disasterTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {disasterTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const metrics = [
    {
      label: 'Prediction Accuracy',
      value: '94.2%',
      change: '+2.1%',
      trend: 'up',
      icon: Target
    },
    {
      label: 'Response Time',
      value: '2.3s',
      change: '-0.5s',
      trend: 'down',
      icon: Clock
    },
    {
      label: 'Data Quality',
      value: '98.7%',
      change: '+1.2%',
      trend: 'up',
      icon: Activity
    },
    {
      label: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Brain
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-poppins">Advanced Analytics</h2>
          <p className="text-sm text-muted-foreground">Real-time disaster analytics and trend analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24h</SelectItem>
              <SelectItem value="7d">7d</SelectItem>
              <SelectItem value="30d">30d</SelectItem>
              <SelectItem value="90d">90d</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedChartType} onValueChange={setSelectedChartType}>
            <SelectTrigger className="w-32">
              <BarChart3 className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="bar">Bar</SelectItem>
              <SelectItem value="area">Area</SelectItem>
              <SelectItem value="pie">Pie</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <metric.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Disaster Trends Analysis</h3>
              <p className="text-sm text-muted-foreground">Real-time monitoring and prediction trends</p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Activity className="h-3 w-3 mr-1" />
                Live Data
              </Badge>
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {renderChart()}
        </Card>
      </motion.div>

      {/* Additional Analytics Cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Regional Risk Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Regional Risk Analysis</h3>
              <Badge variant="outline">High Risk</Badge>
            </div>
            <div className="space-y-3">
              {regionalData.map((region, index) => (
                <div key={region.region} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{region.region}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(region.high / region.total) * 100} className="w-20 h-2" />
                    <span className="text-xs text-muted-foreground">{region.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Model Performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">AI Model Performance</h3>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Optimized
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Earthquake Model</span>
                  <span className="font-medium">94.2%</span>
                </div>
                <Progress value={94.2} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Wildfire Model</span>
                  <span className="font-medium">91.8%</span>
                </div>
                <Progress value={91.8} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Flood Model</span>
                  <span className="font-medium">89.5%</span>
                </div>
                <Progress value={89.5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hurricane Model</span>
                  <span className="font-medium">96.1%</span>
                </div>
                <Progress value={96.1} className="h-2" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
