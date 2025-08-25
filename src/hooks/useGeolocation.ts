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
          // Use a CORS-friendly geolocation service or skip fallback
          // Removed ipapi.co due to CORS restrictions
          console.warn('High accuracy geolocation not available, using available coordinates');
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

  // Simplified reverse geocoding - removed external API calls to prevent CORS issues
  const reverseGeocode = async (lat: number, lng: number) => {
    // Return basic coordinate info without external API calls
    return { 
      city: 'Location', 
      state: 'Coordinates', 
      country: `${lat.toFixed(4)}, ${lng.toFixed(4)}`, 
      coordinates: { lat, lng } 
    };
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