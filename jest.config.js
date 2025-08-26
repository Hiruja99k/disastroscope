export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'ES2020',
        target: 'ES2020',
        moduleResolution: 'node',
        moduleDetection: 'force',
        allowImportingTsExtensions: true,
        noEmit: true,
      },
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50, // Lower threshold temporarily
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))',
  ],
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:5000',
        VITE_SOCKET_URL: 'http://localhost:5000',
        VITE_ENABLE_REALTIME: 'true',
        VITE_ENABLE_AI: 'true',
        VITE_ENABLE_CHATBOT: 'true',
        VITE_ENABLE_MAPS: 'true',
        VITE_MAPBOX_ACCESS_TOKEN: 'test-token',
        VITE_OPENWEATHER_API_KEY: 'test-key',
        VITE_APP_VERSION: '1.0.0',
        MODE: 'test',
        DEV: false,
        PROD: true,
        VITE_SENTRY_DSN: '',
        VITE_ANALYTICS_ID: '',
        VITE_MAPTILER_API_KEY: 'test-maptiler-key',
      },
    },
  },
};
