import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Activity, 
  AlertTriangle, 
  RefreshCw, 
  Filter,
  Globe,
  TrendingUp,
  Clock
} from 'lucide-react';

// Mock earthquake data - in production, this would come from your API
const generateMockEarthquakeData = () => {
  const earthquakes = [];
  const locations = [
    { lat: 36.2048, lon: 138.2529, name: 'Japan' },
    { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
    { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, CA' },
    { lat: 37.7749, lon: -122.4194, name: 'San Francisco, CA' },
    { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
    { lat: 19.4326, lon: -99.1332, name: 'Mexico City, Mexico' },
    { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
    { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
    { lat: 48.8566, lon: 2.3522, name: 'Paris, France' },
    { lat: 55.7558, lon: 37.6176, name: 'Moscow, Russia' },
    { lat: 39.9042, lon: 116.4074, name: 'Beijing, China' },
    { lat: 28.6139, lon: 77.2090, name: 'New Delhi, India' },
    { lat: -14.2350, lon: -51.9253, name: 'Brazil' },
    { lat: -25.7461, lon: 28.1881, name: 'Johannesburg, South Africa' },
    { lat: 61.5240, lon: 105.3188, name: 'Russia' },
  ];

  for (let i = 0; i < 50; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const magnitude = Math.random() * 8 + 2; // Magnitude between 2-10
    const depth = Math.random() * 700; // Depth between 0-700km
    const time = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
    
    earthquakes.push({
      lat: location.lat + (Math.random() - 0.5) * 2, // Add some variation
      lon: location.lon + (Math.random() - 0.5) * 2,
      magnitude: magnitude,
      depth: depth,
      time: time,
      location: location.name,
      id: `eq_${i}`,
    });
  }

  return earthquakes;
};

interface EarthquakeData {
  lat: number;
  lon: number;
  magnitude: number;
  depth: number;
  time: Date;
  location: string;
  id: string;
}

interface EarthquakeMagnitudeMapProps {
  height?: number;
  className?: string;
}

export default function EarthquakeMagnitudeMap({ height = 500, className = '' }: EarthquakeMagnitudeMapProps) {
  const [earthquakes, setEarthquakes] = useState<EarthquakeData[]>([]);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState<EarthquakeData[]>([]);
  const [magnitudeFilter, setMagnitudeFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('7d');
  const [loading, setLoading] = useState(false);
  const [selectedEarthquake, setSelectedEarthquake] = useState<EarthquakeData | null>(null);

  useEffect(() => {
    const data = generateMockEarthquakeData();
    setEarthquakes(data);
    setFilteredEarthquakes(data);
  }, []);

  useEffect(() => {
    let filtered = [...earthquakes];

    // Apply magnitude filter
    if (magnitudeFilter !== 'all') {
      const minMagnitude = parseFloat(magnitudeFilter);
      filtered = filtered.filter(eq => eq.magnitude >= minMagnitude);
    }

    // Apply time filter
    const now = new Date();
    const timeFilters = {
      '1d': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
    };

    if (timeFilter in timeFilters) {
      const cutoffTime = now.getTime() - timeFilters[timeFilter as keyof typeof timeFilters];
      filtered = filtered.filter(eq => eq.time.getTime() >= cutoffTime);
    }

    setFilteredEarthquakes(filtered);
  }, [earthquakes, magnitudeFilter, timeFilter]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      const data = generateMockEarthquakeData();
      setEarthquakes(data);
      setLoading(false);
    }, 1000);
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 8) return '#FF0000'; // Red for major earthquakes
    if (magnitude >= 7) return '#FF6600'; // Orange for strong earthquakes
    if (magnitude >= 6) return '#FF9900'; // Light orange for moderate-strong
    if (magnitude >= 5) return '#FFCC00'; // Yellow for moderate
    if (magnitude >= 4) return '#99CC00'; // Light green for light
    return '#66CC00'; // Green for minor
  };

  const getMagnitudeSize = (magnitude: number) => {
    return Math.max(5, magnitude * 3); // Minimum size 5, scale with magnitude
  };

  const plotData = [
    {
      type: 'scattergeo' as const,
      lat: filteredEarthquakes.map(eq => eq.lat),
      lon: filteredEarthquakes.map(eq => eq.lon),
      mode: 'markers' as const,
      marker: {
        size: filteredEarthquakes.map(eq => getMagnitudeSize(eq.magnitude)),
        color: filteredEarthquakes.map(eq => getMagnitudeColor(eq.magnitude)),
        opacity: 0.8,
        line: {
          color: '#000000',
          width: 1,
        },
        symbol: 'circle' as const,
      },
      text: filteredEarthquakes.map(eq => 
        `Magnitude: ${eq.magnitude.toFixed(1)}<br>` +
        `Location: ${eq.location}<br>` +
        `Depth: ${eq.depth.toFixed(0)}km<br>` +
        `Time: ${eq.time.toLocaleString()}`
      ),
      hoverinfo: 'text' as const,
      name: 'Earthquakes',
    },
  ];

  const layout = {
    title: {
      text: 'Global Earthquake Magnitude Map',
      font: { size: 18, color: '#1f2937' },
    },
    geo: {
      scope: 'world' as const,
      projection: {
        type: 'natural earth' as const,
      },
      showland: true,
      landcolor: '#f3f4f6',
      showocean: true,
      oceancolor: '#dbeafe',
      showlakes: true,
      lakecolor: '#dbeafe',
      showrivers: true,
      rivercolor: '#dbeafe',
      coastlinecolor: '#6b7280',
      countrycolor: '#9ca3af',
      showcountries: true,
      showcoastlines: true,
      showframe: false,
      bgcolor: '#ffffff',
    },
    margin: {
      l: 0,
      r: 0,
      t: 50,
      b: 0,
    },
    height: height,
    autosize: true,
    showlegend: false,
  };

  const config = {
    displayModeBar: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    responsive: true,
  };

  const stats = {
    total: filteredEarthquakes.length,
    averageMagnitude: filteredEarthquakes.length > 0 
      ? (filteredEarthquakes.reduce((sum, eq) => sum + eq.magnitude, 0) / filteredEarthquakes.length).toFixed(1)
      : '0.0',
    maxMagnitude: filteredEarthquakes.length > 0 
      ? Math.max(...filteredEarthquakes.map(eq => eq.magnitude)).toFixed(1)
      : '0.0',
    recentCount: filteredEarthquakes.filter(eq => 
      eq.time.getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Earthquake Magnitude Map
            </CardTitle>
            <CardDescription>
              Real-time global earthquake monitoring and magnitude visualization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              {stats.total} Events
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={magnitudeFilter} onValueChange={setMagnitudeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Magnitudes</SelectItem>
              <SelectItem value="4">4.0+</SelectItem>
              <SelectItem value="5">5.0+</SelectItem>
              <SelectItem value="6">6.0+</SelectItem>
              <SelectItem value="7">7.0+</SelectItem>
              <SelectItem value="8">8.0+</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Events</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
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
              <span className="text-sm font-medium">Last 24h</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.recentCount}</p>
          </div>
        </div>

        {/* Magnitude Legend */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium mb-2">Magnitude Scale:</p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>2-3.9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>4-4.9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>5-5.9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>6-7.9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-700"></div>
              <span>8+</span>
            </div>
          </div>
        </div>

        {/* Plotly Map */}
        <div className="border rounded-lg overflow-hidden">
          <Plot
            data={plotData}
            layout={layout}
            config={config}
            style={{ width: '100%', height: `${height}px` }}
            useResizeHandler={true}
            onHover={(data) => {
              if (data.points && data.points[0]) {
                const pointIndex = data.points[0].pointIndex;
                if (pointIndex !== undefined && filteredEarthquakes[pointIndex]) {
                  setSelectedEarthquake(filteredEarthquakes[pointIndex]);
                }
              }
            }}
            onUnhover={() => setSelectedEarthquake(null)}
          />
        </div>

        {/* Selected Earthquake Details */}
        {selectedEarthquake && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Selected Earthquake Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p className="font-medium">{selectedEarthquake.location}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Magnitude:</span>
                <p className="font-medium text-red-600">{selectedEarthquake.magnitude.toFixed(1)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Depth:</span>
                <p className="font-medium">{selectedEarthquake.depth.toFixed(0)} km</p>
              </div>
              <div>
                <span className="text-muted-foreground">Time:</span>
                <p className="font-medium">{selectedEarthquake.time.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
