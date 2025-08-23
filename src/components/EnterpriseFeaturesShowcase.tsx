import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Zap, 
  Brain, 
  Globe, 
  Activity, 
  TrendingUp,
  BarChart3,
  Layers,
  Database,
  Cpu,
  Network,
  Satellite,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  Gauge,
  LineChart,
  PieChart,
  Settings,
  Lock,
  Eye,
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';
import { trackEvent } from '@/utils/monitoring';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: {
    value: string | number;
    label: string;
    change?: number;
  }[];
  color: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  metrics, 
  color, 
  delay 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
  >
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-border/50 group">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{metric.label}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              {metric.change !== undefined && (
                <Badge 
                  variant={metric.change >= 0 ? "default" : "destructive"}
                  className="text-xs"
                >
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface SystemMetricProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
}

const SystemMetric: React.FC<SystemMetricProps> = ({ label, value, max, color, icon }) => (
  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
    <div className={`p-2 rounded-lg ${color}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Progress value={(value / max) * 100} className="h-2" />
    </div>
  </div>
);

export function EnterpriseFeaturesShowcase() {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 45,
    memory: 62,
    network: 78,
    storage: 34,
    uptime: 99.9
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    trackEvent('enterprise_tab_changed', { tab });
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      title: "Enterprise Security",
      description: "Military-grade security with end-to-end encryption",
      metrics: [
        { value: "99.99%", label: "Uptime" },
        { value: "256-bit", label: "Encryption" },
        { value: "0", label: "Security Breaches", change: 0 }
      ],
      color: "bg-green-500",
      delay: 0.1
    },
    {
      icon: <Brain className="h-6 w-6 text-white" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning for predictive insights",
      metrics: [
        { value: "94.2%", label: "Prediction Accuracy" },
        { value: "2.3ms", label: "Response Time" },
        { value: "15", label: "ML Models", change: 12 }
      ],
      color: "bg-blue-500",
      delay: 0.2
    },
    {
      icon: <Globe className="h-6 w-6 text-white" />,
      title: "Global Coverage",
      description: "Real-time monitoring across all continents",
      metrics: [
        { value: "195", label: "Countries" },
        { value: "50K+", label: "Sensors" },
        { value: "24/7", label: "Monitoring", change: 0 }
      ],
      color: "bg-purple-500",
      delay: 0.3
    },
    {
      icon: <Activity className="h-6 w-6 text-white" />,
      title: "Real-time Processing",
      description: "Instant data processing and alert generation",
      metrics: [
        { value: "<100ms", label: "Latency" },
        { value: "1M+", label: "Events/sec" },
        { value: "99.9%", label: "Reliability", change: 0.1 }
      ],
      color: "bg-orange-500",
      delay: 0.4
    },
    {
      icon: <Database className="h-6 w-6 text-white" />,
      title: "Data Management",
      description: "Petabyte-scale data storage and processing",
      metrics: [
        { value: "10PB+", label: "Storage" },
        { value: "99.999%", label: "Data Integrity" },
        { value: "5x", label: "Performance", change: 25 }
      ],
      color: "bg-cyan-500",
      delay: 0.5
    },
    {
      icon: <Network className="h-6 w-6 text-white" />,
      title: "Scalable Infrastructure",
      description: "Auto-scaling cloud infrastructure",
      metrics: [
        { value: "1000+", label: "Servers" },
        { value: "50TB", label: "Bandwidth" },
        { value: "99.95%", label: "Availability", change: 0.05 }
      ],
      color: "bg-indigo-500",
      delay: 0.6
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-poppins">
            Enterprise Features
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Professional-grade disaster monitoring with enterprise-level security, scalability, and performance
        </p>
        
        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <Lock className="h-3 w-3 mr-1" />
            Enterprise Security
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Zap className="h-3 w-3 mr-1" />
            High Performance
          </Badge>
          <Badge variant="outline" className="bg-info/10 text-info border-info/20">
            <Globe className="h-3 w-3 mr-1" />
            Global Scale
          </Badge>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      {/* System Performance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground font-poppins mb-4">
            System Performance
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time system metrics and performance indicators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SystemMetric
            label="CPU Usage"
            value={systemMetrics.cpu}
            max={100}
            color="bg-blue-100 dark:bg-blue-900/30"
            icon={<Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          />
          <SystemMetric
            label="Memory Usage"
            value={systemMetrics.memory}
            max={100}
            color="bg-green-100 dark:bg-green-900/30"
            icon={<Database className="h-5 w-5 text-green-600 dark:text-green-400" />}
          />
          <SystemMetric
            label="Network I/O"
            value={systemMetrics.network}
            max={100}
            color="bg-purple-100 dark:bg-purple-900/30"
            icon={<Network className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          />
          <SystemMetric
            label="Storage Usage"
            value={systemMetrics.storage}
            max={100}
            color="bg-orange-100 dark:bg-orange-900/30"
            icon={<BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
          />
          <SystemMetric
            label="System Uptime"
            value={systemMetrics.uptime}
            max={100}
            color="bg-cyan-100 dark:bg-cyan-900/30"
            icon={<Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />}
          />
          <SystemMetric
            label="Active Users"
            value={85}
            max={100}
            color="bg-indigo-100 dark:bg-indigo-900/30"
            icon={<Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />}
          />
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready for Enterprise Deployment?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Experience the power of enterprise-grade disaster monitoring with advanced security, scalability, and performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary hover:shadow-glow"
                onClick={() => trackEvent('enterprise_cta_clicked', { action: 'demo' })}
              >
                <Eye className="h-5 w-5 mr-2" />
                Request Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => trackEvent('enterprise_cta_clicked', { action: 'contact' })}
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Contact Sales
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => trackEvent('enterprise_cta_clicked', { action: 'documentation' })}
              >
                <Download className="h-5 w-5 mr-2" />
                Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default EnterpriseFeaturesShowcase;
