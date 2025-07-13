import { useEffect, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DisasterChartProps {
  type: 'line' | 'bar' | 'pie';
  data?: any[];
  title?: string;
  dataKey?: string;
  nameKey?: string;
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

export default function DisasterChart({ type, data, title, dataKey = 'value', nameKey = 'name' }: DisasterChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // Use provided data or generate sample data
    if (data && data.length > 0) {
      setChartData(data);
    } else {
      setChartData(generateSampleData(type));
    }
  }, [data, type]);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
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