import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import StatusIndicator from './StatusIndicator';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    type: 'increase' | 'decrease' | 'neutral';
  };
  icon: LucideIcon;
  status?: 'active' | 'warning' | 'resolved' | 'pending';
  trend?: number[];
  color?: 'primary' | 'secondary' | 'destructive' | 'warning' | 'success';
  className?: string;
  delay?: number;
}

export default function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  status,
  trend = [],
  color = 'primary',
  className = '',
  delay = 0
}: MetricCardProps) {
  const getIconColor = () => {
    switch (color) {
      case 'destructive':
        return 'text-red-500';
      case 'warning':
        return 'text-orange-500';
      case 'success':
        return 'text-green-500';
      case 'secondary':
        return 'text-blue-500';
      default:
        return 'text-primary';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-red-500';
      case 'warning':
        return 'text-orange-500';
      case 'resolved':
        return 'text-green-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-primary';
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: delay * 0.1 + 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const getChangeIcon = () => {
    if (!change) return null;
    switch (change.type) {
      case 'increase':
        return <TrendingUp className="h-3 w-3" />;
      case 'decrease':
        return <TrendingDown className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getChangeColor = () => {
    if (!change) return 'text-muted-foreground';
    switch (change.type) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className={`group ${className}`}
    >
      <Card className="
        relative overflow-hidden p-6 
        bg-white dark:bg-gray-900/50
        border border-gray-200 dark:border-gray-700
        hover:border-primary/60
        transition-all duration-300 ease-out
        shadow-sm hover:shadow-lg
        backdrop-blur-sm
      ">
        {/* Professional Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        </div>

        {/* Subtle Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                variants={iconVariants}
                className={`
                  w-14 h-14 rounded-2xl 
                  bg-gradient-to-br from-gray-50 to-gray-100
                  dark:from-gray-800 dark:to-gray-700
                  flex items-center justify-center
                  border border-gray-200 dark:border-gray-600
                  shadow-sm
                  ${getIconColor()}
                `}
              >
                <Icon className="h-7 w-7" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  {title}
                </h3>
                {status && (
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor().replace('text-', 'bg-')}`}></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{status}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Value Section */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
            </div>
            
            {/* Change Indicator */}
            {change && (
              <div className={`flex items-center space-x-2 text-sm font-medium ${getChangeColor()}`}>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
                  change.type === 'increase' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' :
                  change.type === 'decrease' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                  'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                }`}>
                  {getChangeIcon()}
                  <span>{change.value}</span>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Trend Visualization */}
          {trend.length > 0 && (
            <div className="relative">
              <div className="flex items-end justify-between h-16 space-x-1">
                {trend.map((point, index) => (
                  <motion.div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-primary/20 to-primary/40 rounded-t-sm relative group"
                    style={{ height: `${Math.max(point * 60, 8)}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(point * 60, 8)}px` }}
                    transition={{ 
                      delay: delay * 0.1 + index * 0.05,
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {Math.round(point * 100)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Trend line overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            </div>
          )}

          {/* Professional Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Last updated</span>
              <span className="flex items-center space-x-1">
                <Activity className="h-3 w-3" />
                <span>Live</span>
              </span>
            </div>
          </div>
        </div>

        {/* Subtle Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </Card>
    </motion.div>
  );
}
