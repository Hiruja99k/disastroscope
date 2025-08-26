import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, LayersControl, LayerGroup, ScaleControl, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { environment } from '@/config/environment';
import { useEonetEvents } from '@/hooks/useFlaskData';

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

function getLatestCoordinate(geometry: EonetGeometry[] | undefined): { lat: number; lon: number } | null {
  if (!geometry || geometry.length === 0) return null;
  const last = geometry[geometry.length - 1];
  const coords = last?.coordinates;
  if (!coords) return null;
  // EONET coordinates may be [lon, lat]
  if (Array.isArray(coords) && coords.length >= 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return { lat: coords[1], lon: coords[0] };
  }
  return null;
}

interface FloodMonitoringMapProps {
  height?: number | string;
  className?: string;
}

export default function FloodMonitoringMap({ height = 500, className = '' }: FloodMonitoringMapProps) {
  const { events, loading, error } = useEonetEvents();
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
          <LayersControl.Overlay name="Flood Events (EONET)" checked>
            <LayerGroup>
              {floodPoints.map(({ ev, coord }) => (
                <CircleMarker key={ev.id} center={[coord.lat, coord.lon]} pathOptions={{ color: '#1e40af' }} radius={6}>
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


