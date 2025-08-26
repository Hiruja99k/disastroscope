"use client";
import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";

interface EarthquakeRow {
  Latitude: number;
  Longitude: number;
  Magnitude: number;
}

const EarthquakeDensityMap: React.FC = () => {
  const [data, setData] = useState<EarthquakeRow[]>([]);

  useEffect(() => {
    // Load the same dataset from Plotly's GitHub
    Papa.parse(
      "https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv",
      {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          setData(results.data as EarthquakeRow[]);
        },
      }
    );
  }, []);

  return (
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
          style: "stamen-terrain", // 👈 matches the Plotly example
        },
        coloraxis: { colorscale: "Viridis" },
        margin: { t: 40, b: 0, l: 0, r: 0 },
        autosize: true,
      }}
      style={{ width: "100%", height: "100vh" }}
      config={{ responsive: true }}
    />
  );
};

export default EarthquakeDensityMap;
