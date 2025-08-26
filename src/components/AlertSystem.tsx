import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin,
  Users,
  Shield,
  Zap,
  Settings,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  Download,
  RefreshCw,
  Volume2,
  VolumeX,
  Star,
  StarOff,
  Send,
  Archive,
  Flag,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Globe,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, subMinutes, subHours, subDays } from 'date-fns';

interface Disaster {
  id: number;
  type: string;
  location: string;
  magnitude: string | number;
  severity: string;
  status: string;
  timestamp: Date;
  affected: number;
  coordinates: [number, number];
}

interface Alert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  priority: number;
  affected: number;
  source: string;
  category: string;
  isRead: boolean;
  isStarred: boolean;
}

interface AlertSystemProps {
  disasters: Disaster[];
}

const AlertSystem: React.FC<AlertSystemProps> = ({ disasters }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    category: 'all'
  });
  const [isMuted, setIsMuted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generate mock alerts from disasters
  useEffect(() => {
    const generateAlerts = () => {
      const alertTypes = ['critical', 'high', 'medium', 'low'];
      const categories = ['Earthquake', 'Flood', 'Wildfire', 'Storm', 'Tsunami', 'Volcano'];
      const sources = ['USGS', 'NOAA', 'NASA', 'Local Sensors', 'Satellite Data'];
      
      const newAlerts: Alert[] = disasters.map((disaster, index) => ({
        id: `alert-${disaster.id}`,
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)] as any,
        title: `${disaster.type} Alert - ${disaster.location}`,
        description: `A ${disaster.type.toLowerCase()} has been detected in ${disaster.location} with magnitude ${disaster.magnitude}. Immediate attention required.`,
        location: disaster.location,
        timestamp: disaster.timestamp,
        status: disaster.status === 'Active' ? 'active' : 'acknowledged',
        priority: Math.floor(Math.random() * 10) + 1,
        affected: disaster.affected,
        source: sources[Math.floor(Math.random() * sources.length)],
        category: disaster.type,
        isRead: false,
        isStarred: Math.random() > 0.8
      }));

      // Add some additional alerts
      const additionalAlerts: Alert[] = [
        {
          id: 'alert-weather-001',
          type: 'high',
          title: 'Severe Weather Warning - California',
          description: 'Heavy rainfall and potential flooding expected in Northern California.',
          location: 'California, USA',
          timestamp: subHours(new Date(), 1),
          status: 'active',
          priority: 8,
          affected: 150000,
          source: 'NOAA',
          category: 'Weather',
          isRead: false,
          isStarred: true
        },
        {
          id: 'alert-seismic-002',
          type: 'medium',
          title: 'Seismic Activity Detected - Japan',
          description: 'Unusual seismic activity detected in the Pacific Ring of Fire region.',
          location: 'Tokyo, Japan',
          timestamp: subMinutes(new Date(), 30),
          status: 'active',
          priority: 6,
          affected: 50000,
          source: 'USGS',
          category: 'Seismic',
          isRead: false,
          isStarred: false
        }
      ];

      setAlerts([...newAlerts, ...additionalAlerts]);
    };

    generateAlerts();
  }, [disasters]);

  // Filter alerts based on current filters and search
  useEffect(() => {
    let filtered = alerts;

    if (filters.type !== 'all') {
      filtered = filtered.filter(alert => alert.type === filters.type);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(alert => alert.status === filters.status);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(alert => alert.category === filters.category);
    }

    if (searchQuery) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, filters, searchQuery]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-blue-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'destructive';
      case 'acknowledged': return 'secondary';
      case 'resolved': return 'default';
      default: return 'outline';
    }
  };

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'acknowledged' as any } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const handleResolve = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' as any } : alert
    ));
    toast.success('Alert resolved');
  };

  const toggleStar = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isStarred: !alert.isStarred } : alert
    ));
  };

  const markAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const sendNotification = (alert: Alert) => {
    toast.success(`Notification sent for: ${alert.title}`);
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Management System
              </CardTitle>
              <CardDescription>
                Real-time disaster alerts and notifications
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {activeAlerts.length} Active
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Bell className="h-3 w-3" />
                {unreadAlerts.length} Unread
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                {isMuted ? 'Unmute' : 'Mute'}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.type === 'critical').length}
                </p>
              </div>
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-2xl font-bold text-green-600">2.3s</p>
              </div>
              <div className="p-2 rounded-full bg-green-100">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Coverage</p>
                <p className="text-2xl font-bold text-purple-600">94.2%</p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search alerts..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        !alert.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      } ${selectedAlert?.id === alert.id ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        setSelectedAlert(alert);
                        markAsRead(alert.id);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{alert.title}</h4>
                              {alert.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {alert.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(alert.timestamp, 'MMM dd, HH:mm')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {alert.affected.toLocaleString()} affected
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getAlertColor(alert.type)}>
                            {alert.type}
                          </Badge>
                          <Badge variant={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Details */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {selectedAlert ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getAlertIcon(selectedAlert.type)}
                          Alert Details
                        </CardTitle>
                        <CardDescription>
                          {selectedAlert.title}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStar(selectedAlert.id)}
                      >
                        {selectedAlert.isStarred ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedAlert.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-medium">{selectedAlert.location}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Source:</span>
                        <p className="font-medium">{selectedAlert.source}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{selectedAlert.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Priority:</span>
                        <p className="font-medium">{selectedAlert.priority}/10</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Affected:</span>
                        <p className="font-medium">{selectedAlert.affected.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Time:</span>
                        <p className="font-medium">{format(selectedAlert.timestamp, 'MMM dd, HH:mm')}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {selectedAlert.status === 'active' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleAcknowledge(selectedAlert.id)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Acknowledge
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolve(selectedAlert.id)}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button size="sm" variant="outline" onClick={() => sendNotification(selectedAlert)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Notify
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button size="sm" variant="outline">
                          <Smartphone className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-600 mb-2">No Alert Selected</h3>
                  <p className="text-sm text-gray-500">
                    Select an alert from the list to view details and take action.
                  </p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem;
