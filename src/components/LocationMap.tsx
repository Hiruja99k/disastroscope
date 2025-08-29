import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation } from 'lucide-react';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address?: string;
  height?: number;
  accuracy?: number;
}

const LocationMap: React.FC<LocationMapProps> = ({ 
  latitude, 
  longitude, 
  address, 
  height = 200,
  accuracy
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const mapboxToken = 'pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw';

  useEffect(() => {
    if (!mapContainer.current) return;

    // Load Mapbox GL JS dynamically
    const loadMapbox = async () => {
      try {
        // Add Mapbox CSS if not already loaded
        if (!document.querySelector('link[href*="mapbox-gl.css"]')) {
          const link = document.createElement('link');
          link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }

        // Load Mapbox GL JS if not already loaded
        if (!(window as any).mapboxgl) {
          const script = document.createElement('script');
          script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
          script.onload = () => {
            initializeMap();
          };
          document.head.appendChild(script);
        } else {
          initializeMap();
        }
      } catch (error) {
        console.error('Error loading Mapbox:', error);
      }
    };

    loadMapbox();
  }, [latitude, longitude]);

  const initializeMap = () => {
    if (!mapContainer.current || !(window as any).mapboxgl) return;

    const mapboxgl = (window as any).mapboxgl;
    mapboxgl.accessToken = mapboxToken;

    // Remove existing map if any
    if (map) {
      map.remove();
    }

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 12,
      attributionControl: false
    });

    // Add navigation control
    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker for user location
    new mapboxgl.Marker({
      color: '#3b82f6',
      scale: 1.2
    })
      .setLngLat([longitude, latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="p-2">
              <div class="font-medium text-sm">📍 Your Location</div>
              <div class="text-xs text-gray-600">${address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}</div>
            </div>
          `)
      )
      .addTo(newMap);

    setMap(newMap);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div 
          ref={mapContainer} 
          style={{ height: `${height}px`, width: '100%' }}
          className="relative"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium shadow-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-blue-600" />
            <span>Your Location</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
