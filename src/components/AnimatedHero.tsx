import { useEffect, useRef, useState } from 'react';
// @ts-ignore
import anime from 'animejs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Globe, Shield, Brain, Zap, Play } from 'lucide-react';
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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
    // Initial entrance animations
    const timeline = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        // Start continuous animations after entrance
        startContinuousAnimations();
      }
    });

    // Badge entrance
    timeline.add({
      targets: badgeRef.current,
      translateY: [-50, 0],
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 800,
      delay: 200
    });

    // Title entrance with stagger effect
    timeline.add({
      targets: titleRef.current?.children,
      translateY: [100, 0],
      opacity: [0, 1],
      rotateX: [90, 0],
      scale: [0.9, 1],
      duration: 1000,
      delay: anime.stagger(150),
      offset: '-=600'
    });

    // Subtitle entrance
    timeline.add({
      targets: subtitleRef.current,
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 800,
      offset: '-=400'
    });

    // Buttons entrance
    timeline.add({
      targets: buttonsRef.current?.children,
      translateY: [50, 0],
      opacity: [0, 1],
      scale: [0.9, 1],
      duration: 600,
      delay: anime.stagger(100),
      offset: '-=400'
    });

    // Floating elements entrance
    timeline.add({
      targets: floatingElementsRef.current?.children,
      translateY: anime.stagger([100, -100]),
      translateX: anime.stagger([-100, 100]),
      opacity: [0, 1],
      scale: [0, 1],
      rotate: anime.stagger([0, 180]),
      duration: 1200,
      delay: anime.stagger(200),
      offset: '-=800'
    });

  }, []);

  const startContinuousAnimations = () => {
    // Floating animations for decorative elements
    anime({
      targets: '.floating-element',
      translateY: [-20, 20],
      rotate: ['0deg', '10deg'],
      scale: [1, 1.1],
      duration: 4000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: anime.stagger(1000)
    });

    // Orb animations
    anime({
      targets: '.floating-orb',
      translateY: [-30, 30],
      translateX: [-15, 15],
      scale: [0.8, 1.2],
      opacity: [0.3, 0.8],
      duration: 6000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
      delay: anime.stagger(2000)
    });

    // Pulse animation for primary button
    anime({
      targets: '.hero-cta-button',
      scale: [1, 1.02],
      boxShadow: [
        '0 4px 20px rgba(59, 130, 246, 0.3)',
        '0 8px 40px rgba(59, 130, 246, 0.5)'
      ],
      duration: 2000,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine'
    });
  };

  useEffect(() => {
    // Mouse-responsive animations
    if (isHovered) {
      anime({
        targets: '.mouse-responsive',
        translateX: (mousePosition.x - 0.5) * 50,
        translateY: (mousePosition.y - 0.5) * 30,
        rotateY: (mousePosition.x - 0.5) * 20,
        rotateX: (mousePosition.y - 0.5) * -10,
        duration: 800,
        easing: 'easeOutQuart'
      });

      anime({
        targets: '.orb-responsive',
        translateX: (mousePosition.x - 0.5) * 80,
        translateY: (mousePosition.y - 0.5) * 80,
        scale: 1 + (mousePosition.x * 0.2),
        duration: 1000,
        easing: 'easeOutQuart'
      });
    }
  }, [mousePosition, isHovered]);

  const handleCtaHover = () => {
    anime({
      targets: '.hero-cta-button .lucide-arrow-right',
      translateX: [0, 10],
      scale: [1, 1.2],
      duration: 300,
      easing: 'easeOutBack'
    });
  };

  const handleCtaLeave = () => {
    anime({
      targets: '.hero-cta-button .lucide-arrow-right',
      translateX: [10, 0],
      scale: [1.2, 1],
      duration: 300,
      easing: 'easeOutBack'
    });
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background with parallax effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0) scale(1.1)`
        }}
      />
      
      {/* Dynamic gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/85 to-background/95"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(59, 130, 246, 0.1) 0%, 
            rgba(0, 0, 0, 0.8) 50%, 
            rgba(0, 0, 0, 0.9) 100%)`
        }}
      />

      {/* Floating orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-orb orb-responsive absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="floating-orb orb-responsive absolute top-3/4 right-1/4 w-24 h-24 bg-secondary/20 rounded-full blur-xl"></div>
        <div className="floating-orb orb-responsive absolute bottom-1/4 left-1/3 w-40 h-40 bg-accent/15 rounded-full blur-2xl"></div>
      </div>

      {/* Floating decorative elements */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="floating-element mouse-responsive absolute top-20 left-20">
          <Shield className="w-8 h-8 text-primary/30" />
        </div>
        <div className="floating-element mouse-responsive absolute top-40 right-32">
          <Brain className="w-10 h-10 text-secondary/40" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-40 left-40">
          <Zap className="w-6 h-6 text-accent/50" />
        </div>
        <div className="floating-element mouse-responsive absolute bottom-20 right-20">
          <Globe className="w-12 h-12 text-primary/25" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div ref={badgeRef} className="mb-8 opacity-0">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-6 py-3 text-lg">
            <Globe className="mr-3 h-5 w-5" />
            Advanced Disaster Intelligence Platform
          </Badge>
        </div>

        {/* Title */}
        <h1 ref={titleRef} className="text-6xl lg:text-8xl font-bold mb-8 font-poppins leading-tight">
          <span className="inline-block mouse-responsive">Predict.</span>{' '}
          <span className="inline-block mouse-responsive">Monitor.</span>{' '}
          <span className="inline-block bg-gradient-primary bg-clip-text text-transparent mouse-responsive">
            Protect.
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          ref={subtitleRef} 
          className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-inter opacity-0"
        >
          DisastroScope is the world's most advanced disaster prediction and monitoring platform. 
          Using cutting-edge AI and global satellite networks, we help governments and organizations 
          protect communities from natural disasters.
        </p>

        {/* Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            asChild 
            size="lg" 
            className="hero-cta-button bg-gradient-primary hover:shadow-glow text-lg px-8 py-4 opacity-0"
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
            className="bg-background/10 backdrop-blur-sm border-primary/30 hover:bg-primary/10 text-lg px-8 py-4 opacity-0"
          >
            <Play className="mr-3 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
      </div>

      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div 
          className="w-full h-full bg-[linear-gradient(rgba(59,130,246,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[size:50px_50px]"
          style={{
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`
          }}
        />
      </div>
    </div>
  );
}