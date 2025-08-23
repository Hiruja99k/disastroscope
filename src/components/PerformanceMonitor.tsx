import { useEffect } from 'react';
import { trackPerformance } from '@/utils/monitoring';

/**
 * Component to monitor and track performance metrics
 */
export function PerformanceMonitor() {
  useEffect(() => {
    // Track Core Web Vitals when available
    if (typeof window !== 'undefined') {
      // Monitor Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            trackPerformance('LCP', entry.startTime, 'ms');
          }
          
          if (entry.entryType === 'first-input') {
            trackPerformance('FID', entry.processingStart - entry.startTime, 'ms');
          }
          
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            trackPerformance('CLS', entry.value, 'score');
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        // Observer not supported in this environment
        console.warn('Performance Observer not supported');
      }

      // Track page load performance
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            // Track various performance metrics
            trackPerformance('DOMContentLoaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
            trackPerformance('LoadComplete', navigation.loadEventEnd - navigation.fetchStart, 'ms');
            trackPerformance('FirstByte', navigation.responseStart - navigation.fetchStart, 'ms');
            trackPerformance('DOMInteractive', navigation.domInteractive - navigation.fetchStart, 'ms');
          }

          // Track resource loading
          const resources = performance.getEntriesByType('resource');
          const scripts = resources.filter(r => r.name.includes('.js'));
          const styles = resources.filter(r => r.name.includes('.css'));
          const images = resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/));

          if (scripts.length > 0) {
            const totalScriptTime = scripts.reduce((sum, script) => sum + script.duration, 0);
            trackPerformance('TotalScriptLoadTime', totalScriptTime, 'ms');
          }

          if (styles.length > 0) {
            const totalStyleTime = styles.reduce((sum, style) => sum + style.duration, 0);
            trackPerformance('TotalStyleLoadTime', totalStyleTime, 'ms');
          }

          if (images.length > 0) {
            const totalImageTime = images.reduce((sum, image) => sum + image.duration, 0);
            trackPerformance('TotalImageLoadTime', totalImageTime, 'ms');
          }
        }, 0);
      });

      // Track memory usage if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        trackPerformance('JSHeapSizeUsed', memory.usedJSHeapSize / 1024 / 1024, 'MB');
        trackPerformance('JSHeapSizeTotal', memory.totalJSHeapSize / 1024 / 1024, 'MB');
        trackPerformance('JSHeapSizeLimit', memory.jsHeapSizeLimit / 1024 / 1024, 'MB');
      }

      // Cleanup
      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return null; // This component doesn't render anything
}

/**
 * Higher-order component to measure component render time
 */
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName: string
) {
  return function PerformanceTrackedComponent(props: T) {
    useEffect(() => {
      const startTime = performance.now();
      
      return () => {
        const endTime = performance.now();
        trackPerformance(`${componentName}RenderTime`, endTime - startTime, 'ms');
      };
    });

    return <WrappedComponent {...props} />;
  };
}

/**
 * Hook to measure function execution time
 */
export function usePerformanceMeasure() {
  return function measurePerformance<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: Parameters<T>) => {
      const startTime = performance.now();
      const result = fn(...args);
      const endTime = performance.now();
      
      trackPerformance(name, endTime - startTime, 'ms');
      
      return result;
    }) as T;
  };
}

export default PerformanceMonitor;
