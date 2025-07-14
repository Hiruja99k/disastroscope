import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Globe, 
  Zap, 
  Shield, 
  Activity,
  Satellite,
  Network,
  Eye,
  Target,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Cpu,
  Database,
  Layers,
  Radar
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdvancedFeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [stats, setStats] = useState({
    threats: 17,
    predictions: 142,
    accuracy: 94.2,
    responseTime: 0.3
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        threats: prev.threats + Math.floor(Math.random() * 3) - 1,
        predictions: prev.predictions + Math.floor(Math.random() * 5) - 2,
        accuracy: Math.max(90, Math.min(99, prev.accuracy + (Math.random() - 0.5))),
        responseTime: Math.max(0.1, Math.min(1, prev.responseTime + (Math.random() - 0.5) * 0.1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 'ai-prediction',
      title: 'AI-Powered Prediction Engine',
      description: 'Advanced machine learning models process millions of data points to predict disasters with unprecedented accuracy.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-600',
      capabilities: [
        'Deep neural networks',
        'Pattern recognition',
        'Probabilistic modeling',
        'Real-time analysis'
      ],
      metrics: {
        accuracy: '94.2%',
        speed: '0.3s',
        models: '12',
        dataPoints: '50M+'
      }
    },
    {
      id: 'global-monitoring',
      title: 'Global Monitoring Network',
      description: 'Comprehensive surveillance system covering 195 countries with satellite integration and ground sensors.',
      icon: Globe,
      color: 'from-blue-500 to-cyan-600',
      capabilities: [
        'Satellite coverage',
        'Ground sensor networks',
        'Weather station integration',
        'Real-time data fusion'
      ],
      metrics: {
        coverage: '195 countries',
        satellites: '25',
        sensors: '50K+',
        uptime: '99.9%'
      }
    },
    {
      id: 'instant-alerts',
      title: 'Instant Alert System',
      description: 'Sub-second threat detection with automated multi-channel notifications to emergency services.',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      capabilities: [
        'Multi-channel alerts',
        'Emergency integration',
        'Automated escalation',
        'Custom workflows'
      ],
      metrics: {
        speed: '0.3s',
        channels: '12',
        integrations: '500+',
        delivered: '99.8%'
      }
    },
    {
      id: 'risk-assessment',
      title: 'Comprehensive Risk Assessment',
      description: 'Advanced vulnerability analysis and impact modeling for informed decision-making.',
      icon: Shield,
      color: 'from-green-500 to-emerald-600',
      capabilities: [
        'Vulnerability mapping',
        'Impact modeling',
        'Risk scoring',
        'Decision support'
      ],
      metrics: {
        riskModels: '150+',
        accuracy: '96.1%',
        assessments: '10K+',
        prevented: '$2.3B'
      }
    }
  ];

  const currentFeature = features[activeFeature];

  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">
              <Activity className="mr-2 h-4 w-4" />
              Advanced Technology
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-poppins">
              Next-Generation Disaster Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Experience the most sophisticated disaster prediction and monitoring platform ever built.
              Our advanced AI systems provide unparalleled accuracy and speed.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Selection */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card 
                  className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                    activeFeature === index 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {feature.capabilities.slice(0, 2).map((capability, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {capability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3 h-3 bg-primary rounded-full"
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Showcase */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="p-8 bg-gradient-card border-border/20 shadow-xl">
              {/* Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center`}>
                  <currentFeature.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{currentFeature.title}</h3>
                  <p className="text-muted-foreground">{currentFeature.description}</p>
                </div>
              </div>

              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.threats}</div>
                  <div className="text-xs text-muted-foreground">Active Threats</div>
                  <div className="w-full bg-destructive/20 rounded-full h-1 mt-2">
                    <div className="bg-destructive h-1 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.predictions}</div>
                  <div className="text-xs text-muted-foreground">AI Predictions</div>
                  <div className="w-full bg-primary/20 rounded-full h-1 mt-2">
                    <div className="bg-primary h-1 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.accuracy.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                  <div className="w-full bg-success/20 rounded-full h-1 mt-2">
                    <div className="bg-success h-1 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">{stats.responseTime.toFixed(1)}s</div>
                  <div className="text-xs text-muted-foreground">Response Time</div>
                  <div className="w-full bg-warning/20 rounded-full h-1 mt-2">
                    <div className="bg-warning h-1 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
              </div>

              {/* Capabilities */}
              <div className="space-y-3 mb-6">
                <h4 className="text-sm font-medium text-foreground">Core Capabilities</h4>
                {currentFeature.capabilities.map((capability, index) => (
                  <motion.div
                    key={capability}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-foreground">{capability}</span>
                  </motion.div>
                ))}
              </div>

              {/* Metrics */}
              <div className="border-t border-border/50 pt-6">
                <h4 className="text-sm font-medium text-foreground mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(currentFeature.metrics).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="text-lg font-bold text-foreground">{value}</div>
                      <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Animated indicators */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-success rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </Card>

            {/* Background effects */}
            <div className="absolute inset-0 -z-10">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 4,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}