import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Flame, 
  Zap, 
  Waves, 
  Mountain,
  AlertTriangle,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const disasters = [
    {
      id: 1,
      type: 'Earthquake',
      location: 'Pacific Ring of Fire',
      magnitude: '6.2 M',
      status: 'Active',
      icon: Zap,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      lat: 35.6762,
      lng: 139.6503
    },
    {
      id: 2,
      type: 'Wildfire',
      location: 'California, USA',
      magnitude: 'High Risk',
      status: 'Monitoring',
      icon: Flame,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      lat: 37.7749,
      lng: -122.4194
    },
    {
      id: 3,
      type: 'Flood',
      location: 'Bangladesh',
      magnitude: 'Severe',
      status: 'Alert',
      icon: Waves,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      lat: 23.6850,
      lng: 90.3563
    },
    {
      id: 4,
      type: 'Landslide',
      location: 'Nepal Himalayas',
      magnitude: 'Moderate',
      status: 'Watch',
      icon: Mountain,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      lat: 27.7172,
      lng: 85.3240
    }
  ];

  const stats = [
    { label: 'Active Monitors', value: '1,247', change: '+12%', icon: Activity },
    { label: 'Risk Zones', value: '89', change: '-3%', icon: AlertTriangle },
    { label: 'Predictions Today', value: '156', change: '+8%', icon: TrendingUp },
    { label: 'Coverage Area', value: '99.7%', change: '+0.1%', icon: Globe }
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Global Monitoring Dashboard</h1>
              <p className="text-muted-foreground">Real-time disaster tracking and prediction system</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Live Data</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 bg-gradient-card border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className={`text-xs ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {stat.change} from yesterday
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Global Threat Map</h2>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Interactive
                </Badge>
              </div>
              
              {/* Map Placeholder */}
              <div className="relative h-96 bg-muted/20 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Globe className="h-12 w-12 text-primary mx-auto animate-pulse-glow" />
                    <p className="text-lg font-medium text-foreground">Interactive Map Loading...</p>
                    <p className="text-sm text-muted-foreground">Leaflet integration coming soon</p>
                  </div>
                </div>
                
                {/* Simulated Markers */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-destructive rounded-full animate-pulse-glow"></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-warning rounded-full animate-pulse-glow"></div>
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-primary rounded-full animate-pulse-glow"></div>
              </div>
            </Card>
          </motion.div>

          {/* Active Disasters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Active Threats</h2>
                <Badge variant="destructive" className="animate-pulse">
                  {disasters.length} Active
                </Badge>
              </div>
              
              <div className="space-y-4">
                {disasters.map((disaster, index) => (
                  <motion.div
                    key={disaster.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="border border-border/50 rounded-lg p-4 hover:shadow-card transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 ${disaster.bgColor} rounded-lg flex items-center justify-center`}>
                        <disaster.icon className={`h-5 w-5 ${disaster.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {disaster.type}
                          </h3>
                          <Badge 
                            variant={disaster.status === 'Active' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {disaster.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{disaster.location}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-foreground">{disaster.magnitude}</span>
                          <Button variant="ghost" size="sm" className="h-6 text-xs">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4 border-primary/20 hover:bg-primary/10">
                View All Threats
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', event: 'Seismic activity detected in Japan', type: 'warning' },
                  { time: '5 min ago', event: 'Wildfire risk updated for California', type: 'destructive' },
                  { time: '12 min ago', event: 'Flood warning issued for Bangladesh', type: 'primary' },
                  { time: '18 min ago', event: 'Landslide monitoring activated in Nepal', type: 'secondary' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/30">
                    <div className={`w-2 h-2 rounded-full bg-${activity.type}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.event}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* System Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-6 bg-gradient-card border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">System Status</h2>
              <div className="space-y-4">
                {[
                  { system: 'Satellite Network', status: 'Operational', uptime: '99.9%' },
                  { system: 'AI Prediction Engine', status: 'Operational', uptime: '99.7%' },
                  { system: 'Data Processing', status: 'Operational', uptime: '99.8%' },
                  { system: 'Alert System', status: 'Operational', uptime: '100%' }
                ].map((system, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded">
                    <div>
                      <p className="text-sm font-medium text-foreground">{system.system}</p>
                      <p className="text-xs text-muted-foreground">Uptime: {system.uptime}</p>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {system.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}