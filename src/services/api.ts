import { io, Socket } from 'socket.io-client';

// API Configuration - FORCE Railway backend URL
const RAILWAY_BACKEND_URL = 'https://web-production-47673.up.railway.app';

// Always use Railway backend - override any environment variables
const API_BASE_URL = RAILWAY_BACKEND_URL;
const SOCKET_URL = RAILWAY_BACKEND_URL;
const OPENWEATHER_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim();

// Debug logging to see which URLs are being used
console.log('🔧 API Configuration (FORCED TO RAILWAY):', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  API_BASE_URL,
  SOCKET_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
  FORCED_RAILWAY_URL: RAILWAY_BACKEND_URL
});

// Types
export interface WeatherData {
  location: string;
  coordinates: { lat: number; lng: number };
  temperature: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_direction: number;
  precipitation: number;
  visibility: number;
  cloud_cover: number;
  weather_condition: string;
  timestamp: string;
  forecast_data?: any[];
  uv_index?: number;
  feels_like?: number;
  pop?: number; // Probability of precipitation
}

export interface DisasterEvent {
  magnitude: string;
  id: string;
  name: string;
  event_type: string;
  location: string;
  severity: string;
  status: string;
  coordinates: { lat: number; lng: number };
  affected_population: number;
  economic_impact: number;
  created_at: string;
  updated_at: string;
  description: string;
  source: string;
  confidence_score: number;
  weather_data?: any;
}

export interface Prediction {
  id: string;
  event_type: string;
  location: string;
  probability: number;
  severity: string;
  timeframe: string;
  coordinates: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
  confidence_level: number;
  affected_area_km2: number;
  potential_impact: string;
  weather_data?: any;
  ai_model: string;
}

export interface SensorData {
  id: string;
  sensor_type: string;
  station_id: string;
  station_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  reading_value: number;
  reading_unit: string;
  reading_time: string;
  data_quality: string;
  metadata: any;
  created_at: string;
}

export interface Stats {
  total_events: number;
  active_events: number;
  critical_events: number;
  total_predictions: number;
  high_probability_predictions: number;
  total_sensors: number;
  weather_locations_monitored: number;
  ai_models_active: number;
  last_updated: string;
}

export interface AIPrediction {
  location: string;
  coordinates: { lat: number; lng: number };
  weather_data: any;
  predictions: { [key: string]: number };
  summaries?: { [key: string]: string };
  timestamp: string;
}

export interface GlobalRiskAnalysis {
  location: {
    query?: string;
    latitude: number;
    longitude: number;
    country: string;
    region: string;
  };
  timestamp: string;
  analysis_period: string;
  disasters: {
    [key: string]: {
      risk_score: number;
      risk_level: string;
      color: string;
      probability: number;
      severity: string;
      factors: {
        geographical: number;
        seasonal: number;
        historical: number;
        environmental: number;
      };
      description: string;
      recommendations: string[];
      last_updated: string;
    };
  };
  composite_risk: {
    score: number;
    level: string;
    trend: string;
  };
}

