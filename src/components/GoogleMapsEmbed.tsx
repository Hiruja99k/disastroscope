import React, { useEffect, useRef, useState } from 'react';

interface GoogleMapsEmbedProps {
  width?: string;
  height?: string;
  location?: string;
  zoom?: number;
  mapType?: string;
  className?: string;
  center?: { lat: number; lng: number };
  markers?: Array<{
    position: { lat: number; lng: number };
    title?: string;
    icon?: string;
  }>;
}

// TypeScript types are defined in src/types/google-maps.d.ts

export default function GoogleMapsEmbed({ 
  width = '100%', 
  height = '600px', 
  location = '',
  zoom = 14,
  mapType = 'roadmap',
  className = '',
  center = { lat: 0, lng: 0 },
  markers = []
}: GoogleMapsEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDz0Pktpw75btj-mpxR1j-8Pp7149y1qgY';

  useEffect(() => {
    // Load Google Maps API script
    const loadGoogleMapsAPI = () => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        console.error('Failed to load Google Maps API');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsAPI();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // Initialize map
    const mapOptions = {
      center: center,
      zoom: zoom,
      mapTypeId: mapType === 's' ? 'satellite' : 
                 mapType === 'h' ? 'hybrid' : 
                 mapType === 't' ? 'terrain' : 'roadmap',
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      scaleControl: true,
      rotateControl: true,
      tilt: 0
    };

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add markers if provided
      markers.forEach(markerData => {
        new window.google.maps.Marker({
          position: markerData.position,
          map: mapInstanceRef.current,
          title: markerData.title || '',
          icon: markerData.icon
        });
      });

      // If location string is provided, geocode it
      if (location && location.trim()) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results: any, status: any) => {
          if (status === 'OK' && results[0]) {
            const locationCenter = results[0].geometry.location;
            mapInstanceRef.current.setCenter(locationCenter);
            
            // Add a marker for the searched location
            new window.google.maps.Marker({
              position: locationCenter,
              map: mapInstanceRef.current,
              title: location,
              animation: window.google.maps.Animation.DROP
            });
          }
        });
      }
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
    }
  }, [isLoaded, center, zoom, mapType, location, markers]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className={className}
      style={{ width, height }}
    />
  );
}
