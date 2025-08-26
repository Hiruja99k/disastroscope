import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Bell, 
  Settings,
  Activity,
  BarChart3,
  PieChart,
  Globe,
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
  Gauge
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import EarthquakeMagnitudeMap from './EarthquakeMagnitudeMap';

// Mock data for charts and tables
const disasterTrendsData = [
  { month: 'Jan', earthquakes: 12, floods: 8, wildfires: 15, storms: 20 },
  { month: 'Feb', earthquakes: 15, floods: 10, wildfires: 18, storms: 25 },
  { month: 'Mar', earthquakes: 18, floods: 12, wildfires: 22, storms: 30 },
  { month: 'Apr', earthquakes: 20, floods: 15, wildfires: 25, storms: 28 },
  { month: 'May', earthquakes: 22, floods: 18, wildfires: 30, storms: 35 },
  { month: 'Jun', earthquakes: 25, floods: 20, wildfires: 35, storms: 40 },
];

const predictionAccuracyData = [
  { name: 'Earthquakes', value: 94.2, color: '#3182CE' },
  { name: 'Floods', value: 89.7, color: '#38B2AC' },
  { name: 'Wildfires', value: 91.5, color: '#ED8936' },
  { name: 'Storms', value: 87.3, color: '#805AD5' },
];

const recentEvents = [
  {
    id: 1,
    type: 'Earthquake',
    location: 'San Francisco, CA',
    magnitude: '6.2',
    severity: 'High',
    status: 'Active',
    timestamp: '2 hours ago',
    affected: 125000,
  },
  {
    id: 2,
    type: 'Flood',
    location: 'Miami, FL',
    magnitude: 'Category 3',
    severity: 'Medium',
    status: 'Monitoring',
    timestamp: '4 hours ago',
    affected: 89000,
  },
  {
    id: 3,
    type: 'Wildfire',
    location: 'Los Angeles, CA',
    magnitude: 'Large',
    severity: 'Critical',
    status: 'Active',
    timestamp: '6 hours ago',
    affected: 156000,
  },
  {
    id: 4,
    type: 'Storm',
    location: 'New Orleans, LA',
    magnitude: 'Category 2',
    severity: 'Medium',
    status: 'Resolved',
    timestamp: '1 day ago',
    affected: 67000,
  },
];

const sensorData = [
  { name: 'Temperature', value: 24.5, unit: '°C', status: 'Normal' },
  { name: 'Humidity', value: 65, unit: '%', status: 'Normal' },
  { name: 'Pressure', value: 1013, unit: 'hPa', status: 'Normal' },
  { name: 'Wind Speed', value: 12, unit: 'km/h', status: 'Elevated' },
  { name: 'Air Quality', value: 45, unit: 'AQI', status: 'Good' },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function EnterpriseDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const handleExport = () => {
    toast.success('Export started! Your dashboard data is being exported...');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'destructive';
      case 'monitoring':
        return 'secondary';
      case 'resolved':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">DisastroScope Dashboard</h1>
          <p className="text-gray-600">Real-time disaster monitoring and prediction analytics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="us-west">US West</SelectItem>
              <SelectItem value="us-east">US East</SelectItem>
              <SelectItem value="us-central">US Central</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +12.5%
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">23</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingDown className="h-4 w-4" />
                  -8.2%
                </div>
              </div>
              <div className="p-3 rounded-full bg-orange-100">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +2.1%
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Affected Population</p>
                <p className="text-2xl font-bold text-red-600">2.1M</p>
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <TrendingUp className="h-4 w-4" />
                  +15.3%
                </div>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Disaster Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Disaster Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={disasterTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="earthquakes"
                  stroke="#3182CE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="floods"
                  stroke="#38B2AC"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="wildfires"
                  stroke="#ED8936"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="storms"
                  stroke="#805AD5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Prediction Accuracy Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Accuracy by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={predictionAccuracyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {predictionAccuracyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Earthquake Magnitude Map Section */}
      <div className="mb-8">
        <EarthquakeMagnitudeMap height={600} />
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Events Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recent Events</CardTitle>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant="outline">{event.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{event.location}</p>
                        <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Sensor Data */}
        <Card>
          <CardHeader>
            <CardTitle>Sensor Readings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sensorData.map((sensor, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{sensor.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {sensor.value} {sensor.unit}
                    </span>
                  </div>
                  <Progress value={sensor.value} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Status: {sensor.status}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Model Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm mb-2">Response Time</p>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">85% - Excellent</p>
              </div>
              <div>
                <p className="text-sm mb-2">Data Processing</p>
                <Progress value={92} className="h-2" />
                <p className="text-xs text-muted-foreground">92% - Optimal</p>
              </div>
              <div>
                <p className="text-sm mb-2">System Uptime</p>
                <Progress value={99.8} className="h-2" />
                <p className="text-xs text-muted-foreground">99.8% - Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={disasterTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="earthquakes" fill="#3182CE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                             <div className="flex justify-between items-center">
                 <span className="text-sm">Active Analysts</span>
                 <div className="flex -space-x-2">
                   <Avatar className="border-2 border-white">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>JD</AvatarFallback>
                   </Avatar>
                   <Avatar className="border-2 border-white">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>JS</AvatarFallback>
                   </Avatar>
                   <Avatar className="border-2 border-white">
                     <AvatarImage src="https://github.com/shadcn.png" />
                     <AvatarFallback>MJ</AvatarFallback>
                   </Avatar>
                 </div>
               </div>
              <div>
                <p className="text-sm mb-2">Tasks Completed</p>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground">78% - On Track</p>
              </div>
              <div>
                <p className="text-sm mb-2">Alerts Responded</p>
                <Progress value={95} className="h-2" />
                <p className="text-xs text-muted-foreground">95% - Excellent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
