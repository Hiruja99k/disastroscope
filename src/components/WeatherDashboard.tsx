import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { apiService, WeatherData, AIPrediction } from '../services/api';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Cloud, 
  Eye, 
  Gauge,
  MapPin,
  AlertTriangle,
  Brain,
  RefreshCw
} from 'lucide-react';

interface WeatherDashboardProps {
  className?: string;
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ className }) => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [customLat, setCustomLat] = useState('');
  const [customLon, setCustomLon] = useState('');

  useEffect(() => {
    fetchWeatherData();
    subscribeToWeatherUpdates();

    return () => {
      apiService.off('weather_update', handleWeatherUpdate);
    };
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getWeatherData();
      setWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToWeatherUpdates = () => {
    apiService.subscribeToWeather();
    apiService.on('weather_update', handleWeatherUpdate);
  };

  const handleWeatherUpdate = (data: WeatherData[]) => {
    setWeatherData(data);
  };

  const getCustomPrediction = async () => {
    if (!customLat || !customLon) return;

    setLoading(true);
    try {
      const prediction = await apiService.predictDisaster(
        parseFloat(customLat),
        parseFloat(customLon),
        customLocation
      );
      setAiPrediction(prediction);
    } catch (error) {
      console.error('Error getting AI prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear': return '☀️';
      case 'clouds': return '☁️';
      case 'rain': return '🌧️';
      case 'snow': return '❄️';
      case 'thunderstorm': return '⛈️';
      case 'drizzle': return '🌦️';
      case 'mist': return '🌫️';
      case 'fog': return '🌫️';
      default: return '🌤️';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Real-Time Weather Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Live weather data from monitored locations with AI-powered disaster predictions
          </p>
        </div>
        <Button onClick={fetchWeatherData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Custom Location Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Disaster Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="location">Location Name</Label>
              <Input
                id="location"
                placeholder="e.g., New York"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="40.7128"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="lon">Longitude</Label>
              <Input
                id="lon"
                type="number"
                step="any"
                placeholder="-74.0060"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={getCustomPrediction} disabled={loading || !customLat || !customLon}>
                Predict Disasters
              </Button>
            </div>
          </div>

          {aiPrediction && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">
                AI Prediction for {aiPrediction.location}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(aiPrediction.predictions).map(([disaster, risk]) => (
                  <div key={disaster} className="text-center">
                    <div className="text-sm font-medium text-gray-600 capitalize">
                      {disaster.replace('_', ' ')}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(risk * 100).toFixed(1)}%
                    </div>
                    <Badge className={getSeverityColor(risk > 0.7 ? 'critical' : risk > 0.4 ? 'high' : 'medium')}>
                      {risk > 0.7 ? 'Critical' : risk > 0.4 ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weather Data Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherData.map((weather) => (
          <Card key={weather.location} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  {weather.location}
                </CardTitle>
                <span className="text-2xl">
                  {getWeatherIcon(weather.weather_condition)}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Updated: {formatTimestamp(weather.timestamp)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <span className="text-lg font-semibold">{weather.temperature}°C</span>
              </div>

              {/* Humidity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Humidity</span>
                </div>
                <span className="text-lg font-semibold">{weather.humidity}%</span>
              </div>

              {/* Wind Speed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">Wind Speed</span>
                </div>
                <span className="text-lg font-semibold">{weather.wind_speed} m/s</span>
              </div>

              {/* Pressure */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Pressure</span>
                </div>
                <span className="text-lg font-semibold">{weather.pressure} hPa</span>
              </div>

              {/* Precipitation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Precipitation</span>
                </div>
                <span className="text-lg font-semibold">{weather.precipitation} mm</span>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium">Visibility</span>
                </div>
                <span className="text-lg font-semibold">{weather.visibility} km</span>
              </div>

              {/* Cloud Cover */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium">Cloud Cover</span>
                </div>
                <span className="text-lg font-semibold">{weather.cloud_cover}%</span>
              </div>

              {/* Weather Condition */}
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Condition</span>
                  <Badge variant="outline" className="capitalize">
                    {weather.weather_condition}
                  </Badge>
                </div>
              </div>

              {/* Quick AI Analysis */}
              <div className="pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setCustomLat(weather.coordinates.lat.toString());
                    setCustomLon(weather.coordinates.lng.toString());
                    setCustomLocation(weather.location);
                  }}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Analyze for Disasters
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {weatherData.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No weather data available</p>
            <Button onClick={fetchWeatherData} className="mt-4">
              Load Weather Data
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-8">
            <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading weather data...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherDashboard;
