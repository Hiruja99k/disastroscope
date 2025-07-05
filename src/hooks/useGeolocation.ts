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

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

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

  // Reverse geocoding function (mock implementation)
  const reverseGeocode = async (lat: number, lng: number) => {
    // In a real app, you'd use a geocoding service like Google Maps API
    // For demo purposes, we'll return mock location data
    const mockLocations = [
      { lat: 40.7128, lng: -74.0060, city: 'New York', state: 'NY', country: 'USA' },
      { lat: 34.0522, lng: -118.2437, city: 'Los Angeles', state: 'CA', country: 'USA' },
      { lat: 25.7617, lng: -80.1918, city: 'Miami', state: 'FL', country: 'USA' },
      { lat: 37.7749, lng: -122.4194, city: 'San Francisco', state: 'CA', country: 'USA' },
      { lat: 41.8781, lng: -87.6298, city: 'Chicago', state: 'IL', country: 'USA' },
    ];

    // Find closest location
    let closest = mockLocations[0];
    let minDistance = Math.abs(lat - closest.lat) + Math.abs(lng - closest.lng);

    for (const location of mockLocations) {
      const distance = Math.abs(lat - location.lat) + Math.abs(lng - location.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = location;
      }
    }

    return {
      city: closest.city,
      state: closest.state,
      country: closest.country,
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