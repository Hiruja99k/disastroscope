import { useState, useEffect } from 'react';
import { Geolocation } from '@capacitor/geolocation';

interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  speed?: number;
  heading?: number;
}

interface GeolocationState {
  location: GeolocationData | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    error: null,
    loading: false,
  });

  const getCurrentPosition = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Check if geolocation is available
      const permissions = await Geolocation.checkPermissions();
      
      if (permissions.location === 'denied') {
        const requestResult = await Geolocation.requestPermissions();
        if (requestResult.location === 'denied') {
          throw new Error('Location permission denied');
        }
      }

      let position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      // Fallback to IP geolocation if accuracy is very poor (> 50 km)
      const accuracy = position.coords.accuracy ?? 9999999;
      if (!position.coords || accuracy > 50000) {
        try {
          const resp = await fetch('https://ipapi.co/json/');
          if (resp.ok) {
            const data: any = await resp.json();
            if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
              position = {
                coords: {
                  latitude: data.latitude,
                  longitude: data.longitude,
                  accuracy: 50000,
                  altitude: undefined as any,
                  altitudeAccuracy: undefined as any,
                  heading: undefined as any,
                  speed: undefined as any,
                },
                timestamp: Date.now(),
              } as any;
            }
          }
        } catch (_) {
          // ignore fallback failure
        }
      }

      const locationData: GeolocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude || undefined,
        speed: position.coords.speed || undefined,
        heading: position.coords.heading || undefined,
      };

      setState({
        location: locationData,
        error: null,
        loading: false,
      });

      return locationData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState({
        location: null,
        error: errorMessage,
        loading: false,
      });
      throw new Error(errorMessage);
    }
  };

  const watchPosition = (callback: (location: GeolocationData) => void) => {
    let watchId: string;

    const startWatching = async () => {
      try {
        watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy: true,
            timeout: 10000,
          },
          (position, err) => {
            if (err) {
              setState(prev => ({ ...prev, error: err.message }));
              return;
            }

            if (position) {
              const locationData: GeolocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude || undefined,
                speed: position.coords.speed || undefined,
                heading: position.coords.heading || undefined,
              };

              setState({
                location: locationData,
                error: null,
                loading: false,
              });

              callback(locationData);
            }
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to watch location';
        setState(prev => ({ ...prev, error: errorMessage }));
      }
    };

    startWatching();

    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  };

  // Reverse geocoding with real providers (OSM → BigDataCloud fallback)
  const reverseGeocode = async (lat: number, lng: number) => {
    // Provider 1: OpenStreetMap Nominatim
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`;
      const resp = await fetch(osmUrl, {
        headers: { 'Accept': 'application/json' },
      });
      if (resp.ok) {
        const data: any = await resp.json();
        const addr = data?.address || {};
        const city = addr.city || addr.town || addr.village || addr.hamlet || 'Unknown';
        const state = addr.state || addr.province || addr.region || 'Unknown';
        const country = addr.country || addr.country_code || 'Unknown';
        return { city, state, country, coordinates: { lat, lng } };
      }
    } catch (e) {
      // ignore and fallback
    }

    // Provider 2: BigDataCloud
    try {
      const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
      const resp = await fetch(bdcUrl);
      if (resp.ok) {
        const data: any = await resp.json();
        const city = data.city || data.locality || data.principalSubdivision || 'Unknown';
        const state = data.principalSubdivision || 'Unknown';
        const country = data.countryName || 'Unknown';
        return { city, state, country, coordinates: { lat, lng } };
      }
    } catch (e) {
      // ignore and fallback
    }

    // Fallback
    return { city: 'Unknown', state: 'Unknown', country: 'Unknown', coordinates: { lat, lng } };
  };

  return {
    location: state.location,
    error: state.error,
    loading: state.loading,
    getCurrentPosition,
    watchPosition,
    reverseGeocode,
  };
};