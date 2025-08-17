import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe,
  Users,
  Award,
  Target,
  Brain,
  Satellite,
  Shield,
  Zap
} from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze millions of data points to predict natural disasters with 94.2% accuracy.'
    },
    {
      icon: Satellite,
      title: 'Global Satellite Network',
      description: 'Real-time data from 500+ satellites providing comprehensive Earth monitoring and early warning capabilities.'
    },
    {
      icon: Shield,
      title: 'Emergency Response',
      description: 'Instant alert system connecting to emergency services and disaster response teams worldwide.'
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Sub-second data processing with quantum-enhanced algorithms for immediate threat detection.'
    }
  ];

  const stats = [
    { number: '195', label: 'Countries Monitored', icon: Globe },
    { number: '10M+', label: 'Lives Protected', icon: Users },
    { number: '99.7%', label: 'Uptime Guarantee', icon: Award },
    { number: '3.2min', label: 'Average Response', icon: Target }
  ];

  const team = [
    {
      name: 'Hiruja Kulasiriwardana',
      role: 'Student',
      expertise: 'Bandaranayake College, Gampaha',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Thisaru Nirmala Samarathunge',
      role: 'Student',
      expertise: 'Bandaranayake College, Gampaha',
      image: '/api/placeholder/150/150'
    },
    {
      name: 'Minila Prakarsha Yalage',
      role: 'Student',
      expertise: 'Bandaranayake College, Gampaha',
      image: '/api/placeholder/150/150'
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">
            🏆 Award-Winning Technology
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">DisastroScope</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're pioneering the future of disaster prediction through cutting-edge AI, 
            satellite technology, and global data networks to protect communities worldwide.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-8 lg:p-12 bg-gradient-card border-border/50 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
              To revolutionize disaster preparedness through intelligent prediction systems, 
              providing early warnings that save lives, protect infrastructure, and enable 
              communities to respond effectively to natural disasters before they strike.
            </p>
          </Card>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Global Impact</h2>
            <p className="text-muted-foreground">Protecting communities across the world</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card className="p-6 text-center bg-gradient-card border-border/50 hover:shadow-elevation transition-all">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Advanced Technology</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge platform combines multiple technologies to deliver unparalleled disaster prediction capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Research Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Expert Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              College researchers dedicated to advancing disaster prediction technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="p-6 text-center bg-gradient-card border-border/50 hover:shadow-elevation transition-all">
                  <div className="w-24 h-24 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.expertise}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Card className="p-8 lg:p-12 bg-gradient-card border-border/50">
            <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Partner with us to build a safer world through advanced disaster prediction and early warning systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow">
                Partner With Us
              </Button>
              <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/10">
                Research Collaboration
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}