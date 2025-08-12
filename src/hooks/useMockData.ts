import { useState, useEffect } from 'react';

export interface DisasterEvent {
  id: string;
  event_type: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: string;
  status: string;
  magnitude?: string;
  start_time?: string;
  end_time?: string;
  description?: string;
  affected_population?: number;
  economic_impact?: number;
  probability?: number;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  prediction_type: string;
  location: string;
  coordinates: { lat: number; lng: number };
  probability: number;
  confidence_score: number;
  severity_level: string;
  timeframe_start: string;
  timeframe_end: string;
  model_name: string;
  details?: any;
  is_active: boolean;
  verified: boolean;
  created_at: string;
  updated_at: string;
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
  metadata?: any;
  created_at: string;
}

// Mock data
const mockDisasterEvents: DisasterEvent[] = [
  {
    id: '1',
    event_type: 'earthquake',
    name: 'Magnitude 6.2 Earthquake',
    location: 'San Francisco, CA, USA',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    severity: 'high',
    status: 'active',
    magnitude: '6.2',
    start_time: '2024-01-12T14:30:00Z',
    description: 'Strong earthquake detected in the San Francisco Bay Area',
    affected_population: 500000,
    economic_impact: 250000000,
    probability: 85,
    created_at: '2024-01-12T14:30:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: '2',
    event_type: 'wildfire',
    name: 'Forest Fire Alert',
    location: 'Los Angeles, CA, USA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    severity: 'critical',
    status: 'active',
    start_time: '2024-01-10T08:00:00Z',
    description: 'Large wildfire spreading rapidly',
    affected_population: 200000,
    economic_impact: 100000000,
    probability: 95,
    created_at: '2024-01-10T08:00:00Z',
    updated_at: '2024-01-12T15:00:00Z'
  },
  {
    id: '3',
    event_type: 'hurricane',
    name: 'Hurricane Delta',
    location: 'Miami, FL, USA',
    coordinates: { lat: 25.7617, lng: -80.1918 },
    severity: 'critical',
    status: 'monitoring',
    magnitude: 'Category 3',
    start_time: '2024-01-15T12:00:00Z',
    description: 'Major hurricane approaching the coast',
    affected_population: 1000000,
    economic_impact: 500000000,
    probability: 78,
    created_at: '2024-01-11T12:00:00Z',
    updated_at: '2024-01-12T16:00:00Z'
  },
  {
    id: '4',
    event_type: 'flood',
    name: 'Flash Flood Warning',
    location: 'Houston, TX, USA',
    coordinates: { lat: 29.7604, lng: -95.3698 },
    severity: 'moderate',
    status: 'active',
    start_time: '2024-01-11T20:00:00Z',
    description: 'Heavy rainfall causing flash flooding',
    affected_population: 150000,
    economic_impact: 50000000,
    probability: 90,
    created_at: '2024-01-11T20:00:00Z',
    updated_at: '2024-01-12T10:00:00Z'
  }
];

const mockPredictions: Prediction[] = [
  {
    id: '1',
    prediction_type: 'earthquake',
    location: 'Tokyo, Japan',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    probability: 67,
    confidence_score: 0.8,
    severity_level: 'high',
    timeframe_start: '2024-01-15T00:00:00Z',
    timeframe_end: '2024-01-22T00:00:00Z',
    model_name: 'SeismicPredict-AI',
    details: { magnitude_range: '5.5-6.8', depth: 'shallow' },
    is_active: true,
    verified: false,
    created_at: '2024-01-12T09:00:00Z',
    updated_at: '2024-01-12T09:00:00Z'
  },
  {
    id: '2',
    prediction_type: 'wildfire',
    location: 'Northern California, USA',
    coordinates: { lat: 38.8026, lng: -120.7645 },
    probability: 85,
    confidence_score: 0.92,
    severity_level: 'critical',
    timeframe_start: '2024-01-14T00:00:00Z',
    timeframe_end: '2024-01-20T00:00:00Z',
    model_name: 'FireRisk-Neural',
    details: { wind_speed: 45, humidity: 15, temperature: 38 },
    is_active: true,
    verified: true,
    created_at: '2024-01-12T11:30:00Z',
    updated_at: '2024-01-12T11:30:00Z'
  }
];

const mockSensorData: SensorData[] = [
  {
    id: '1',
    sensor_type: 'seismic',
    station_id: 'SF_001',
    station_name: 'Golden Gate Seismic Station',
    location: 'San Francisco, CA',
    coordinates: { lat: 37.8199, lng: -122.4783 },
    reading_value: 2.3,
    reading_unit: 'magnitude',
    reading_time: '2024-01-12T15:45:00Z',
    data_quality: 'excellent',
    metadata: { depth: 8.2, frequency: 4.5 },
    created_at: '2024-01-12T15:45:00Z'
  },
  {
    id: '2',
    sensor_type: 'weather',
    station_id: 'LA_003',
    station_name: 'Los Angeles Weather Station',
    location: 'Los Angeles, CA',
    coordinates: { lat: 34.0522, lng: -118.2437 },
    reading_value: 42,
    reading_unit: 'celsius',
    reading_time: '2024-01-12T16:00:00Z',
    data_quality: 'good',
    metadata: { humidity: 12, wind_speed: 35 },
    created_at: '2024-01-12T16:00:00Z'
  }
];

export const useDisasterEvents = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setEvents(mockDisasterEvents);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const refetch = async () => {
    setLoading(true);
    setTimeout(() => {
      setEvents(mockDisasterEvents);
      setLoading(false);
    }, 300);
  };

  return { events, loading, error, refetch };
};

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const refetch = async () => {
    setLoading(true);
    setTimeout(() => {
      setPredictions(mockPredictions);
      setLoading(false);
    }, 300);
  };

  return { predictions, loading, error, refetch };
};

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSensorData(mockSensorData);
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const refetch = async () => {
    setLoading(true);
    setTimeout(() => {
      setSensorData(mockSensorData);
      setLoading(false);
    }, 300);
  };

  return { sensorData, loading, error, refetch };
};

export const useHistoricalData = () => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHistoricalData([
        { year: 2023, event_type: 'earthquake', frequency: 45, impact_economic: 2000000 },
        { year: 2023, event_type: 'wildfire', frequency: 23, impact_economic: 1500000 },
        { year: 2022, event_type: 'earthquake', frequency: 38, impact_economic: 1800000 },
        { year: 2022, event_type: 'wildfire', frequency: 31, impact_economic: 2200000 }
      ]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const refetch = async () => {
    setLoading(true);
    setTimeout(() => {
      setHistoricalData([]);
      setLoading(false);
    }, 300);
  };

  return { historicalData, loading, error, refetch };
};

export const useMockRealTime = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchRealDisasters = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdate(new Date());
      setIsUpdating(false);
    }, 1000);
  };

  useEffect(() => {
    fetchRealDisasters();
    
    const interval = setInterval(() => {
      fetchRealDisasters();
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    isUpdating,
    lastUpdate,
    fetchRealDisasters
  };
};