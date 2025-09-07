// Environment configuration for DisastroScope
export const environment = {
  // API Configuration
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://web-production-47673.up.railway.app',
    socketURL: import.meta.env.VITE_SOCKET_URL || 'https://web-production-47673.up.railway.app',
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
    // Optional Copernicus GloFAS WMS overlay config
    glofasWmsUrl: import.meta.env.VITE_GLOFAS_WMS_URL || 'https://geoservices.copernicus.eu/maps/wms',
    glofasWmsLayer: import.meta.env.VITE_GLOFAS_WMS_LAYER || 'EFAS_flood_hazard_rp100',
    glofasWmsAttribution: import.meta.env.VITE_GLOFAS_WMS_ATTRIB || 'Copernicus Emergency Management Service (GloFAS/EFAS)',
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
