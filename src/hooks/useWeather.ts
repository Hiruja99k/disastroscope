import { useState, useEffect, useCallback } from 'react';
import { apiService, WeatherData } from '@/services/api';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getWeatherData();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();

    const handleWeatherUpdate = (updated: WeatherData[]) => {
      setWeather(updated);
    };

    apiService.on('weather_update', handleWeatherUpdate);
    apiService.subscribeToWeather();

    return () => {
      apiService.off('weather_update', handleWeatherUpdate);
    };
  }, [fetchWeather]);

  const refetch = useCallback(async () => {
    await fetchWeather();
  }, [fetchWeather]);

  return { weather, loading, error, refetch };
};
