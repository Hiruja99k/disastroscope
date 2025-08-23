import '@testing-library/jest-dom';

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_API_BASE_URL: 'http://localhost:5000',
      VITE_SOCKET_URL: 'http://localhost:5000',
      VITE_ENABLE_REALTIME: 'true',
      VITE_ENABLE_AI: 'true',
      VITE_ENABLE_CHATBOT: 'true',
      VITE_ENABLE_MAPS: 'true',
      VITE_MAPBOX_ACCESS_TOKEN: '',
      VITE_OPENWEATHER_API_KEY: '',
      VITE_APP_VERSION: '1.0.0',
      MODE: 'test',
      DEV: false,
      PROD: false,
      VITE_SENTRY_DSN: '',
      VITE_ANALYTICS_ID: '',
    },
  },
});

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;
