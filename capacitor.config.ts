import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.963235aee0a44d9685e27680a9692d55',
  appName: 'disastroscope-future-watch',
  webDir: 'dist',
  server: {
    url: 'https://963235ae-e0a4-4d96-85e2-7680a9692d55.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Geolocation: {
      permissions: ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION']
    }
  }
};

export default config;