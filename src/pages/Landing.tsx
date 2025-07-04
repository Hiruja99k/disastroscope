import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Database, 
  Globe, 
  BarChart, 
  Bell,
  Zap,
  Shield,
  Brain,
  Satellite,
  Activity,
  Target,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Cloud,
  Eye,
  Rocket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useEffect, useState } from 'react';
import heroImage from '@/assets/hero-image.jpg';

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Matrix rain effect
const MatrixRain = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute text-primary/30 text-xs font-mono animate-matrix-rain"
          style={{
            left: `${i * 5}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 2}s`
          }}
        >
          01010101
        </div>
      ))}
    </div>
  );
};

// Scanning line effect
const ScanningLine = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-scan opacity-50" />
    </div>
  );
};

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'Neural Prediction Engine',
      description: 'Quantum-enhanced AI algorithms process 10TB+ of satellite data per second',
      stats: '99.7% Accuracy',
      color: 'text-primary',
      delay: 0.1
    },
    {
      icon: Satellite,
      title: 'Global Sensor Network',
      description: 'Real-time monitoring through 847 satellites and 50,000+ ground sensors',
      stats: '24/7 Coverage',
      color: 'text-secondary',
      delay: 0.2
    },
    {
      icon: Zap,
      title: 'Instant Alert System',
      description: 'Sub-second threat detection with automated emergency response protocols',
      stats: '0.3s Response',
      color: 'text-warning',
      delay: 0.3
    },
    {
      icon: Shield,
      title: 'Risk Mitigation AI',
      description: 'Predictive modeling for disaster impact assessment and evacuation planning',
      stats: '10M+ Protected',
      color: 'text-success',
      delay: 0.4
    }
  ];

  const techStack = [
    { name: 'Quantum Computing', icon: Cpu, progress: 94 },
    { name: 'Satellite Networks', icon: Globe, progress: 98 },
    { name: 'AI/ML Models', icon: Brain, progress: 96 },
    { name: 'Edge Computing', icon: Cloud, progress: 92 },
    { name: 'IoT Sensors', icon: Activity, progress: 89 },
    { name: 'Blockchain Security', icon: Shield, progress: 95 }
  ];

  const disasterTypes = [
    { name: 'Earthquakes', count: '1,247', trend: '+12%', icon: Zap, color: 'text-warning' },
    { name: 'Wildfires', count: '893', trend: '-8%', icon: Bell, color: 'text-destructive' },
    { name: 'Floods', count: '2,156', trend: '+15%', icon: Database, color: 'text-primary' },
    { name: 'Landslides', count: '567', trend: '+3%', icon: Target, color: 'text-secondary' }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Background Effects */}
      <FloatingParticles />
      <MatrixRain />
      
      {/* Interactive cursor glow */}
      <div
        className="fixed w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none z-0"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
          transition: 'all 0.3s ease-out'
        }}
      />

      {/* Hero Section */}
      <motion.section 
        style={{ y: textY }}
        className="relative pt-32 pb-20 px-4 overflow-hidden z-10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8 relative"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-orbitron text-sm px-4 py-2">
                    🚀 NEXT-GEN DISASTER INTELLIGENCE
                  </Badge>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-6xl lg:text-8xl font-orbitron font-black text-foreground leading-none tracking-tight"
                >
                  DISASTRO
                  <br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent animate-glow-pulse">
                    SCOPE
                  </span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="text-xl lg:text-2xl text-muted-foreground font-exo leading-relaxed max-w-2xl"
                >
                  Revolutionary <span className="text-primary font-semibold">AI-powered platform</span> for 
                  real-time disaster prediction, monitoring, and response coordination. 
                  Protecting humanity through <span className="text-secondary font-semibold">quantum intelligence</span>.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow group font-orbitron text-lg px-8 py-4 h-auto">
                  <Link to="/dashboard">
                    <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                    LAUNCH MISSION CONTROL
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-orbitron text-lg px-8 py-4 h-auto">
                  <Eye className="mr-3 h-6 w-6" />
                  WATCH SIMULATION
                </Button>
              </motion.div>

              {/* Live Stats */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                {[
                  { label: 'Prediction Accuracy', value: '99.7%', icon: Target },
                  { label: 'Global Coverage', value: '195 Countries', icon: Globe },
                  { label: 'Response Time', value: '0.3 Seconds', icon: Zap }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                    className="text-center relative group"
                  >
                    <div className="relative">
                      <ScanningLine />
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:animate-pulse-glow">
                        <stat.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="text-xl font-bold text-primary font-orbitron">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-exo">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Enhanced Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative">
                <motion.div
                  style={{ y: backgroundY }}
                  className="relative overflow-hidden rounded-2xl shadow-elevation group"
                >
                  <img
                    src={heroImage}
                    alt="DisastroScope Command Center"
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
                  
                  {/* Animated overlays */}
                  <div className="absolute inset-0">
                    <ScanningLine />
                  </div>
                  
                  {/* Floating status cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 30, rotate: -5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                    className="absolute top-6 right-6 bg-card/90 backdrop-blur-lg p-4 rounded-xl shadow-elevation border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground font-orbitron">SYSTEM STATUS</p>
                        <p className="text-xs text-success font-exo">ALL SYSTEMS OPERATIONAL</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30, rotate: 5 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ delay: 1.7, duration: 0.8 }}
                    className="absolute bottom-6 left-6 bg-card/90 backdrop-blur-lg p-4 rounded-xl shadow-elevation border border-border/50"
                  >
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-warning animate-pulse" />
                      <div>
                        <p className="text-sm font-semibold text-foreground font-orbitron">ACTIVE THREATS</p>
                        <p className="text-xs text-warning font-exo">3 HIGH PRIORITY ALERTS</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Holographic elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Technology Stack Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-orbitron font-bold text-foreground mb-6">
              QUANTUM-POWERED TECHNOLOGY
            </h2>
            <p className="text-xl text-muted-foreground font-exo max-w-3xl mx-auto">
              Leveraging cutting-edge quantum computing, AI, and satellite networks for unparalleled disaster prediction capabilities.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {techStack.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-500 hover:scale-105 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <tech.icon className="h-8 w-8 text-primary group-hover:animate-pulse" />
                      <span className="text-2xl font-bold text-primary font-orbitron">{tech.progress}%</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground font-orbitron mb-2">{tech.name}</h3>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.progress}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        className="bg-gradient-primary h-2 rounded-full"
                      />
                    </div>
                  </div>
                  <ScanningLine />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Advanced Features Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-orbitron font-bold text-foreground mb-6">
              MISSION-CRITICAL CAPABILITIES
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                className="group"
              >
                <Card className="p-8 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-500 h-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 group-hover:animate-pulse-glow">
                        <feature.icon className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-foreground font-orbitron">{feature.title}</h3>
                          <Badge variant="outline" className={`${feature.color} bg-current/10 border-current/30 font-orbitron`}>
                            {feature.stats}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-exo leading-relaxed text-lg">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                  <ScanningLine />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Live Disaster Monitoring */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-orbitron font-bold text-foreground mb-6">
              REAL-TIME THREAT ANALYSIS
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disasterTypes.map((disaster, index) => (
              <motion.div
                key={disaster.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group"
              >
                <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-elevation transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 text-center space-y-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto group-hover:animate-pulse-glow">
                      <disaster.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground font-orbitron">{disaster.name}</h3>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary font-orbitron">{disaster.count}</div>
                      <div className={`text-sm font-medium ${disaster.trend.startsWith('+') ? 'text-warning' : 'text-success'} font-exo`}>
                        {disaster.trend} this month
                      </div>
                    </div>
                  </div>
                  <ScanningLine />
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20 px-4 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-card p-12 lg:p-16 rounded-3xl shadow-elevation border border-border/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-orbitron font-bold text-foreground mb-6">
                JOIN THE MISSION
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground font-exo mb-10 leading-relaxed">
                Be part of the next generation of disaster prevention technology. 
                Help us build a <span className="text-primary font-semibold">safer tomorrow</span> for humanity.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button asChild size="lg" className="bg-gradient-primary hover:shadow-glow font-orbitron text-lg px-8 py-4 h-auto group">
                  <Link to="/dashboard">
                    <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                    ACCESS COMMAND CENTER
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 font-orbitron text-lg px-8 py-4 h-auto">
                  <Brain className="mr-3 h-6 w-6" />
                  AI RESEARCH PARTNERSHIP
                </Button>
              </div>
            </div>
            <ScanningLine />
            <MatrixRain />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}