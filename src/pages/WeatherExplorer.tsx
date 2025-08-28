import { useCallback, useMemo, useState } from 'react';
import { apiService, WeatherData } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin, Search, Thermometer, Wind, Droplets, Cloud, CalendarDays } from 'lucide-react';

interface GeoResult {
  name: string;
  lat: number;
  lon: number;
  country?: string;
  state?: string;
}

export default function WeatherExplorer() {
  const [query, setQuery] = useState('');
  const [units, setUnits] = useState<'metric' | 'imperial' | 'standard'>('metric');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<GeoResult[]>([]);
  const [selected, setSelected] = useState<GeoResult | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const unitSuffix = useMemo(() => ({
    temp: units === 'imperial' ? '°F' : units === 'metric' ? '°C' : 'K',
    wind: units === 'imperial' ? 'mph' : 'm/s',
    vis: 'km',
    pressure: 'hPa',
  }), [units]);

  const parseCoords = (text: string): { lat: number; lon: number } | null => {
    // Accept formats like "6.9271,79.8612" or "6.9271 , 79.8612"
    const m = text.trim().match(/^\s*([+-]?\d{1,2}\.\d+)\s*,\s*([+-]?\d{1,3}\.\d+)\s*$/);
    if (!m) return null;
    const lat = parseFloat(m[1]);
    const lon = parseFloat(m[2]);
    if (isNaN(lat) || isNaN(lon)) return null;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
    return { lat, lon };
  };

  const loadWeather = useCallback(async (place: GeoResult) => {
    setLoading(true);
    setError(null);
    setSelected(place);
    try {
      const displayName = [place.name, place.state, place.country].filter(Boolean).join(', ');
      const w = await apiService.getCurrentWeatherByCoords(place.lat, place.lon, displayName, units);
      const f = await apiService.getForecast(place.lat, place.lon, 5);
      setWeather(w);
      setForecast(Array.isArray(f) ? f : []);
    } catch (e: any) {
      console.error('Weather loading error:', e);
      setError('Failed to load weather data. Please try again.');
      setForecast([]); // Ensure forecast is always an array
    } finally {
      setLoading(false);
    }
  }, [units]);

  const doSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    try {
      // 1) If user typed coordinates, fetch directly
      const coords = parseCoords(query);
      if (coords) {
        const w = await apiService.getCurrentWeatherByCoords(coords.lat, coords.lon, undefined, units);
        setWeather(w);
        setSelected({ name: `${coords.lat.toFixed(4)}, ${coords.lon.toFixed(4)}` as any, lat: coords.lat, lon: coords.lon });
        const f = await apiService.getForecast(coords.lat, coords.lon, 5);
        setForecast(Array.isArray(f) ? f : []);
        setResults([]);
        return;
      }

      // 2) First try backend best-match by-city
      const w = await apiService.getWeatherByCity(query.trim(), units);
      if (w) {
        setWeather(w);
        // Geocode to obtain canonical coords list for selection and forecast
        const res = await apiService.geocode(query.trim(), 5);
        setResults(res);
        if (res[0]) {
          setSelected(res[0]);
          const f = await apiService.getForecast(res[0].lat, res[0].lon, 5);
          setForecast(Array.isArray(f) ? f : []);
        } else {
          setSelected(null);
          setForecast([]);
        }
        return;
      }

      // 3) Finally, geocode and auto-load top result
      const res = await apiService.geocode(query.trim(), 10);
      setResults(res);
      if (res.length > 0) {
        void loadWeather(res[0]);
      } else {
        setError('No locations found. Try a more specific query.');
      }
    } catch (e: any) {
      setError('Search failed.');
    } finally {
      setSearching(false);
    }
  }, [query, units, loadWeather]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void doSearch();
  };

  return (
    <div className="pt-20 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Weather Explorer</h1>
      <p className="text-muted-foreground mb-6">Search real-time weather for any place worldwide. Powered by OpenWeather.</p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Search city, state, country (e.g., Paris, FR or Austin, TX)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" disabled={searching}>
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2">Search</span>
          </Button>
        </div>
        <div className="w-full md:w-56">
          <Select value={units} onValueChange={(v: any) => setUnits(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Units" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric (°C, m/s)</SelectItem>
              <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
              <SelectItem value="standard">Standard (K, m/s)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </form>

      {results.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Select a location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((r, idx) => {
                const label = [r.name, r.state, r.country].filter(Boolean).join(', ');
                return (
                  <Button key={`${r.name}-${r.lat}-${idx}`} variant="outline" className="justify-start" onClick={() => void loadWeather(r)}>
                    <MapPin className="h-4 w-4 mr-2" /> {label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading weather...
        </div>
      )}

      {weather && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" /> Current Weather
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> {selected ? [selected.name, selected.state, selected.country].filter(Boolean).join(', ') : (weather.location || 'Selected location')}
                </div>
                <div className="text-2xl font-bold">{weather.temperature}{unitSuffix.temp}</div>
                <div className="text-muted-foreground">{weather.weather_condition}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Humidity: {weather.humidity}%</div>
                  <div className="flex items-center gap-2"><Wind className="h-4 w-4" /> Wind: {weather.wind_speed} {unitSuffix.wind}</div>
                  <div className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Clouds: {weather.cloud_cover}%</div>
                  <div className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Visibility: {weather.visibility} {unitSuffix.vis}</div>
                  <div className="flex items-center gap-2"><Cloud className="h-4 w-4" /> Pressure: {weather.pressure} {unitSuffix.pressure}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">Updated: {new Date(weather.timestamp).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" /> Forecast (5-day, 3h intervals)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!forecast || !Array.isArray(forecast) || forecast.length === 0 ? (
                <div className="text-muted-foreground">No forecast data available.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {forecast.slice(0, 18).map((f: any, idx: number) => {
                    const t = f?.main?.temp;
                    const cond = f?.weather?.[0]?.main;
                    const dt = f?.dt_txt || f?.dt;
                    return (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">{dt}</div>
                          <div className="text-xl font-semibold mt-1">{t}{unitSuffix.temp}</div>
                          <div className="text-muted-foreground">{cond}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
