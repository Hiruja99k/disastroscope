import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { ArrowRight, Shield, Brain, Globe, Zap, BarChart, Users, Target, CheckCircle, Star, Award, TrendingUp, Database, Activity, Bell, Eye, Play, Download, Calendar, Phone, Mail, Satellite, AlertTriangle, Cpu, Network, Layers, Radar, Clock, Filter, Search, Settings, Lock, Wifi, Monitor, Smartphone, Tablet, Server, Cloud, MessageSquare, FileText, BarChart3, PieChart, LineChart, MapPin, Thermometer, Wind, Droplets, Mountain, Waves, Flame, MousePointer, RefreshCw, MoreHorizontal, ExternalLink, ChevronRight, ChevronDown, Menu, X, Home, BookOpen, HelpCircle, UserCheck, Briefcase, Building, Headphones, Mic, VideoIcon, Share2, Copy, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';
import aiDashboard from '@/assets/ai-dashboard.jpg';
import satelliteMonitoring from '@/assets/satellite-monitoring.jpg';
import neuralNetwork from '@/assets/neural-network.jpg';
import commandCenter from '@/assets/command-center.jpg';
import AdvancedFeatureShowcase from '@/components/AdvancedFeatureShowcase';
import EnterpriseFeaturesShowcase from '@/components/EnterpriseFeaturesShowcase';
export default function EnhancedLanding() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState(0);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleSubscribe = () => {
    if (email) {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive updates about our latest features and insights."
      });
      setEmail('');
    }
  };

  const handleStartTrial = () => {
    toast({
      title: "Free Trial Started!",
      description: "Welcome to DisastroScope! Your 14-day free trial is now active."
    });
  };

  const handleWatchDemo = () => {
    toast({
      title: "Demo Video",
      description: "Opening DisastroScope platform demonstration video..."
    });
    // In a real app, this would open a video modal or redirect to demo page
  };

  const handleScheduleConsultation = () => {
    toast({
      title: "Consultation Scheduled",
      description: "We'll contact you within 24 hours to schedule your consultation."
    });
  };

  const handleScheduleDemo = () => {
    toast({
      title: "Demo Scheduled",
      description: "We'll contact you to schedule a personalized demo of DisastroScope."
    });
  };

  const handleContactSales = () => {
    toast({
      title: "Contact Sales",
      description: "Our sales team will reach out to you within 2 hours."
    });
  };

  const handlePricingAction = (planName: string) => {
    if (planName === 'Enterprise') {
      handleContactSales();
    } else {
      handleStartTrial();
    }
  };
  const features = [{
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning algorithms analyze millions of data points to predict disasters with 94.2% accuracy',
    benefits: ['Real-time analysis', 'Pattern recognition', 'Predictive modeling'],
    image: neuralNetwork,
    metrics: ['94.2% accuracy', '0.3s response time', '10M+ predictions made']
  }, {
    icon: Globe,
    title: 'Global Monitoring Network',
    description: 'Comprehensive coverage across 195 countries with 24/7 satellite surveillance and ground sensors',
    benefits: ['Worldwide coverage', '24/7 monitoring', 'Multi-source data'],
    image: satelliteMonitoring,
    metrics: ['195 countries', '50K+ sensors', '25 satellites']
  }, {
    icon: Zap,
    title: 'Instant Alert System',
    description: 'Sub-second threat detection with automated notifications to emergency services and affected communities',
    benefits: ['Instant notifications', 'Multi-channel alerts', 'Emergency integration'],
    image: commandCenter,
    metrics: ['0.3s alerts', '99.9% uptime', '10M+ lives protected']
  }, {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive vulnerability analysis and impact assessment for informed decision-making',
    benefits: ['Risk modeling', 'Impact analysis', 'Decision support'],
    image: aiDashboard,
    metrics: ['$2.3B prevented', '60% faster response', '95% accuracy']
  }];
  const platformFeatures = [{
    category: 'Monitoring',
    icon: Monitor,
    color: 'bg-blue-500',
    items: [{
      name: 'Real-time Surveillance',
      description: 'Continuous monitoring across all regions',
      progress: 99
    }, {
      name: 'Multi-sensor Networks',
      description: 'Integrated sensor ecosystem',
      progress: 95
    }, {
      name: 'Satellite Integration',
      description: 'Global satellite coverage',
      progress: 92
    }, {
      name: 'Weather Stations',
      description: '50,000+ connected stations',
      progress: 97
    }]
  }, {
    category: 'Analysis',
    icon: Brain,
    color: 'bg-purple-500',
    items: [{
      name: 'AI Prediction Models',
      description: 'Advanced machine learning algorithms',
      progress: 94
    }, {
      name: 'Pattern Recognition',
      description: 'Historical data analysis',
      progress: 88
    }, {
      name: 'Risk Assessment',
      description: 'Comprehensive threat evaluation',
      progress: 91
    }, {
      name: 'Impact Modeling',
      description: 'Damage and casualty predictions',
      progress: 87
    }]
  }, {
    category: 'Response',
    icon: Zap,
    color: 'bg-green-500',
    items: [{
      name: 'Instant Alerts',
      description: 'Sub-second notification system',
      progress: 100
    }, {
      name: 'Emergency Protocols',
      description: 'Automated response triggers',
      progress: 96
    }, {
      name: 'Resource Deployment',
      description: 'Optimized resource allocation',
      progress: 89
    }, {
      name: 'Coordination Hub',
      description: 'Multi-agency collaboration',
      progress: 93
    }]
  }];
  const integrations = [{
    name: 'NOAA',
    logo: '/logos/noaa-logo.svg',
    type: 'Weather Data',
    status: 'Connected'
  }, {
    name: 'USGS',
    logo: '/logos/usgs-logo.svg',
    type: 'Geological Data',
    status: 'Connected'
  }, {
    name: 'NASA',
    logo: '/logos/nasa-logo.svg',
    type: 'Satellite Imagery',
    status: 'Connected'
  }, {
    name: 'WHO',
    logo: '/logos/who-logo.svg',
    type: 'Health Data',
    status: 'Connected'
  }, {
    name: 'FEMA',
    logo: '/logos/fema-logo.svg',
    type: 'Emergency Response',
    status: 'Connected'
  }, {
    name: 'Red Cross',
    logo: '/logos/redcross-logo.svg',
    type: 'Humanitarian Aid',
    status: 'Connected'
  }];
  const pricingPlans = [{
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for small organizations and local governments',
    features: ['Regional monitoring (up to 3 states)', 'Basic AI predictions', 'Email alerts', 'Standard dashboard', 'API access (1000 calls/month)', 'Community support'],
    popular: false,
    color: 'border-gray-200'
  }, {
    name: 'Professional',
    price: '$499',
    period: '/month',
    description: 'Ideal for federal agencies and large organizations',
    features: ['National monitoring coverage', 'Advanced AI predictions', 'Multi-channel alerts (SMS, Email, Push)', 'Custom dashboards', 'Unlimited API access', 'Priority support', 'Custom integrations', 'Advanced analytics'],
    popular: true,
    color: 'border-primary ring-2 ring-primary/20'
  }, {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solution for international operations',
    features: ['Global monitoring coverage', 'Custom AI model training', 'White-label solution', 'Dedicated infrastructure', 'On-premise deployment', '24/7 dedicated support', 'Custom development', 'SLA guarantees'],
    popular: false,
    color: 'border-gray-200'
  }];
  const useCases = [{
    title: 'Government Agencies',
    icon: Building,
    description: 'Federal and local governments use DisastroScope for national disaster preparedness',
    metrics: ['95% faster response times', '60% reduction in casualties', '$2.3B in damages prevented'],
    image: commandCenter,
    challenges: ['Multi-agency coordination', 'Real-time decision making', 'Public safety'],
    solutions: ['Unified command center', 'AI-powered recommendations', 'Automated alert systems']
  }, {
    title: 'Emergency Services',
    icon: AlertTriangle,
    description: 'First responders rely on our real-time alerts and coordination tools',
    metrics: ['10x improved coordination', '40% faster deployment', '85% accuracy in predictions'],
    image: satelliteMonitoring,
    challenges: ['Resource allocation', 'Communication gaps', 'Response time'],
    solutions: ['Smart resource mapping', 'Unified communications', 'Predictive deployment']
  }, {
    title: 'Insurance Companies',
    icon: Shield,
    description: 'Insurance providers use our risk models for accurate premium calculations',
    metrics: ['30% better risk assessment', '$500M in prevented claims', '99.2% model accuracy'],
    image: aiDashboard,
    challenges: ['Risk modeling', 'Claims processing', 'Fraud detection'],
    solutions: ['AI risk algorithms', 'Automated claims', 'Anomaly detection']
  }, {
    title: 'Research Institutions',
    icon: BookOpen,
    description: 'Academic researchers access comprehensive historical and real-time data',
    metrics: ['150+ research partnerships', '1000+ published papers', '50TB+ data processed'],
    image: neuralNetwork,
    challenges: ['Data access', 'Research funding', 'Collaboration'],
    solutions: ['Open data platform', 'Research grants', 'Global network']
  }];
  const stats = [{
    number: '99.2%',
    label: 'Prediction Accuracy',
    icon: Target,
    trend: '+2.1%'
  }, {
    number: '195',
    label: 'Countries Covered',
    icon: Globe,
    trend: '+5'
  }, {
    number: '10M+',
    label: 'Lives Protected',
    icon: Users,
    trend: '+1.2M'
  }, {
    number: '0.3s',
    label: 'Response Time',
    icon: Zap,
    trend: '-0.1s'
  }];
  const testimonials = [{
    name: 'Dr. Sarah Chen',
    role: 'Director of Emergency Management',
    organization: 'FEMA',
    content: 'DisastroScope has revolutionized our disaster response capabilities. The AI-powered predictions have helped us save thousands of lives and prevent billions in damages.',
    rating: 5,
    avatar: '👩‍⚕️',
    metrics: ['50% faster response', '$2.3B prevented', '99.5% accuracy']
  }, {
    name: 'Prof. Michael Rodriguez',
    role: 'Climate Research Lead',
    organization: 'NOAA',
    content: 'The accuracy and speed of DisastroScope\'s predictions are unmatched. It\'s become an essential tool in our climate research and disaster preparedness strategy.',
    rating: 5,
    avatar: '👨‍🔬',
    metrics: ['94.2% accuracy', '1000+ studies', '150 partnerships']
  }, {
    name: 'Amanda Foster',
    role: 'Emergency Response Coordinator',
    organization: 'Red Cross International',
    content: 'The platform\'s real-time monitoring and alert system have dramatically improved our response times and coordination efforts across multiple countries.',
    rating: 5,
    avatar: '👩‍💼',
    metrics: ['10x coordination', '40% faster', '25 countries']
  }];
  return <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Ultra Advanced Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-secondary/3"></div>
        
        {/* Neural network visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1200 800">
          {[...Array(15)].map((_, i) => <g key={i}>
              <motion.circle cx={100 + i % 5 * 250} cy={150 + Math.floor(i / 5) * 200} r="4" fill="hsl(var(--primary))" animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }} transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3
          }} />
              {i < 14 && <motion.line x1={100 + i % 5 * 250} y1={150 + Math.floor(i / 5) * 200} x2={100 + (i + 1) % 5 * 250} y2={150 + Math.floor((i + 1) / 5) * 200} stroke="hsl(var(--primary))" strokeWidth="1" animate={{
            strokeOpacity: [0.1, 0.4, 0.1]
          }} transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2
          }} />}
            </g>)}
        </svg>
        
        {/* Floating data streams */}
        {[...Array(8)].map((_, i) => <motion.div key={`stream-${i}`} className="absolute w-0.5 h-32 bg-gradient-to-b from-transparent via-primary/30 to-transparent" style={{
        left: `${20 + i * 12}%`,
        top: `${10 + i % 3 * 30}%`
      }} animate={{
        y: [-100, window.innerHeight + 100],
        opacity: [0, 1, 0]
      }} transition={{
        duration: 8 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 5,
        ease: "linear"
      }} />)}
        
        {/* Advanced particles with trails */}
        {[...Array(40)].map((_, i) => <motion.div key={`particle-${i}`} className="absolute" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }}>
            <motion.div className="w-2 h-2 bg-primary/30 rounded-full" animate={{
          scale: [0, 1, 0],
          opacity: [0, 0.8, 0]
        }} transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 6
        }} />
            <motion.div className="absolute inset-0 w-8 h-8 border border-primary/20 rounded-full -translate-x-3 -translate-y-3" animate={{
          scale: [0, 2, 0],
          opacity: [0.5, 0, 0]
        }} transition={{
          duration: 4 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 6
        }} />
          </motion.div>)}
        
        {/* Animated grid with perspective */}
        <div className="absolute inset-0 opacity-5 perspective-1000">
          <div className="w-full h-full bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:80px_80px] transform-gpu rotate-x-12"></div>
        </div>
        
        {/* Multiple flowing waves with different speeds */}
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/2 to-transparent" animate={{
        x: ["-100%", "100%"]
      }} transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }} />
        <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/2 to-transparent" animate={{
        x: ["100%", "-100%"]
      }} transition={{
        duration: 30,
        repeat: Infinity,
        ease: "linear"
      }} />
        
        {/* Orbital elements */}
        {[...Array(3)].map((_, i) => <motion.div key={`orbital-${i}`} className="absolute w-2 h-2 bg-primary/40 rounded-full" style={{
        left: '50%',
        top: '30%'
      }} animate={{
        rotate: 360
      }} transition={{
        duration: 20 + i * 10,
        repeat: Infinity,
        ease: "linear"
      }} transformTemplate={({
        rotate
      }) => `translate(-50%, -50%) rotate(${rotate}) translateX(${100 + i * 50}px) rotate(-${rotate})`} />)}
      </div>

      {/* Enhanced Hero Section */}
      <motion.section style={{
      y: backgroundY
    }} className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-8">
            {/* Badge */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }}>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-lg">
                <Globe className="mr-2 h-5 w-5" />
                Sri Lanka's #1 Disaster Intelligence Platform
              </Badge>
            </motion.div>
            
            {/* Main heading */}
            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.4,
            duration: 0.8
          }} className="text-6xl lg:text-7xl font-bold text-foreground leading-tight font-poppins">
              Predict. Monitor.{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Protect.
              </span>
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6,
            duration: 0.8
          }} className="text-2xl text-muted-foreground leading-relaxed font-inter max-w-5xl mx-auto">
              DisastroScope is the Sri Lanka's most advanced disaster prediction and monitoring platform. 
              Using cutting-edge AI and global satellite networks, we help governments and organizations 
              protect communities from natural disasters with unprecedented accuracy.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.8,
            duration: 0.8
          }} className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              <Button onClick={handleStartTrial} size="lg" className="bg-gradient-primary hover:shadow-glow group font-medium text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button onClick={handleWatchDemo} variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-medium text-lg px-8 py-4">
                <Play className="mr-2 h-6 w-6" />
                Watch Live Demo
              </Button>
              <Button onClick={handleScheduleConsultation} variant="ghost" size="lg" className="hover:bg-muted/50 font-medium text-lg px-8 py-4">
                <Calendar className="mr-2 h-6 w-6" />
                Schedule Consultation
              </Button>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 1.0,
            duration: 0.8
          }} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
              {stats.map((stat, index) => <motion.div key={stat.label} initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              delay: 1.2 + index * 0.1,
              duration: 0.6
            }} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <stat.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground font-poppins">{stat.number}</div>
                  <div className="text-sm text-muted-foreground font-inter mb-1">{stat.label}</div>
                  <div className="text-xs text-success font-medium">{stat.trend} this month</div>
                </motion.div>)}
            </motion.div>

            {/* Interactive Hero Dashboard Preview */}
            <motion.div initial={{
            opacity: 0,
            y: 50
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 1.2,
            duration: 1
          }} className="relative mt-16">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-card border border-border/20">
                <img src={heroImage} alt="DisastroScope Control Center" className="w-full h-auto max-w-6xl mx-auto opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
                
                {/* Interactive overlays */}
                <div className="absolute inset-0 p-8">
                  {/* Real-time stats overlay */}
                  
                  
                  {/* AI prediction notification */}
                  
                  
                  {/* Global status indicators */}
                  
                  
                  {/* Floating action elements */}
                  {[...Array(6)].map((_, i) => <motion.div key={`floating-${i}`} className="absolute w-2 h-2 bg-primary/60 rounded-full" style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i % 2 * 40}%`
                }} animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1]
                }} transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3
                }} />)}
                </div>
                
                {/* Multiple Status Overlays */}
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6,
                delay: 1.5
              }} className="absolute top-8 left-8 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-card border border-border/50 mx-[47px]">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Global Network</p>
                      <p className="text-xs text-success">99.9% Uptime</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6,
                delay: 1.7
              }} className="absolute top-8 right-8 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-card border border-border/50 mx-[47px]">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Live Data</p>
                      <p className="text-xs text-primary">50,247 Sensors</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 1.9
              }} className="absolute bottom-8 left-8 bg-card/95 backdrop-blur-sm p-4 rounded-xl shadow-card border border-border/50 mx-[47px]">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">AI Processing</p>
                      <p className="text-xs text-purple-500">12 Models Active</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Platform Features with Tabs */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Comprehensive Platform Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              Our integrated platform provides everything you need for effective disaster management,
              from real-time monitoring to AI-powered predictions and coordinated response.
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 bg-card">
              {platformFeatures.map(feature => <TabsTrigger key={feature.category} value={feature.category.toLowerCase()} className="flex items-center space-x-2 text-lg py-4">
                  <feature.icon className="h-5 w-5" />
                  <span>{feature.category}</span>
                </TabsTrigger>)}
            </TabsList>

            {platformFeatures.map(feature => <TabsContent key={feature.category} value={feature.category.toLowerCase()}>
                <div className="grid md:grid-cols-2 gap-6">
                  {feature.items.map((item, index) => <motion.div key={item.name} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1,
                duration: 0.6
              }}>
                      <Card className="p-6 bg-card border-border/50 hover:shadow-elevation transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-foreground font-poppins">{item.name}</h3>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {item.progress}%
                            </Badge>
                          </div>
                          <p className="text-muted-foreground font-inter">{item.description}</p>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </Card>
                    </motion.div>)}
                </div>
              </TabsContent>)}
          </Tabs>
        </div>
      </section>

      {/* Enhanced Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Why Choose DisastroScope?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              Our comprehensive platform combines advanced technology with proven expertise 
              to deliver unmatched disaster prediction and response capabilities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.2,
            duration: 0.6
          }}>
                <Card className="p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full overflow-hidden group">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground font-poppins">{feature.title}</h3>
                        <div className="flex items-center space-x-4 mt-2">
                          {feature.metrics.map((metric, idx) => <Badge key={idx} variant="outline" className="text-xs">
                              {metric}
                            </Badge>)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature Image */}
                    <div className="relative overflow-hidden rounded-xl">
                      <img src={feature.image} alt={feature.title} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed font-inter text-lg">{feature.description}</p>
                    
                    <div className="space-y-3">
                      {feature.benefits.map((benefit, idx) => <div key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="text-foreground font-inter">{benefit}</span>
                        </div>)}
                    </div>

                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Advanced Feature Showcase */}
      <AdvancedFeatureShowcase />

      {/* Enterprise Features Showcase */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <EnterpriseFeaturesShowcase />
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              Organizations worldwide rely on DisastroScope for mission-critical disaster management
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              {useCases.map((useCase, index) => <motion.div key={useCase.title} initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1,
              duration: 0.6
            }} onClick={() => setSelectedUseCase(index)} className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${selectedUseCase === index ? 'bg-primary/10 border-2 border-primary/30 shadow-glow' : 'bg-card border border-border/50 hover:shadow-card'}`}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedUseCase === index ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                      <useCase.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground font-poppins mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground font-inter mb-4">{useCase.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.metrics.map((metric, idx) => <Badge key={idx} variant="outline" className="text-xs">
                            {metric}
                          </Badge>)}
                      </div>
                    </div>
                  </div>
                </motion.div>)}
            </div>

            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} className="relative">
              <Card className="p-8 bg-card border-border/50 h-full">
                <div className="space-y-6">
                  <img src={useCases[selectedUseCase].image} alt={useCases[selectedUseCase].title} className="w-full h-64 object-cover rounded-xl" />
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground font-poppins mb-4">
                      {useCases[selectedUseCase].title}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Key Challenges:</h4>
                        <ul className="space-y-1">
                          {useCases[selectedUseCase].challenges?.map((challenge, idx) => <li key={idx} className="flex items-center space-x-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="text-muted-foreground text-sm">{challenge}</span>
                            </li>)}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Our Solutions:</h4>
                        <ul className="space-y-1">
                          {useCases[selectedUseCase].solutions?.map((solution, idx) => <li key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              <span className="text-muted-foreground text-sm">{solution}</span>
                            </li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Seamless Integrations
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              Connect with leading data providers and emergency response organizations
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => <motion.div key={integration.name} initial={{
            opacity: 0,
            scale: 0.9
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className="p-6 bg-card border-border/50 hover:shadow-card transition-all duration-300 text-center group">
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <img 
                      src={integration.logo} 
                      alt={`${integration.name} logo`}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        // Fallback to text if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = document.createElement('div');
                        fallback.className = 'text-2xl';
                        fallback.textContent = integration.name.charAt(0);
                        target.parentNode?.appendChild(fallback);
                      }}
                    />
                  </div>
                  <h3 className="font-semibold text-foreground font-poppins">{integration.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{integration.type}</p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                    {integration.status}
                  </Badge>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Flexible Pricing Plans
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              Choose the plan that fits your organization's needs and scale
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => <motion.div key={plan.name} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className={`p-8 bg-card border-2 ${plan.color} relative ${plan.popular ? 'shadow-glow' : 'hover:shadow-card'} transition-all duration-300`}>
                  {plan.popular && <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>}
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground font-poppins">{plan.name}</h3>
                      <div className="flex items-baseline justify-center mt-4">
                        <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground mt-2">{plan.description}</p>
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => <li key={idx} className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>)}
                    </ul>
                    
                    <Button 
                      onClick={() => handlePricingAction(plan.name)} 
                      className={`w-full ${plan.popular ? 'bg-gradient-primary' : 'variant-outline'}`} 
                      size="lg"
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-6 font-poppins">
              Trusted by Global Leaders
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto font-inter">
              See what industry experts say about DisastroScope's impact
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <motion.div key={testimonial.name} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className="p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{testimonial.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-foreground font-poppins">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-sm text-primary">{testimonial.organization}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    
                    <blockquote className="text-muted-foreground font-inter leading-relaxed">
                      "{testimonial.content}"
                    </blockquote>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {testimonial.metrics.map((metric, idx) => <div key={idx} className="text-center p-2 bg-muted/50 rounded">
                          <div className="text-xs font-medium text-foreground">{metric}</div>
                        </div>)}
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="bg-gradient-card p-12 rounded-3xl shadow-elevation border border-border/50 text-center">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-poppins">
                Ready to Protect Your Community?
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                Join thousands of organizations worldwide who trust DisastroScope to safeguard lives and property. 
                Start your free trial today and experience the future of disaster management.
              </p>
              
              <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                <Button onClick={handleStartTrial} size="lg" className="bg-gradient-primary hover:shadow-glow font-medium text-lg px-8 py-4">
                  <Zap className="mr-2 h-6 w-6" />
                  Start Free Trial
                </Button>
                <Button onClick={handleScheduleDemo} variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-medium text-lg px-8 py-4">
                  <Calendar className="mr-2 h-6 w-6" />
                  Schedule Demo
                </Button>
                <Button onClick={handleContactSales} variant="ghost" size="lg" className="hover:bg-muted/50 font-medium text-lg px-8 py-4">
                  <Phone className="mr-2 h-6 w-6" />
                  Contact Sales
                </Button>
              </div>

              {/* Newsletter Signup */}
              <div className="pt-8 border-t border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Stay Updated</h3>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="flex-1" />
                  <Button onClick={handleSubscribe} variant="outline">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}