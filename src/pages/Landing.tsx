import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, Brain, Globe, Zap, BarChart, Users, Target, CheckCircle, Star, Award, TrendingUp, Database, Activity, Bell, Eye, Play, Download, Calendar, Phone, Mail, Satellite, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import heroImage from '@/assets/hero-image.jpg';
export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const features = [{
    icon: Brain,
    title: 'AI-Powered Predictions',
    description: 'Advanced machine learning algorithms analyze millions of data points to predict disasters with 94.2% accuracy',
    benefits: ['Real-time analysis', 'Pattern recognition', 'Predictive modeling']
  }, {
    icon: Globe,
    title: 'Global Monitoring Network',
    description: 'Comprehensive coverage across 195 countries with 24/7 satellite surveillance and ground sensors',
    benefits: ['Worldwide coverage', '24/7 monitoring', 'Multi-source data']
  }, {
    icon: Zap,
    title: 'Instant Alert System',
    description: 'Sub-second threat detection with automated notifications to emergency services and affected communities',
    benefits: ['Instant notifications', 'Multi-channel alerts', 'Emergency integration']
  }, {
    icon: Shield,
    title: 'Risk Assessment',
    description: 'Comprehensive vulnerability analysis and impact assessment for informed decision-making',
    benefits: ['Risk modeling', 'Impact analysis', 'Decision support']
  }];
  const solutions = [{
    icon: Database,
    title: 'Data Integration Platform',
    description: 'Seamlessly integrate multiple data sources including satellite imagery, weather stations, and IoT sensors'
  }, {
    icon: BarChart,
    title: 'Analytics Dashboard',
    description: 'Comprehensive visualization tools for monitoring trends, analyzing patterns, and generating reports'
  }, {
    icon: Bell,
    title: 'Alert Management',
    description: 'Customizable notification system with multi-level alerts and automated response protocols'
  }, {
    icon: Users,
    title: 'Collaboration Tools',
    description: 'Multi-agency coordination platform for emergency responders, government, and relief organizations'
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
      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3"></div>
        {[...Array(30)].map((_, i) => <motion.div key={i} className="absolute w-px h-px bg-primary/30 rounded-full" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }} animate={{
        y: [0, -30, 0],
        opacity: [0.1, 0.6, 0.1],
        scale: [1, 1.5, 1]
      }} transition={{
        duration: 4 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 3,
        ease: "easeInOut"
      }} />)}
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => <motion.div key={`particle-${i}`} className="absolute w-1 h-1 bg-secondary/20 rounded-full" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`
      }} animate={{
        x: [0, 20, -20, 0],
        y: [0, -40, 0],
        opacity: [0.2, 0.8, 0.2]
      }} transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        delay: Math.random() * 4,
        ease: "linear"
      }} />)}
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
              }} className="text-xl text-muted-foreground leading-relaxed font-inter">
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
            }} className="flex flex-col sm:flex-row gap-4">
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
                <Card className="p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-semibold text-foreground font-poppins">{feature.title}</h3>
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