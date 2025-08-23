import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Globe, 
  Satellite, 
  Layers, 
  AlertTriangle, 
  TrendingUp,
  Zap,
  Shield,
  Activity,
  BarChart3,
  Clock,
  Users
} from 'lucide-react';
import AdvancedInteractiveMap from '@/components/AdvancedInteractiveMap';
import { trackEvent } from '@/utils/monitoring';

export default function AdvancedMapPage() {
  const handleFeatureClick = (feature: string) => {
    trackEvent('map_feature_clicked', { feature });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Globe className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground font-poppins">
                Advanced Interactive Map
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real-time disaster monitoring with AI-powered predictions, weather overlays, and sensor network visualization
            </p>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Satellite className="h-3 w-3 mr-1" />
                Satellite View
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Activity className="h-3 w-3 mr-1" />
                Real-time Data
              </Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                <TrendingUp className="h-3 w-3 mr-1" />
                AI Predictions
              </Badge>
              <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                <Layers className="h-3 w-3 mr-1" />
                Multi-layer
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Map Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-border/50"
          >
            <AdvancedInteractiveMap />
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground font-poppins mb-4">
              Enterprise Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced capabilities for professional disaster monitoring and analysis
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-time Monitoring */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Activity className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-xl">Real-time Monitoring</CardTitle>
                  </div>
                  <CardDescription>
                    Live tracking of active disasters with instant updates and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Instant disaster detection
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Severity classification
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      Location tracking
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Predictions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">AI Predictions</CardTitle>
                  </div>
                  <CardDescription>
                    Machine learning models predict potential disaster events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Risk assessment
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Probability mapping
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      Early warning systems
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weather Integration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <CardTitle className="text-xl">Weather Integration</CardTitle>
                  </div>
                  <CardDescription>
                    Comprehensive weather data overlay for enhanced analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      Temperature mapping
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      Precipitation tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                      Wind patterns
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sensor Network */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-xl">Sensor Network</CardTitle>
                  </div>
                  <CardDescription>
                    Global network of environmental sensors for data collection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Seismic monitoring
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Environmental sensors
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Real-time data feeds
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Multi-layer Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-xl">Multi-layer View</CardTitle>
                  </div>
                  <CardDescription>
                    Customizable layers for different data visualization needs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Layer toggling
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Opacity controls
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      Custom overlays
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <CardTitle className="text-xl">Performance Metrics</CardTitle>
                  </div>
                  <CardDescription>
                    Real-time system performance and data processing metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Response times
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      Data accuracy
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      System uptime
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Ready to Experience Enterprise-Level Disaster Monitoring?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Access advanced features, real-time data, and AI-powered predictions to stay ahead of natural disasters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:shadow-glow"
                    onClick={() => handleFeatureClick('dashboard')}
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Go to Dashboard
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => handleFeatureClick('predictions')}
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    View Predictions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
