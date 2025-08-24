import React, { useEffect, useRef, useState } from 'react';

interface MapTilerMapProps {
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

export default function MapTilerMap({ 
  width = '100%', 
  height = '600px', 
  location = '',
  zoom = 14,
  mapType = 'basic',
  className = '',
  center = { lat: 0, lng: 0 },
  markers = []
}: MapTilerMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'DOCOM2xq5hJddM7rfMdp';

  useEffect(() => {
    // Load MapTiler GL JS
    const loadMapTiler = () => {
      if (window.maplibregl) {
        console.log('MapTiler GL JS already loaded');
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      console.log('Loading MapTiler GL JS...');

      // Load MapTiler GL JS CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/maplibre-gl@3.6.2/dist/maplibre-gl.css';
      document.head.appendChild(link);

      // Load MapTiler GL JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/maplibre-gl@3.6.2/dist/maplibre-gl.js';
      script.async = true;
      script.onload = () => {
        console.log('MapTiler GL JS loaded successfully');
        setIsLoaded(true);
        setIsLoading(false);
      };
      script.onerror = (error) => {
        console.error('Failed to load MapTiler GL JS:', error);
        setLoadError('Failed to load MapTiler library');
        setIsLoading(false);
      };
      document.head.appendChild(script);
    };

    loadMapTiler();
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    console.log('Initializing MapTiler map...');
    console.log('API Key:', MAPTILER_API_KEY);
    console.log('Map Type:', mapType);
    console.log('Center:', center);
    console.log('Zoom:', zoom);

    // Initialize map
    const mapOptions = {
      container: mapRef.current,
      style: `https://api.maptiler.com/maps/${mapType}/style.json?key=${MAPTILER_API_KEY}`,
      center: [center.lng, center.lat] as [number, number],
      zoom: zoom,
      attributionControl: true
    };

    console.log('Map options:', mapOptions);

    try {
      mapInstanceRef.current = new window.maplibregl.Map(mapOptions);

      mapInstanceRef.current.on('load', () => {
        console.log('Map loaded successfully');
      });

      mapInstanceRef.current.on('error', (error: any) => {
        console.error('Map error:', error);
      });

      // Add navigation controls
      mapInstanceRef.current.addControl(new window.maplibregl.NavigationControl());

      // Add markers if provided
      markers.forEach(markerData => {
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'marker';
        markerEl.style.width = '25px';
        markerEl.style.height = '25px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.backgroundColor = '#ff4444';
        markerEl.style.border = '2px solid white';
        markerEl.style.cursor = 'pointer';
        markerEl.title = markerData.title || '';

        // Create popup
        const popup = new window.maplibregl.Popup({ offset: 25 }).setHTML(
          `<h3>${markerData.title || 'Location'}</h3>`
        );

        // Add marker to map
        new window.maplibregl.Marker({ element: markerEl })
          .setLngLat([markerData.position.lng, markerData.position.lat])
          .setPopup(popup)
          .addTo(mapInstanceRef.current);
      });

      // If location string is provided, geocode it
      if (location && location.trim()) {
        // Simple geocoding using MapTiler's geocoding API
        fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${MAPTILER_API_KEY}`)
          .then(response => response.json())
          .then(data => {
            if (data.features && data.features.length > 0) {
              const [lng, lat] = data.features[0].center;
              mapInstanceRef.current.setCenter([lng, lat]);
              
              // Add a marker for the searched location
              const markerEl = document.createElement('div');
              markerEl.className = 'marker';
              markerEl.style.width = '25px';
              markerEl.style.height = '25px';
              markerEl.style.borderRadius = '50%';
              markerEl.style.backgroundColor = '#4444ff';
              markerEl.style.border = '2px solid white';
              markerEl.style.cursor = 'pointer';
              markerEl.title = location;

              const popup = new window.maplibregl.Popup({ offset: 25 }).setHTML(
                `<h3>${location}</h3>`
              );

              new window.maplibregl.Marker({ element: markerEl })
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(mapInstanceRef.current);
            }
          })
          .catch(error => {
            console.error('Geocoding error:', error);
          });
      }
    } catch (error) {
      console.error('Error initializing MapTiler map:', error);
      setLoadError('Failed to initialize map');
    }
  }, [isLoaded, center, zoom, mapType, location, markers]);

  if (loadError) {
    return (
      <div 
        className={`flex items-center justify-center bg-red-50 dark:bg-red-900/20 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-sm text-red-600 dark:text-red-400">Map Error: {loadError}</p>
          <p className="text-xs text-gray-500 mt-1">API Key: {MAPTILER_API_KEY.substring(0, 8)}...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading MapTiler map...</p>
          <p className="text-xs text-gray-500 mt-1">API Key: {MAPTILER_API_KEY.substring(0, 8)}...</p>
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
