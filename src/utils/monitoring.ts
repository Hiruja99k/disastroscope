import { environment } from '@/config/environment';

// Simple monitoring utility - can be extended with Sentry, LogRocket, etc.
class Monitoring {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = environment.monitoring.sentryDsn !== '' || environment.app.isProduction;
  }

  /**
   * Track user events and actions
   */
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (!this.isEnabled) return;

    try {
      // Log to console in development
      if (environment.app.isDevelopment) {
        console.log('📊 Event:', eventName, properties);
      }

      // TODO: Send to analytics service in production
      // Example: Google Analytics, Mixpanel, etc.
      if (environment.app.isProduction && environment.monitoring.analyticsId) {
        // gtag('event', eventName, properties);
      }
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  /**
   * Track errors and exceptions
   */
  trackError(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) return;

    try {
      // Log to console in development
      if (environment.app.isDevelopment) {
        console.error('🚨 Error:', error, context);
      }

      // TODO: Send to error reporting service in production
      // Example: Sentry, LogRocket, etc.
      if (environment.app.isProduction && environment.monitoring.sentryDsn) {
        // Sentry.captureException(error, { extra: context });
      }
    } catch (err) {
      console.warn('Failed to track error:', err);
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName: string, value: number, unit: string = 'ms') {
    if (!this.isEnabled) return;

    try {
      // Log to console in development
      if (environment.app.isDevelopment) {
        console.log(`⚡ Performance: ${metricName} = ${value}${unit}`);
      }

      // TODO: Send to performance monitoring service
      // Example: Web Vitals, custom metrics
      if (environment.app.isProduction) {
        // web-vitals.getCLS(console.log);
        // web-vitals.getFID(console.log);
        // web-vitals.getFCP(console.log);
        // web-vitals.getLCP(console.log);
        // web-vitals.getTTFB(console.log);
      }
    } catch (error) {
      console.warn('Failed to track performance:', error);
    }
  }

  /**
   * Track page views
   */
  trackPageView(pageName: string, properties?: Record<string, any>) {
    this.trackEvent('page_view', {
      page: pageName,
      url: window.location.href,
      ...properties,
    });
  }

  /**
   * Track API calls
   */
  trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    this.trackEvent('api_call', {
      endpoint,
      method,
      duration,
      status,
      success: status >= 200 && status < 300,
    });

    this.trackPerformance(`api_${method}_${endpoint}`, duration);
  }
}

// Export singleton instance
export const monitoring = new Monitoring();

// Convenience functions
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  monitoring.trackEvent(eventName, properties);
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  monitoring.trackError(error, context);
};

export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  monitoring.trackPageView(pageName, properties);
};

export const trackApiCall = (endpoint: string, method: string, duration: number, status: number) => {
  monitoring.trackApiCall(endpoint, method, duration, status);
};
