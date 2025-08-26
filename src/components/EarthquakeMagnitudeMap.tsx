import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface EarthquakeMagnitudeMapProps {
  height?: number | string;
  className?: string;
}

// Fallback earthquake data in case external source fails
const fallbackEarthquakeData = [
  { Latitude: 37.7749, Longitude: -122.4194, Magnitude: 6.2 },
  { Latitude: 34.0522, Longitude: -118.2437, Magnitude: 5.8 },
  { Latitude: 40.7128, Longitude: -74.0060, Magnitude: 4.5 },
  { Latitude: 25.7617, Longitude: -80.1918, Magnitude: 5.1 },
  { Latitude: 29.9511, Longitude: -90.0715, Magnitude: 4.8 },
  { Latitude: 35.6762, Longitude: 139.6503, Magnitude: 7.2 },
  { Latitude: 19.8968, Longitude: -155.5828, Magnitude: 5.5 },
  { Latitude: 51.5074, Longitude: -0.1278, Magnitude: 4.2 },
  { Latitude: 48.8566, Longitude: 2.3522, Magnitude: 4.7 },
  { Latitude: 55.7558, Longitude: 37.6176, Magnitude: 6.1 },
];

export default function EarthquakeMagnitudeMap({ height = 600, className = "" }: EarthquakeMagnitudeMapProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setUsingFallback(false);
        
        // Try to fetch from external source first
        const response = await fetch("https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv", {
          method: 'GET',
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const csv = await response.text();
        
        const rows = csv.split("\n").slice(1).map((line) => {
          const [Date, Latitude, Longitude, Magnitude] = line.split(",");
          return {
            Latitude: parseFloat(Latitude),
            Longitude: parseFloat(Longitude),
            Magnitude: parseFloat(Magnitude),
          };
        });
        
        const validRows = rows.filter((r) => !isNaN(r.Latitude) && !isNaN(r.Longitude));
        
        if (validRows.length > 0) {
          setData(validRows);
        } else {
          throw new Error("No valid data rows found");
        }
      } catch (err) {
        // Use fallback data if external source fails
        setData(fallbackEarthquakeData);
        setUsingFallback(true);
        setError(null); // Clear error since we have fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading earthquake data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && data.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="flex items-center justify-center h-full bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="text-center">
            <p className="text-sm text-destructive mb-2">Error loading earthquake data</p>
            <p className="text-xs text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-3 py-1 text-xs bg-destructive text-white rounded hover:bg-destructive/80"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No earthquake data available</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/80"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} style={{ height: typeof height === 'number' ? `${height}px` : height }}>
      {usingFallback && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
          ⚠️ Using sample data (external source unavailable)
        </div>
      )}
      
      <Plot
        data={[
          {
            type: "densitymapbox",
            lon: data.map((row) => row.Longitude),
            lat: data.map((row) => row.Latitude),
            z: data.map((row) => row.Magnitude),
            radius: 10,
            hoverinfo: "skip",
            coloraxis: "coloraxis",
          },
        ]}
        layout={{
          title: { 
            text: "Global Earthquake Magnitude Distribution",
            font: { size: 18, color: '#374151' }
          },
          mapbox: {
            center: { lon: 0, lat: 20 },
            zoom: 1.5,
            style: "outdoors",
          },
          coloraxis: { 
            colorscale: "Viridis",
            colorbar: {
              title: "Magnitude",
              titleside: "right"
            }
          },
          margin: { t: 60, b: 20, l: 20, r: 20 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }}
        config={{
          mapboxAccessToken: "pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw",
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