// API Service Class
class ApiService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();
  private geocodeCache: Map<string, Array<{ name: string; lat: number; lon: number; country?: string; state?: string }>> = new Map();

  constructor() {
    this.initializeSocket();
  }

  // Worldwide Weather Search
  async geocode(query: string, limit: number = 5): Promise<Array<{ name: string; lat: number; lon: number; country?: string; state?: string }>> {
    const key = `${query}\n${limit}`.toLowerCase();
    const cached = this.geocodeCache.get(key);
    if (cached && cached.length) return cached;

    // Strategy: OpenWeather (if key) -> Open-Meteo (no key) -> Nominatim -> Backend
    if (OPENWEATHER_KEY) {
      try {
        const url = new URL('https://api.openweathermap.org/geo/1.0/direct');
        url.searchParams.set('q', query);
        url.searchParams.set('limit', String(limit));
        url.searchParams.set('appid', OPENWEATHER_KEY);
        const ow = await fetch(url.toString());
        if (ow.ok) {
          const arr = await ow.json();
          const mapped = (arr || []).map((x: any) => ({
            name: x?.name || [x?.name, x?.state, x?.country].filter(Boolean).join(', '),
            lat: x?.lat,
            lon: x?.lon,
            country: x?.country,
            state: x?.state,
          }));
          this.geocodeCache.set(key, mapped);
          if (mapped.length) return mapped;
        }
      } catch (e) {
        console.warn('OpenWeather geocode attempt failed:', e);
      }
    }

    // Open-Meteo free geocoding (no key)
    try {
      const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
      url.searchParams.set('name', query);
      url.searchParams.set('count', String(limit));
      url.searchParams.set('language', 'en');
      url.searchParams.set('format', 'json');
      const om = await fetch(url.toString());
      if (om.ok) {
        const data = await om.json();
        const results = Array.isArray(data?.results) ? data.results : [];
        const mapped = results.map((x: any) => ({
          name: [x?.name, x?.admin1, x?.country].filter(Boolean).join(', '),
          lat: x?.latitude,
          lon: x?.longitude,
          country: x?.country_code,
          state: x?.admin1,
        }));
        this.geocodeCache.set(key, mapped);
        if (mapped.length) return mapped;
      }
    } catch (e) {
      console.warn('Open-Meteo geocode attempt failed:', e);
    }

    try {
      const url = new URL(`${API_BASE_URL}/api/geocode`);
      url.searchParams.set('query', query);
      url.searchParams.set('limit', String(limit));
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        this.geocodeCache.set(key, data);
        return data;
      }
      console.warn(`Backend geocode failed (${response.status})`);
    } catch (error) {
      console.warn('Backend geocoding error:', error);
    }

    // Nominatim fallback
    try {
      const url = new URL('https://nominatim.openstreetmap.org/search');
      url.searchParams.set('q', query);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', String(limit));
      const nm = await fetch(url.toString(), { headers: { 'Accept-Language': 'en', 'User-Agent': 'DisastroScope/1.0' } as any });
      if (nm.ok) {
        const arr = await nm.json();
        const mapped = (arr || []).map((x: any) => ({
          name: x?.display_name || query,
          lat: parseFloat(x?.lat),
          lon: parseFloat(x?.lon),
          country: undefined,
          state: undefined,
        }));
        this.geocodeCache.set(key, mapped);
        return mapped;
      }
    } catch (e) {
      console.warn('Nominatim geocode attempt failed:', e);
    }

    return [];
  }

  async getCurrentWeatherByCoords(lat: number, lon: number, name?: string, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherData | null> {
    try {
      const url = new URL(`${API_BASE_URL}/api/weather/current`);
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      if (name) url.searchParams.set('name', name);
      if (units) url.searchParams.set('units', units);
      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        // Ensure all required fields are present and properly formatted
        return this.normalizeWeatherData(data, lat, lon, name);
      }
      throw new Error(`Backend current weather failed (${response.status})`);
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Enhanced fallback: OpenWeather direct call with comprehensive data
      try {
        if (!OPENWEATHER_KEY) return null;
        const url = new URL('https://api.openweathermap.org/data/2.5/weather');
        url.searchParams.set('lat', String(lat));
        url.searchParams.set('lon', String(lon));
        url.searchParams.set('appid', OPENWEATHER_KEY);
        url.searchParams.set('units', units === 'standard' ? 'standard' : units);
        const ow = await fetch(url.toString());
        if (!ow.ok) return null;
        const d = await ow.json();
        
        // Enhanced data extraction with better accuracy
        const visibilityKm = typeof d?.visibility === 'number' ? Math.round((d.visibility / 1000) * 10) / 10 : null;
        const precipitation = d?.rain?.['1h'] ?? d?.snow?.['1h'] ?? 0;
        const feelsLike = d?.main?.feels_like ?? d?.main?.temp;
        
        const mapped: WeatherData = {
          location: name || d?.name || 'Selected location',
          coordinates: { lat, lng: lon },
          temperature: Number(d?.main?.temp ?? 0),
          humidity: Number(d?.main?.humidity ?? 0),
          pressure: Number(d?.main?.pressure ?? 0),
          wind_speed: Number(d?.wind?.speed ?? 0),
          wind_direction: Number(d?.wind?.deg ?? 0),
          precipitation: Number(precipitation ?? 0),
          visibility: visibilityKm ?? 0,
          cloud_cover: Number(d?.clouds?.all ?? 0),
          weather_condition: d?.weather?.[0]?.main || '—',
          timestamp: new Date((d?.dt ?? Date.now()) * 1000).toISOString(),
          forecast_data: undefined,
          uv_index: undefined, // Will be fetched separately
          feels_like: Number(feelsLike ?? 0),
          pop: undefined // Will be available in forecast
        };
        return mapped;
      } catch (e) {
        console.warn('OpenWeather current weather fallback failed:', e);
        return null;
      }
    }
  }

  async getWeatherByCity(query: string, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherData | null> {
    try {
      const url = new URL(`${API_BASE_URL}/api/weather/by-city`);
      url.searchParams.set('query', query);
      if (units) url.searchParams.set('units', units);
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch weather by city');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      return null;
    }
  }

  async getForecast(
    lat: number,
    lon: number,
    days: number = 5,
    units: 'metric' | 'imperial' | 'standard' = 'metric'
  ): Promise<any[]> {
    try {
      const url = new URL(`${API_BASE_URL}/api/weather/forecast`);
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      url.searchParams.set('days', String(days));
      if (units) url.searchParams.set('units', units);
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch forecast');
      const data = await response.json();
      
      // Enhanced normalization with better data processing
      let forecastArray: any[] = [];
      if (Array.isArray(data)) forecastArray = data;
      else if (Array.isArray(data?.list)) forecastArray = data.list;
      else if (Array.isArray(data?.forecast)) forecastArray = data.forecast;
      
      // Process and enhance forecast data
      return forecastArray.map(item => this.enhanceForecastItem(item, units));
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // Enhanced fallback: OpenWeather 5-day / 3-hour forecast with better processing
      try {
        if (!OPENWEATHER_KEY) return [];
        const url = new URL('https://api.openweathermap.org/data/2.5/forecast');
        url.searchParams.set('lat', String(lat));
        url.searchParams.set('lon', String(lon));
        url.searchParams.set('appid', OPENWEATHER_KEY);
        url.searchParams.set('units', units === 'standard' ? 'standard' : units);
        const ow = await fetch(url.toString());
        if (!ow.ok) return [];
        const d = await ow.json();
        return Array.isArray(d?.list) ? d.list : [];
      } catch (e) {
        console.warn('OpenWeather forecast fallback failed:', e);
        return [];
      }
    }
  }

  private initializeSocket() {
    try {
      // TEMPORARILY DISABLED: Socket.IO initialization disabled to prevent connection errors
      // while backend Socket.IO server is being configured on Railway
      console.log('[API] Socket.IO initialization temporarily disabled for backend stability');
      
      // TODO: Re-enable when Socket.IO server is properly configured
      /*
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to DisastroScope API with Real Weather Data');
        // Re-emit via local event bus for app-level listeners
        this.emit('connect', { connected: true });
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from DisastroScope API');
        this.emit('disconnect', { connected: false });
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.emit('connect_error', error);
      });

      // Handle real-time updates
      this.socket.on('new_event', (event: DisasterEvent) => {
        this.emit('new_event', event);
      });

      this.socket.on('new_prediction', (prediction: Prediction) => {
        this.emit('new_prediction', prediction);
      });

      this.socket.on('sensor_update', (sensor: SensorData) => {
        this.emit('sensor_update', sensor);
      });

      this.socket.on('weather_update', (weather: WeatherData[]) => {
        this.emit('weather_update', weather);
      });

      this.socket.on('events_update', (events: DisasterEvent[]) => {
        this.emit('events_update', events);
      });

      this.socket.on('predictions_update', (predictions: Prediction[]) => {
        this.emit('predictions_update', predictions);
      });

      // FEMA disasters (OpenFEMA)
      this.socket.on('disasters_update', (items: any[]) => {
        this.emit('disasters_update', items);
      });
      this.socket.on('new_disaster', (item: any) => {
        this.emit('new_disaster', item);
      });

      // NASA EONET events
      this.socket.on('eonet_update', (items: any[]) => {
        this.emit('eonet_update', items);
      });
      this.socket.on('new_eonet_event', (item: any) => {
        this.emit('new_eonet_event', item);
      });
      */

    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }

  // Weather API Methods
  async getWeatherData(): Promise<WeatherData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather`);
      if (!response.ok) throw new Error('Failed to fetch weather data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return [];
    }
  }

  async getWeatherForLocation(location: string): Promise<WeatherData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather/${location}`);
      if (!response.ok) throw new Error('Failed to fetch weather for location');
      return await response.json();
    } catch (error) {
      console.error('Error fetching weather for location:', error);
      return null;
    }
  }

  // AI Prediction Methods
  async predictDisaster(lat: number, lon: number, locationName?: string): Promise<AIPrediction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          location_name: locationName
        }),
      });
      if (!response.ok) throw new Error('Failed to get AI prediction');
      return await response.json();
    } catch (error) {
      console.error('Error getting AI prediction:', error);
      return null;
    }
  }

  // NEW: Enhanced Location Analysis Method
  async analyzeLocation(query: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Location analysis failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error in location analysis:', error);
      throw error; // Re-throw to handle in UI
    }
  }

  // NEW: Analyze by precise coordinates (server reverse-geocodes and predicts)
  async analyzeCoords(lat: number, lon: number, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/analyze/coords`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lon, units })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Coordinate analysis failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in coordinate analysis:', error);
      throw error;
    }
  }

  // NEW: Get model registry (for transparency: version, type, metrics placeholder)
  async getModels(): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/models`);
      if (!response.ok) throw new Error('Failed to fetch models');
      return await response.json();
    } catch (error) {
      console.error('Error fetching models:', error);
      return null;
    }
  }

  // NEW: Test Location Method for Debugging
  async testLocation(query: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test/location?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Location test failed');
      return await response.json();
    } catch (error) {
      console.error('Error testing location:', error);
      return null;
    }
  }

  async trainModels(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to train models');
      return true;
    } catch (error) {
      console.error('Error training models:', error);
      return false;
    }
  }

  async analyzeGlobalRisk(locationQuery?: string, latitude?: number, longitude?: number): Promise<GlobalRiskAnalysis | null> {
    try {
      const payload: any = {};
      if (locationQuery) payload.location_query = locationQuery;
      if (latitude !== undefined) payload.latitude = latitude;
      if (longitude !== undefined) payload.longitude = longitude;
      
      // Primary call
      const primary = await fetch(`${API_BASE_URL}/api/global-risk-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        // Explicit CORS mode to avoid credential issues on Vercel
        mode: 'cors',
      });

      if (primary.ok) {
        const data = await primary.json();
        return data;
      }

      // Fallback 1: Client-side geocode then retry /api/global-risk-analysis with coordinates
      if (locationQuery) {
        try {
          const geo = await this.geocode(locationQuery, 1);
          const best = Array.isArray(geo) && geo.length ? geo[0] : null;
          if (best?.lat != null && best?.lon != null) {
            const retryPayload: any = { latitude: best.lat, longitude: best.lon, location_query: locationQuery };
            const retry = await fetch(`${API_BASE_URL}/api/global-risk-analysis`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(retryPayload),
              mode: 'cors',
            });
            if (retry.ok) {
              const d2 = await retry.json();
              return d2;
            }
          }
        } catch (e) {
          console.warn('Geocode+retry fallback failed:', e);
        }
      }

      // Fallback 2: Enhanced AI prediction endpoint
      if (locationQuery) {
        try {
          const enhResp = await fetch(`${API_BASE_URL}/api/ai/predict-enhanced`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location_query: locationQuery }),
            mode: 'cors',
          });
          if (enhResp.ok) {
            const enh = await enhResp.json();
            const mapped = this.mapEnhancedPredictionToGlobal(enh, locationQuery);
            if (mapped) return mapped;
          }
        } catch (e) {
          console.warn('Fallback predict-enhanced failed:', e);
        }
      }

      // Fallback 3: Basic AI predict with geocoded coordinates
      if (locationQuery) {
        try {
          const geo = await this.geocode(locationQuery, 1);
          const best = Array.isArray(geo) && geo.length ? geo[0] : null;
          if (best?.lat != null && best?.lon != null) {
            const basic = await this.predictDisaster(best.lat, best.lon, locationQuery);
            if (basic) {
              const mapped = this.mapBasicPredictionToGlobal(basic, locationQuery);
              if (mapped) return mapped;
            }
          }
        } catch (e) {
          console.warn('Fallback basic predict failed:', e);
        }
      }

      // If all fallbacks failed, throw for outer catch
      throw new Error(`Global risk analysis failed (${primary.status})`);
    } catch (error) {
      console.error('Error analyzing global risk:', error);
      return null;
    }
  }

  // HTTP API Methods
  async getEvents(): Promise<DisasterEvent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEvent(id: string): Promise<DisasterEvent | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
      if (!response.ok) throw new Error('Failed to fetch event');
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async createEvent(eventData: Partial<DisasterEvent>): Promise<DisasterEvent | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  async getPredictions(): Promise<Prediction[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions`);
      if (!response.ok) throw new Error('Failed to fetch predictions');
      return await response.json();
    } catch (error) {
      console.error('Error fetching predictions:', error);
      return [];
    }
  }

  async getPrediction(id: string): Promise<Prediction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch prediction');
      return await response.json();
    } catch (error) {
      console.error('Error fetching prediction:', error);
      return null;
    }
  }

  async createPrediction(predictionData: Partial<Prediction>): Promise<Prediction | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });
      if (!response.ok) throw new Error('Failed to create prediction');
      return await response.json();
    } catch (error) {
      console.error('Error creating prediction:', error);
      return null;
    }
  }

  // Helper method to normalize weather data
  private normalizeWeatherData(data: any, lat: number, lon: number, name?: string): WeatherData {
    return {
      location: data.location || name || 'Selected location',
      coordinates: data.coordinates || { lat, lng: lon },
      temperature: Number(data.temperature ?? 0),
      humidity: Number(data.humidity ?? 0),
      pressure: Number(data.pressure ?? 0),
      wind_speed: Number(data.wind_speed ?? 0),
      wind_direction: Number(data.wind_direction ?? 0),
      precipitation: Number(data.precipitation ?? 0),
      visibility: Number(data.visibility ?? 0),
      cloud_cover: Number(data.cloud_cover ?? 0),
      weather_condition: data.weather_condition || '—',
      timestamp: data.timestamp || new Date().toISOString(),
      forecast_data: data.forecast_data,
      uv_index: Number(data.uv_index) || undefined,
      feels_like: Number(data.feels_like) || undefined,
      pop: Number(data.pop) || undefined
    };
  }

  // Helper: map /api/location/analyze response to GlobalRiskAnalysis
  private mapLocationAnalysisToGlobal(loc: any, query: string): GlobalRiskAnalysis | null {
    try {
      const coords = loc?.location?.coordinates || {};
      const lat = Number(coords?.lat ?? loc?.latitude ?? 0);
      const lon = Number(coords?.lng ?? loc?.longitude ?? 0);
      const risks = loc?.disaster_risks || {};
      const disasters: Record<string, any> = {};

      const mapKey = (k: string) => {
        const key = (k || '').toLowerCase();
        if (key.startsWith('flood')) return 'Floods';
        if (key.startsWith('landslide')) return 'Landslides';
        if (key.startsWith('earth')) return 'Earthquakes';
        if (key.startsWith('cycl') || key.includes('storm') || key.includes('hurricane') || key.includes('typhoon')) return 'Cyclones';
        if (key.startsWith('wild')) return 'Wildfires';
        if (key.startsWith('tsun')) return 'Tsunamis';
        if (key.startsWith('drou')) return 'Droughts';
        return key.charAt(0).toUpperCase() + key.slice(1);
      };

      const riskToLevel = (p: number) => {
        if (p > 0.7) return { level: 'Critical', color: 'red' };
        if (p > 0.5) return { level: 'High', color: 'orange' };
        if (p > 0.3) return { level: 'Moderate', color: 'yellow' };
        return { level: 'Low', color: 'green' };
      };

      Object.entries(risks).forEach(([k, v]) => {
        const p = Math.max(0, Math.min(1, Number(v ?? 0)));
        const title = mapKey(k);
        const rl = riskToLevel(p);
        disasters[title] = {
          risk_score: Math.round(p * 1000) / 10,
          risk_level: rl.level,
          color: rl.color,
          probability: Math.round(p * 1000) / 10,
          severity: rl.level,
          factors: {
            geographical: Math.round(p * 1000) / 10,
            seasonal: Math.round(50 + 30 * p),
            historical: Math.round(p * 80 * 10) / 10,
            environmental: Math.round(p * 70 * 10) / 10,
          },
          description: `${rl.level} risk of ${title.toLowerCase()} in this region`,
          recommendations: [
            `Monitor ${title.toLowerCase()} indicators`,
            'Stay informed about local alerts',
            'Prepare emergency response plans',
          ],
          last_updated: new Date().toISOString(),
        };
      });

      const scores = Object.values(disasters).map((d: any) => d.risk_score);
      const composite = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const level = composite < 30 ? 'Low' : composite < 50 ? 'Moderate' : composite < 70 ? 'High' : 'Critical';

      return {
        location: {
          query,
          latitude: lat,
          longitude: lon,
          country: loc?.location?.name?.split(',').slice(-1)[0]?.trim() || 'Unknown',
          region: loc?.location?.name?.split(',')[1]?.trim() || loc?.location?.name || 'Unknown',
        },
        timestamp: new Date().toISOString(),
        analysis_period: '7 days',
        disasters,
        composite_risk: {
          score: Math.round(composite * 10) / 10,
          level,
          trend: 'stable',
        },
      } as GlobalRiskAnalysis;
    } catch (e) {
      console.warn('mapLocationAnalysisToGlobal failed:', e);
      return null;
    }
  }

  // Helper: map /api/ai/predict-enhanced response to GlobalRiskAnalysis
  private mapEnhancedPredictionToGlobal(enh: any, query: string): GlobalRiskAnalysis | null {
    try {
      const preds = enh?.predictions || {};
      const meta = enh?.metadata || {};
      const lat = Number(meta?.location?.latitude ?? 0);
      const lon = Number(meta?.location?.longitude ?? 0);

      const disasters: Record<string, any> = {};
      const mapKey = (k: string) => {
        const key = (k || '').toLowerCase();
        if (key.startsWith('flood')) return 'Floods';
        if (key.startsWith('landslide')) return 'Landslides';
        if (key.startsWith('earth')) return 'Earthquakes';
        if (key.startsWith('cycl') || key.includes('storm') || key.includes('hurricane') || key.includes('typhoon')) return 'Cyclones';
        if (key.startsWith('wild')) return 'Wildfires';
        if (key.startsWith('tsun')) return 'Tsunamis';
        if (key.startsWith('drou')) return 'Droughts';
        return key.charAt(0).toUpperCase() + key.slice(1);
      };
      const riskToLevel = (p: number) => {
        if (p > 0.7) return { level: 'Critical', color: 'red' };
        if (p > 0.5) return { level: 'High', color: 'orange' };
        if (p > 0.3) return { level: 'Moderate', color: 'yellow' };
        return { level: 'Low', color: 'green' };
      };

      Object.entries(preds).forEach(([k, v]) => {
        const p = Math.max(0, Math.min(1, Number(v ?? 0)));
        const title = mapKey(k);
        const rl = riskToLevel(p);
        disasters[title] = {
          risk_score: Math.round(p * 1000) / 10,
          risk_level: rl.level,
          color: rl.color,
          probability: Math.round(p * 1000) / 10,
          severity: rl.level,
          factors: {
            geographical: Math.round(p * 1000) / 10,
            seasonal: Math.round(50 + 30 * p),
            historical: Math.round(p * 80 * 10) / 10,
            environmental: Math.round(p * 70 * 10) / 10,
          },
          description: `${rl.level} risk of ${title.toLowerCase()} in this region`,
          recommendations: [
            `Monitor ${title.toLowerCase()} indicators`,
            'Stay informed about local alerts',
            'Prepare emergency response plans',
          ],
          last_updated: new Date().toISOString(),
        };
      });

      const scores = Object.values(disasters).map((d: any) => d.risk_score);
      const composite = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const level = composite < 30 ? 'Low' : composite < 50 ? 'Moderate' : composite < 70 ? 'High' : 'Critical';

      return {
        location: {
          query,
          latitude: lat,
          longitude: lon,
          country: meta?.location?.name?.split(',').slice(-1)[0]?.trim() || 'Unknown',
          region: meta?.location?.name || 'Unknown',
        },
        timestamp: new Date().toISOString(),
        analysis_period: '7 days',
        disasters,
        composite_risk: {
          score: Math.round(composite * 10) / 10,
          level,
          trend: 'stable',
        },
      } as GlobalRiskAnalysis;
    } catch (e) {
      console.warn('mapEnhancedPredictionToGlobal failed:', e);
      return null;
    }
  }

  // Helper: map /api/ai/predict (basic) response to GlobalRiskAnalysis
  private mapBasicPredictionToGlobal(basic: any, query: string): GlobalRiskAnalysis | null {
    try {
      const coords = basic?.coordinates || basic?.location || {};
      const lat = Number(coords?.lat ?? coords?.latitude ?? 0);
      const lon = Number(coords?.lng ?? coords?.longitude ?? 0);
      const preds = basic?.predictions || basic?.predictions_map || basic?.preds || {};

      const disasters: Record<string, any> = {};
      const mapKey = (k: string) => {
        const key = (k || '').toLowerCase();
        if (key.startsWith('flood')) return 'Floods';
        if (key.startsWith('landslide')) return 'Landslides';
        if (key.startsWith('earth')) return 'Earthquakes';
        if (key.startsWith('cycl') || key.includes('storm') || key.includes('hurricane') || key.includes('typhoon')) return 'Cyclones';
        if (key.startsWith('wild')) return 'Wildfires';
        if (key.startsWith('tsun')) return 'Tsunamis';
        if (key.startsWith('drou')) return 'Droughts';
        return key.charAt(0).toUpperCase() + key.slice(1);
      };
      const riskToLevel = (p: number) => {
        if (p > 0.7) return { level: 'Critical', color: 'red' };
        if (p > 0.5) return { level: 'High', color: 'orange' };
        if (p > 0.3) return { level: 'Moderate', color: 'yellow' };
        return { level: 'Low', color: 'green' };
      };

      Object.entries(preds).forEach(([k, v]) => {
        const p = Math.max(0, Math.min(1, Number(v ?? 0)));
        const title = mapKey(k);
        const rl = riskToLevel(p);
        disasters[title] = {
          risk_score: Math.round(p * 1000) / 10,
          risk_level: rl.level,
          color: rl.color,
          probability: Math.round(p * 1000) / 10,
          severity: rl.level,
          factors: {
            geographical: Math.round(p * 1000) / 10,
            seasonal: Math.round(50 + 30 * p),
            historical: Math.round(p * 80 * 10) / 10,
            environmental: Math.round(p * 70 * 10) / 10,
          },
          description: `${rl.level} risk of ${title.toLowerCase()} in this region`,
          recommendations: [
            `Monitor ${title.toLowerCase()} indicators`,
            'Stay informed about local alerts',
            'Prepare emergency response plans',
          ],
          last_updated: new Date().toISOString(),
        };
      });

      const scores = Object.values(disasters).map((d: any) => d.risk_score);
      const composite = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const level = composite < 30 ? 'Low' : composite < 50 ? 'Moderate' : composite < 70 ? 'High' : 'Critical';

      return {
        location: {
          query,
          latitude: lat,
          longitude: lon,
          country: 'Unknown',
          region: query,
        },
        timestamp: new Date().toISOString(),
        analysis_period: '7 days',
        disasters,
        composite_risk: {
          score: Math.round(composite * 10) / 10,
          level,
          trend: 'stable',
        },
      } as GlobalRiskAnalysis;
    } catch (e) {
      console.warn('mapBasicPredictionToGlobal failed:', e);
      return null;
    }
  }

  // Helper method to enhance forecast items with additional data
  private enhanceForecastItem(item: any, units: string): any {
    const enhanced = { ...item };
    
    // Ensure temperature data is properly formatted
    if (enhanced.main) {
      enhanced.main.temp = Number(enhanced.main.temp ?? 0);
      enhanced.main.feels_like = Number(enhanced.main.feels_like ?? enhanced.main.temp);
      enhanced.main.humidity = Number(enhanced.main.humidity ?? 0);
      enhanced.main.pressure = Number(enhanced.main.pressure ?? 0);
    }
    
    // Ensure wind data is properly formatted
    if (enhanced.wind) {
      enhanced.wind.speed = Number(enhanced.wind.speed ?? 0);
      enhanced.wind.deg = Number(enhanced.wind.deg ?? 0);
    }
    
    // Ensure precipitation probability is properly formatted
    enhanced.pop = Number(enhanced.pop ?? 0);
    
    // Add weather condition if missing
    if (enhanced.weather && enhanced.weather.length > 0) {
      enhanced.weather[0].main = enhanced.weather[0].main || 'Clear';
      enhanced.weather[0].description = enhanced.weather[0].description || 'Clear sky';
    }
    
    return enhanced;
  }

  // Method to fetch UV index data
  async getUVIndex(lat: number, lon: number): Promise<number | null> {
    try {
      if (!OPENWEATHER_KEY) return null;
      
      // Try OpenWeather UV index endpoint first
      const url = new URL('https://api.openweathermap.org/data/2.5/air_pollution');
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      url.searchParams.set('appid', OPENWEATHER_KEY);
      
      const response = await fetch(url.toString());
      if (!response.ok) return null;
      
      const data = await response.json();
      const uvi = data?.list?.[0]?.main?.uvi;
      
      if (uvi !== null && uvi !== undefined) {
        return Number(uvi);
      }
      
      // Fallback: try to get UV index from current weather data
      const weatherUrl = new URL('https://api.openweathermap.org/data/2.5/weather');
      weatherUrl.searchParams.set('lat', String(lat));
      weatherUrl.searchParams.set('lon', String(lon));
      weatherUrl.searchParams.set('appid', OPENWEATHER_KEY);
      
      const weatherResponse = await fetch(weatherUrl.toString());
      if (!weatherResponse.ok) return null;
      
      const weatherData = await weatherResponse.json();
      return weatherData?.uvi ?? null;
    } catch (error) {
      console.error('Error fetching UV index:', error);
      return null;
    }
  }

  async getSensorData(): Promise<SensorData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sensors`);
      if (!response.ok) throw new Error('Failed to fetch sensor data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return [];
    }
  }

  async getSensor(id: string): Promise<SensorData | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sensors/${id}`);
      if (!response.ok) throw new Error('Failed to fetch sensor');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensor:', error);
      return null;
    }
  }

  async getStats(): Promise<Stats | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Disaster Data (OpenFEMA)
  async getDisasters(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/disasters`);
      if (!response.ok) {
        // Treat 404 as empty dataset to keep dashboard stable
        if (response.status === 404) return [];
        throw new Error('Failed to fetch disasters');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching disasters:', error);
      return [];
    }
  }

  async getDisastersByState(stateCode: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/disasters/state/${stateCode}`);
      if (!response.ok) throw new Error('Failed to fetch disasters by state');
      return await response.json();
    } catch (error) {
      console.error('Error fetching disasters by state:', error);
      return [];
    }
  }

  // NASA EONET
  async getEONETEvents(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/eonet`);
      if (!response.ok) {
        // Treat 404 as empty dataset to keep dashboard stable
        if (response.status === 404) return [];
        throw new Error('Failed to fetch EONET events');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching EONET events:', error);
      return [];
    }
  }

  async getEONETByCategory(category: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/eonet/category/${category}`);
      if (!response.ok) throw new Error('Failed to fetch EONET by category');
      return await response.json();
    } catch (error) {
      console.error('Error fetching EONET by category:', error);
      return [];
    }
  }

  // WebSocket Methods - TEMPORARILY DISABLED
  subscribeToEvents() {
    // Temporarily disabled to prevent connection errors
    console.log('[API] subscribeToEvents temporarily disabled');
    /*
    if (this.socket) {
      this.socket.emit('subscribe_events');
    }
    */
  }

  subscribeToPredictions() {
    // Temporarily disabled to prevent connection errors
    console.log('[API] subscribeToPredictions temporarily disabled');
    /*
    if (this.socket) {
      this.socket.emit('subscribe_predictions');
    }
    */
  }

  subscribeToWeather() {
    // Temporarily disabled to prevent connection errors
    console.log('[API] subscribeToWeather temporarily disabled');
    /*
    if (this.socket) {
      this.socket.emit('subscribe_weather');
    }
    */
  }

  subscribeToDisasters() {
    // Temporarily disabled to prevent connection errors
    console.log('[API] subscribeToDisasters temporarily disabled');
    /*
    if (this.socket) {
      this.socket.emit('subscribe_disasters');
    }
    */
  }

  subscribeToEONET() {
    // Temporarily disabled to prevent connection errors
    console.log('[API] subscribeToEONET temporarily disabled');
    /*
    if (this.socket) {
      this.socket.emit('subscribe_eonet');
    }
    */
  }

  // Event Listener Management
  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Cleanup
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.eventListeners.clear();
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Types are exported via their interface declarations above.