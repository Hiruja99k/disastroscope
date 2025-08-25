import { io, Socket } from 'socket.io-client';

// API Configuration - robust defaults: use Railway for any non-local host
const inferredBase = (() => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname.toLowerCase();
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    if (!isLocal) {
      // Default to your Railway backend when running on Vercel or any non-local domain
      return 'https://web-production-47673.up.railway.app';
    }
  }
  return 'http://localhost:5000';
})();

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || inferredBase).replace(/\/$/, '');
const SOCKET_URL = (import.meta.env.VITE_SOCKET_URL || API_BASE_URL).replace(/\/$/, '');

// Debug logging to see which URLs are being used
console.log('🔧 API Configuration:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  API_BASE_URL,
  SOCKET_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE
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

// API Service Class
class ApiService {
  private socket: Socket | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.initializeSocket();
  }

  // Worldwide Weather Search
  async geocode(query: string, limit: number = 5): Promise<Array<{ name: string; lat: number; lon: number; country?: string; state?: string }>> {
    try {
      const url = new URL(`${API_BASE_URL}/api/geocode`);
      url.searchParams.set('query', query);
      url.searchParams.set('limit', String(limit));
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to geocode');
      return await response.json();
    } catch (error) {
      console.error('Error during geocoding:', error);
      return [];
    }
  }

  async getCurrentWeatherByCoords(lat: number, lon: number, name?: string, units: 'metric' | 'imperial' | 'standard' = 'metric'): Promise<WeatherData | null> {
    try {
      const url = new URL(`${API_BASE_URL}/api/weather/current`);
      url.searchParams.set('lat', String(lat));
      url.searchParams.set('lon', String(lon));
      if (name) url.searchParams.set('name', name);
      if (units) url.searchParams.set('units', units);
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch current weather');
      return await response.json();
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
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
      return await response.json();
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return [];
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
          lat,
          lon,
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
      if (!response.ok) throw new Error('Failed to fetch disasters');
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
      if (!response.ok) throw new Error('Failed to fetch EONET events');
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