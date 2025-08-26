import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayersControl, LayerGroup, ScaleControl, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { environment } from '@/config/environment';
import { useEonetEvents, useFemaDisasters } from '@/hooks/useFlaskData';

type EonetGeometry = {
  date?: string;
  type?: string;
  coordinates?: any;
};

type EonetEvent = {
  id: string;
  title: string;
  categories?: { id?: number | string; title?: string }[];
  geometry?: EonetGeometry[];
  link?: string;
  status?: string;
};

function isFloodEvent(ev: EonetEvent): boolean {
  const categories = ev.categories || [];
  return categories.some(c => `${c.title}`.toLowerCase().includes('flood'));
}

// Extract a representative lon/lat from nested coordinate arrays (Point, LineString, Polygon, MultiPolygon)
function extractLonLatFromCoords(input: any): { lat: number; lon: number } | null {
  if (!input) return null;
  // Point: [lon, lat]
  if (Array.isArray(input) && input.length >= 2 && typeof input[0] === 'number' && typeof input[1] === 'number') {
    return { lat: input[1], lon: input[0] };
  }
  // Array of points: average centroid
  if (Array.isArray(input) && input.length > 0 && Array.isArray(input[0])) {
    // flatten one level and collect numeric pairs
    const points: [number, number][] = [];
    const stack: any[] = [input];
    while (stack.length) {
      const cur = stack.pop();
      if (Array.isArray(cur)) {
        if (cur.length >= 2 && typeof cur[0] === 'number' && typeof cur[1] === 'number') {
          points.push([cur[0], cur[1]]);
        } else {
          for (const child of cur) stack.push(child);
        }
      }
    }
    if (points.length > 0) {
      const sum = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
      const lon = sum[0] / points.length;
      const lat = sum[1] / points.length;
      return { lat, lon };
    }
  }
  return null;
}

function getLatestCoordinate(geometry: EonetGeometry[] | undefined): { lat: number; lon: number } | null {
  if (!geometry || geometry.length === 0) return null;
  // Walk from most recent backwards until we find usable coords
  for (let i = geometry.length - 1; i >= 0; i--) {
    const g = geometry[i];
    const candidate = extractLonLatFromCoords(g?.coordinates);
    if (candidate) return candidate;
  }
  return null;
}

interface FloodMonitoringMapProps {
  height?: number | string;
  className?: string;
}

