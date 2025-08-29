import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

interface DisasterChartProps {
  type: 'line' | 'bar' | 'pie' | 'area';
  data?: any[];
  title?: string;
  dataKey?: string;
  nameKey?: string;
  height?: number;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))', 
  'hsl(var(--accent))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
  'hsl(var(--success))'
];

// Generate sample data for different chart types
const generateSampleData = (type: string) => {
  switch (type) {
    case 'line':
      return [
        { date: '2024-01-01', earthquakes: 12, wildfires: 8, floods: 5 },
        { date: '2024-01-02', earthquakes: 15, wildfires: 12, floods: 7 },
        { date: '2024-01-03', earthquakes: 8, wildfires: 15, floods: 9 },
        { date: '2024-01-04', earthquakes: 18, wildfires: 6, floods: 12 },
        { date: '2024-01-05', earthquakes: 22, wildfires: 18, floods: 6 },
        { date: '2024-01-06', earthquakes: 16, wildfires: 14, floods: 15 },
        { date: '2024-01-07', earthquakes: 25, wildfires: 20, floods: 8 }
      ];
    case 'bar':
      return [
        { region: 'Pacific', high: 45, medium: 32, low: 18 },
        { region: 'Atlantic', high: 28, medium: 41, low: 25 },
        { region: 'Mediterranean', high: 15, medium: 28, low: 35 },
        { region: 'Indian Ocean', high: 38, medium: 29, low: 20 },
        { region: 'Arctic', high: 8, medium: 15, low: 42 }
      ];
    case 'area':
      // Use a region-based dataset that works well for stacked area
      return [
        { region: 'Pacific', high: 40, medium: 30, low: 15 },
        { region: 'Atlantic', high: 28, medium: 34, low: 20 },
        { region: 'Mediterranean', high: 18, medium: 26, low: 28 },
        { region: 'Indian Ocean', high: 34, medium: 24, low: 18 },
        { region: 'Arctic', high: 10, medium: 14, low: 36 }
      ];
    case 'pie':
      return [
        { name: 'Earthquakes', value: 35, color: COLORS[0] },
        { name: 'Wildfires', value: 28, color: COLORS[1] },
        { name: 'Floods', value: 22, color: COLORS[2] },
        { name: 'Hurricanes', value: 10, color: COLORS[3] },
        { name: 'Others', value: 5, color: COLORS[4] }
      ];
    default:
      return [];
  }
};

export default function DisasterChart({ type, data, title, dataKey = 'value', nameKey = 'name', height = 192 }: DisasterChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(generateSampleData(type));
    }
  }, [data, type]);

  const renderChart = () => {
    switch (type) {
      case 'line': {
        const categories = chartData.map((d) => d.date);
        const series = [
          { name: 'earthquakes', data: chartData.map((d) => d.earthquakes) },
          { name: 'wildfires', data: chartData.map((d) => d.wildfires) },
          { name: 'floods', data: chartData.map((d) => d.floods) },
        ];
        const options: ApexOptions = {
          chart: { type: 'line', toolbar: { show: false }, parentHeightOffset: 0 },
          stroke: { curve: 'smooth', width: 2 },
          fill: { type: 'solid', opacity: 0 },
          xaxis: { categories },
          colors: COLORS,
          legend: { position: 'bottom', horizontalAlign: 'center' },
          grid: { borderColor: 'rgba(0,0,0,0.08)', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        };
        return <ReactApexChart options={options} series={series} type="line" height={height} />;
      }
      case 'area': {
        const categories = chartData.map((d) => d.region);
        const options: ApexOptions = {
          chart: { type: 'area', stacked: true, toolbar: { show: false }, parentHeightOffset: 0 },
          xaxis: { categories },
          colors: COLORS,
          stroke: { curve: 'smooth', width: 2 },
          fill: { type: 'solid', opacity: 0.25 },
          dataLabels: { enabled: false },
          legend: { position: 'bottom' },
          grid: { borderColor: 'rgba(0,0,0,0.08)', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
        };
        const series = [
          { name: 'high', data: chartData.map((d) => d.high) },
          { name: 'medium', data: chartData.map((d) => d.medium) },
          { name: 'low', data: chartData.map((d) => d.low) },
        ];
        return <ReactApexChart options={options} series={series} type="area" height={height} />;
      }
      case 'bar': {
        const categories = chartData.map((d) => d.region);
        const options: ApexOptions = {
          chart: { type: 'bar', toolbar: { show: false }, parentHeightOffset: 0 },
          plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
          xaxis: { categories },
          colors: COLORS,
          grid: { borderColor: 'rgba(0,0,0,0.08)', padding: { top: 0, right: 0, bottom: 0, left: 0 } },
          legend: { position: 'bottom' },
        };
        const series = [
          { name: 'high', data: chartData.map((d) => d.high) },
          { name: 'medium', data: chartData.map((d) => d.medium) },
          { name: 'low', data: chartData.map((d) => d.low) },
        ];
        return <ReactApexChart options={options} series={series} type="bar" height={height} />;
      }
      case 'pie': {
        const options: ApexOptions = {
          chart: { type: 'donut', toolbar: { show: false }, parentHeightOffset: 0 },
          labels: chartData.map((d) => d[nameKey]),
          colors: chartData.map((d, i) => d.color || COLORS[i % COLORS.length]),
          legend: { position: 'bottom' },
          plotOptions: {
            pie: {
              donut: {
                size: '72%'
              }
            }
          }
        };
        const series = chartData.map((d) => d[dataKey]);
        return <ReactApexChart options={options} series={series} type="donut" height={height} />;
      }
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Unsupported chart type</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      )}
      {renderChart()}
    </div>
  );
}