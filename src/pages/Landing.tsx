import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, Shield, Brain, Globe, Zap, BarChart, Users, Target, CheckCircle, Star, Award, TrendingUp, Database, Activity, Bell, Eye, Play, Download, Calendar, Phone, Mail, Satellite, AlertTriangle, Cpu, Network, Layers, Radar, Monitor, Building, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-image.jpg';
import aiDashboard from '@/assets/ai-dashboard.jpg';
import satelliteMonitoring from '@/assets/satellite-monitoring.jpg';
import neuralNetwork from '@/assets/neural-network.jpg';
import commandCenter from '@/assets/command-center.jpg';
import techBackground from '@/assets/tech-background.jpg';
export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
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
        description: "You'll receive updates about our latest features and insights.",
      });
      setEmail('');
    }
  };
  const features = [{
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning algorithms analyze millions of data points to predict disasters with 94.2% accuracy',
    benefits: ['Real-time analysis', 'Pattern recognition', 'Predictive modeling'],
    image: neuralNetwork
  }, {
    icon: Globe,
    title: 'Global Monitoring Network',
    description: 'Comprehensive coverage across 195 countries with 24/7 satellite surveillance and ground sensors',
    benefits: ['Worldwide coverage', '24/7 monitoring', 'Multi-source data'],
    image: satelliteMonitoring
  }, {
    icon: Zap,
    title: 'Instant Alert System',
    description: 'Sub-second threat detection with automated notifications to emergency services and affected communities',
    benefits: ['Instant notifications', 'Multi-channel alerts', 'Emergency integration'],
    image: commandCenter
  }, {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive vulnerability analysis and impact assessment for informed decision-making',
    benefits: ['Risk modeling', 'Impact analysis', 'Decision support'],
    image: aiDashboard
  }];
  const solutions = [{
    icon: Database,
    title: 'Data Integration Platform',
    description: 'Seamlessly integrate multiple data sources including satellite imagery, weather stations, and IoT sensors',
    features: ['Multi-source data fusion', 'Real-time processing', 'API integrations', 'Data quality assurance']
  }, {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Comprehensive visualization tools for monitoring trends, analyzing patterns, and generating reports',
    features: ['Interactive visualizations', 'Custom reports', 'Trend analysis', 'Export capabilities']
  }, {
    icon: Bell,
    title: 'Alert Management',
    description: 'Customizable notification system with multi-level alerts and automated response protocols',
    features: ['Multi-channel alerts', 'Smart filtering', 'Response tracking', 'Escalation rules']
  }, {
    icon: Users,
    title: 'Collaboration Tools',
    description: 'Multi-agency coordination platform for emergency responders, government, and relief organizations',
    features: ['Team coordination', 'Resource sharing', 'Communication tools', 'Access controls']
  }];

  const platformFeatures = [
    {
      category: 'Monitoring',
      icon: Monitor,
      items: [
        { name: 'Real-time Surveillance', description: 'Continuous monitoring across all regions' },
        { name: 'Multi-sensor Networks', description: 'Integrated sensor ecosystem' },
        { name: 'Satellite Integration', description: 'Global satellite coverage' },
        { name: 'Weather Stations', description: '50,000+ connected stations' }
      ]
    },
    {
      category: 'Analysis',
      icon: Brain,
      items: [
        { name: 'AI Prediction Models', description: 'Advanced machine learning algorithms' },
        { name: 'Pattern Recognition', description: 'Historical data analysis' },
        { name: 'Risk Assessment', description: 'Comprehensive threat evaluation' },
        { name: 'Impact Modeling', description: 'Damage and casualty predictions' }
      ]
    },
    {
      category: 'Response',
      icon: Zap,
      items: [
        { name: 'Instant Alerts', description: 'Sub-second notification system' },
        { name: 'Emergency Protocols', description: 'Automated response triggers' },
        { name: 'Resource Deployment', description: 'Optimized resource allocation' },
        { name: 'Coordination Hub', description: 'Multi-agency collaboration' }
      ]
    }
  ];

  const integrations = [
    { name: 'NOAA', logo: '🌊', type: 'Weather Data' },
    { name: 'USGS', logo: '🌍', type: 'Geological Data' },
    { name: 'NASA', logo: '🛰️', type: 'Satellite Imagery' },
    { name: 'WHO', logo: '🏥', type: 'Health Data' },
    { name: 'FEMA', logo: '🚨', type: 'Emergency Response' },
    { name: 'Red Cross', logo: '➕', type: 'Humanitarian Aid' }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small organizations and local governments',
      features: [
        'Regional monitoring (up to 3 states)',
        'Basic AI predictions',
        'Email alerts',
        'Standard dashboard',
        'API access (1000 calls/month)',
        'Community support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$499',
      period: '/month',
      description: 'Ideal for federal agencies and large organizations',
      features: [
        'National monitoring coverage',
        'Advanced AI predictions',
        'Multi-channel alerts (SMS, Email, Push)',
        'Custom dashboards',
        'Unlimited API access',
        'Priority support',
        'Custom integrations',
        'Advanced analytics'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored solution for international operations',
      features: [
        'Global monitoring coverage',
        'Custom AI model training',
        'White-label solution',
        'Dedicated infrastructure',
        'On-premise deployment',
        '24/7 dedicated support',
        'Custom development',
        'SLA guarantees'
      ],
      popular: false
    }
  ];

  const useCases = [
    {
      title: 'Government Agencies',
      icon: Building,
      description: 'Federal and local governments use DisastroScope for national disaster preparedness',
      metrics: ['95% faster response times', '60% reduction in casualties', '$2.3B in damages prevented'],
      image: commandCenter
    },
    {
      title: 'Emergency Services',
      icon: AlertTriangle,
      description: 'First responders rely on our real-time alerts and coordination tools',
      metrics: ['10x improved coordination', '40% faster deployment', '85% accuracy in predictions'],
      image: satelliteMonitoring
    },
    {
      title: 'Insurance Companies',
      icon: Shield,
      description: 'Insurance providers use our risk models for accurate premium calculations',
      metrics: ['30% better risk assessment', '$500M in prevented claims', '99.2% model accuracy'],
      image: aiDashboard
    },
    {
      title: 'Research Institutions',
      icon: BookOpen,
      description: 'Academic researchers access comprehensive historical and real-time data',
      metrics: ['150+ research partnerships', '1000+ published papers', '50TB+ data processed'],
      image: neuralNetwork
    }
  ];

  const aiAgents = [{
    icon: Cpu,
    title: 'Climate Intelligence Agent',
    description: 'Analyzes weather patterns, temperature fluctuations, and atmospheric conditions using deep learning models',
    capabilities: ['Weather prediction', 'Climate modeling', 'Atmospheric analysis']
  }, {
    icon: Network,
    title: 'Seismic Analysis Agent',
    description: 'Monitors tectonic activity and predicts earthquake probabilities using neural network algorithms',
    capabilities: ['Earthquake prediction', 'Tectonic monitoring', 'Fault line analysis']
  }, {
    icon: Layers,
    title: 'Flood Risk Agent',
    description: 'Processes hydrological data and rainfall patterns to forecast flood risks in real-time',
    capabilities: ['Flood forecasting', 'Water level monitoring', 'Drainage analysis']
  }, {
    icon: Radar,
    title: 'Multi-Hazard Agent',
    description: 'Integrates all disaster types for comprehensive risk assessment and coordinated response planning',
    capabilities: ['Multi-risk analysis', 'Response coordination', 'Impact assessment']
  }];
  const stats = [{
    number: '99.2%',
    label: 'Prediction Accuracy',
    icon: Target
  }, {
    number: '195',
    label: 'Countries Covered',
    icon: Globe
  }, {
    number: '10M+',
    label: 'Lives Protected',
    icon: Users
  }, {
    number: '0.3s',
    label: 'Response Time',
    icon: Zap
  }];
  const testimonials = [{
    name: 'Dr. Sarah Chen',
    role: 'Director of Emergency Management',
    organization: 'FEMA',
    content: 'DisastroScope has revolutionized our disaster response capabilities. The AI-powered predictions have helped us save thousands of lives.',
    rating: 5
  }, {
    name: 'Prof. Michael Rodriguez',
    role: 'Climate Research Lead',
    organization: 'NOAA',
    content: 'The accuracy and speed of DisastroScope\'s predictions are unmatched. It\'s become an essential tool in our disaster preparedness strategy.',
    rating: 5
  }, {
    name: 'Amanda Foster',
    role: 'Emergency Response Coordinator',
    organization: 'Red Cross International',
    content: 'The platform\'s real-time monitoring and alert system have dramatically improved our response times and coordination efforts.',
    rating: 5
  }];
  return <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Advanced Background with Video-like Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated background image with overlay */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${techBackground})`,
            backgroundAttachment: 'fixed'
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95"></div>
        
        {/* Dynamic floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div 
            key={i} 
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }} 
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5]
            }} 
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }} 
          />
        ))}
        
        {/* Animated grid pattern */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px', '0px 0px']
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-full h-full bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </motion.div>
        
        {/* Flowing light waves */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          animate={{
            x: ["-100%", "200%"]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Pulsing glow effects */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Hero Section */}
      <motion.section style={{
      y: backgroundY
    }} className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-secondary/2"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8
          }} className="space-y-8">
              <div className="space-y-6">
                <div className="flex justify-center">
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
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2">
                      <Globe className="mr-2 h-4 w-4" />
                      Advanced Disaster Intelligence Platform
                    </Badge>
                  </motion.div>
                </div>
                
                <motion.h1 initial={{
                opacity: 0,
                y: 30
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4,
                duration: 0.8
              }} className="text-5xl lg:text-6xl font-bold text-foreground leading-tight font-poppins text-center">
                  Predict. Monitor.{' '}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Protect.
                  </span>
                </motion.h1>
                
                <motion.p initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.6,
                duration: 0.8
              }} className="text-xl text-muted-foreground leading-relaxed font-inter text-center max-w-4xl mx-auto">
                  DisastroScope is the world's most advanced disaster prediction and monitoring platform. 
                  Using cutting-edge AI and global satellite networks, we help governments and organizations 
                  protect communities from natural disasters.
                </motion.p>
              </div>

              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.8,
              duration: 0.8
            }} className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow group font-medium">
                  <Link to="/dashboard">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-medium">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
                <Button variant="ghost" size="lg" className="hover:bg-muted/50 font-medium">
                  <Download className="mr-2 h-5 w-5" />
                  Download Brochure
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 1.0,
              duration: 0.8
            }} className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => <motion.div key={stat.label} initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 1.2 + index * 0.1,
                duration: 0.6
              }} className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground font-poppins">{stat.number}</div>
                    <div className="text-sm text-muted-foreground font-inter">{stat.label}</div>
                  </motion.div>)}
              </motion.div>
            </motion.div>

            {/* Right Content - Hero Image */}
            <motion.div initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }} className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-elevation">
                <img src={heroImage} alt="DisastroScope Control Center" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                
                {/* Status Indicators */}
                <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 1.0
              }} className="absolute top-6 right-6 bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-card border border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">System Online</p>
                      <p className="text-xs text-success">All Services Operational</p>
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
                delay: 1.2
              }} className="absolute bottom-6 left-6 bg-card/95 backdrop-blur-sm p-4 rounded-lg shadow-card border border-border/50">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Live Monitoring</p>
                      <p className="text-xs text-primary">3,247 Active Sensors</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
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
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Why Choose DisastroScope?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Our comprehensive platform combines advanced technology with proven expertise 
              to deliver unmatched disaster prediction and response capabilities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className="p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full overflow-hidden">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground font-poppins">{feature.title}</h3>
                    </div>
                    
                    {/* Feature Image */}
                    <div className="relative overflow-hidden rounded-lg">
                      <img src={feature.image} alt={feature.title} className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed font-inter">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, idx) => <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-foreground font-inter">{benefit}</span>
                        </div>)}
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-4">
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
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Comprehensive Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Our integrated platform provides everything you need for effective disaster management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => <motion.div key={solution.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className="p-6 bg-card border-border/50 hover:shadow-card transition-all duration-300 text-center h-full">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <solution.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground font-poppins">{solution.title}</h3>
                    <p className="text-muted-foreground leading-relaxed font-inter">{solution.description}</p>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-20 px-4">
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
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              AI & ML Intelligent Agents
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Our specialized AI agents work together to provide comprehensive disaster prediction and analysis across multiple hazard types.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiAgents.map((agent, index) => <motion.div key={agent.title} initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1,
            duration: 0.6
          }}>
                <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <agent.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-foreground font-poppins">{agent.title}</h3>
                        <div className="w-12 h-1 bg-gradient-primary rounded-full mt-1"></div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed font-inter">{agent.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground font-poppins">Key Capabilities:</p>
                      {agent.capabilities.map((capability, idx) => <div key={idx} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-foreground font-inter">{capability}</span>
                        </div>)}
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
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
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Trusted by Leaders Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Emergency management professionals and researchers rely on DisastroScope for critical decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
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
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="h-5 w-5 text-warning fill-current" />)}
                    </div>
                    <p className="text-foreground leading-relaxed italic font-inter">"{testimonial.content}"</p>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground font-poppins">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8
        }} className="bg-gradient-card p-12 lg:p-16 rounded-2xl shadow-elevation border border-border/50">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground font-poppins">
                  Ready to Protect Your Community?
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
                  Join thousands of emergency management professionals using DisastroScope 
                  to predict, monitor, and respond to natural disasters more effectively.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow font-medium">
                  <Link to="/dashboard">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary/20 hover:bg-primary/5 font-medium">
                  <Calendar className="mr-2 h-5 w-5" />
                  Schedule Demo
                </Button>
                <Button variant="ghost" size="lg" className="hover:bg-muted/50 font-medium">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Sales
                </Button>
              </div>

              <div className="flex items-center justify-center space-x-8 pt-8 border-t border-border/20">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-warning" />
                  <span className="text-sm text-muted-foreground font-inter">Award-Winning Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-success" />
                  <span className="text-sm text-muted-foreground font-inter">Enterprise Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground font-inter">24/7 Support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>;
}