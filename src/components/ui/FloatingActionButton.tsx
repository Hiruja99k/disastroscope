import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, X, AlertTriangle, MapPin, Users, FileText } from 'lucide-react';

interface FloatingActionButtonProps {
  onReportDisaster: () => void;
  onViewMap: () => void;
  onViewAnalytics: () => void;
  onExportReport: () => void;
}

export default function FloatingActionButton({
  onReportDisaster,
  onViewMap,
  onViewAnalytics,
  onExportReport
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainButtonVariants = {
    closed: { rotate: 0 },
    open: { rotate: 45 }
  };

  const menuVariants = {
    closed: {
      scale: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: 1
      }
    }
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      scale: 0,
      x: 0,
      y: 0
    },
    open: { 
      opacity: 1, 
      scale: 1,
      x: 0,
      y: 0
    }
  };

  const actions = [
    {
      icon: AlertTriangle,
      label: 'Report Disaster',
      onClick: onReportDisaster,
      color: 'from-red-500 to-red-600',
      delay: 0
    },
    {
      icon: MapPin,
      label: 'View Map',
      onClick: onViewMap,
      color: 'from-blue-500 to-blue-600',
      delay: 0.1
    },
    {
      icon: Users,
      label: 'Analytics',
      onClick: onViewAnalytics,
      color: 'from-green-500 to-green-600',
      delay: 0.2
    },
    {
      icon: FileText,
      label: 'Export Report',
      onClick: onExportReport,
      color: 'from-purple-500 to-purple-600',
      delay: 0.3
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* Action Items */}
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.label}
                variants={itemVariants}
                className="flex items-center space-x-3"
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: action.delay }}
                  className="bg-slate-800/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm text-white whitespace-nowrap shadow-lg border border-slate-700/50"
                >
                  {action.label}
                </motion.div>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    action.onClick();
                    setIsOpen(false);
                  }}
                  className={`
                    w-12 h-12 rounded-full 
                    bg-gradient-to-r ${action.color}
                    flex items-center justify-center
                    shadow-lg hover:shadow-xl
                    transition-all duration-200
                    border-2 border-white/20
                  `}
                >
                  <action.icon className="h-6 w-6 text-white" />
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <motion.button
        variants={mainButtonVariants}
        animate={isOpen ? "open" : "closed"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full 
          bg-gradient-to-r from-blue-500 to-purple-600
          flex items-center justify-center
          shadow-2xl hover:shadow-blue-500/25
          transition-all duration-300
          border-2 border-white/20
          relative overflow-hidden
          before:absolute before:inset-0 
          before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
          before:translate-x-[-100%] hover:before:translate-x-[100%]
          before:transition-transform before:duration-700
        `}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <X className="h-8 w-8 text-white" />
          ) : (
            <Plus className="h-8 w-8 text-white" />
          )}
        </motion.div>

        {/* Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.button>
    </div>
  );
}
