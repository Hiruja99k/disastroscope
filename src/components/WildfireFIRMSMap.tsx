import React, { useMemo } from "react";
import Plot from "react-plotly.js";

interface WildfireFIRMSMapProps {
  height?: number | string;
  className?: string;
  hours?: number; // last N hours window (e.g., 24)
}

const MAPBOX_TOKEN = "pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw";

// NASA FIRMS anonymous tiler key provided by user (not used directly by Plotly)
// Keeping for reference if switching to raster tiles later.
const NASA_FIRMS_KEY = "1502ef1a75c41927b4d4d53ed4bded9e";

// FIRMS raster tiles (24h) - these are XYZ compatible tiles. We add multiple layers so if one fails the other should still show.
const FIRMS_TILE_TEMPLATES = [
  // VIIRS 24h (SNPP + NPP + J1/J2 combined)
  `https://firms.modaps.eosdis.nasa.gov/mapserver/GoogleMapsCompatible/VIIRS_SNPP_NPP_J1_C2_Global_24h/{z}/{x}/{y}.png?MAP_KEY=${NASA_FIRMS_KEY}`,
  // MODIS 24h
  `https://firms.modaps.eosdis.nasa.gov/mapserver/GoogleMapsCompatible/MODIS_C6_1_Global_24h/{z}/{x}/{y}.png?MAP_KEY=${NASA_FIRMS_KEY}`,
];

export default function WildfireFIRMSMap({ height = 600, className = "", hours = 24 }: WildfireFIRMSMapProps) {
  // Build mapbox raster layers from the templates
  const rasterLayers = useMemo(
    () =>
      FIRMS_TILE_TEMPLATES.map((template, idx) => ({
        sourcetype: "raster" as const,
        source: [template],
        below: "traces",
        opacity: 0.85,
        name: idx === 0 ? "FIRMS VIIRS" : "FIRMS MODIS",
      })),
    []
  );

  return (
    <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      <Plot
        data={[
          // Empty scatter layer so we still have a visible map with raster overlays
          { type: "scattermapbox", lon: [], lat: [], mode: "markers", marker: { size: 1 } },
        ]}
        layout={{
          title: { text: `NASA FIRMS Active Wildfires (last ${hours}h)`, font: { size: 18, color: '#374151' } },
          mapbox: {
            center: { lon: 0, lat: 15 },
            zoom: 1.6,
            style: "outdoors",
            layers: rasterLayers as any,
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


