import React, { useEffect, useMemo, useState } from "react";
import Plot from "react-plotly.js";

type WildfirePoint = {
  latitude: number;
  longitude: number;
  brightness: number | null;
  confidence: number | null;
  frp: number | null;
  acq_date: string | null;
  acq_time: string | null;
  instrument: string | null;
};

interface WildfireFIRMSMapProps {
  height?: number | string;
  className?: string;
  hours?: number; // last N hours window (e.g., 24)
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw";

// NASA FIRMS anonymous tiler key provided by user (not used directly by Plotly)
// Keeping for reference if switching to raster tiles later.
const NASA_FIRMS_KEY = "1502ef1a75c41927b4d4d53ed4bded9e";

// Public CSV endpoints (last 24h) for global active fires. If network blocked, we'll fallback to sample.
// VIIRS NOAA-20 (J2):
const VIIRS_URL =
  "https://firms.modaps.eosdis.nasa.gov/active_fire/c6.1/viirs/Global/viirs_snpp_npp_j1_c61_Global_24h.csv";
// MODIS:
const MODIS_URL =
  "https://firms.modaps.eosdis.nasa.gov/active_fire/c6.1/csv/MODIS_C6_1_Global_24h.csv";

const fallbackFires: WildfirePoint[] = [
  { latitude: 34.3, longitude: -118.2, brightness: 320, confidence: 85, frp: 12.3, acq_date: "2024-08-10", acq_time: "1545", instrument: "VIIRS" },
  { latitude: 38.6, longitude: -120.7, brightness: 315, confidence: 78, frp: 9.1, acq_date: "2024-08-10", acq_time: "1610", instrument: "VIIRS" },
  { latitude: -15.8, longitude: 128.6, brightness: 310, confidence: 72, frp: 7.4, acq_date: "2024-08-10", acq_time: "0810", instrument: "MODIS" },
  { latitude: -3.1, longitude: -60.0, brightness: 335, confidence: 92, frp: 18.6, acq_date: "2024-08-10", acq_time: "1020", instrument: "VIIRS" },
];

function parseFIRMSCsv(csv: string): WildfirePoint[] {
  const lines = csv.split(/\r?\n/);
  if (lines.length < 2) return [];
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const latIdx = header.indexOf("latitude");
  const lonIdx = header.indexOf("longitude");
  const brightIdx = header.indexOf("brightness");
  const confIdx = header.indexOf("confidence");
  const frpIdx = header.indexOf("frp");
  const dateIdx = header.indexOf("acq_date");
  const timeIdx = header.indexOf("acq_time");
  const instIdx = header.indexOf("instrument");

  const points: WildfirePoint[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    const cols = line.split(",");
    const lat = parseFloat(cols[latIdx]);
    const lon = parseFloat(cols[lonIdx]);
    if (isNaN(lat) || isNaN(lon)) continue;
    points.push({
      latitude: lat,
      longitude: lon,
      brightness: brightIdx >= 0 ? parseFloat(cols[brightIdx]) : null,
      confidence: confIdx >= 0 ? parseFloat(String(cols[confIdx]).replace(/[^0-9.]/g, "")) : null,
      frp: frpIdx >= 0 ? parseFloat(cols[frpIdx]) : null,
      acq_date: dateIdx >= 0 ? cols[dateIdx] : null,
      acq_time: timeIdx >= 0 ? cols[timeIdx] : null,
      instrument: instIdx >= 0 ? cols[instIdx] : null,
    });
  }
  return points;
}

export default function WildfireFIRMSMap({ height = 600, className = "", hours = 24 }: WildfireFIRMSMapProps) {
  const [fires, setFires] = useState<WildfirePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      try {
        // Try VIIRS first, then MODIS
        const responses: Response[] = [];
        try {
          responses.push(await fetch(VIIRS_URL));
        } catch {}
        try {
          responses.push(await fetch(MODIS_URL));
        } catch {}

        const csvs: string[] = [];
        for (const r of responses) {
          if (r && r.ok) {
            csvs.push(await r.text());
          }
        }

        let points: WildfirePoint[] = [];
        for (const csv of csvs) {
          points = points.concat(parseFIRMSCsv(csv));
        }

        if (points.length === 0) {
          throw new Error("No FIRMS data available");
        }

        setFires(points);
      } catch (e: any) {
        setFires(fallbackFires);
        setUsingFallback(true);
        setError(e?.message ?? "Failed to load FIRMS data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [hours]);

  const lons = useMemo(() => fires.map((f) => f.longitude), [fires]);
  const lats = useMemo(() => fires.map((f) => f.latitude), [fires]);
  const intensities = useMemo(() => fires.map((f) => (f.brightness ?? f.frp ?? 0)), [fires]);
  const hoverTexts = useMemo(
    () =>
      fires.map(
        (f) =>
          `Brightness: ${f.brightness ?? "n/a"}<br>` +
          `FRP: ${f.frp ?? "n/a"}<br>` +
          `Confidence: ${f.confidence ?? "n/a"}<br>` +
          `Time: ${f.acq_date ?? ""} ${f.acq_time ?? ""}<br>` +
          `Instrument: ${f.instrument ?? ""}`
      ),
    [fires]
  );

  if (loading) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading wildfire hotspots…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!fires.length) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No wildfire data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      {usingFallback && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
          ⚠️ Using sample data (FIRMS endpoints unavailable)
        </div>
      )}
      <Plot
        data={[
          {
            type: "densitymapbox",
            lon: lons,
            lat: lats,
            z: intensities,
            radius: 12,
            coloraxis: "coloraxis",
            hoverinfo: "text",
            text: hoverTexts,
          },
        ]}
        layout={{
          title: { text: `NASA FIRMS Active Fires (last ${hours}h)`, font: { size: 18, color: '#374151' } },
          mapbox: {
            center: { lon: 0, lat: 15 },
            zoom: 1.6,
            style: "outdoors",
          },
          coloraxis: {
            colorscale: [
              [0, "#1E3A8A"],
              [0.2, "#0EA5E9"],
              [0.4, "#22C55E"],
              [0.6, "#F59E0B"],
              [0.8, "#F97316"],
              [1, "#DC2626"],
            ],
            colorbar: { title: "Intensity", titleside: "right" },
          },
          margin: { t: 60, b: 20, l: 20, r: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{
          mapboxAccessToken: MAPBOX_TOKEN,
          displayModeBar: true,
          displaylogo: false,
          modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
        }}
        style={{ width: "100%", height: "100%" }}
        useResizeHandler={true}
      />
    </div>
  );
}


