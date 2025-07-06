import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DisasterEvent {
  id: string;
  event_type: string;
  name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: string;
  magnitude?: string;
  status: string;
  probability?: number;
  affected_population?: number;
  economic_impact?: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  model_name: string;
  prediction_type: string;
  location: string;
  coordinates: { lat: number; lng: number };
  probability: number;
  confidence_score: number;
  severity_level: string;
  timeframe_start: string;
  timeframe_end: string;
  details: any;
  is_active: boolean;
  verified: boolean;
  created_at: string;
}

export interface SensorData {
  id: string;
  station_id: string;
  station_name: string;
  location: string;
  coordinates: { lat: number; lng: number };
  sensor_type: string;
  reading_value: number;
  reading_unit: string;
  reading_time: string;
  data_quality: string;
  metadata: any;
}

export const useDisasterEvents = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('disaster_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setEvents((data || []).map(event => ({
        ...event,
        coordinates: event.coordinates as { lat: number; lng: number }
      })));
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching disaster events",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Set up real-time subscription
    const channel = supabase
      .channel('disaster-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'disaster_events'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchEvents(); // Refetch data on changes
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};

export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('is_active', true)
        .order('confidence_score', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPredictions((data || []).map(pred => ({
        ...pred,
        coordinates: pred.coordinates as { lat: number; lng: number }
      })));
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching predictions",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();

    // Set up real-time subscription
    const channel = supabase
      .channel('predictions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'predictions'
        },
        () => {
          fetchPredictions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { predictions, loading, error, refetch: fetchPredictions };
};

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSensorData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sensor_data')
        .select('*')
        .order('reading_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSensorData((data || []).map(sensor => ({
        ...sensor,
        coordinates: sensor.coordinates as { lat: number; lng: number }
      })));
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching sensor data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();

    // Set up real-time subscription
    const channel = supabase
      .channel('sensor-data')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data'
        },
        () => {
          fetchSensorData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { sensorData, loading, error, refetch: fetchSensorData };
};

export const useHistoricalData = () => {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('historical_data')
        .select('*')
        .order('year', { ascending: false })
        .limit(100);

      if (error) throw error;
      setHistoricalData(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  return { historicalData, loading, error, refetch: fetchHistoricalData };
};