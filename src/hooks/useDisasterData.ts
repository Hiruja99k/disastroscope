import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disasterService } from '@/services/disasterService';
import { handleApiError } from '@/services/apiClient';
import { trackEvent } from '@/utils/monitoring';
import type { DisasterEvent, Prediction, WeatherData, Stats, SensorData } from '@/services/api';

// Query keys for React Query
export const QUERY_KEYS = {
  disasters: ['disasters'] as const,
  disaster: (id: string) => ['disasters', id] as const,
  predictions: ['predictions'] as const,
  prediction: (id: string) => ['predictions', id] as const,
  weather: ['weather'] as const,
  weatherLocation: (lat: number, lng: number) => ['weather', 'location', lat, lng] as const,
  sensors: ['sensors'] as const,
  stats: ['stats'] as const,
  historical: (startDate?: string, endDate?: string) => ['historical', startDate, endDate] as const,
  searchDisasters: (criteria: object) => ['disasters', 'search', criteria] as const,
} as const;

/**
 * Hook to fetch all disasters
 */
export function useDisasters() {
  return useQuery({
    queryKey: QUERY_KEYS.disasters,
    queryFn: () => disasterService.getDisasters(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    throwOnError: false,
  });
}

/**
 * Hook to fetch a specific disaster
 */
export function useDisaster(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.disaster(id),
    queryFn: () => disasterService.getDisaster(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch predictions
 */
export function usePredictions() {
  return useQuery({
    queryKey: QUERY_KEYS.predictions,
    queryFn: () => disasterService.getPredictions(),
    staleTime: 2 * 60 * 1000, // 2 minutes for more recent data
    gcTime: 5 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch a specific prediction
 */
export function usePrediction(id: string, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.prediction(id),
    queryFn: () => disasterService.getPrediction(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch weather data
 */
export function useWeatherData() {
  return useQuery({
    queryKey: QUERY_KEYS.weather,
    queryFn: () => disasterService.getWeatherData(),
    staleTime: 1 * 60 * 1000, // 1 minute for weather data
    gcTime: 5 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch weather data for specific location
 */
export function useWeatherByLocation(lat: number, lng: number, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.weatherLocation(lat, lng),
    queryFn: () => disasterService.getWeatherByLocation(lat, lng),
    enabled: enabled && !isNaN(lat) && !isNaN(lng),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch sensor data
 */
export function useSensorData() {
  return useQuery({
    queryKey: QUERY_KEYS.sensors,
    queryFn: () => disasterService.getSensorData(),
    staleTime: 30 * 1000, // 30 seconds for sensor data
    gcTime: 2 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch statistics
 */
export function useStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: () => disasterService.getStats(),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to fetch historical data
 */
export function useHistoricalData(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.historical(startDate, endDate),
    queryFn: () => disasterService.getHistoricalData(startDate, endDate),
    staleTime: 10 * 60 * 1000, // 10 minutes for historical data
    gcTime: 30 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to search disasters
 */
export function useSearchDisasters(criteria: {
  type?: string;
  location?: string;
  severity?: string;
  status?: string;
  limit?: number;
}, enabled = true) {
  return useQuery({
    queryKey: QUERY_KEYS.searchDisasters(criteria),
    queryFn: () => disasterService.searchDisasters(criteria),
    enabled: enabled && Object.keys(criteria).length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    throwOnError: false,
  });
}

/**
 * Hook to generate AI prediction (mutation)
 */
export function useGeneratePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lat, lng, disasterType }: { lat: number; lng: number; disasterType: string }) =>
      disasterService.generatePrediction(lat, lng, disasterType),
    onSuccess: (data) => {
      // Invalidate predictions to refresh the list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.predictions });
      
      // Track successful prediction generation
      trackEvent('prediction_generated', {
        disasterType: data.event_type,
        location: data.location,
        confidence: data.confidence_level,
      });
    },
    onError: (error) => {
      const errorMessage = handleApiError(error);
      
      // Track prediction generation failure
      trackEvent('prediction_generation_failed', {
        error: errorMessage,
      });
    },
  });
}

/**
 * Helper hook to get loading state across multiple queries
 */
export function useDisasterLoadingState() {
  const disasters = useDisasters();
  const predictions = usePredictions();
  const weather = useWeatherData();
  const stats = useStats();

  return {
    isLoading: disasters.isLoading || predictions.isLoading || weather.isLoading || stats.isLoading,
    isError: disasters.isError || predictions.isError || weather.isError || stats.isError,
    error: disasters.error || predictions.error || weather.error || stats.error,
  };
}

/**
 * Helper hook to refetch all data
 */
export function useRefreshAllData() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.disasters });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.predictions });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.weather });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sensors });
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.stats });
    
    trackEvent('data_refresh_triggered');
  };
}
