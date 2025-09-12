import React, { useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

interface AnimatedStatCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color?: string;
  delay?: number;
  className?: string;
  trend?: number[];
}

export default function AnimatedStatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'blue',
  delay = 0,
  className = '',
  trend = []
}: AnimatedStatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  // Spring animation for the number
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: typeof value === 'number' ? value : 0 },
    delay: delay * 100,
    config: { duration: 2000 }
  });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
      controls.start("visible");
    }
  }, [isInView, controls]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        delay: delay * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: delay * 0.1 + 0.2,
        ease: "backOut"
      }
    }
  };

  const getColorClasses = () => {
    const colorMap = {
      red: {
        bg: 'from-red-500/20 to-red-600/10',
        icon: 'text-red-400',
        accent: 'text-red-300',
        glow: 'shadow-red-500/25'
      },
      blue: {
        bg: 'from-blue-500/20 to-blue-600/10',
        icon: 'text-blue-400',
        accent: 'text-blue-300',
        glow: 'shadow-blue-500/25'
      },
      green: {
        bg: 'from-green-500/20 to-green-600/10',
        icon: 'text-green-400',
        accent: 'text-green-300',
        glow: 'shadow-green-500/25'
      },
      yellow: {
        bg: 'from-yellow-500/20 to-yellow-600/10',
        icon: 'text-yellow-400',
        accent: 'text-yellow-300',
        glow: 'shadow-yellow-500/25'
      },
      purple: {
        bg: 'from-purple-500/20 to-purple-600/10',
        icon: 'text-purple-400',
        accent: 'text-purple-300',
        glow: 'shadow-purple-500/25'
      },
      orange: {
        bg: 'from-orange-500/20 to-orange-600/10',
        icon: 'text-orange-400',
        accent: 'text-orange-300',
        glow: 'shadow-orange-500/25'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses();

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-400';
      case 'decrease':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return '↗';
      case 'decrease':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={controls}
      className={`group ${className}`}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        transition: { duration: 0.2 }
      }}
    >
      <Card className={`
        relative overflow-hidden p-6 
        bg-gradient-to-br ${colors.bg} 
        border-slate-700/50 backdrop-blur-sm
        hover:shadow-2xl hover:${colors.glow}
        transition-all duration-300
        before:absolute before:inset-0 
        before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
        before:translate-x-[-100%] hover:before:translate-x-[100%]
        before:transition-transform before:duration-700
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                variants={iconVariants}
                className={`
                  w-12 h-12 rounded-xl 
                  bg-gradient-to-br from-white/10 to-white/5
                  flex items-center justify-center
                  border border-white/10
                  ${colors.icon}
                `}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="text-sm text-gray-400 font-medium">{title}</p>
                {change && (
                  <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
                    <span>{getChangeIcon()}</span>
                    <span>{change}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              {typeof value === 'number' ? (
                <animated.span className="text-3xl font-bold text-white">
                  {number.to(n => Math.floor(n).toLocaleString())}
                </animated.span>
              ) : (
                <span className="text-3xl font-bold text-white">{value}</span>
              )}
            </div>

            {/* Trend Line */}
            {trend.length > 0 && (
              <div className="flex items-center space-x-1 h-8">
                {trend.map((point, index) => (
                  <motion.div
                    key={index}
                    className="w-1 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full"
                    style={{ height: `${Math.max(point * 20, 4)}px` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(point * 20, 4)}px` }}
                    transition={{ delay: delay * 0.1 + index * 0.05 }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Hover Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </Card>
    </motion.div>
  );
}
