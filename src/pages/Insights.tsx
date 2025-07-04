import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function Insights() {
  const chartData = [
    {
      title: 'Earthquake Activity Trends',
      subtitle: 'Last 30 days seismic data',
      icon: LineChart,
      change: '+12%',
      type: 'increase',
      description: 'Increased activity detected in Pacific Ring of Fire region'
    },
    {
      title: 'Wildfire Risk Distribution',
      subtitle: 'Global fire probability zones',
      icon: BarChart,
      change: '-8%',
      type: 'decrease',
      description: 'Overall risk reduced due to seasonal weather patterns'
    },
    {
      title: 'Disaster Type Breakdown',
      subtitle: 'Distribution of active threats',
      icon: PieChart,
      change: '+3%',
      type: 'increase',
      description: 'Flood events showing seasonal increase'
    }
  ];

  const insights = [
    {
      title: 'Pacific Ring of Fire Activity',
      type: 'Earthquake',
      severity: 'High',
      prediction: '85% chance of 6.0+ magnitude event in next 72 hours',
      location: 'Japan, Philippines region',
      confidence: '89%',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'California Fire Season Peak',
      type: 'Wildfire',
      severity: 'Critical',
      prediction: 'Extreme fire weather conditions expected',
      location: 'Northern California',
      confidence: '94%',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    },
    {
      title: 'Monsoon Flood Risk',
      type: 'Flood',
      severity: 'Moderate',
      prediction: 'Above-normal rainfall in South Asia',
      location: 'Bangladesh, Eastern India',
      confidence: '76%',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  const metrics = [
    { label: 'Prediction Accuracy', value: '94.2%', change: '+2.1%', icon: Activity },
    { label: 'Early Warnings Issued', value: '1,847', change: '+15%', icon: AlertTriangle },
    { label: 'Data Points Analyzed', value: '2.4M', change: '+23%', icon: TrendingUp },
    { label: 'Response Time', value: '3.2min', change: '-18%', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Insights & Analytics</h1>
              <p className="text-muted-foreground">Advanced predictive analytics and trend analysis</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
                Export Report
              </Button>
              <Button className="bg-gradient-primary hover:shadow-glow">
                Generate Forecast
              </Button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-gradient-card border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className={`text-xs ${metric.change.startsWith('+') ? 'text-success' : metric.change.startsWith('-') && metric.label === 'Response Time' ? 'text-success' : 'text-destructive'}`}>
                        {metric.change} this month
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {chartData.map((chart, index) => (
            <motion.div
              key={chart.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="p-6 bg-gradient-card border-border/50 h-80">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <chart.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{chart.title}</h3>
                      <p className="text-sm text-muted-foreground">{chart.subtitle}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={chart.type === 'increase' ? 'destructive' : 'secondary'}
                    className="flex items-center space-x-1"
                  >
                    {chart.type === 'increase' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{chart.change}</span>
                  </Badge>
                </div>
                
                {/* Chart Placeholder */}
                <div className="h-48 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center space-y-2">
                    <chart.icon className="h-12 w-12 text-primary mx-auto animate-pulse-glow" />
                    <p className="text-sm text-muted-foreground">Chart.js Integration</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">{chart.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* AI Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI Prediction Models</h2>
                <p className="text-muted-foreground">Advanced machine learning forecasts for next 72 hours</p>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Real-time Analysis
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight, index) => (
                <motion.div
                  key={insight.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="border border-border/50 rounded-lg p-4 hover:shadow-card transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={insight.severity === 'Critical' ? 'destructive' : insight.severity === 'High' ? 'secondary' : 'outline'}
                        className={insight.bgColor}
                      >
                        {insight.severity} Risk
                      </Badge>
                      <span className={`text-sm font-medium ${insight.color}`}>{insight.type}</span>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{insight.location}</p>
                      <p className="text-sm text-foreground">{insight.prediction}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Confidence</span>
                      </div>
                      <span className="text-sm font-medium text-primary">{insight.confidence}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Historical Trends */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-4">Global Disaster Frequency</h3>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <BarChart className="h-12 w-12 text-primary mx-auto animate-pulse-glow" />
                  <p className="text-sm text-muted-foreground">Historical trend analysis</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50">
              <h3 className="text-xl font-semibold text-foreground mb-4">Risk Assessment Timeline</h3>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <LineChart className="h-12 w-12 text-secondary mx-auto animate-pulse-glow" />
                  <p className="text-sm text-muted-foreground">Predictive modeling results</p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}