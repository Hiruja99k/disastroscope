import { useState, useEffect, useCallback } from 'react';
import { apiService, DisasterEvent, Prediction, SensorData, Stats } from '@/services/api';

// Hook for disaster events
export const useDisasterEvents = () => {
  const [events, setEvents] = useState<DisasterEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();

    // Subscribe to real-time updates
    const handleNewEvent = (event: DisasterEvent) => {
      setEvents(prev => {
        const existing = prev.find(e => e.id === event.id);
        if (existing) {
          return prev.map(e => e.id === event.id ? event : e);
        }
        return [...prev, event];
      });
    };

    const handleEventsUpdate = (updatedEvents: DisasterEvent[]) => {
      setEvents(updatedEvents);
    };

    apiService.on('new_event', handleNewEvent);
    apiService.on('events_update', handleEventsUpdate);
    apiService.subscribeToEvents();

    return () => {
      apiService.off('new_event', handleNewEvent);
      apiService.off('events_update', handleEventsUpdate);
    };
  }, [fetchEvents]);

  return { events, loading, error, refetch };
};

// Hook for predictions
export const usePredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getPredictions();
      setPredictions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch predictions');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchPredictions();
  }, [fetchPredictions]);

  useEffect(() => {
    fetchPredictions();

    // Subscribe to real-time updates
    const handleNewPrediction = (prediction: Prediction) => {
      setPredictions(prev => {
        const existing = prev.find(p => p.id === prediction.id);
        if (existing) {
          return prev.map(p => p.id === prediction.id ? prediction : p);
        }
        return [...prev, prediction];
      });
    };

    const handlePredictionsUpdate = (updatedPredictions: Prediction[]) => {
      setPredictions(updatedPredictions);
    };

    apiService.on('new_prediction', handleNewPrediction);
    apiService.on('predictions_update', handlePredictionsUpdate);
    apiService.subscribeToPredictions();

    return () => {
      apiService.off('new_prediction', handleNewPrediction);
      apiService.off('predictions_update', handlePredictionsUpdate);
    };
  }, [fetchPredictions]);

  return { predictions, loading, error, refetch };
};

// Hook for sensor data
export const useSensorData = () => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSensorData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSensorData();
      setSensorData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sensor data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchSensorData();
  }, [fetchSensorData]);

  useEffect(() => {
    fetchSensorData();

    // Subscribe to real-time updates
    const handleSensorUpdate = (sensor: SensorData) => {
      setSensorData(prev => {
        const existing = prev.find(s => s.id === sensor.id);
        if (existing) {
          return prev.map(s => s.id === sensor.id ? sensor : s);
        }
        return [...prev, sensor];
      });
    };

    apiService.on('sensor_update', handleSensorUpdate);

    return () => {
      apiService.off('sensor_update', handleSensorUpdate);
    };
  }, [fetchSensorData]);

  return { sensorData, loading, error, refetch };
};

// Hook for statistics
export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error, refetch };
};

// Hook for API health check
export const useApiHealth = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      const healthy = await apiService.healthCheck();
      setIsHealthy(healthy);
    } catch (error) {
      setIsHealthy(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();

    // Check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  return { isHealthy, loading, checkHealth };
};

// Hook for real-time updates
export const useRealTimeUpdates = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setLastUpdate(new Date());
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNewEvent = () => {
      setLastUpdate(new Date());
    };

    const handleNewPrediction = () => {
      setLastUpdate(new Date());
    };

    const handleSensorUpdate = () => {
      setLastUpdate(new Date());
    };

    apiService.on('connect', handleConnect);
    apiService.on('disconnect', handleDisconnect);
    apiService.on('new_event', handleNewEvent);
    apiService.on('new_prediction', handleNewPrediction);
    apiService.on('sensor_update', handleSensorUpdate);

    return () => {
      apiService.off('connect', handleConnect);
      apiService.off('disconnect', handleDisconnect);
      apiService.off('new_event', handleNewEvent);
      apiService.off('new_prediction', handleNewPrediction);
      apiService.off('sensor_update', handleSensorUpdate);
    };
  }, []);

  return { isConnected, lastUpdate };
};

// Hook for OpenFEMA disaster declarations (recent/ongoing)
export const useFemaDisasters = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDisasters();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch disasters');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    fetchAll();

    const handleBulk = (updated: any[]) => setItems(updated || []);
    const handleNew = (item: any) => setItems(prev => {
      const id = item?.id ?? item?.disasterNumber;
      if (!id) return [item, ...prev];
      const exists = prev.some(x => (x?.id ?? x?.disasterNumber) === id);
      return exists ? prev : [item, ...prev];
    });

    apiService.on('disasters_update', handleBulk);
    apiService.on('new_disaster', handleNew);
    apiService.subscribeToDisasters();

    return () => {
      apiService.off('disasters_update', handleBulk);
      apiService.off('new_disaster', handleNew);
    };
  }, [fetchAll]);

  return { items, loading, error, refetch };
};

// Hook for NASA EONET events (open/ongoing)
export const useEonetEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEONETEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch EONET');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    fetchAll();

    const handleBulk = (updated: any[]) => setEvents(updated || []);
    const handleNew = (item: any) => setEvents(prev => {
      const id = item?.id;
      if (!id) return [item, ...prev];
      const exists = prev.some(x => x?.id === id);
      return exists ? prev : [item, ...prev];
    });

    apiService.on('eonet_update', handleBulk);
    apiService.on('new_eonet_event', handleNew);
    apiService.subscribeToEONET();

    return () => {
      apiService.off('eonet_update', handleBulk);
      apiService.off('new_eonet_event', handleNew);
    };
  }, [fetchAll]);

  return { events, loading, error, refetch };
};
