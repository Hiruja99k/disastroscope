import React, { useEffect, useRef } from "react";

interface WildfireFIRMSMapProps {
  height?: number | string;
  className?: string;
  hours?: number; // last N hours window (e.g., 24)
}

const MAPTILER_KEY = "DOCOM2xq5hJddM7rfMdp";

// NASA FIRMS anonymous tiler key provided by user (not used directly by Plotly)
// Keeping for reference if switching to raster tiles later.
const NASA_FIRMS_KEY = "1502ef1a75c41927b4d4d53ed4bded9e";

// FIRMS raster tiles (24h) - XYZ compatible tile endpoints
const FIRMS_TILE_TEMPLATES = [
  `https://firms.modaps.eosdis.nasa.gov/mapserver/GoogleMapsCompatible/VIIRS_SNPP_NPP_J1_C2_Global_24h/{z}/{x}/{y}.png?MAP_KEY=${NASA_FIRMS_KEY}`,
  `https://firms.modaps.eosdis.nasa.gov/mapserver/GoogleMapsCompatible/MODIS_C6_1_Global_24h/{z}/{x}/{y}.png?MAP_KEY=${NASA_FIRMS_KEY}`,
];

export default function WildfireFIRMSMap({ height = 600, className = "", hours = 24 }: WildfireFIRMSMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => {
      // @ts-ignore
      const L = window.L as any;
      if (!L) return;

      const map = L.map(containerRef.current!, {
        center: [15, 0],
        zoom: 2,
        worldCopyJump: true,
      });

      // Basemap fallback: OpenStreetMap (reliable, no key required)
      const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      });
      osm.addTo(map);

      // Optional basemap: MapTiler Streets
      const mapTiler = L.tileLayer(
        `https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`,
        {
          attribution:
            '<a href="https://www.maptiler.com/" target="_blank" rel="noreferrer">MapTiler</a>',
          maxZoom: 19,
        }
      );

      // Add FIRMS overlays with partial transparency; use two layers for redundancy
      FIRMS_TILE_TEMPLATES.forEach((template) => {
        const layer = L.tileLayer(template, {
          opacity: 0.85,
          tileSize: 256,
          crossOrigin: false,
        });
        layer.addTo(map);
      });

      // Ensure proper sizing after layout settles
      setTimeout(() => {
        try { map.invalidateSize(); } catch {}
      }, 250);
    };
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch {}
      try {
        document.head.removeChild(link);
      } catch {}
    };
  }, [hours]);

  return (
    <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden border" />
    </div>
  );
}