export default function FloodMonitoringMap({ height = 500, className = '' }: FloodMonitoringMapProps) {
  const { events, loading, error } = useEonetEvents();
  const { items: femaItems } = useFemaDisasters();
  const [center] = useState<[number, number]>([20, 0]);

  const floodPoints = useMemo(() => {
    return (events as EonetEvent[])
      .filter(isFloodEvent)
      .map(ev => ({ ev, coord: getLatestCoordinate(ev.geometry) }))
      .filter(x => !!x.coord) as { ev: EonetEvent; coord: { lat: number; lon: number } }[];
  }, [events]);

  const hasKey = Boolean(environment.services.mapTilerKey);
  const tileUrl = hasKey
    ? `https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=${environment.services.mapTilerKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  useEffect(() => {
    if (!hasKey) {
      // eslint-disable-next-line no-console
      console.warn('[FloodMonitoringMap] Missing VITE_MAPTILER_API_KEY. Falling back to OSM tiles.');
    }
  }, [hasKey]);

  return (
    <div className={className} style={{ width: '100%', height }}>
      <MapContainer center={center} zoom={2.5} style={{ width: '100%', height: '100%' }} zoomControl={false}>
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" />
        <TileLayer url={tileUrl} attribution={hasKey ? '&copy; MapTiler & OpenStreetMap contributors' : '&copy; OpenStreetMap contributors'} />

        <LayersControl position="topright">
          {/* FEMA Flood-related Declarations Overlay */}
          <LayersControl.Overlay name="FEMA Declarations (Flood-related)" checked>
            <LayerGroup>
              {getFemaFloodMarkers(femaItems).map((m) => (
                <CircleMarker key={m.key} center={[m.lat, m.lon]} pathOptions={{ color: '#0ea5e9', fillOpacity: 0.5 }} radius={5}>
                  <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
                    <div style={{ maxWidth: 260 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.title}</div>
                      <div style={{ fontSize: 12 }}>{m.subtitle}</div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>

          {/* Copernicus GloFAS WMS Overlay (if configured) */}
          {environment.services.glofasWmsUrl && environment.services.glofasWmsLayer && (
            <LayersControl.Overlay name="GloFAS Flood Hazard" checked>
              <LayerGroup>
                <WMSTile 
                  url={environment.services.glofasWmsUrl}
                  options={{
                    layers: environment.services.glofasWmsLayer,
                    format: 'image/png',
                    transparent: true,
                    opacity: 0.5,
                    attribution: environment.services.glofasWmsAttribution,
                  }}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          )}

          <LayersControl.Overlay name="Flood Events (EONET)" checked>
            <LayerGroup>
              {floodPoints.map(({ ev, coord }) => (
                <CircleMarker key={ev.id} center={[coord.lat, coord.lon]} pathOptions={{ color: '#1e40af', fillOpacity: 0.6 }} radius={6}>
                  <Tooltip direction="top" offset={[0, -6]} opacity={1} permanent={false}>
                    <div style={{ maxWidth: 240 }}>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>{ev.title}</div>
                      <div style={{ fontSize: 12 }}>
                        Status: {ev.status || 'unknown'}
                      </div>
                      {ev.link && (
                        <div style={{ marginTop: 4 }}>
                          <a href={ev.link} target="_blank" rel="noreferrer" style={{ color: '#1d4ed8' }}>Details</a>
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {loading && (
          <div className="absolute left-2 top-2 bg-white/80 rounded px-2 py-1 text-xs">Loading flood events…</div>
        )}
        {error && (
          <div className="absolute left-2 top-2 bg-red-50 border border-red-200 rounded px-2 py-1 text-xs text-red-700">Error loading flood events</div>
        )}
      </MapContainer>
    </div>
  );
}

// Helper component to attach a WMS layer to the current map using react-leaflet's context
function WMSTile({ url, options }: { url: string; options: L.WMSOptions & { opacity?: number } }) {
  const map = useMap();
  useEffect(() => {
    const wmsLayer = L.tileLayer.wms(url, options);
    wmsLayer.addTo(map);
    return () => {
      try { map.removeLayer(wmsLayer); } catch { /* noop */ }
    };
  }, [map, url, JSON.stringify(options)]);
  return null;
}

// FEMA state centroid lookup (approximate)
const STATE_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  AL: { lat: 32.8067, lon: -86.7911 }, AK: { lat: 61.3707, lon: -152.4044 }, AZ: { lat: 33.7298, lon: -111.4312 },
  AR: { lat: 34.9697, lon: -92.3731 }, CA: { lat: 36.1162, lon: -119.6816 }, CO: { lat: 39.0598, lon: -105.3111 },
  CT: { lat: 41.5978, lon: -72.7554 }, DE: { lat: 39.3185, lon: -75.5071 }, FL: { lat: 27.7663, lon: -81.6868 },
  GA: { lat: 33.0406, lon: -83.6431 }, HI: { lat: 21.0943, lon: -157.4983 }, ID: { lat: 44.2405, lon: -114.4788 },
  IL: { lat: 40.3495, lon: -88.9861 }, IN: { lat: 39.8494, lon: -86.2583 }, IA: { lat: 42.0115, lon: -93.2105 },
  KS: { lat: 38.5266, lon: -96.7265 }, KY: { lat: 37.6681, lon: -84.6701 }, LA: { lat: 31.1695, lon: -91.8678 },
  ME: { lat: 44.6939, lon: -69.3819 }, MD: { lat: 39.0639, lon: -76.8021 }, MA: { lat: 42.2302, lon: -71.5301 },
  MI: { lat: 43.3266, lon: -84.5361 }, MN: { lat: 45.6945, lon: -93.9002 }, MS: { lat: 32.7416, lon: -89.6787 },
  MO: { lat: 38.4561, lon: -92.2884 }, MT: { lat: 46.9219, lon: -110.4544 }, NE: { lat: 41.1254, lon: -98.2681 },
  NV: { lat: 38.3135, lon: -117.0554 }, NH: { lat: 43.4525, lon: -71.5639 }, NJ: { lat: 40.2989, lon: -74.5210 },
  NM: { lat: 34.8405, lon: -106.2485 }, NY: { lat: 42.1657, lon: -74.9481 }, NC: { lat: 35.6301, lon: -79.8064 },
  ND: { lat: 47.5289, lon: -99.7840 }, OH: { lat: 40.3888, lon: -82.7649 }, OK: { lat: 35.5653, lon: -96.9289 },
  OR: { lat: 44.5720, lon: -122.0709 }, PA: { lat: 40.5908, lon: -77.2098 }, RI: { lat: 41.6809, lon: -71.5118 },
  SC: { lat: 33.8569, lon: -80.9450 }, SD: { lat: 44.2998, lon: -99.4388 }, TN: { lat: 35.7478, lon: -86.6923 },
  TX: { lat: 31.0545, lon: -97.5635 }, UT: { lat: 40.1500, lon: -111.8624 }, VT: { lat: 44.0459, lon: -72.7107 },
  VA: { lat: 37.7693, lon: -78.1699 }, WA: { lat: 47.4009, lon: -121.4905 }, WV: { lat: 38.4912, lon: -80.9545 },
  WI: { lat: 44.2685, lon: -89.6165 }, WY: { lat: 42.7559, lon: -107.3025 }, DC: { lat: 38.9072, lon: -77.0369 },
  PR: { lat: 18.2208, lon: -66.5901 }
};

function getFemaFloodMarkers(items: any[]): { key: string; lat: number; lon: number; title: string; subtitle: string }[] {
  if (!Array.isArray(items)) return [];
  const floodLike = items.filter((d: any) => {
    const t = `${d?.incidentType || ''}`.toLowerCase();
    return t.includes('flood') || t.includes('flooding') || t.includes('severe storm');
  });
  return floodLike.map((d: any) => {
    const state = `${d?.state || ''}`.toUpperCase();
    const pos = STATE_CENTROIDS[state] || { lat: 39, lon: -98 }; // fallback US center
    const title = `${d?.title || d?.incidentType || 'FEMA Declaration'} (${state})`;
    const subtitle = `Disaster #${d?.disasterNumber ?? d?.id || 'N/A'} • ${d?.declarationDate?.slice(0,10) || ''}`;
    return { key: String(d?.id ?? d?.disasterNumber ?? Math.random()), lat: pos.lat, lon: pos.lon, title, subtitle };
  });
}


