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
import AnimatedHero from '@/components/AnimatedHero';
import GSAPEnhancedCard from '@/components/GSAPEnhancedCard';
import StatCounter from '@/components/StatCounter';
import { useGSAPStagger, useGSAPParallax } from '@/hooks/useGSAPAnimations';
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
  
  // GSAP animation refs
  const featuresRef = useGSAPStagger('.feature-card', 0.2);
  const statsRef = useGSAPStagger('.stat-item', 0.1);
  const parallaxRef = useGSAPParallax(0.3);
  
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

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Hero Section with AnimeJS */}
      <AnimatedHero />

      {/* Features Grid with GSAP */}
      <section className="py-20 relative" ref={parallaxRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">
              Platform Features
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Comprehensive Disaster Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Our platform combines cutting-edge technology with global data networks to provide 
              unprecedented insights into natural disaster patterns and risks.
            </p>
          </div>

          <div ref={featuresRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <GSAPEnhancedCard key={index} className="feature-card p-6 h-full bg-gradient-card" delay={index * 100}>
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2 font-poppins">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4 font-inter text-sm leading-relaxed">{feature.description}</p>
                </div>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-muted/30">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </GSAPEnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with GSAP Count Animation */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-16">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mb-4">
              Global Impact
            </Badge>
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Protecting Communities Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Our platform has made a measurable impact on disaster preparedness and response globally.
            </p>
          </div>

          <div ref={statsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <GSAPEnhancedCard key={index} className="stat-item text-center p-6" delay={index * 150}>
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-foreground mb-2 font-poppins group-hover:text-primary transition-colors">
                  <StatCounter value={stat.number} />
                </div>
                <div className="text-muted-foreground font-inter">{stat.label}</div>
              </GSAPEnhancedCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4 font-poppins">
              Trusted by Leaders Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
              Emergency management professionals and researchers rely on DisastroScope for critical decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.name} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="p-8 bg-card border-border/50 hover:shadow-elevation transition-all duration-300 h-full">
                  <div className="space-y-6">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-warning fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed italic font-inter">"{testimonial.content}"</p>
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground font-poppins">{testimonial.name}</p>
                      <p className="text-sm text-primary">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.organization}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            className="bg-gradient-card p-12 lg:p-16 rounded-2xl shadow-elevation border border-border/50"
          >
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
    </div>
  );
}