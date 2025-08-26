import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
// Temporarily comment out Nivo imports until they're installed
// import { ResponsiveLine } from '@nivo/line';
// import { ResponsiveBar } from '@nivo/bar';
// import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveHeatMap } from '@nivo/heatmap';
import { format, subDays, subHours } from 'date-fns';

interface AdvancedChartsProps {
  type: 'trends' | 'analytics';
  data?: any;
}

const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ type, data }) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'heatmap'>('line');
  const [timeframe, setTimeframe] = useState('7d');

  // Generate advanced mock data
  const generateTrendData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = subDays(now, i);
      data.push({
        x: format(date, 'MMM dd'),
        y: Math.floor(Math.random() * 50) + 10,
        category: 'Earthquakes'
      });
      data.push({
        x: format(date, 'MMM dd'),
        y: Math.floor(Math.random() * 30) + 5,
        category: 'Floods'
      });
      data.push({
        x: format(date, 'MMM dd'),
        y: Math.floor(Math.random() * 20) + 2,
        category: 'Wildfires'
      });
    }
    
    return [
      {
        id: 'Earthquakes',
        color: '#ff4444',
        data: data.filter(d => d.category === 'Earthquakes')
      },
      {
        id: 'Floods',
        color: '#4444ff',
        data: data.filter(d => d.category === 'Floods')
      },
      {
        id: 'Wildfires',
        color: '#ff8800',
        data: data.filter(d => d.category === 'Wildfires')
      }
    ];
  };

  const generateAnalyticsData = () => {
    return [
      {
        id: 'Response Time',
        label: 'Response Time',
        value: 85,
        color: '#10b981'
      },
      {
        id: 'Accuracy',
        label: 'Accuracy',
        value: 94,
        color: '#3b82f6'
      },
      {
        id: 'Coverage',
        label: 'Coverage',
        value: 87,
        color: '#f59e0b'
      },
      {
        id: 'Efficiency',
        label: 'Efficiency',
        value: 92,
        color: '#8b5cf6'
      }
    ];
  };

  const generateHeatmapData = () => {
    const data = [];
    const regions = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Oceania'];
    const metrics = ['Response Time', 'Accuracy', 'Coverage', 'Efficiency'];
    
    regions.forEach(region => {
      metrics.forEach(metric => {
        data.push({
          x: region,
          y: metric,
          value: Math.floor(Math.random() * 100)
        });
      });
    });
    
    return data;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <div style={{ height: '300px' }} className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <LineChart className="h-12 w-12 mx-auto mb-2" />
              <p>Line Chart - Nivo library required</p>
              <p className="text-sm">Install @nivo/line for full functionality</p>
            </div>
          </div>
        );

      case 'bar':
        return (
          <div style={{ height: '300px' }} className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Bar Chart - Nivo library required</p>
              <p className="text-sm">Install @nivo/bar for full functionality</p>
            </div>
          </div>
        );

      case 'pie':
        return (
          <div style={{ height: '300px' }} className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Pie Chart - Nivo library required</p>
              <p className="text-sm">Install @nivo/pie for full functionality</p>
            </div>
          </div>
        );

      case 'heatmap':
        return (
          <div style={{ height: '300px' }} className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Heatmap - Nivo library required</p>
              <p className="text-sm">Install @nivo/heatmap for full functionality</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (type === 'trends') {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChart className="h-4 w-4 mr-2" />
              Trends
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Distribution
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
        {renderChart()}
      </div>
    );
  }

  if (type === 'analytics') {
    return (
      <div className="space-y-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Disasters</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    +12% this month
                  </div>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                  <p className="text-2xl font-bold">2.3s</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingDown className="h-4 w-4" />
                    -0.5s improvement
                  </div>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold">94.2%</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    +2.1% improvement
                  </div>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Coverage Area</p>
                  <p className="text-2xl font-bold">87.5%</p>
                  <div className="flex items-center gap-1 text-sm text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                    +5.2% expansion
                  </div>
                </div>
                <div className="p-2 rounded-full bg-orange-100">
                  <Eye className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                    <p>Performance Metrics Chart</p>
                    <p className="text-sm">Nivo library required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Regional Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ height: '300px' }}>
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                    <p>Regional Performance Heatmap</p>
                    <p className="text-sm">Nivo library required</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
};

export default AdvancedCharts;
