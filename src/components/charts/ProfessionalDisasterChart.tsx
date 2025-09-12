import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface ProfessionalDisasterChartProps {
  type: 'line' | 'area' | 'bar' | 'pie' | 'radial' | 'scatter' | 'composed' | 'clustered';
  data: any[];
  title?: string;
  height?: number;
  colors?: string[];
  showAnimation?: boolean;
  className?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
}

const SCIENTIFIC_COLORS = [
  'hsl(217, 91%, 60%)', // Primary blue
  'hsl(180, 80%, 50%)', // Teal
  'hsl(0, 84%, 60%)',   // Destructive red
  'hsl(38, 92%, 50%)',  // Warning orange
  'hsl(142, 76%, 36%)', // Success green
  'hsl(99, 102%, 241%)', // Purple
  'hsl(14, 165, 233%)'  // Cyan
];

export default function ProfessionalDisasterChart({
  type,
  data,
  title,
  height = 300,
  colors = SCIENTIFIC_COLORS,
  showAnimation = true,
  className = '',
  showGrid = true,
  showLegend = true,
  showTooltip = true
}: ProfessionalDisasterChartProps) {
  const chartVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const renderChart = () => {
    const commonProps = {
      width: '100%',
      height: height,
      data: data
    };

    const tooltipStyle = {
      backgroundColor: 'hsl(var(--card))',
      border: '1px solid hsl(var(--border))',
      borderRadius: '12px',
      color: 'hsl(var(--foreground))',
      boxShadow: '0 8px 32px hsl(var(--primary) / 0.1)',
      backdropFilter: 'blur(8px)'
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend />}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2, fill: 'white' }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              fillOpacity={1} 
              fill="url(#areaGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            <Bar 
              dataKey="value" 
              fill={colors[0]}
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart width={height} height={height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={height * 0.35}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart 
            width={height} 
            height={height} 
            cx="50%" 
            cy="50%" 
            innerRadius="25%" 
            outerRadius="75%" 
            data={data}
          >
            <RadialBar 
              dataKey="value" 
              cornerRadius={8} 
              fill={colors[0]}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
          </RadialBarChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="x" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              dataKey="y" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            <Scatter 
              dataKey="value" 
              fill={colors[0]}
            />
          </ScatterChart>
        );

      case 'composed':
        return (
          <ComposedChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend />}
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="trend" stroke={colors[1]} strokeWidth={2} />
          </ComposedChart>
        );

      case 'clustered':
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--muted-foreground) / 0.2)" 
                opacity={0.3} 
              />
            )}
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            {showTooltip && <Tooltip contentStyle={tooltipStyle} />}
            {showLegend && <Legend />}
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="secondary" fill={colors[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="tertiary" fill={colors[2]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={chartVariants}
      initial="hidden"
      animate="visible"
      className={`w-full ${className}`}
    >
      <Card className="relative overflow-hidden p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-glow">
        {title && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mr-3 animate-pulse"></div>
              {title}
            </h3>
            <div className="w-full h-px bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 mt-2"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </Card>
    </motion.div>
  );
}
