import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'resolved' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export default function StatusIndicator({ 
  status, 
  size = 'md', 
  showLabel = false, 
  animated = true,
  className = '' 
}: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          color: 'destructive',
          icon: AlertTriangle,
          label: 'Active',
          bgColor: 'bg-destructive/20',
          borderColor: 'border-destructive/30',
          textColor: 'text-destructive'
        };
      case 'warning':
        return {
          color: 'warning',
          icon: Clock,
          label: 'Warning',
          bgColor: 'bg-warning/20',
          borderColor: 'border-warning/30',
          textColor: 'text-warning'
        };
      case 'resolved':
        return {
          color: 'success',
          icon: CheckCircle,
          label: 'Resolved',
          bgColor: 'bg-success/20',
          borderColor: 'border-success/30',
          textColor: 'text-success'
        };
      case 'pending':
        return {
          color: 'muted',
          icon: XCircle,
          label: 'Pending',
          bgColor: 'bg-muted/20',
          borderColor: 'border-muted/30',
          textColor: 'text-muted-foreground'
        };
      default:
        return {
          color: 'muted',
          icon: Clock,
          label: 'Unknown',
          bgColor: 'bg-muted/20',
          borderColor: 'border-muted/30',
          textColor: 'text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6'
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.div
        className={`
          ${sizeClasses[size]} 
          ${config.bgColor} 
          ${config.borderColor}
          rounded-full 
          flex 
          items-center 
          justify-center 
          border
          relative
          overflow-hidden
        `}
        variants={animated ? pulseVariants : undefined}
        animate={animated ? "pulse" : undefined}
      >
        <Icon className={`${iconSizeClasses[size]} ${config.textColor}`} />
        
        {/* Animated ring for active status */}
        {status === 'active' && animated && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-destructive/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )}
      </motion.div>
      
      {showLabel && (
        <span className={`text-sm font-medium ${config.textColor}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
