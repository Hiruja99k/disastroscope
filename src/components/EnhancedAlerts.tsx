import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Users, 
  Settings, 
  Filter, 
  Search, 
  MoreHorizontal, 
  ExternalLink, 
  Download, 
  Share2, 
  Eye,
  Volume2,
  VolumeX,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Flame,
  Waves,
  Mountain,
  CloudRain,
  Wind,
  Thermometer
} from 'lucide-react';
import { useState } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  affectedPopulation?: number;
  severity: string;
  category: string;
  source: string;
}

export default function EnhancedAlerts() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Major Earthquake Detected',
      description: 'Magnitude 7.2 earthquake detected in Pacific Ring of Fire',
      location: 'Pacific Ocean, 150km off Japan coast',
      timestamp: '2 minutes ago',
      status: 'active',
      affectedPopulation: 2500000,
      severity: 'Magnitude 7.2',
      category: 'Earthquake',
      source: 'USGS Seismic Network'
    },
    {
      id: '2',
      type: 'high',
      title: 'Wildfire Spread Warning',
      description: 'Rapid wildfire spread detected in California',
      location: 'Northern California, Redwood National Park',
      timestamp: '15 minutes ago',
      status: 'active',
      affectedPopulation: 150000,
      severity: 'High Risk',
      category: 'Wildfire',
      source: 'NASA Satellite Monitoring'
    },
    {
      id: '3',
      type: 'medium',
      title: 'Flood Warning Issued',
      description: 'Heavy rainfall causing river overflow',
      location: 'Mississippi River Valley',
      timestamp: '1 hour ago',
      status: 'acknowledged',
      affectedPopulation: 500000,
      severity: 'Moderate',
      category: 'Flood',
      source: 'NOAA Weather Service'
    },
    {
      id: '4',
      type: 'high',
      title: 'Hurricane Formation Alert',
      description: 'Tropical depression intensifying rapidly',
      location: 'Atlantic Ocean, 300km east of Florida',
      timestamp: '3 hours ago',
      status: 'active',
      affectedPopulation: 1000000,
      severity: 'Category 3 Expected',
      category: 'Hurricane',
      source: 'National Hurricane Center'
    },
    {
      id: '5',
      type: 'low',
      title: 'Minor Seismic Activity',
      description: 'Small earthquake cluster detected',
      location: 'San Andreas Fault, California',
      timestamp: '6 hours ago',
      status: 'resolved',
      affectedPopulation: 50000,
      severity: 'Magnitude 3.2',
      category: 'Earthquake',
      source: 'California Seismic Network'
    }
  ];

  const getAlertIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'earthquake':
        return Mountain;
      case 'wildfire':
        return Flame;
      case 'flood':
        return Waves;
      case 'hurricane':
        return Wind;
      case 'tsunami':
        return Waves;
      case 'volcano':
        return Mountain;
      default:
        return AlertTriangle;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-500';
      case 'acknowledged':
        return 'bg-yellow-500';
      case 'resolved':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = selectedFilter === 'all' || alert.type === selectedFilter;
    const matchesSearch = alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    high: alerts.filter(a => a.type === 'high').length,
    medium: alerts.filter(a => a.type === 'medium').length,
    low: alerts.filter(a => a.type === 'low').length,
    active: alerts.filter(a => a.status === 'active').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-poppins">Alert Management</h2>
          <p className="text-sm text-muted-foreground">Real-time disaster alerts and notifications</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{alertStats.total}</div>
              <div className="text-xs text-muted-foreground">Total Alerts</div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">{alertStats.critical}</div>
              <div className="text-xs text-muted-foreground">Critical</div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{alertStats.high}</div>
              <div className="text-xs text-muted-foreground">High</div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{alertStats.medium}</div>
              <div className="text-xs text-muted-foreground">Medium</div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">{alertStats.low}</div>
              <div className="text-xs text-muted-foreground">Low</div>
            </div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 bg-gradient-card border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{alertStats.active}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex items-center space-x-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search alerts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Volume2 className="h-4 w-4 mr-2" />
            Sound On
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Smartphone className="h-4 w-4 mr-2" />
            SMS
          </Button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => {
          const IconComponent = getAlertIcon(alert.category);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
                <div className="flex items-start space-x-4">
                  {/* Alert Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAlertColor(alert.type)}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  
                  {/* Alert Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground font-poppins">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getAlertColor(alert.type)}>
                          {alert.type.toUpperCase()}
                        </Badge>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(alert.status)}`}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{alert.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {alert.affectedPopulation ? `${(alert.affectedPopulation / 1000000).toFixed(1)}M affected` : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{alert.severity}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>Source: {alert.source}</span>
                        <span>Category: {alert.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* No Alerts State */}
      {filteredAlerts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Alerts Found</h3>
          <p className="text-muted-foreground">No alerts match your current filters.</p>
        </motion.div>
      )}
    </div>
  );
}
