import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export const useGSAPAnimations = () => {
  const animatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = animatedRef.current;
    if (!element) return;

    // Set initial state
    gsap.set(element, { opacity: 0, y: 50 });

    // Create scroll-triggered animation
    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return animatedRef;
};

export const useGSAPStagger = (selector: string, delay: number = 0.1) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    
    gsap.set(elements, { opacity: 0, y: 30 });

    const animation = gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    return () => {
      animation.kill();
    };
  }, [selector, delay]);

  return containerRef;
};

export const useGSAPHover = () => {
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = hoverRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        rotationY: 5,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        rotationY: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return hoverRef;
};

export const useGSAPParallax = (speed: number = 0.5) => {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = parallaxRef.current;
    if (!element) return;

    const animation = gsap.to(element, {
      yPercent: -50 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      animation.kill();
    };
  }, [speed]);

  return parallaxRef;
};

export const useGSAPCountUp = (endValue: number, duration: number = 2) => {
  const countRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef({ value: 0 });

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    const animation = gsap.to(valueRef.current, {
      value: endValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (element) {
          element.textContent = Math.floor(valueRef.current.value).toString();
        }
      },
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    return () => {
      animation.kill();
    };
  }, [endValue, duration]);

  return countRef;
};

export const useGSAPTimeline = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const createTimeline = () => {
    return gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });
  };

  return { timelineRef, createTimeline };
};