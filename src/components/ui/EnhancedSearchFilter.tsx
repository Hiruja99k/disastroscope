import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown,
  MapPin,
  Calendar,
  AlertTriangle,
  Users
} from 'lucide-react';
// import { useSpring, animated } from '@react-spring/web';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
  color?: string;
}

interface EnhancedSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: {
    status: FilterOption[];
    severity: FilterOption[];
    type: FilterOption[];
  };
  activeFilters: {
    status?: string;
    severity?: string;
    type?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export default function EnhancedSearchFilter({
  searchTerm,
  onSearchChange,
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters
}: EnhancedSearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // const searchSpring = useSpring({
  //   scale: searchFocused ? 1.02 : 1,
  //   boxShadow: searchFocused 
  //     ? '0 0 0 2px rgba(59, 130, 246, 0.5)' 
  //     : '0 0 0 0px rgba(59, 130, 246, 0.5)',
  //   config: { tension: 300, friction: 30 }
  // });

  const filterVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto'
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1
    }
  };

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

  return (
    <Card className="relative overflow-hidden p-6 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10 space-y-4">
        {/* Search Bar */}
        <motion.div 
          animate={{ 
            scale: searchFocused ? 1.02 : 1,
            boxShadow: searchFocused 
              ? '0 0 0 2px rgba(59, 130, 246, 0.5)' 
              : '0 0 0 0px rgba(59, 130, 246, 0.5)'
          }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search disasters by title, type, location..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="pl-10 pr-4 py-3 bg-card/50 border-primary/30 text-foreground placeholder-muted-foreground focus:border-primary/60 focus:ring-primary/20 backdrop-blur-sm"
            />
            {searchTerm && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-slate-700/50 transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 bg-card/50 border-primary/30 text-foreground hover:bg-card/70 hover:border-primary/50 hover:shadow-glow transition-all duration-300"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown 
              className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            />
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-400 hover:text-white"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {Object.entries(activeFilters).map(([type, value]) => {
                if (!value) return null;
                return (
                  <motion.div
                    key={`${type}-${value}`}
                    variants={badgeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2, ease: "backOut" }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="flex items-center space-x-1 bg-blue-500/20 text-blue-300 border-blue-500/30"
                    >
                      <span className="capitalize">{type}: {value}</span>
                      <button
                        onClick={() => onFilterChange(type, '')}
                        className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-4"
            >
              {/* Status Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Status
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.status.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onFilterChange('status', option.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${activeFilters.status === option.value
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-gray-300'
                        }
                      `}
                    >
                      {option.label}
                      {option.count && (
                        <span className="ml-1 text-xs opacity-75">({option.count})</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Severity Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Severity
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.severity.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onFilterChange('severity', option.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${activeFilters.severity === option.value
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-gray-300'
                        }
                      `}
                    >
                      {option.label}
                      {option.count && (
                        <span className="ml-1 text-xs opacity-75">({option.count})</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Type
                </h4>
                <div className="flex flex-wrap gap-2">
                  {filters.type.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onFilterChange('type', option.value)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${activeFilters.type === option.value
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-700/50 text-gray-400 hover:bg-slate-600/50 hover:text-gray-300'
                        }
                      `}
                    >
                      {option.label}
                      {option.count && (
                        <span className="ml-1 text-xs opacity-75">({option.count})</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
