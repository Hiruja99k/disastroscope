// Environment configuration for DisastroScope
export const environment = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    socketURL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000',
    timeout: 10000,
    retries: 3,
  },
  
  // Feature Flags
  features: {
    enableRealTime: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    enableAI: import.meta.env.VITE_ENABLE_AI !== 'false',
    enableChatbot: import.meta.env.VITE_ENABLE_CHATBOT !== 'false',
    enableMaps: import.meta.env.VITE_ENABLE_MAPS !== 'false',
  },
  
  // External Services
  services: {
    mapboxToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
    mapTilerKey: import.meta.env.VITE_MAPTILER_API_KEY || '',
    openWeatherKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '',
  },
  
  // Application Settings
  app: {
    name: 'DisastroScope',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
  
  // Monitoring & Analytics
  monitoring: {
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || '',
    analyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
  },
} as const;

// Type-safe environment access
export type Environment = typeof environment;
