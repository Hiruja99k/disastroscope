import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

export default function EarthquakeMap() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv")
      .then((res) => res.text())
      .then((csv) => {
        const rows = csv.split("\n").slice(1).map((line) => {
          const [Date, Latitude, Longitude, Magnitude] = line.split(",");
          return {
            Latitude: parseFloat(Latitude),
            Longitude: parseFloat(Longitude),
            Magnitude: parseFloat(Magnitude),
          };
        });
        setData(rows.filter((r) => !isNaN(r.Latitude) && !isNaN(r.Longitude)));
      });
  }, []);

  return (
    <div className="w-full h-screen">
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
          title: { text: "Earthquake Magnitude" },
          mapbox: {
            center: { lon: 60, lat: 30 },
            zoom: 2,
            style: "outdoors",
          },
          coloraxis: { colorscale: "Viridis" },
          margin: { t: 40, b: 0, l: 0, r: 0 },
        }}
        config={{
          mapboxAccessToken:
            "pk.eyJ1IjoiaGlydWpha2wiLCJhIjoiY21lczA2ZTdsMGQ0czJxcTFjYzI4bDJvMiJ9.NvKvNXcT-gqoNomkWFeouw",
        }}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
