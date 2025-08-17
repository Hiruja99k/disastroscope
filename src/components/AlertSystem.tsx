import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  AlertOctagon,
  X,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Zap,
  Flame,
  Waves,
  Wind,
  Mountain,
  Globe,
  CheckCircle,
  Info,
  Mail,
  Smartphone,
  Wifi,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Minus,
  Trash2,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DisasterEvent, Prediction } from '@/services/api';

export interface Alert {
  id: string;
  type: 'disaster' | 'prediction' | 'system' | 'weather' | 'seismic' | 'satellite';
  severity: 'info' | 'warning' | 'critical' | 'emergency';
  title: string;
  message: string;
  location?: string;
  coordinates?: { lat: number; lng: number };
  timestamp: Date;
  acknowledged: boolean;
  dismissed: boolean;
  source: string;
  category: string;
  priority: number;
  expiresAt?: Date;
  actions?: AlertAction[];
  metadata?: Record<string, any>;
}

export interface AlertAction {
  id: string;
  label: string;
  action: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  conditions: AlertCondition[];
  actions: AlertAction[];
  priority: number;
  category: string;
}

export interface AlertCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in_range';
  value: any;
  value2?: any; // For range operations
}

interface AlertSystemProps {
  events: DisasterEvent[];
  predictions: Prediction[];
  onAlertAction?: (alertId: string, action: string) => void;
  className?: string;
}

const getSeverityIcon = (severity: Alert['severity']) => {
  switch (severity) {
    case 'emergency': return AlertOctagon;
    case 'critical': return AlertTriangle;
    case 'warning': return AlertCircle;
    case 'info': return Info;
    default: return Bell;
  }
};

const getSeverityColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'emergency': return 'bg-red-600 text-white';
    case 'critical': return 'bg-red-500 text-white';
    case 'warning': return 'bg-yellow-500 text-white';
    case 'info': return 'bg-blue-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getDisasterIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'earthquake': return Zap;
    case 'hurricane': return Wind;
    case 'wildfire': return Flame;
    case 'flood': return Waves;
    case 'tornado': return Wind;
    case 'landslide': return Mountain;
    case 'tsunami': return Waves;
    case 'volcanic': return Mountain;
    default: return Globe;
  }
};

