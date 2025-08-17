import { useEffect, useRef, useState } from 'react';
// Use require for Anime.js to avoid TypeScript issues
const anime = require('animejs');
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Globe, Shield, Brain, Zap, Play, Satellite, AlertTriangle, Cpu, Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-image.jpg';

export default function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const morphingShapesRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [animationsStarted, setAnimationsStarted] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  useEffect(() => {
    // Wait a bit for elements to be rendered
    const timer = setTimeout(() => {
      if (!animationsStarted) {
        startEntranceAnimations();
        setAnimationsStarted(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [animationsStarted]);

  const startEntranceAnimations = () => {
    // Enhanced entrance animations with more sophisticated timing
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        startContinuousAnimations();
        startParticleSystem();
        startMorphingShapes();
      }
    });

    // Badge entrance with bounce effect
    if (badgeRef.current) {
      timeline.add({
        targets: badgeRef.current,
        translateY: [-100, 0],
        opacity: [0, 1],
        scale: [0.5, 1],
        rotateX: [-90, 0],
        duration: 1200,
        delay: 300,
        easing: 'easeOutBack'
      });
    }

    // Title entrance with advanced stagger and morphing effect
    if (titleRef.current && titleRef.current.children) {
      timeline.add({
        targets: titleRef.current.children,
        translateY: [150, 0],
        opacity: [0, 1],
        rotateX: [90, 0],
        scale: [0.7, 1],
        duration: 1400,
        delay: anime.stagger(200, { start: 600 }),
        easing: 'easeOutQuart'
      });
    }

    // Subtitle entrance with wave effect
    if (subtitleRef.current) {
      timeline.add({
        targets: subtitleRef.current,
        translateY: [80, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 1000,
        offset: '-=800',
        easing: 'easeOutCubic'
      });
    }

    // Buttons entrance with elastic effect
    if (buttonsRef.current && buttonsRef.current.children) {
      timeline.add({
        targets: buttonsRef.current.children,
        translateY: [60, 0],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 800,
        delay: anime.stagger(150, { start: 1200 }),
        easing: 'easeOutBack'
      });
    }

    // Floating elements entrance with spiral effect
    if (floatingElementsRef.current && floatingElementsRef.current.children) {
      timeline.add({
        targets: floatingElementsRef.current.children,
        translateY: anime.stagger([-150, 150]),
        translateX: anime.stagger([-150, 150]),
        opacity: [0, 1],
        scale: [0, 1],
        rotate: anime.stagger([-180, 180]),
        duration: 1600,
        delay: anime.stagger(300, { start: 1000 }),
        easing: 'easeOutQuart'
      });
    }
  };

  const startContinuousAnimations = () => {
    // Enhanced floating animations with more complex paths
    if (floatingElementsRef.current) {
      anime({
        targets: '.floating-element',
        translateY: anime.stagger([-30, 30, -20, 20]),
        translateX: anime.stagger([-20, 20, -15, 15]),
        rotate: anime.stagger([0, 360, -180, 180]),
        scale: [1, 1.15, 0.9, 1.1],
        duration: 6000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        delay: anime.stagger(1500)
      });
    }

    // Advanced orb animations with morphing
    if (orbsRef.current) {
      anime({
        targets: '.floating-orb',
        translateY: anime.stagger([-40, 40, -30, 30]),
        translateX: anime.stagger([-25, 25, -20, 20]),
        scale: [0.7, 1.3, 0.8, 1.2],
        opacity: [0.2, 0.9, 0.3, 0.8],
        duration: 8000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutQuart',
        delay: anime.stagger(2000)
      });
    }

    // Enhanced pulse animation for primary button
    anime({
      targets: '.hero-cta-button',
      scale: [1, 1.03],
      boxShadow: [
        '0 4px 20px rgba(59, 130, 246, 0.3)',
        '0 12px 50px rgba(59, 130, 246, 0.6)'
      ],
      duration: 2500,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });

    // Background grid animation
    anime({
      targets: '.background-grid',
      translateX: [0, 50],
      translateY: [0, 50],
      duration: 20000,
      direction: 'alternate',
      loop: true,
      easing: 'linear'
    });
  };

  const startParticleSystem = () => {
    // Create dynamic particle system
    anime({
      targets: '.particle',
      translateX: anime.stagger([-100, 100]),
      translateY: anime.stagger([-100, 100]),
      scale: [0, 1, 0],
      opacity: [0, 0.8, 0],
      duration: 4000,
      delay: anime.stagger(100),
      loop: true,
      easing: 'easeInOutSine'
    });
  };

  const startMorphingShapes = () => {
    // Morphing geometric shapes
    anime({
      targets: '.morphing-shape',
      scale: [1, 1.5, 0.8, 1.2],
      rotate: [0, 180, 360, 90],
      borderRadius: ['0%', '50%', '0%', '25%'],
      duration: 6000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutQuart',
      delay: anime.stagger(1000)
    });
  };

  useEffect(() => {
    // Enhanced mouse-responsive animations
    if (isHovered) {
      anime({
        targets: '.mouse-responsive',
        translateX: (mousePosition.x - 0.5) * 60,
        translateY: (mousePosition.y - 0.5) * 40,
        rotateY: (mousePosition.x - 0.5) * 25,
        rotateX: (mousePosition.y - 0.5) * -15,
        scale: 1 + Math.abs(mousePosition.x - 0.5) * 0.1,
        duration: 1000,
        easing: 'easeOutQuart'
      });

      anime({
        targets: '.orb-responsive',
        translateX: (mousePosition.x - 0.5) * 100,
        translateY: (mousePosition.y - 0.5) * 100,
        scale: 1 + (mousePosition.x * 0.3),
        duration: 1200,
        easing: 'easeOutQuart'
      });

      // Particle attraction effect
      anime({
        targets: '.particle',
        translateX: (mousePosition.x - 0.5) * 200,
        translateY: (mousePosition.y - 0.5) * 200,
        scale: 1 + Math.abs(mousePosition.x - 0.5) * 0.5,
        duration: 800,
        easing: 'easeOutQuart'
      });
    }
  }, [mousePosition, isHovered]);

  const handleCtaHover = () => {
    anime({
      targets: '.hero-cta-button .lucide-arrow-right',
      translateX: [0, 15],
      scale: [1, 1.3],
      rotate: [0, 15],
      duration: 400,
      easing: 'easeOutBack'
    });

    // Ripple effect on button
    anime({
      targets: '.hero-cta-button',
      scale: [1, 1.05],
      boxShadow: [
        '0 4px 20px rgba(59, 130, 246, 0.3)',
        '0 8px 40px rgba(59, 130, 246, 0.7)'
      ],
      duration: 300,
      easing: 'easeOutQuart'
    });
  };

  const handleCtaLeave = () => {
    anime({
      targets: '.hero-cta-button .lucide-arrow-right',
      translateX: [15, 0],
      scale: [1.3, 1],
      rotate: [15, 0],
      duration: 400,
      easing: 'easeOutBack'
    });

    anime({
      targets: '.hero-cta-button',
      scale: [1.05, 1],
      boxShadow: [
        '0 8px 40px rgba(59, 130, 246, 0.7)',
        '0 4px 20px rgba(59, 130, 246, 0.3)'
      ],
      duration: 300,
      easing: 'easeOutQuart'
    });
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `translate3d(${mousePosition.x * 30}px, ${mousePosition.y * 30}px, 0) scale(1.15)`
        }}
      />
      
      {/* Dynamic gradient overlay with enhanced effects */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(0, 0, 0, 0.7) 40%, 
            rgba(0, 0, 0, 0.9) 100%)`
        }}
      />

      {/* Enhanced floating orbs with glow effects */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-orb orb-responsive absolute top-1/4 left-1/4 w-40 h-40 bg-primary/25 rounded-full blur-2xl shadow-2xl"></div>
        <div className="floating-orb orb-responsive absolute top-3/4 right-1/4 w-32 h-32 bg-secondary/30 rounded-full blur-xl shadow-2xl"></div>
        <div className="floating-orb orb-responsive absolute bottom-1/4 left-1/3 w-48 h-48 bg-accent/20 rounded-full blur-3xl shadow-2xl"></div>
        <div className="floating-orb orb-responsive absolute top-1/2 right-1/3 w-24 h-24 bg-primary/15 rounded-full blur-lg shadow-xl"></div>
      </div>

      {/* Particle system */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 bg-primary/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Morphing shapes */}
      <div ref={morphingShapesRef} className="absolute inset-0 pointer-events-none">
        <div className="morphing-shape absolute top-1/4 right-1/4 w-16 h-16 bg-primary/10 border border-primary/20"></div>
        <div className="morphing-shape absolute bottom-1/3 left-1/4 w-12 h-12 bg-secondary/10 border border-secondary/20"></div>
        <div className="morphing-shape absolute top-2/3 right-1/3 w-20 h-20 bg-accent/10 border border-accent/20"></div>
      </div>

      {/* Enhanced floating decorative elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-element mouse-responsive absolute top-20 left-20">
          <Shield className="w-10 h-10 text-primary/40 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute top-40 right-32">
          <Brain className="w-12 h-12 text-secondary/50 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-40 left-40">
          <Zap className="w-8 h-8 text-accent/60 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-20 right-20">
          <Globe className="w-14 h-14 text-primary/35 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute top-1/2 left-1/4">
          <Satellite className="w-9 h-9 text-secondary/45 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-1/3 right-1/4">
          <Cpu className="w-7 h-7 text-accent/55 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute top-1/3 right-1/5">
          <Network className="w-11 h-11 text-primary/30 drop-shadow-lg" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-1/4 left-1/5">
          <AlertTriangle className="w-6 h-6 text-secondary/40 drop-shadow-lg" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Enhanced Badge */}
        <div ref={badgeRef} className="mb-8 opacity-0">
          <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 px-8 py-4 text-lg backdrop-blur-sm shadow-lg">
            <Globe className="mr-3 h-6 w-6" />
            Advanced Disaster Intelligence Platform
          </Badge>
        </div>

        {/* Enhanced Title with gradient text effect */}
        <h1 ref={titleRef} className="text-6xl lg:text-8xl font-bold mb-8 font-poppins leading-tight">
          <span className="inline-block mouse-responsive bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Predict.</span>{' '}
          <span className="inline-block mouse-responsive bg-gradient-to-r from-foreground/90 to-foreground/70 bg-clip-text text-transparent">Monitor.</span>{' '}
          <span className="inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mouse-responsive">
            Protect.
          </span>
        </h1>

        {/* Enhanced Subtitle */}
        <p 
          ref={subtitleRef} 
          className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-inter opacity-0 backdrop-blur-sm"
        >
          DisastroScope is the world's most advanced disaster prediction and monitoring platform. 
          Using cutting-edge AI and global satellite networks, we help governments and organizations 
          protect communities from natural disasters.
        </p>

        {/* Enhanced Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="hero-cta-button bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:via-primary hover:to-primary/90 text-lg px-10 py-5 opacity-0 shadow-2xl hover:shadow-primary/25 transition-all duration-300"
            onMouseEnter={handleCtaHover}
            onMouseLeave={handleCtaLeave}
          >
            <Link to="/dashboard">
              Get Started
              <ArrowRight className="ml-3 h-6 w-6" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-background/20 backdrop-blur-md border-primary/40 hover:bg-primary/20 text-lg px-10 py-5 opacity-0 shadow-lg hover:shadow-primary/10 transition-all duration-300"
          >
            <Play className="mr-3 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>

      {/* Enhanced animated background grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="background-grid w-full h-full bg-[linear-gradient(rgba(59,130,246,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.4)_1px,transparent_1px)] bg-[size:60px_60px]"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
          }}
        />
      </div>
    </div>
  );
}