import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Globe
} from 'lucide-react';
import { useState } from 'react';
import AdvancedAnalysis from '@/components/AdvancedAnalysis';

export default function Predictions() {
  const [selectedModel, setSelectedModel] = useState('hurricane');
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);

  const models = [
    {
      id: 'hurricane',
      name: 'Hurricane Prediction',
      icon: Wind,
      accuracy: '94.2%',
      lastUpdate: '2 hours ago',
      status: 'active',
      description: 'Advanced AI model predicting hurricane formation and trajectory using satellite data and atmospheric patterns'
    },
    {
      id: 'earthquake',
      name: 'Seismic Activity',
      icon: Activity,
      accuracy: '87.5%',
      lastUpdate: '30 minutes ago',
      status: 'active',
      description: 'ML algorithms analyzing tectonic movements and historical seismic data for earthquake prediction'
    },
    {
      id: 'flood',
      name: 'Flood Risk Assessment',
      icon: CloudRain,
      accuracy: '91.8%',
      lastUpdate: '1 hour ago',
      status: 'active',
      description: 'Hydrological models combining rainfall data, topography, and drainage systems for flood prediction'
    },
    {
      id: 'wildfire',
      name: 'Wildfire Spread',
      icon: AlertTriangle,
      accuracy: '89.3%',
      lastUpdate: '45 minutes ago',
      status: 'active',
      description: 'Fire behavior models using weather conditions, vegetation data, and historical fire patterns'
    }
  ];

  const recentPredictions = [
    {
      type: 'Hurricane',
      location: 'Gulf of Mexico',
      severity: 'Category 3',
      probability: '78%',
      timeframe: '72-96 hours',
      status: 'high'
    },
    {
      type: 'Earthquake',
      location: 'San Francisco Bay',
      severity: 'Magnitude 5.2',
      probability: '23%',
      timeframe: '7-14 days',
      status: 'medium'
    },
    {
      type: 'Flood',
      location: 'Mississippi Valley',
      severity: 'Moderate',
      probability: '65%',
      timeframe: '24-48 hours',
      status: 'high'
    }
  ];

  const dataMetrics = [
    { label: 'Weather Stations', value: '50,000+', icon: Thermometer },
    { label: 'Satellite Feeds', value: '25', icon: Satellite },
    { label: 'Historical Records', value: '150 Years', icon: Database },
    { label: 'ML Models Active', value: '12', icon: Brain }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 mb-4">
              <Brain className="mr-2 h-4 w-4" />
              AI-Powered Disaster Prediction
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 font-poppins">
              Advanced Prediction Models
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Harness the power of artificial intelligence and machine learning to predict natural disasters 
              with unprecedented accuracy using real-time data and historical patterns.
            </p>
          </div>
        </motion.div>

        {/* Data Metrics */}
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
              <Card className="p-6 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <metric.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground font-poppins">{metric.value}</div>
                <div className="text-sm text-muted-foreground font-inter">{metric.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Prediction Models */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 font-poppins">Active Prediction Models</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                onClick={() => setSelectedModel(model.id)}
                className="cursor-pointer"
              >
                <Card className={`p-6 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 ${
                  selectedModel === model.id ? 'ring-2 ring-primary/50 shadow-glow' : ''
                }`}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <model.icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-foreground font-poppins">{model.name}</h3>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                              {model.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary font-poppins">{model.accuracy}</div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                      </div>
                    </div>
                    <p className="text-muted-foreground font-inter">{model.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {model.lastUpdate}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 font-poppins">Recent Predictions</h2>
          <div className="space-y-4">
            {recentPredictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
              >
                <Card className="p-6 bg-card border-border/50 hover:shadow-card transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        prediction.status === 'high' ? 'bg-destructive' : 
                        prediction.status === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}></div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground font-poppins">
                          {prediction.type} - {prediction.location}
                        </h3>
                        <p className="text-muted-foreground font-inter">
                          {prediction.severity} • {prediction.probability} probability • {prediction.timeframe}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={prediction.status === 'high' ? 'destructive' : 
                        prediction.status === 'medium' ? 'outline' : 'outline'}>
                        {prediction.status.toUpperCase()}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MapPin className="mr-2 h-4 w-4" />
                        View Map
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="bg-gradient-card p-8 lg:p-12 rounded-2xl shadow-elevation border border-border/50 text-center"
        >
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground font-poppins">
              Ready to Access Advanced Predictions?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
              Get real-time disaster predictions, AI-powered insights, and comprehensive risk assessments 
              to protect your community and assets.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow font-medium"
                onClick={() => setIsAnalysisOpen(true)}
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Start Analysis
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-medium">
                <Calendar className="mr-2 h-5 w-5" />
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Analysis Modal */}
      <AdvancedAnalysis 
        isOpen={isAnalysisOpen} 
        onClose={() => setIsAnalysisOpen(false)} 
      />
    </div>
  );
}