export default function AlertSystem({ events, predictions, onAlertAction, className = '' }: AlertSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoAcknowledge, setAutoAcknowledge] = useState(false);
  const [maxAlerts, setMaxAlerts] = useState(50);
  const [alertTimeout, setAlertTimeout] = useState(300); // 5 minutes
  const { toast } = useToast();

  // Initialize default alert rules
  useEffect(() => {
    const defaultRules: AlertRule[] = [
      {
        id: 'critical-disaster',
        name: 'Critical Disaster Detection',
        enabled: true,
        priority: 1,
        category: 'disaster',
        conditions: [
          { field: 'severity', operator: 'equals', value: 'critical' },
          { field: 'status', operator: 'equals', value: 'active' }
        ],
        actions: []
      },
      {
        id: 'high-probability-prediction',
        name: 'High Probability Predictions',
        enabled: true,
        priority: 2,
        category: 'prediction',
        conditions: [
          { field: 'probability', operator: 'greater_than', value: 0.7 }
        ],
        actions: []
      },
      {
        id: 'new-disaster-event',
        name: 'New Disaster Events',
        enabled: true,
        priority: 3,
        category: 'disaster',
        conditions: [
          { field: 'created_at', operator: 'greater_than', value: new Date(Date.now() - 300000) } // Last 5 minutes
        ],
        actions: []
      },
      {
        id: 'location-based-alerts',
        name: 'Location-Based Alerts',
        enabled: true,
        priority: 4,
        category: 'location',
        conditions: [
          { field: 'location', operator: 'contains', value: 'miami' }
        ],
        actions: []
      }
    ];
    setAlertRules(defaultRules);
  }, []);

  // Generate alerts based on events and predictions
  const generateAlerts = useCallback(() => {
    const newAlerts: Alert[] = [];

    // Process disaster events
    events.forEach(event => {
      // Critical disaster alert
      if (event.severity?.toLowerCase().includes('critical') && event.status === 'active') {
        newAlerts.push({
          id: `event-${event.id}-critical`,
          type: 'disaster',
          severity: 'critical',
          title: `🚨 Critical ${event.event_type} Alert`,
          message: `${event.name} is currently active in ${event.location}. ${event.description || 'Immediate attention required.'}`,
          location: event.location,
          coordinates: event.coordinates,
          timestamp: new Date(),
          acknowledged: false,
          dismissed: false,
          source: event.source || 'Disaster Monitoring System',
          category: 'disaster',
          priority: 1,
          metadata: {
            eventId: event.id,
            affectedPopulation: event.affected_population,
            economicImpact: event.economic_impact,
            magnitude: event.magnitude
          },
          actions: [
            {
              id: 'acknowledge',
              label: 'Acknowledge',
              action: () => acknowledgeAlert(`event-${event.id}-critical`),
              variant: 'outline'
            },
            {
              id: 'view-details',
              label: 'View Details',
              action: () => viewEventDetails(event.id),
              variant: 'default'
            }
          ]
        });
      }

      // New event alert (created in last 5 minutes)
      const eventAge = Date.now() - new Date(event.created_at).getTime();
      if (eventAge < 300000) { // 5 minutes
        newAlerts.push({
          id: `event-${event.id}-new`,
          type: 'disaster',
          severity: 'warning',
          title: `⚠️ New ${event.event_type} Detected`,
          message: `A new ${event.event_type} has been detected in ${event.location}.`,
          location: event.location,
          coordinates: event.coordinates,
          timestamp: new Date(),
          acknowledged: false,
          dismissed: false,
          source: event.source || 'Disaster Monitoring System',
          category: 'disaster',
          priority: 2,
          metadata: { eventId: event.id }
        });
      }
    });

    // Process predictions
    predictions.forEach(prediction => {
      if (prediction.probability && prediction.probability > 0.7) {
        newAlerts.push({
          id: `prediction-${prediction.id}-high-risk`,
          type: 'prediction',
          severity: 'warning',
          title: `🔮 High Risk ${prediction.event_type} Prediction`,
          message: `${Math.round(prediction.probability * 100)}% probability of ${prediction.event_type} in ${prediction.location} within ${prediction.timeframe}.`,
          location: prediction.location,
          coordinates: prediction.coordinates,
          timestamp: new Date(),
          acknowledged: false,
          dismissed: false,
          source: prediction.ai_model || 'AI Prediction System',
          category: 'prediction',
          priority: 2,
          metadata: {
            predictionId: prediction.id,
            probability: prediction.probability,
            timeframe: prediction.timeframe
          },
          actions: [
            {
              id: 'acknowledge',
              label: 'Acknowledge',
              action: () => acknowledgeAlert(`prediction-${prediction.id}-high-risk`),
              variant: 'outline'
            },
            {
              id: 'view-analysis',
              label: 'View Analysis',
              action: () => viewPredictionAnalysis(prediction.id),
              variant: 'default'
            }
          ]
        });
      }
    });

    // System health alerts
    const systemAlerts = generateSystemAlerts();
    newAlerts.push(...systemAlerts);

    // Weather alerts
    const weatherAlerts = generateWeatherAlerts();
    newAlerts.push(...weatherAlerts);

    // Add new alerts to existing ones
    setAlerts(prevAlerts => {
      const combined = [...newAlerts, ...prevAlerts];
      // Remove duplicates based on ID
      const unique = combined.filter((alert, index, self) => 
        index === self.findIndex(a => a.id === alert.id)
      );
      // Limit to maxAlerts
      return unique.slice(0, maxAlerts);
    });

    // Show toast notifications for critical alerts
    newAlerts.forEach(alert => {
      if (alert.severity === 'critical' || alert.severity === 'emergency') {
        toast({
          title: alert.title,
          description: alert.message,
          variant: 'destructive',
          duration: 10000
        });
      }
    });

    // Play sound for critical alerts
    if (soundEnabled && newAlerts.some(a => a.severity === 'critical' || a.severity === 'emergency')) {
      playAlertSound();
    }
  }, [events, predictions, soundEnabled, maxAlerts, toast]);

  // Generate system health alerts
  const generateSystemAlerts = (): Alert[] => {
    const systemAlerts: Alert[] = [];
    
    // Simulate system health issues
    const systemHealth = {
      api: Math.random() > 0.8 ? 'degraded' : 'healthy',
      database: Math.random() > 0.9 ? 'degraded' : 'healthy',
      sensors: Math.random() > 0.85 ? 'degraded' : 'healthy'
    };

    if (systemHealth.api === 'degraded') {
      systemAlerts.push({
        id: `system-api-${Date.now()}`,
        type: 'system',
        severity: 'warning',
        title: '⚠️ API Performance Degraded',
        message: 'External API response times are slower than normal. Some data may be delayed.',
        timestamp: new Date(),
        acknowledged: false,
        dismissed: false,
        source: 'System Monitor',
        category: 'system',
        priority: 3,
        metadata: { component: 'api', responseTime: '2.5s' }
      });
    }

    if (systemHealth.sensors === 'degraded') {
      systemAlerts.push({
        id: `system-sensors-${Date.now()}`,
        type: 'system',
        severity: 'warning',
        title: '⚠️ Sensor Network Issues',
        message: 'Some monitoring sensors are reporting connectivity issues.',
        timestamp: new Date(),
        acknowledged: false,
        dismissed: false,
        source: 'Sensor Network',
        category: 'system',
        priority: 3,
        metadata: { component: 'sensors', offlineCount: 5 }
      });
    }

    return systemAlerts;
  };

  // Generate weather alerts
  const generateWeatherAlerts = (): Alert[] => {
    const weatherAlerts: Alert[] = [];
    
    // Simulate weather conditions that might trigger alerts
    const weatherConditions = [
      { condition: 'severe_storm', probability: Math.random() },
      { condition: 'extreme_temperature', probability: Math.random() },
      { condition: 'heavy_rainfall', probability: Math.random() }
    ];

    weatherConditions.forEach(weather => {
      if (weather.probability > 0.6) {
        weatherAlerts.push({
          id: `weather-${weather.condition}-${Date.now()}`,
          type: 'weather',
          severity: weather.probability > 0.8 ? 'critical' : 'warning',
          title: `🌩️ ${weather.condition.replace('_', ' ').toUpperCase()} Warning`,
          message: `High probability of ${weather.condition.replace('_', ' ')} conditions in the next 24 hours.`,
          timestamp: new Date(),
          acknowledged: false,
          dismissed: false,
          source: 'Weather Service',
          category: 'weather',
          priority: weather.probability > 0.8 ? 1 : 2,
          metadata: { condition: weather.condition, probability: weather.probability }
        });
      }
    });

    return weatherAlerts;
  };

  // Alert actions
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    onAlertAction?.(alertId, 'acknowledge');
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    ));
    onAlertAction?.(alertId, 'dismiss');
  };

  const viewEventDetails = (eventId: string) => {
    // Navigate to event details or open modal
    console.log('Viewing event details:', eventId);
  };

  const viewPredictionAnalysis = (predictionId: string) => {
    // Navigate to prediction analysis or open modal
    console.log('Viewing prediction analysis:', predictionId);
  };

  const playAlertSound = () => {
    // Create and play alert sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    audio.play().catch(() => {
      // Fallback if audio fails
      console.log('Alert sound played');
    });
  };

  // Auto-acknowledge alerts after timeout
  useEffect(() => {
    if (!autoAcknowledge) return;

    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => {
        const age = Date.now() - alert.timestamp.getTime();
        if (age > alertTimeout * 1000 && !alert.acknowledged) {
          return { ...alert, acknowledged: true };
        }
        return alert;
      }));
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoAcknowledge, alertTimeout]);

  // Generate alerts periodically
  useEffect(() => {
    generateAlerts();
    
    const interval = setInterval(generateAlerts, 60000); // Generate alerts every minute
    return () => clearInterval(interval);
  }, [generateAlerts]);

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filterSeverity !== 'all' && alert.severity !== filterSeverity) return false;
    if (filterCategory !== 'all' && alert.category !== filterCategory) return false;
    if (searchTerm && !alert.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alert.message.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return !alert.dismissed;
  });

  const activeAlerts = filteredAlerts.filter(alert => !alert.acknowledged);
  const acknowledgedAlerts = filteredAlerts.filter(alert => alert.acknowledged);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Alert System Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="h-6 w-6 text-primary" />
              {activeAlerts.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {activeAlerts.length}
                </Badge>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">Alert System</h3>
              <p className="text-sm text-muted-foreground">
                {activeAlerts.length} active alerts, {acknowledgedAlerts.length} acknowledged
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlerts([])}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Alert Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterSeverity} onValueChange={setFilterSeverity}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="disaster">Disaster</SelectItem>
              <SelectItem value="prediction">Prediction</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="weather">Weather</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="p-4">
          <h4 className="font-semibold mb-4">Alert Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound Alerts</span>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Acknowledge</span>
                <Switch
                  checked={autoAcknowledge}
                  onCheckedChange={setAutoAcknowledge}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Max Alerts</label>
                <Input
                  type="number"
                  value={maxAlerts}
                  onChange={(e) => setMaxAlerts(Number(e.target.value))}
                  min="10"
                  max="200"
                />
              </div>
              <div>
                <label className="text-sm">Auto Acknowledge Timeout (seconds)</label>
                <Input
                  type="number"
                  value={alertTimeout}
                  onChange={(e) => setAlertTimeout(Number(e.target.value))}
                  min="60"
                  max="3600"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-destructive">Active Alerts ({activeAlerts.length})</h4>
          {activeAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
              onDismiss={() => dismissAlert(alert.id)}
            />
          ))}
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledgedAlerts.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-muted-foreground">Acknowledged Alerts ({acknowledgedAlerts.length})</h4>
          {acknowledgedAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={() => acknowledgeAlert(alert.id)}
              onDismiss={() => dismissAlert(alert.id)}
              acknowledged
            />
          ))}
        </div>
      )}

      {/* No Alerts */}
      {filteredAlerts.length === 0 && (
        <Card className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h4 className="font-semibold mb-2">All Clear</h4>
          <p className="text-muted-foreground">No alerts matching your current filters.</p>
        </Card>
      )}
    </div>
  );
}

// Alert Card Component
interface AlertCardProps {
  alert: Alert;
  onAcknowledge: () => void;
  onDismiss: () => void;
  acknowledged?: boolean;
}

function AlertCard({ alert, onAcknowledge, onDismiss, acknowledged = false }: AlertCardProps) {
  const SeverityIcon = getSeverityIcon(alert.severity);
  const DisasterIcon = getDisasterIcon(alert.category);

  return (
    <Card className={`p-4 transition-all ${acknowledged ? 'opacity-60' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
          <SeverityIcon className="h-4 w-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h5 className="font-semibold text-sm">{alert.title}</h5>
              <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
            </div>
            <div className="flex items-center space-x-1 ml-2">
              {alert.location && (
                <Badge variant="outline" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {alert.location}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {alert.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {alert.timestamp.toLocaleTimeString()}
              </span>
              <span>{alert.source}</span>
            </div>

            <div className="flex items-center space-x-2">
              {alert.actions?.map(action => (
                <Button
                  key={action.id}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={action.action}
                >
                  {action.label}
                </Button>
              ))}
              {!acknowledged && (
                <Button size="sm" variant="outline" onClick={onAcknowledge}>
                  Acknowledge
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={onDismiss}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
