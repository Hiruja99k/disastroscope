import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  Globe,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';

interface EarthquakeData {
  Longitude: number;
  Latitude: number;
  Magnitude: number;
}

interface EarthquakeMagnitudeMapProps {
  height?: number;
  className?: string;
}

export default function EarthquakeMagnitudeMap({ height = 600, className = '' }: EarthquakeMagnitudeMapProps) {
  const [plotData, setPlotData] = useState<any[]>([]);
  const [layout, setLayout] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    averageMagnitude: '0.0',
    maxMagnitude: '0.0',
    minMagnitude: '0.0',
  });

  useEffect(() => {
    const loadEarthquakeData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Function to unpack data from rows (exact implementation from CodePen)
        const unpack = (rows: any[], key: string) => {
          return rows.map(function(row: any) { 
            return row[key]; 
          });
        };

        // Fetch the CSV data
        const response = await fetch('https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv');
        if (!response.ok) {
          throw new Error('Failed to fetch earthquake data');
        }

        const csvText = await response.text();
        
        // Parse CSV data exactly like d3.csv would
        const rows = csvText.split('\n').slice(1) // Skip header
          .filter(row => row.trim() !== '')
          .map(row => {
            const columns = row.split(',');
            return {
              Longitude: parseFloat(columns[0]),
              Latitude: parseFloat(columns[1]),
              Magnitude: parseFloat(columns[2])
            };
          })
          .filter(row => !isNaN(row.Longitude) && !isNaN(row.Latitude) && !isNaN(row.Magnitude));

        // Calculate statistics
        const total = rows.length;
        const averageMagnitude = total > 0 
          ? (rows.reduce((sum, eq) => sum + eq.Magnitude, 0) / total).toFixed(1)
          : '0.0';
        const maxMagnitude = total > 0 
          ? Math.max(...rows.map(eq => eq.Magnitude)).toFixed(1)
          : '0.0';
        const minMagnitude = total > 0 
          ? Math.min(...rows.map(eq => eq.Magnitude)).toFixed(1)
          : '0.0';

        setStats({ total, averageMagnitude, maxMagnitude, minMagnitude });

        // Exact data structure from CodePen
        const data = [{
          lon: unpack(rows, 'Longitude'),
          lat: unpack(rows, 'Latitude'),
          radius: 10,
          z: unpack(rows, 'Magnitude'),
          type: "densitymap",
          coloraxis: 'coloraxis',
          hoverinfo: 'skip'
        }];

        // Exact layout from CodePen
        const layoutConfig = {
          map: {
            center: { lon: 60, lat: 30 },
            style: "outdoors",
            zoom: 2
          },
          coloraxis: {
            colorscale: "Viridis"
          },
          title: {
            text: "Earthquake Magnitude"
          },
          width: undefined, // Will be responsive
          height: height,
          margin: { t: 30, b: 0, l: 0, r: 0 },
          autosize: true
        };

        setPlotData(data);
        setLayout(layoutConfig);

      } catch (err) {
        console.error('Error loading earthquake data:', err);
        setError('Failed to load earthquake data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadEarthquakeData();
  }, [height]);

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true,
    mapboxAccessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoicGxvdGx5IiwiYSI6ImNrcmQ0N2Q1bDB6NGYyb3A5N3p2Z2Z1a2IifQ.EjMjSxvXt8vp2f6tFufjQw'
  };

  const refreshData = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Earthquake Magnitude Density Map
          </CardTitle>
          <CardDescription>
            Loading real earthquake data from USGS...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-lg">Loading earthquake data...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-red-600" />
            Earthquake Magnitude Density Map
          </CardTitle>
          <CardDescription>
            Error loading earthquake data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Earthquake Magnitude Density Map
            </CardTitle>
            <CardDescription>
              Real earthquake data from USGS with density heatmap visualization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {stats.total.toLocaleString()} Events
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Events</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.total.toLocaleString()}</p>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Avg Magnitude</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{stats.averageMagnitude}</p>
          </div>
          
          <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium">Max Magnitude</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.maxMagnitude}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Min Magnitude</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.minMagnitude}</p>
          </div>
        </div>

        {/* Magnitude Legend */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium mb-2">Magnitude Scale (Viridis):</p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Low (5.5-6.0)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Medium (6.0-7.0)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>High (7.0-8.0)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Very High (8.0-9.0)</span>
            </div>
          </div>
        </div>

        {/* Plotly Density Map - Exact CodePen implementation */}
        <div className="border rounded-lg overflow-hidden bg-white">
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: `${height}px` }}
            useResizeHandler={true}
          />
        </div>

        {/* Map Information */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900 dark:text-blue-100">
              Map Information
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Data Source:</span>
              <p className="font-medium">USGS Earthquake Database</p>
            </div>
            <div>
              <span className="text-muted-foreground">Visualization:</span>
              <p className="font-medium">Density Heatmap</p>
            </div>
            <div>
              <span className="text-muted-foreground">Map Style:</span>
              <p className="font-medium">Outdoors (Stamen Terrain)</p>
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>This map shows the exact same visualization as the Plotly.js CodePen example, using real earthquake data from the USGS database.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
