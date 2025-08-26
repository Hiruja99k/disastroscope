import React from "react";

interface FloodForecastMapProps {
  height?: number | string;
  className?: string;
}

export default function FloodForecastMap({ height = 600, className = "" }: FloodForecastMapProps) {
  return (
    <div className={className} style={{ width: "100%", height }}>
      <iframe
        src="https://www.floodmap.net/CurrentFloodForecast/"
        title="Current Flood Forecast Map"
        style={{ border: 0, width: "100%", height: "100%" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}


