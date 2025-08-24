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
    type?: 'disaster' | 'prediction';
  }>;
  showControls?: boolean;
}

export default function MapTilerMap({ 
  width = '100%', 
  height = '600px', 
  location = '',
  zoom = 14,
  mapType = 'streets',
  className = '',
  center = { lat: 0, lng: 0 },
  markers = [],
  showControls = false
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
      attributionControl: false, // Hide attribution for cleaner look
      boxZoom: true,
      doubleClickZoom: true,
      dragPan: true,
      dragRotate: true,
      keyboard: true,
      scrollZoom: true,
      touchZoomRotate: true
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

      // Add navigation controls only if showControls is true
      if (showControls) {
        mapInstanceRef.current.addControl(new window.maplibregl.NavigationControl());
      }

      // Add markers if provided
      markers.forEach(markerData => {
        // Create marker element with distinct styling
        const markerEl = document.createElement('div');
        markerEl.className = 'marker';
        markerEl.style.width = '20px';
        markerEl.style.height = '20px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.border = '3px solid white';
        markerEl.style.cursor = 'pointer';
        markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        markerEl.style.transition = 'all 0.2s ease';
        markerEl.title = markerData.title || '';

        // Set color based on marker type
        if (markerData.type === 'prediction') {
          markerEl.style.backgroundColor = '#3b82f6'; // Blue for predictions
        } else {
          markerEl.style.backgroundColor = '#ef4444'; // Red for disasters
        }

        // Add hover effect
        markerEl.addEventListener('mouseenter', () => {
          markerEl.style.transform = 'scale(1.2)';
          markerEl.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
        });

        markerEl.addEventListener('mouseleave', () => {
          markerEl.style.transform = 'scale(1)';
          markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        });

        // Create popup with better styling
        const popup = new window.maplibregl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px'
        }).setHTML(`
          <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              ${markerData.title || 'Location'}
            </h3>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${markerData.type === 'prediction' ? '#3b82f6' : '#ef4444'}; border: 2px solid white;"></div>
              <span style="font-size: 14px; color: #6b7280; text-transform: capitalize;">
                ${markerData.type || 'event'}
              </span>
            </div>
          </div>
        `);

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
              markerEl.style.width = '20px';
              markerEl.style.height = '20px';
              markerEl.style.borderRadius = '50%';
              markerEl.style.backgroundColor = '#10b981'; // Green for searched location
              markerEl.style.border = '3px solid white';
              markerEl.style.cursor = 'pointer';
              markerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              markerEl.title = location;

              const popup = new window.maplibregl.Popup({ 
                offset: 25,
                closeButton: true,
                closeOnClick: false
              }).setHTML(`
                <div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
                  <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">
                    ${location}
                  </h3>
                  <span style="font-size: 14px; color: #6b7280;">Searched Location</span>
                </div>
              `);

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
  }, [isLoaded, center, zoom, mapType, location, markers, showControls]);

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
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading interactive map...</p>
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
