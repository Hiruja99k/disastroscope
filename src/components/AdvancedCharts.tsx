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
import { ResponsiveLine, ResponsiveBar, ResponsivePie, ResponsiveHeatMap } from '@nivo/core';
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
          <div style={{ height: '300px' }}>
            <ResponsiveLine
              data={generateTrendData()}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Date',
                legendOffset: 40,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              useMesh={true}
              legends={[
                {
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        );

      case 'bar':
        return (
          <div style={{ height: '300px' }}>
            <ResponsiveBar
              data={[
                { region: 'North America', earthquakes: 45, floods: 23, wildfires: 12 },
                { region: 'Europe', earthquakes: 32, floods: 18, wildfires: 8 },
                { region: 'Asia', earthquakes: 67, floods: 34, wildfires: 15 },
                { region: 'Africa', earthquakes: 28, floods: 41, wildfires: 6 },
                { region: 'South America', earthquakes: 38, floods: 29, wildfires: 9 },
                { region: 'Oceania', earthquakes: 15, floods: 12, wildfires: 4 }
              ]}
              keys={['earthquakes', 'floods', 'wildfires']}
              indexBy="region"
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              padding={0.3}
              groupMode="grouped"
              valueScale={{ type: 'linear' }}
              indexScale={{ type: 'band', round: true }}
              colors={{ scheme: 'nivo' }}
              borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Region',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelSkipWidth={12}
              labelSkipHeight={12}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
              legends={[
                {
                  dataFrom: 'keys',
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: -20,
                  itemsSpacing: 2,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 20,
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemOpacity: 1
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        );

      case 'pie':
        return (
          <div style={{ height: '300px' }}>
            <ResponsivePie
              data={generateAnalyticsData()}
              margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              activeOuterRadiusOffset={8}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 56,
                  itemsSpacing: 0,
                  itemWidth: 100,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  itemDirection: 'left-to-right',
                  itemOpacity: 1,
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </div>
        );

      case 'heatmap':
        return (
          <div style={{ height: '300px' }}>
            <ResponsiveHeatMap
              data={generateHeatmapData()}
              margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
              forceSquare={true}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Region',
                legendPosition: 'middle',
                legendOffset: 40
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Metric',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
              animate={true}
              motionStiffness={80}
              motionDamping={9}
              hoverTarget="cell"
              tooltip={({ x, y, value }) => (
                <div
                  style={{
                    background: 'white',
                    padding: '9px 12px',
                    border: '1px solid #ccc',
                  }}
                >
                  <strong>
                    {x} - {y}
                  </strong>
                  <br />
                  {value}
                </div>
              )}
            />
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
                <ResponsivePie
                  data={generateAnalyticsData()}
                  margin={{ top: 20, right: 80, bottom: 20, left: 80 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  activeOuterRadiusOffset={8}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: 'color' }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                  legends={[
                    {
                      anchor: 'bottom',
                      direction: 'row',
                      justify: false,
                      translateX: 0,
                      translateY: 56,
                      itemsSpacing: 0,
                      itemWidth: 100,
                      itemHeight: 18,
                      itemTextColor: '#999',
                      itemDirection: 'left-to-right',
                      itemOpacity: 1,
                      symbolSize: 18,
                      symbolShape: 'circle',
                      effects: [
                        {
                          on: 'hover',
                          style: {
                            itemTextColor: '#000'
                          }
                        }
                      ]
                    }
                  ]}
                />
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
                <ResponsiveHeatMap
                  data={generateHeatmapData()}
                  margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                  forceSquare={true}
                  axisTop={null}
                  axisRight={null}
                  axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                    legend: 'Region',
                    legendPosition: 'middle',
                    legendOffset: 40
                  }}
                  axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Metric',
                    legendPosition: 'middle',
                    legendOffset: -40
                  }}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
                  animate={true}
                  motionStiffness={80}
                  motionDamping={9}
                  hoverTarget="cell"
                  tooltip={({ x, y, value }) => (
                    <div
                      style={{
                        background: 'white',
                        padding: '9px 12px',
                        border: '1px solid #ccc',
                      }}
                    >
                      <strong>
                        {x} - {y}
                      </strong>
                      <br />
                      {value}
                    </div>
                  )}
                />
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
