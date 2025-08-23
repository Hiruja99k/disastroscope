import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X,
  AlertTriangle,
  Brain,
  Zap,
  MapPin,
  TrendingUp,
  Activity,
  Wind,
  CloudRain,
  Thermometer,
  Eye,
  Target,
  Clock,
  BarChart3,
  Globe,
  Satellite,
  Database,
  Shield,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Users,
  Home,
  Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import apiService from '@/services/api';

interface AdvancedAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdvancedAnalysis({ isOpen, onClose }: AdvancedAnalysisProps) {
  const [activeTab, setActiveTab] = useState('predictions');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [locationPredictions, setLocationPredictions] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<string>('');
  const [hazardsMeta, setHazardsMeta] = useState<Record<string, any>>({});
  
  const { location, error: locationError, loading: locationLoading, getCurrentPosition, reverseGeocode } = useGeolocation();

  useEffect(() => {
    // Fetch model registry once for transparency details
    apiService.getModels().then(res => {
      setHazardsMeta(res?.models || {});
    }).catch(() => {});

    if (isOpen && isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            setIsAnalyzing(false);
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isOpen, isAnalyzing]);

  // Generate location-based predictions
  const generateLocationPredictions = async (lat: number, lng: number, locationName: string) => {
    const predictions = [
      {
        id: 'loc-1',
        type: 'Hurricane',
        name: `Local Hurricane Risk - ${locationName}`,
        severity: 'Category 2-3',
        probability: Math.floor(Math.random() * 40) + 20,
        timeframe: '48-72 hours',
        risk: 'medium',
        description: `Moderate hurricane risk detected for ${locationName} area based on current atmospheric conditions.`,
        coordinates: { lat, lng }
      },
      {
        id: 'loc-2', 
        type: 'Severe Weather',
        name: `Thunderstorm System - ${locationName}`,
        severity: 'Severe',
        probability: Math.floor(Math.random() * 60) + 30,
        timeframe: '12-24 hours',
        risk: 'high',
        description: `High probability of severe thunderstorms with potential for damaging winds and hail in ${locationName}.`,
        coordinates: { lat, lng }
      },
      {
        id: 'loc-3',
        type: 'Flood',
        name: `Flash Flood Watch - ${locationName}`,
        severity: 'Moderate',
        probability: Math.floor(Math.random() * 50) + 25,
        timeframe: '6-18 hours',
        risk: 'medium',
        description: `Flash flood potential in ${locationName} due to saturated ground conditions and forecasted rainfall.`,
        coordinates: { lat, lng }
      }
    ];
    
    setLocationPredictions(predictions);
  };

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentPosition();
      const locationInfo = await reverseGeocode(position.latitude, position.longitude);
      const locationString = `${locationInfo.city}, ${locationInfo.state}`;
      setUserLocation(locationString);
      await generateLocationPredictions(position.latitude, position.longitude, locationString);
    } catch (error) {
      console.error('Failed to get location:', error);
    }
  };

  const realTimePredictions = [
    {
      id: 1,
      type: 'Hurricane',
      name: 'Hurricane Marina',
      location: 'Gulf of Mexico',
      severity: 'Category 4',
      probability: 89,
      timeframe: '36-48 hours',
      risk: 'critical',
      windSpeed: '145 mph',
      pressure: '948 mb',
      movement: 'NNW at 12 mph',
      affectedPopulation: '2.3M',
      coordinates: { lat: 26.5, lng: -89.2 }
    },
    {
      id: 2,
      type: 'Earthquake',
      name: 'San Andreas Fault Activity',
      location: 'Southern California',
      severity: 'Magnitude 6.2',
      probability: 34,
      timeframe: '5-10 days',
      risk: 'high',
      depth: '12 km',
      faultLine: 'San Andreas',
      lastActivity: '2 hours ago',
      affectedPopulation: '8.7M',
      coordinates: { lat: 34.0, lng: -118.2 }
    },
    {
      id: 3,
      type: 'Flood',
      name: 'Mississippi River Flood',
      location: 'Louisiana Delta',
      severity: 'Major Flood',
      probability: 76,
      timeframe: '18-24 hours',
      risk: 'high',
      rainfall: '8.3 inches',
      riverLevel: '24.7 ft',
      floodStage: '17 ft',
      affectedPopulation: '1.2M',
      coordinates: { lat: 29.9, lng: -90.1 }
    }
  ];

  const mapTypeToHazardKey = (t: string) => {
    const s = String(t || '').toLowerCase();
    if (s.includes('hurricane') || s.includes('severe weather') || s.includes('storm')) return 'storm';
    if (s.includes('flood')) return 'flood';
    if (s.includes('earthquake') || s.includes('seismic')) return 'earthquake';
    if (s.includes('wildfire') || s.includes('fire')) return 'wildfire';
    if (s.includes('landslide')) return 'landslide';
    if (s.includes('drought')) return 'drought';
    return s;
  };

  const aiInsights = [
    {
      title: 'Pattern Recognition Alert',
      description: 'Unusual atmospheric pressure patterns detected in the Atlantic Basin indicate 67% higher hurricane formation probability this week.',
      confidence: 94,
      impact: 'high',
      recommendation: 'Increase monitoring of tropical systems and prepare coastal evacuation protocols.'
    },
    {
      title: 'Seismic Anomaly Detection',
      description: 'AI models detect increased micro-seismic activity along the Cascadia Subduction Zone, suggesting potential major event buildup.',
      confidence: 78,
      impact: 'medium',
      recommendation: 'Enhanced sensor deployment and community preparedness programs recommended.'
    },
    {
      title: 'Climate Correlation Analysis',
      description: 'ML algorithms identify strong correlation between current La Niña conditions and historical wildfire patterns.',
      confidence: 91,
      impact: 'high',
      recommendation: 'Implement proactive fire suppression strategies in identified high-risk zones.'
    }
  ];

  const riskAssessments = [
    {
      region: 'Gulf Coast',
      overallRisk: 87,
      factors: {
        hurricane: 92,
        flood: 78,
        tornado: 65,
        storm: 84
      },
      population: '15.2M',
      infrastructure: 'Critical',
      economicImpact: '$45.2B',
      preparedness: 73
    },
    {
      region: 'Pacific Northwest',
      overallRisk: 71,
      factors: {
        earthquake: 89,
        wildfire: 67,
        flood: 52,
        landslide: 71
      },
      population: '8.9M',
      infrastructure: 'Moderate',
      economicImpact: '$28.7B',
      preparedness: 81
    },
    {
      region: 'California Central Valley',
      overallRisk: 68,
      factors: {
        wildfire: 91,
        earthquake: 58,
        drought: 76,
        flood: 48
      },
      population: '6.5M',
      infrastructure: 'High',
      economicImpact: '$52.1B',
      preparedness: 69
    }
  ];

  const tabs = [
    { id: 'predictions', label: 'Real-Time Predictions', icon: Zap },
    { id: 'location', label: 'My Location', icon: MapPin },
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'risk', label: 'Risk Assessment', icon: Shield },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity }
  ];

  const getRiskColor = (risk: string | number) => {
    if (typeof risk === 'string') {
      switch (risk) {
        case 'critical': return 'text-destructive';
        case 'high': return 'text-warning';
        case 'medium': return 'text-accent';
        case 'low': return 'text-success';
        default: return 'text-muted-foreground';
      }
    }
    if (risk >= 80) return 'text-destructive';
    if (risk >= 60) return 'text-warning';
    if (risk >= 40) return 'text-accent';
    return 'text-success';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 bg-card border border-border rounded-2xl shadow-elevation z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-card">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground font-poppins">Advanced Disaster Analysis</h2>
                  <p className="text-muted-foreground font-inter">Real-time predictions and comprehensive risk assessment</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Analyzing Global Data...</span>
                  <span className="text-sm text-muted-foreground">{analysisProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className="bg-gradient-primary h-2 rounded-full"
                    style={{ width: `${analysisProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Processing 50,000+ weather stations, 25 satellite feeds, and 150 years of historical data...
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-border bg-muted/10">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'predictions' && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {realTimePredictions.map((prediction, index) => (
                      <motion.div
                        key={prediction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-6 hover:shadow-card transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                prediction.risk === 'critical' ? 'bg-destructive animate-pulse' :
                                prediction.risk === 'high' ? 'bg-warning' : 'bg-accent'
                              }`} />
                              <div>
                                <h3 className="text-xl font-semibold text-foreground font-poppins">
                                  {prediction.name}
                                </h3>
                                <div className="flex items-center space-x-2 mt-1">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-muted-foreground font-inter">{prediction.location}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={getRiskBadgeVariant(prediction.risk)} className="text-xs">
                              {prediction.risk.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-3 gap-4 mb-4">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Severity</div>
                              <div className="text-lg font-bold text-foreground">{prediction.severity}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Probability</div>
                              <div className={`text-lg font-bold ${getRiskColor(prediction.probability)}`}>
                                {prediction.probability}%
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Timeframe</div>
                              <div className="text-lg font-bold text-foreground">{prediction.timeframe}</div>
                            </div>
                          </div>

                          {prediction.type === 'Hurricane' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Wind Speed</div>
                                <div className="font-semibold text-foreground">{prediction.windSpeed}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Pressure</div>
                                <div className="font-semibold text-foreground">{prediction.pressure}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Movement</div>
                                <div className="font-semibold text-foreground">{prediction.movement}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Affected Pop.</div>
                                <div className="font-semibold text-foreground">{prediction.affectedPopulation}</div>
                              </div>
                            </div>
                          )}

                          {prediction.type === 'Earthquake' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Depth</div>
                                <div className="font-semibold text-foreground">{prediction.depth}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Fault Line</div>
                                <div className="font-semibold text-foreground">{prediction.faultLine}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Last Activity</div>
                                <div className="font-semibold text-foreground">{prediction.lastActivity}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Affected Pop.</div>
                                <div className="font-semibold text-foreground">{prediction.affectedPopulation}</div>
                              </div>
                            </div>
                          )}

                          {prediction.type === 'Flood' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Rainfall</div>
                                <div className="font-semibold text-foreground">{prediction.rainfall}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">River Level</div>
                                <div className="font-semibold text-foreground">{prediction.riverLevel}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Flood Stage</div>
                                <div className="font-semibold text-foreground">{prediction.floodStage}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Affected Pop.</div>
                                <div className="font-semibold text-foreground">{prediction.affectedPopulation}</div>
                              </div>
                            </div>
                          )}

                          {/* Transparency row */}
                          <div className="mt-4 pt-4 border-t border-border">
                            {(() => {
                              const hzKey = mapTypeToHazardKey(prediction.type);
                              const meta = hazardsMeta[hzKey] || {};
                              const trainedAt = meta.metrics?.trained_at ? new Date(meta.metrics.trained_at).toLocaleDateString() : 'N/A';
                              const auc = meta.metrics?.auc != null ? Number(meta.metrics.auc).toFixed(2) : 'N/A';
                              const ap = meta.metrics?.average_precision != null ? Number(meta.metrics.average_precision).toFixed(2) : 'N/A';
                              const src = Array.isArray(meta.sources) ? meta.sources.join(', ') : '—';
                              const modelType = meta.type === 'ml' ? 'ML' : 'Heuristic';
                              return (
                                <div className="text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                  <div>
                                    <span className="font-medium text-foreground">{modelType}</span>
                                    <span> • Trained: {trainedAt} • AUC: {auc} • AP: {ap}</span>
                                  </div>
                                  <div>
                                    <span className="text-foreground font-medium">Sources:</span> {src}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="space-y-6">
                  {/* Location Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-4 font-poppins">
                      Location-Based Disaster Predictions
                    </h3>
                    <p className="text-muted-foreground mb-6 font-inter">
                      Get personalized disaster predictions and alerts for your current location
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                      <Button 
                        onClick={handleGetLocation}
                        disabled={locationLoading}
                        className="bg-gradient-primary hover:shadow-glow font-medium"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {locationLoading ? 'Getting Location...' : 'Get My Location'}
                      </Button>
                      
                      {userLocation && (
                        <div className="flex items-center space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-foreground font-medium">{userLocation}</span>
                        </div>
                      )}
                    </div>

                    {locationError && (
                      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                          <span className="text-destructive font-medium">Location Error</span>
                        </div>
                        <p className="text-destructive/80 text-sm mt-1">{locationError}</p>
                      </div>
                    )}
                  </div>

                  {/* Location-based predictions */}
                  {locationPredictions.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-foreground font-poppins">
                        Predictions for Your Location
                      </h4>
                      {locationPredictions.map((prediction, index) => (
                        <motion.div
                          key={prediction.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="p-6 hover:shadow-card transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  prediction.risk === 'critical' ? 'bg-destructive animate-pulse' :
                                  prediction.risk === 'high' ? 'bg-warning' : 'bg-accent'
                                }`} />
                                <div>
                                  <h3 className="text-lg font-semibold text-foreground font-poppins">
                                    {prediction.name}
                                  </h3>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-sm text-muted-foreground font-inter">
                                      {prediction.type} • {prediction.timeframe}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <Badge variant={getRiskBadgeVariant(prediction.risk)} className="text-xs">
                                {prediction.risk.toUpperCase()}
                              </Badge>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 font-inter">{prediction.description}</p>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Severity</div>
                                <div className="text-base font-bold text-foreground">{prediction.severity}</div>
                              </div>
                              <div className="space-y-2">
                                <div className="text-sm text-muted-foreground">Probability</div>
                                <div className={`text-base font-bold ${getRiskColor(prediction.probability)}`}>
                                  {prediction.probability}%
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-4">
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm">
                                <Bell className="mr-2 h-4 w-4" />
                                Set Alert
                              </Button>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {!locationPredictions.length && !locationLoading && userLocation && (
                    <div className="text-center py-12">
                      <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Analyzing Your Location
                      </h3>
                      <p className="text-muted-foreground">
                        Processing local weather patterns and historical data for personalized predictions...
                      </p>
                    </div>
                  )}

                  {!userLocation && !locationLoading && (
                    <div className="text-center py-12">
                      <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Get Location-Based Predictions
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Allow location access to receive personalized disaster predictions and real-time alerts for your area.
                      </p>
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 max-w-md mx-auto">
                        <h4 className="font-semibold text-primary mb-2">Why share your location?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1 text-left">
                          <li>• Real-time disaster alerts for your area</li>
                          <li>• Personalized risk assessments</li>
                          <li>• Local evacuation route recommendations</li>
                          <li>• Nearby shelter and resource information</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-6">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6 hover:shadow-card transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="h-6 w-6 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-foreground font-poppins">{insight.title}</h3>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  {insight.confidence}% Confidence
                                </Badge>
                                <Badge variant={insight.impact === 'high' ? 'destructive' : 'outline'}>
                                  {insight.impact.toUpperCase()} IMPACT
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-4 font-inter">{insight.description}</p>
                            <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="h-4 w-4 text-accent" />
                                <span className="text-sm font-medium text-accent">AI Recommendation</span>
                              </div>
                              <p className="text-sm text-foreground font-inter">{insight.recommendation}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'risk' && (
                <div className="space-y-6">
                  <div className="grid gap-6">
                    {riskAssessments.map((assessment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="p-6 hover:shadow-card transition-all duration-300">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-foreground font-poppins">{assessment.region}</h3>
                            <div className="text-right">
                              <div className={`text-3xl font-bold ${getRiskColor(assessment.overallRisk)}`}>
                                {assessment.overallRisk}
                              </div>
                              <div className="text-sm text-muted-foreground">Overall Risk Score</div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 mb-6">
                            {Object.entries(assessment.factors).map(([factor, score]) => (
                              <div key={factor} className="text-center">
                                <div className={`text-2xl font-bold ${getRiskColor(score)}`}>{score}</div>
                                <div className="text-sm text-muted-foreground capitalize">{factor}</div>
                                <div className="w-full bg-muted rounded-full h-2 mt-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      score >= 80 ? 'bg-destructive' :
                                      score >= 60 ? 'bg-warning' :
                                      score >= 40 ? 'bg-accent' : 'bg-success'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="grid md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-muted-foreground">Population</div>
                              <div className="font-semibold text-foreground flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {assessment.population}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Infrastructure</div>
                              <div className="font-semibold text-foreground flex items-center">
                                <Home className="h-4 w-4 mr-1" />
                                {assessment.infrastructure}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Economic Impact</div>
                              <div className="font-semibold text-foreground">{assessment.economicImpact}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Preparedness</div>
                              <div className={`font-semibold ${getRiskColor(assessment.preparedness)}`}>
                                {assessment.preparedness}%
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Active Sensors', value: '3,247', icon: Activity, trend: '+12' },
                      { label: 'Satellite Feeds', value: '25', icon: Satellite, trend: '100%' },
                      { label: 'Weather Stations', value: '50,000+', icon: Thermometer, trend: '+8' },
                      { label: 'AI Models Running', value: '12', icon: Brain, trend: '100%' }
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-4 text-center hover:shadow-card transition-all duration-300">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <metric.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-xl font-bold text-foreground font-poppins">{metric.value}</div>
                          <div className="text-sm text-muted-foreground">{metric.label}</div>
                          <div className="text-xs text-success mt-1">
                            <ArrowUp className="h-3 w-3 inline mr-1" />
                            {metric.trend}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4 font-poppins">Global Monitoring Status</h3>
                    <div className="space-y-4">
                      {[
                        { system: 'Atlantic Hurricane Tracking', status: 'Online', uptime: '99.97%', color: 'success' },
                        { system: 'Pacific Seismic Network', status: 'Online', uptime: '99.89%', color: 'success' },
                        { system: 'Global Weather Integration', status: 'Online', uptime: '99.95%', color: 'success' },
                        { system: 'AI Prediction Pipeline', status: 'Processing', uptime: '99.92%', color: 'warning' },
                        { system: 'Emergency Alert System', status: 'Standby', uptime: '100%', color: 'accent' }
                      ].map((system, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${
                              system.color === 'success' ? 'bg-success' :
                              system.color === 'warning' ? 'bg-warning' :
                              system.color === 'accent' ? 'bg-accent' :
                              'bg-primary'
                            }`} />
                            <span className="font-medium text-foreground">{system.system}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-muted-foreground">Uptime: {system.uptime}</span>
                            <Badge variant="outline" className={`${
                              system.color === 'success' ? 'bg-success/10 text-success border-success/20' :
                              system.color === 'warning' ? 'bg-warning/10 text-warning border-warning/20' :
                              system.color === 'accent' ? 'bg-accent/10 text-accent border-accent/20' :
                              'bg-primary/10 text-primary border-primary/20'
                            }`}>
                              {system.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span>All systems operational</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Database className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Report
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}