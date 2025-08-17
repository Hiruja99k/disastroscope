import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Brain,
  Zap,
  AlertTriangle,
  CloudRain,
  Wind,
  Thermometer,
  Activity,
  TrendingUp,
  MapPin,
  Calendar,
  BarChart3,
  Satellite,
  Database,
  Target,
  Clock,
  Globe,
  Settings,
  Filter,
  Search,
  Download,
  Share2,
  Eye,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Layers,
  Network,
  Cpu,
  LineChart,
  PieChart,
  BarChart,
  TrendingDown,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  FileText,
  Mail,
  Bell,
  Shield,
  CheckCircle,
  XCircle,
  Loader,
  ExternalLink,
  Info
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { useToast } from '@/hooks/use-toast';

export default function EnhancedPredictions() {
  const [selectedModel, setSelectedModel] = useState('hurricane');
  const [activeTab, setActiveTab] = useState('models');
  const [confidenceThreshold, setConfidenceThreshold] = useState([75]);
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const handleConfigureModels = () => {
    toast({
      title: "Model Configuration",
      description: "Opening advanced model configuration panel..."
    });
  };

  const handleViewDetails = (modelName: string) => {
    toast({
      title: "Model Details",
      description: `Opening detailed view for ${modelName} model...`
    });
  };

  const handleConfigureModel = (modelName: string) => {
    toast({
      title: "Configure Model",
      description: `Opening configuration panel for ${modelName}...`
    });
  };

  const handleRefreshPredictions = () => {
    toast({
      title: "Refreshing Predictions",
      description: "Fetching latest prediction data..."
    });
  };

  const handleExportPredictions = () => {
    toast({
      title: "Export Predictions",
      description: "Downloading prediction data as CSV..."
    });
  };

  const handleViewMap = (location: string) => {
    toast({
      title: "View Map",
      description: `Opening interactive map for ${location}...`
    });
  };

  const handleSendAlert = (prediction: any) => {
    toast({
      title: "Alert Sent",
      description: `Emergency alert sent for ${prediction.type} in ${prediction.location}`
    });
  };

  const handleRunSimulation = () => {
    setIsSimulating(true);
    toast({
      title: "Running Simulation",
      description: "Executing disaster prediction simulation..."
    });
    
    // Simulate processing time
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "Simulation Complete",
        description: "Prediction simulation completed successfully!"
      });
    }, 3000);
  };

  const advancedModels = [
    {
      id: 'hurricane',
      name: 'Hurricane Genesis & Tracking',
      icon: Wind,
      accuracy: '94.2%',
      lastUpdate: '2 hours ago',
      status: 'active',
      description: 'Advanced AI model predicting hurricane formation, intensification, and trajectory using satellite data, atmospheric patterns, and ocean temperatures',
      confidence: 94,
      predictions: 156,
      dataPoints: '2.3M',
      modelType: 'Deep Neural Network',
      trainingData: '50 years',
      updateFrequency: 'Every 6 hours',
      coverage: 'Global oceanic regions',
      features: ['Formation probability', 'Intensity forecasting', 'Track prediction', 'Landfall timing', 'Wind speed analysis'],
      metrics: {
        precision: 92.1,
        recall: 94.8,
        f1Score: 93.4,
        mse: 0.12
      }
    },
    {
      id: 'earthquake',
      name: 'Seismic Risk Assessment',
      icon: Activity,
      accuracy: '87.5%',
      lastUpdate: '30 minutes ago',
      status: 'active',
      description: 'ML algorithms analyzing tectonic movements, foreshock patterns, and historical seismic data for earthquake prediction and risk assessment',
      confidence: 87,
      predictions: 89,
      dataPoints: '1.8M',
      modelType: 'Random Forest Ensemble',
      trainingData: '100 years',
      updateFrequency: 'Every hour',
      coverage: 'Major fault lines worldwide',
      features: ['Magnitude estimation', 'Location precision', 'Timing windows', 'Aftershock analysis', 'Ground motion prediction'],
      metrics: {
        precision: 85.3,
        recall: 89.7,
        f1Score: 87.4,
        mse: 0.18
      }
    },
    {
      id: 'flood',
      name: 'Hydrological Flood Modeling',
      icon: CloudRain,
      accuracy: '91.8%',
      lastUpdate: '1 hour ago',
      status: 'active',
      description: 'Comprehensive hydrological models combining rainfall data, river levels, topography, and drainage systems for accurate flood prediction',
      confidence: 91,
      predictions: 234,
      dataPoints: '3.1M',
      modelType: 'Convolutional Neural Network',
      trainingData: '75 years',
      updateFrequency: 'Every 3 hours',
      coverage: 'Major river basins globally',
      features: ['Water level forecasting', 'Inundation mapping', 'Peak flow timing', 'Evacuation zones', 'Infrastructure impact'],
      metrics: {
        precision: 90.2,
        recall: 93.4,
        f1Score: 91.8,
        mse: 0.14
      }
    },
    {
      id: 'wildfire',
      name: 'Wildfire Behavior Prediction',
      icon: AlertTriangle,
      accuracy: '89.3%',
      lastUpdate: '45 minutes ago',
      status: 'active',
      description: 'Advanced fire behavior models using weather conditions, vegetation data, topography, and historical fire patterns for spread prediction',
      confidence: 89,
      predictions: 178,
      dataPoints: '2.7M',
      modelType: 'Gradient Boosting',
      trainingData: '40 years',
      updateFrequency: 'Every 2 hours',
      coverage: 'Fire-prone regions worldwide',
      features: ['Spread rate prediction', 'Direction analysis', 'Intensity modeling', 'Containment probability', 'Smoke dispersion'],
      metrics: {
        precision: 87.9,
        recall: 90.7,
        f1Score: 89.3,
        mse: 0.16
      }
    },
    {
      id: 'drought',
      name: 'Drought Monitoring System',
      icon: Thermometer,
      accuracy: '85.7%',
      lastUpdate: '3 hours ago',
      status: 'active',
      description: 'Long-term drought prediction using precipitation patterns, soil moisture, temperature data, and agricultural indicators',
      confidence: 85,
      predictions: 67,
      dataPoints: '4.2M',
      modelType: 'Long Short-Term Memory',
      trainingData: '120 years',
      updateFrequency: 'Daily',
      coverage: 'Agricultural regions globally',
      features: ['Severity classification', 'Duration estimation', 'Agricultural impact', 'Water resource analysis', 'Economic modeling'],
      metrics: {
        precision: 83.4,
        recall: 87.9,
        f1Score: 85.6,
        mse: 0.22
      }
    },
    {
      id: 'tsunami',
      name: 'Tsunami Wave Modeling',
      icon: CloudRain,
      accuracy: '96.1%',
      lastUpdate: '15 minutes ago',
      status: 'active',
      description: 'High-precision tsunami wave propagation models using seismic data, bathymetry, and coastal topography for early warning',
      confidence: 96,
      predictions: 12,
      dataPoints: '890K',
      modelType: 'Physics-Informed Neural Network',
      trainingData: '150 years',
      updateFrequency: 'Real-time',
      coverage: 'Pacific and Indian Ocean basins',
      features: ['Wave height prediction', 'Arrival time estimation', 'Coastal impact analysis', 'Inundation mapping', 'Warning optimization'],
      metrics: {
        precision: 95.3,
        recall: 96.8,
        f1Score: 96.0,
        mse: 0.08
      }
    }
  ];

  const recentPredictions = [
    {
      type: 'Hurricane',
      location: 'Gulf of Mexico',
      severity: 'Category 3',
      probability: '78%',
      timeframe: '72-96 hours',
      status: 'high',
      confidence: 94,
      impact: 'Major coastal areas',
      lastUpdate: '2 hours ago',
      modelUsed: 'Hurricane Genesis & Tracking'
    },
    {
      type: 'Earthquake',
      location: 'San Francisco Bay Area',
      severity: 'Magnitude 5.2-6.1',
      probability: '23%',
      timeframe: '7-14 days',
      status: 'medium',
      confidence: 67,
      impact: 'Urban infrastructure',
      lastUpdate: '30 minutes ago',
      modelUsed: 'Seismic Risk Assessment'
    },
    {
      type: 'Flood',
      location: 'Mississippi River Valley',
      severity: 'Moderate to Major',
      probability: '65%',
      timeframe: '24-48 hours',
      status: 'high',
      confidence: 82,
      impact: 'Agricultural regions',
      lastUpdate: '1 hour ago',
      modelUsed: 'Hydrological Flood Modeling'
    },
    {
      type: 'Wildfire',
      location: 'California Central Valley',
      severity: 'High Risk',
      probability: '89%',
      timeframe: '12-24 hours',
      status: 'critical',
      confidence: 91,
      impact: 'Residential communities',
      lastUpdate: '45 minutes ago',
      modelUsed: 'Wildfire Behavior Prediction'
    },
    {
      type: 'Drought',
      location: 'Australian Outback',
      severity: 'Severe',
      probability: '95%',
      timeframe: '30-60 days',
      status: 'high',
      confidence: 88,
      impact: 'Agricultural sector',
      lastUpdate: '3 hours ago',
      modelUsed: 'Drought Monitoring System'
    }
  ];

  const dataMetrics = [
    { label: 'Weather Stations', value: '50,247', icon: Thermometer, change: '+127 this week', status: 'online' },
    { label: 'Satellite Feeds', value: '25', icon: Satellite, change: '100% operational', status: 'excellent' },
    { label: 'Historical Records', value: '150 Years', icon: Database, change: '2.3M new records', status: 'complete' },
    { label: 'ML Models Active', value: '12', icon: Brain, change: '94.2% avg accuracy', status: 'optimized' }
  ];

  const modelPerformance = [
    { period: 'Last 24h', accuracy: 94.2, predictions: 847, alerts: 23 },
    { period: 'Last 7d', accuracy: 93.8, predictions: 5923, alerts: 156 },
    { period: 'Last 30d', accuracy: 94.1, predictions: 24567, alerts: 678 },
    { period: 'Last 90d', accuracy: 93.5, predictions: 78234, alerts: 1934 }
  ];

  const simulationScenarios = [
    {
      name: 'Category 5 Hurricane - East Coast',
      description: 'Simulate a major hurricane making landfall on the US East Coast',
      duration: '7 days',
      complexity: 'High',
      dataPoints: '2.3M'
    },
    {
      name: 'Magnitude 8.0 Earthquake - Pacific Ring',
      description: 'Major earthquake simulation with tsunami potential',
      duration: '3 days',
      complexity: 'Very High',
      dataPoints: '1.8M'
    },
    {
      name: 'Flash Flood - Urban Environment',
      description: 'Urban flash flooding scenario with infrastructure impact',
      duration: '24 hours',
      complexity: 'Medium',
      dataPoints: '890K'
    },
    {
      name: 'Wildfire Complex - Multi-State',
      description: 'Large-scale wildfire affecting multiple states',
      duration: '14 days',
      complexity: 'High',
      dataPoints: '1.2M'
    }
  ];

  const runSimulation = (scenario: string) => {
    setIsSimulating(true);
    toast({
      title: "Simulation Started",
      description: `Running ${scenario} simulation...`,
    });
    
    setTimeout(() => {
      setIsSimulating(false);
      toast({
        title: "Simulation Complete",
        description: "Results are ready for analysis.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Enhanced Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3"></div>
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-8">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-lg mb-6">
              <Brain className="mr-2 h-5 w-5" />
              Advanced AI Disaster Prediction Platform
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 font-poppins">
              Next-Generation Prediction Models
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter leading-relaxed">
              Harness the power of artificial intelligence and machine learning to predict natural disasters 
              with unprecedented accuracy using real-time data, advanced algorithms, and comprehensive historical patterns.
            </p>
          </div>

          {/* Control Panel */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Confidence Threshold:</label>
                <div className="w-32">
                  <Slider
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-muted-foreground">{confidenceThreshold[0]}%</span>
              </div>
            </div>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Next 24 Hours</SelectItem>
                <SelectItem value="7d">Next 7 Days</SelectItem>
                <SelectItem value="30d">Next 30 Days</SelectItem>
                <SelectItem value="90d">Next 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-48">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global Coverage</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Enhanced Data Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {dataMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
            >
              <Card className="p-6 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 text-center group">
                <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <metric.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-foreground font-poppins">{metric.value}</div>
                <div className="text-sm text-muted-foreground font-inter mb-2">{metric.label}</div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                  {metric.change}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Advanced Tabs System */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-12 bg-card">
            <TabsTrigger value="models" className="flex items-center space-x-2 text-lg py-4">
              <Brain className="h-5 w-5" />
              <span>AI Models</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2 text-lg py-4">
              <Target className="h-5 w-5" />
              <span>Live Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="simulation" className="flex items-center space-x-2 text-lg py-4">
              <Play className="h-5 w-5" />
              <span>Simulation</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 text-lg py-4">
              <BarChart3 className="h-5 w-5" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* AI Models Tab */}
          <TabsContent value="models">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground font-poppins">Active Prediction Models</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search models..." className="pl-10 w-64" />
                  </div>
                  <Button onClick={handleConfigureModels} variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {advancedModels.map((model, index) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                    onClick={() => setSelectedModel(model.id)}
                    className="cursor-pointer"
                  >
                    <Card className={`p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 ${
                      selectedModel === model.id ? 'ring-2 ring-primary/50 shadow-glow' : ''
                    }`}>
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                              <model.icon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-foreground font-poppins">{model.name}</h3>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse"></div>
                                  {model.status}
                                </Badge>
                                <Badge variant="outline">{model.modelType}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary font-poppins">{model.accuracy}</div>
                            <div className="text-sm text-muted-foreground">Accuracy</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground font-inter leading-relaxed">{model.description}</p>

                        {/* Model Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Precision</span>
                              <span className="text-sm font-medium">{model.metrics.precision}%</span>
                            </div>
                            <Progress value={model.metrics.precision} className="h-2" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Recall</span>
                              <span className="text-sm font-medium">{model.metrics.recall}%</span>
                            </div>
                            <Progress value={model.metrics.recall} className="h-2" />
                          </div>
                        </div>

                        {/* Key Features */}
                        <div>
                          <h4 className="font-semibold text-foreground mb-3">Key Capabilities</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {model.features.slice(0, 4).map((feature, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-success" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Model Stats */}
                        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-border/50">
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">{model.predictions}</div>
                            <div className="text-xs text-muted-foreground">Predictions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">{model.dataPoints}</div>
                            <div className="text-xs text-muted-foreground">Data Points</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">{model.trainingData}</div>
                            <div className="text-xs text-muted-foreground">Training Data</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-foreground">{model.confidence}%</div>
                            <div className="text-xs text-muted-foreground">Confidence</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Updated {model.lastUpdate}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button onClick={() => handleViewDetails(model.name)} variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Details
                            </Button>
                            <Button onClick={() => handleConfigureModel(model.name)} variant="ghost" size="sm">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Live Predictions Tab */}
          <TabsContent value="predictions">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground font-poppins">Active Predictions</h2>
                <div className="flex space-x-2">
                  <Button onClick={handleRefreshPredictions} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button onClick={handleExportPredictions} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="space-y-6">
                {recentPredictions.map((prediction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-8 bg-card border-border/50 hover:shadow-card transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className={`w-4 h-4 rounded-full ${
                            prediction.status === 'critical' ? 'bg-destructive animate-pulse' :
                            prediction.status === 'high' ? 'bg-destructive' : 
                            prediction.status === 'medium' ? 'bg-warning' : 'bg-success'
                          }`}></div>
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground font-poppins">
                              {prediction.type} - {prediction.location}
                            </h3>
                            <p className="text-muted-foreground font-inter">
                              {prediction.severity} • {prediction.probability} probability • {prediction.timeframe}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Model: {prediction.modelUsed}</span>
                              <span>•</span>
                              <span>Confidence: {prediction.confidence}%</span>
                              <span>•</span>
                              <span>Impact: {prediction.impact}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right space-y-2">
                            <Badge variant={prediction.status === 'critical' ? 'destructive' : 
                              prediction.status === 'high' ? 'destructive' :
                              prediction.status === 'medium' ? 'outline' : 'outline'} className="text-sm">
                              {prediction.status.toUpperCase()}
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              Updated {prediction.lastUpdate}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button onClick={() => handleViewMap(prediction.location)} variant="outline" size="sm">
                              <MapPin className="mr-2 h-4 w-4" />
                              View Map
                            </Button>
                            <Button onClick={() => handleSendAlert(prediction)} variant="outline" size="sm">
                              <Bell className="mr-2 h-4 w-4" />
                              Alert
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Simulation Tab */}
          <TabsContent value="simulation">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground font-poppins">Disaster Simulation Center</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Run advanced simulations to test response scenarios and model potential disaster impacts
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {simulationScenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                  >
                    <Card className="p-6 bg-card border-border/50 hover:shadow-card transition-all duration-300">
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-foreground font-poppins">{scenario.name}</h3>
                        <p className="text-muted-foreground">{scenario.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Duration</span>
                            <div className="font-medium text-foreground">{scenario.duration}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Complexity</span>
                            <div className="font-medium text-foreground">{scenario.complexity}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Data Points</span>
                            <div className="font-medium text-foreground">{scenario.dataPoints}</div>
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          onClick={() => runSimulation(scenario.name)}
                          disabled={isSimulating}
                        >
                          {isSimulating ? (
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          {isSimulating ? 'Running...' : 'Start Simulation'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="text-3xl font-bold text-foreground font-poppins">Model Performance Analytics</h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="p-6 bg-card border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Performance Over Time</h3>
                  <div className="space-y-4">
                    {modelPerformance.map((period, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{period.period}</div>
                          <div className="text-sm text-muted-foreground">{period.predictions} predictions</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">{period.accuracy}%</div>
                          <div className="text-sm text-muted-foreground">{period.alerts} alerts</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6 bg-card border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-4">System Health</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Overall System Health</span>
                        <span className="text-sm font-medium">98.7%</span>
                      </div>
                      <Progress value={98.7} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Data Quality Score</span>
                        <span className="text-sm font-medium">96.3%</span>
                      </div>
                      <Progress value={96.3} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Model Accuracy</span>
                        <span className="text-sm font-medium">94.2%</span>
                      </div>
                      <Progress value={94.2} className="h-3" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Response Time</span>
                        <span className="text-sm font-medium">99.1%</span>
                      </div>
                      <Progress value={99.1} className="h-3" />
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Advanced Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 space-y-12"
        >
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-poppins">
              Advanced AI-Powered Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Explore cutting-edge capabilities that go beyond traditional prediction models
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Real-time AI Model Training */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Cpu className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Real-time AI Training</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Continuously improve prediction accuracy with live model training using real-time data streams
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Training Status</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Model Version</span>
                      <span className="font-medium">v2.4.7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last Update</span>
                      <span className="font-medium">2 min ago</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Configure Training
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Predictive Analytics Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <LineChart className="h-6 w-6 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Predictive Analytics</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Advanced statistical analysis and trend prediction with interactive visualizations
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Prediction Horizon</span>
                      <span className="font-medium">72 hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Level</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Data Sources</span>
                      <span className="font-medium">12 active</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Multi-Model Ensemble */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <Network className="h-6 w-6 text-purple-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Ensemble Analysis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Combine multiple AI models for enhanced accuracy and reduced uncertainty
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Active Models</span>
                      <span className="font-medium">8 models</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ensemble Weight</span>
                      <span className="font-medium">Optimized</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Variance Reduction</span>
                      <span className="font-medium">23%</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Layers className="mr-2 h-4 w-4" />
                    Manage Models
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Risk Assessment Matrix */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-red-500/10 rounded-lg">
                      <Target className="h-6 w-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Risk Matrix</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Comprehensive risk assessment with probability-impact analysis and mitigation strategies
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Risk Categories</span>
                      <span className="font-medium">15 types</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>High Risk Areas</span>
                      <span className="font-medium">3 detected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mitigation Plans</span>
                      <span className="font-medium">12 active</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Shield className="mr-2 h-4 w-4" />
                    Assess Risks
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Climate Pattern Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <Globe className="h-6 w-6 text-cyan-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Climate Patterns</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Advanced climate pattern recognition and long-term trend analysis
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Pattern Types</span>
                      <span className="font-medium">8 detected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Trend Confidence</span>
                      <span className="font-medium">89.7%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Historical Data</span>
                      <span className="font-medium">50+ years</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Analyze Patterns
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Emergency Response Planning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-orange-500/10 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">Response Planning</h3>
                  </div>
                  <p className="text-muted-foreground">
                    AI-powered emergency response planning with resource optimization
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Response Plans</span>
                      <span className="font-medium">25 templates</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Resource Allocation</span>
                      <span className="font-medium">Optimized</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span className="font-medium">5 min</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Bell className="mr-2 h-4 w-4" />
                    Plan Response
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Advanced Controls Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="bg-gradient-card p-8 rounded-2xl shadow-elevation border border-border/50"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Model Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Confidence Threshold</label>
                    <Slider
                      value={confidenceThreshold}
                      onValueChange={setConfidenceThreshold}
                      max={100}
                      min={50}
                      step={5}
                      className="mt-2"
                    />
                    <div className="text-sm text-muted-foreground mt-1">
                      {confidenceThreshold[0]}% confidence required
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Time Range</label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24h">24 Hours</SelectItem>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Data Sources</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Satellite className="h-4 w-4 text-primary" />
                      <span className="text-sm">Satellite Data</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-primary" />
                      <span className="text-sm">Seismic Sensors</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="h-4 w-4 text-primary" />
                      <span className="text-sm">Weather Stations</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-600">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-foreground">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh Models
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Report
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}