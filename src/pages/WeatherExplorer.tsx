import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { apiService, WeatherData } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, MapPin, Thermometer, Wind, Droplets, Cloud, Eye, Gauge, Sun, Moon, CloudRain, CloudLightning, ChevronLeft, ChevronRight, Plus, MoreHorizontal, User } from 'lucide-react';

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
    wind: units === 'imperial' ? 'mph' : 'km/h',
    vis: 'km',
    pressure: 'hPa',
  }), [units]);

  const formatNumber = (value: number | null | undefined, digits = 1) => {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    const n = Number(value);
    return Math.round(n * Math.pow(10, digits)) / Math.pow(10, digits);
  };

  const getWeatherIcon = (condition: string | undefined | null) => {
    if (!condition) return <Sun className="h-8 w-8 text-yellow-500" />;
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (cond.includes('thunder') || cond.includes('storm')) return <CloudLightning className="h-8 w-8 text-yellow-500" />;
    if (cond.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getWeatherIconType = (condition: string | undefined | null): 'sun' | 'cloud' => {
    if (!condition) return 'sun';
    const cond = condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('drizzle') || cond.includes('shower')) return 'cloud';
    if (cond.includes('snow') || cond.includes('sleet')) return 'cloud';
    if (cond.includes('thunder') || cond.includes('storm')) return 'cloud';
    if (cond.includes('fog') || cond.includes('mist') || cond.includes('haze')) return 'cloud';
    if (cond.includes('cloud') || cond.includes('overcast')) return 'cloud';
    return 'sun';
  };

  const getWindDirection = (degrees: number | undefined | null) => {
    if (degrees === undefined || degrees === null) return 'N';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  const getComfortLevel = (temp: number | undefined | null, humidity: number | undefined | null) => {
    if (temp === undefined || temp === null || humidity === undefined || humidity === null) {
      return { level: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-50' };
    }
    if (temp < 10) return { level: 'Cold', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (temp > 30) return { level: 'Hot', color: 'text-red-500', bg: 'bg-red-50' };
    if (humidity > 80) return { level: 'Humid', color: 'text-orange-500', bg: 'bg-orange-50' };
    return { level: 'Comfortable', color: 'text-green-500', bg: 'bg-green-50' };
  };

  // Free-text entry is removed; keep util noop for type parity if needed in the future
  const parseCoords = (_text: string): { lat: number; lon: number } | null => null;

  const loadWeather = useCallback(async (place: GeoResult) => {
    setLoading(true);
    setError(null);
    setSelected(place);
    try {
      const displayName = [place.name, place.state, place.country].filter(Boolean).join(', ');
      
      // Load current weather with enhanced data
      const w = await apiService.getCurrentWeatherByCoords(place.lat, place.lon, displayName, units);
      if (w) {
        // Fetch UV index separately for more accurate data
        const uvIndex = await apiService.getUVIndex(place.lat, place.lon);
        const enhancedWeather = {
          ...w,
          uv_index: uvIndex || w.uv_index
        };
        setWeather(enhancedWeather);
        
        // Load enhanced forecast data
        const f = await apiService.getForecast(place.lat, place.lon, 5, units);
        setForecast(Array.isArray(f) ? f : []);
      } else {
        setError('Failed to load weather data');
      }
    } catch (e: any) {
      console.error('Weather loading error:', e);
      setError('Failed to load weather data. Please try again.');
      setForecast([]); // Ensure forecast is always an array
    } finally {
      setLoading(false);
    }
  }, [units]);

  // Caching + abortable geocoding for speed
  const cacheRef = useRef<Map<string, GeoResult[]>>(new Map());
  const scheduleRef = useRef<number | undefined>(undefined);
  const abortRef = useRef<AbortController | null>(null);

  const performGeocode = useCallback(async (text: string) => {
    const q = text.trim();
    if (q.length < 3) {
        setResults([]);
        return;
      }

    // Instant local feedback using prefix cache
    const cachedKeys = Array.from(cacheRef.current.keys());
    const bestKey = cachedKeys.reverse().find(k => q.startsWith(k) && cacheRef.current.get(k)?.length);
    if (bestKey) {
      const local = cacheRef.current.get(bestKey)!.filter(r =>
        [r.name, r.state, r.country].filter(Boolean).join(', ').toLowerCase().includes(q.toLowerCase())
      ).slice(0, 8);
      if (local.length > 0) setResults(local);
    }

    // Abort previous request
    try { abortRef.current?.abort(); } catch {}
    abortRef.current = new AbortController();

    setSearching(true);
    try {
      const res = await apiService.geocode(q, 8);
      cacheRef.current.set(q, res);
      setResults(res);
    } catch {
      // keep previous quick suggestions
    } finally {
      setSearching(false);
    }
  }, []);

  const onQueryChange = (val: string) => {
    setQuery(val);
    if (scheduleRef.current) window.clearTimeout(scheduleRef.current);
    scheduleRef.current = window.setTimeout(() => void performGeocode(val), 200);
  };

    // Mock hourly data for upcoming hours
  const hourlyData = useMemo(() => {
    const baseTemp = weather?.temperature || 25;
    return [
      { time: 'Now', temp: formatNumber(baseTemp), icon: 'sun' as const, precip: 23 },
      { time: '10:00', temp: formatNumber(baseTemp + 1), icon: 'sun' as const, precip: 29 },
      { time: '11:00', temp: formatNumber(baseTemp + 2), icon: 'cloud' as const, precip: 58 },
      { time: '12:00', temp: formatNumber(baseTemp + 3), icon: 'cloud' as const, precip: 75 },
      { time: '13:00', temp: formatNumber(baseTemp + 2), icon: 'sun' as const, precip: 33 },
      { time: '14:00', temp: formatNumber(baseTemp + 1), icon: 'sun' as const, precip: 20 },
      { time: '15:00', temp: formatNumber(baseTemp), icon: 'cloud' as const, precip: 73 },
      { time: '16:00', temp: formatNumber(baseTemp - 1), icon: 'sun' as const, precip: 49 },
    ];
  }, [weather?.temperature]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pt-24">
      <div className="max-w-7xl mx-auto">
                 {/* Compact Single-Row Search Section */}
         <div className="mb-8">
           <div className="bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/50 backdrop-blur-sm border border-white/20 rounded-3xl p-4 shadow-2xl shadow-blue-500/10">
             <div className="flex items-center gap-4">
               {/* Compact Search Input */}
               <div className="flex-1 relative group">
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                 <div className="relative bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl p-1 shadow-lg">
                   <div className="flex items-center gap-3 px-3 py-2">
                     <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                       <MapPin className="h-4 w-4 text-white" />
                     </div>
                     <Input
                       placeholder="Search location..."
                       value={query}
                       onChange={(e) => onQueryChange(e.target.value)}
                       className="flex-1 h-10 text-base bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-500 font-medium"
                     />
                     {searching && (
                       <div className="p-1">
                         <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                       </div>
                     )}
                     {!searching && query && (
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => { setQuery(''); setResults([]); }}
                         className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                       >
                         <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                         </svg>
                       </Button>
                     )}
                   </div>
                 </div>
                 
                 {/* Compact Dropdown Results */}
                 {results.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 z-50">
                     <div className="relative">
                       <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-lg"></div>
                       <div className="relative bg-white/95 backdrop-blur-sm border border-white/30 rounded-2xl p-2 max-h-64 overflow-auto shadow-xl">
                         <div className="space-y-1">
                           {results.map((r, idx) => {
                             const label = [r.name, r.state, r.country].filter(Boolean).join(', ');
                             return (
                               <Button
                                 key={`${r.name}-${r.lat}-${idx}`}
                                 variant="ghost"
                                 className="w-full justify-start hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 rounded-lg p-2 group"
                                 onClick={() => { setSelected(r); setQuery(label); setResults([]); void loadWeather(r); }}
                               >
                                 <div className="flex items-center gap-2">
                                   <div className="p-1 bg-blue-100 group-hover:bg-blue-200 rounded-md transition-colors">
                                     <MapPin className="h-3 w-3 text-blue-600" />
                                   </div>
                                   <div className="text-left truncate">
                                     <div className="font-medium text-gray-900 text-sm truncate">{r.name}</div>
                                     <div className="text-xs text-gray-500 truncate">{[r.state, r.country].filter(Boolean).join(', ')}</div>
                                   </div>
                                 </div>
                               </Button>
                             );
                           })}
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
               </div>
               

             </div>
           </div>
         </div>

      {error && (
          <div className="text-red-500 mb-4 bg-white p-4 rounded-xl">{error}</div>
      )}

      {loading && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4 bg-white p-4 rounded-xl">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading weather...
        </div>
      )}

      {weather && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Current Weather */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white border-0 shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6 relative">
                                     {/* Header */}
                   <div className="flex justify-between items-center mb-6">
                     <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                       <Plus className="h-5 w-5" />
                     </Button>
                     <div className="flex items-center gap-2">
                       <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                         <MoreHorizontal className="h-5 w-5" />
                       </Button>
                       <Select value={units} onValueChange={(v: any) => { setUnits(v); if (selected) { void loadWeather(selected); } }}>
                         <SelectTrigger className="h-8 bg-white/20 text-white border-0 focus:ring-0 focus:outline-none font-medium">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="bg-white/95 backdrop-blur-sm border border-white/30 rounded-xl shadow-xl">
                           <SelectItem value="metric">Metric (°C, km/h)</SelectItem>
                           <SelectItem value="imperial">Imperial (°F, mph)</SelectItem>
                           <SelectItem value="standard">Standard (K, m/s)</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>

                  {/* Location and Date */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-1">
                      {selected ? [selected.name, selected.state, selected.country].filter(Boolean).join(', ') : (weather.location || 'Selected location')}
                    </h2>
                    <p className="text-blue-200">Today {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                  </div>

                  {/* Sunrise/Sunset */}
                  <div className="flex justify-between items-center mb-8">
                    <div className="text-center">
                      <p className="text-blue-200 text-sm">Sunrise</p>
                      <p className="font-semibold">07:19</p>
                    </div>
                    <div className="text-center">
                      <p className="text-blue-200 text-sm">Sunset</p>
                      <p className="font-semibold">19:32</p>
                    </div>
                  </div>

                  {/* Main Temperature */}
                  <div className="text-center mb-6">
                    <div className="text-7xl font-bold mb-2">{formatNumber(weather.temperature)}{unitSuffix.temp}</div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {getWeatherIcon(weather.weather_condition)}
                      <span className="text-xl font-semibold">{weather.weather_condition || 'Clear'}</span>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex justify-between items-center">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* City Skyline Background */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Detailed Weather */}
            <div className="lg:col-span-2">
              <Card className="bg-white border-0 shadow-xl rounded-3xl">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Welcome Back</h3>
                      <p className="text-gray-600">Check out today's weather information.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Upcoming Hours */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Upcoming hours</h4>
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Next days <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      {hourlyData.map((hour, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-sm text-gray-600 mb-2">{hour.time}</p>
                          <div className="flex justify-center mb-2">
                            {hour.icon === 'sun' ? <Sun className="h-6 w-6 text-yellow-500" /> : <Cloud className="h-6 w-6 text-gray-500" />}
                          </div>
                          <p className="font-semibold text-gray-900">{hour.temp}°</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      {hourlyData.map((hour, idx) => (
                        <div key={idx} className="text-center">
                          <p className="text-xs text-gray-500">{hour.precip}%</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Select>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Rain precipitation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rain">Rain precipitation</SelectItem>
                          <SelectItem value="snow">Snow precipitation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                                     {/* More Details Grid */}
                   <div>
                     <h4 className="text-lg font-semibold text-gray-900 mb-6">More details of today's weather</h4>
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                       {/* Humidity */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                             <Droplets className="h-6 w-6 text-blue-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">Humidity</h5>
                             <p className="text-3xl font-bold text-blue-600 mb-1">{formatNumber(weather.humidity)}%</p>
                             <p className="text-sm text-blue-500 font-medium">
                               {(() => {
                                 const humidity = weather.humidity;
                                 if (humidity < 30) return 'dry';
                                 if (humidity < 50) return 'comfortable';
                                 if (humidity < 70) return 'moderate';
                                 return 'high';
                               })()}
                             </p>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>good</span>
                               <span>normal</span>
                               <span>bad</span>
                             </div>
                             <div className="relative">
                               <Progress value={weather.humidity} className="h-2 bg-blue-200" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 opacity-20"></div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>

                       {/* Wind */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
                             <Wind className="h-6 w-6 text-green-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">Wind Speed</h5>
                             <p className="text-3xl font-bold text-green-600 mb-1">{formatNumber(weather.wind_speed)} {unitSuffix.wind}</p>
                             <p className="text-sm text-green-500 font-medium">
                               {(() => {
                                 const speed = weather.wind_speed;
                                 if (speed < 5) return 'calm';
                                 if (speed < 15) return 'light';
                                 if (speed < 25) return 'moderate';
                                 if (speed < 35) return 'strong';
                                 return 'very strong';
                               })()}
                             </p>
                           </div>
                           <div className="flex justify-center">
                             <div className="relative w-16 h-16">
                               <div className="w-16 h-16 border-4 border-green-200 rounded-full"></div>
                               <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-green-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                               </div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>

                       {/* Precipitation */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                             <CloudRain className="h-6 w-6 text-purple-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">Precipitation</h5>
                             <p className="text-3xl font-bold text-purple-600 mb-1">{formatNumber(weather.precipitation)} mm</p>
                             <p className="text-sm text-purple-500 font-medium">
                               {(() => {
                                 const precip = weather.precipitation;
                                 if (precip === 0) return 'none';
                                 if (precip < 2.5) return 'light';
                                 if (precip < 7.5) return 'moderate';
                                 if (precip < 50) return 'heavy';
                                 return 'very heavy';
                               })()}
                             </p>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>0</span>
                               <span>25</span>
                               <span>50</span>
                             </div>
                             <div className="relative">
                               <Progress value={Math.min((weather.precipitation / 50) * 100, 100)} className="h-2 bg-purple-200" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-600 opacity-20"></div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>

                       {/* UV Index */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-orange-500/10 rounded-full group-hover:bg-orange-500/20 transition-colors">
                             <Sun className="h-6 w-6 text-orange-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">UV Index</h5>
                             <p className="text-3xl font-bold text-orange-600 mb-1">
                               4
                             </p>
                             <p className="text-sm text-orange-500 font-medium">
                               medium
                             </p>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>0-2</span>
                               <span>3-5</span>
                               <span>6-7</span>
                               <span>8-10</span>
                               <span>11+</span>
                             </div>
                             <div className="relative">
                               <Progress value={40} className="h-2 bg-orange-200" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-600 opacity-20"></div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>

                       {/* Feels Like */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-red-500/10 rounded-full group-hover:bg-red-500/20 transition-colors">
                             <Thermometer className="h-6 w-6 text-red-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">Feels Like</h5>
                             <p className="text-3xl font-bold text-red-600 mb-1">
                               {weather.feels_like ? formatNumber(weather.feels_like) : formatNumber(weather.temperature)}{unitSuffix.temp}
                             </p>
                             <p className="text-sm text-red-500 font-medium">
                               {(() => {
                                 const temp = weather.feels_like || weather.temperature;
                                 if (temp < 10) return 'cold';
                                 if (temp < 20) return 'cool';
                                 if (temp < 25) return 'mild';
                                 if (temp < 30) return 'warm';
                                 return 'hot';
                               })()}
                             </p>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>0°</span>
                               <span>25°</span>
                               <span>50°</span>
                             </div>
                             <div className="relative">
                               <Progress value={Math.min(Math.max((weather.feels_like || weather.temperature) * 2, 0), 100)} className="h-2 bg-red-200" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-green-400 to-red-600 opacity-20"></div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>

                       {/* Chance of Rain */}
                       <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200">
                         <CardContent className="p-6 relative">
                           <div className="absolute top-4 right-4 p-2 bg-indigo-500/10 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                             <CloudRain className="h-6 w-6 text-indigo-600" />
                           </div>
                           <div className="text-center mb-4">
                             <h5 className="font-semibold text-gray-900 mb-2">Chance of Rain</h5>
                             <p className="text-3xl font-bold text-indigo-600 mb-1">
                               42%
                             </p>
                             <p className="text-sm text-indigo-500 font-medium">
                               likely
                             </p>
                           </div>
                           <div className="space-y-2">
                             <div className="flex justify-between text-xs text-gray-500 font-medium">
                               <span>0%</span>
                               <span>25%</span>
                               <span>50%</span>
                               <span>75%</span>
                               <span>100%</span>
                             </div>
                             <div className="relative">
                               <Progress value={42} className="h-2 bg-indigo-200" />
                               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 opacity-20"></div>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     </div>
                   </div>
            </CardContent>
          </Card>
            </div>
        </div>
      )}
      </div>
    </div>
  );
}
