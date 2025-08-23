import { apiClient, handleApiResponse } from './apiClient';
import type { DisasterEvent, Prediction, WeatherData, Stats, SensorData } from './api';

/**
 * Service for disaster-related API operations
 */
export class DisasterService {
  /**
   * Get all disaster events
   */
  async getDisasters(): Promise<DisasterEvent[]> {
    const response = await apiClient.get<DisasterEvent[]>('/api/disasters');
    return handleApiResponse(response);
  }

  /**
   * Get disaster by ID
   */
  async getDisaster(id: string): Promise<DisasterEvent> {
    const response = await apiClient.get<DisasterEvent>(`/api/disasters/${id}`);
    return handleApiResponse(response);
  }

  /**
   * Get disaster predictions
   */
  async getPredictions(): Promise<Prediction[]> {
    const response = await apiClient.get<Prediction[]>('/api/predictions');
    return handleApiResponse(response);
  }

  /**
   * Get prediction by ID
   */
  async getPrediction(id: string): Promise<Prediction> {
    const response = await apiClient.get<Prediction>(`/api/predictions/${id}`);
    return handleApiResponse(response);
  }

  /**
   * Get weather data
   */
  async getWeatherData(): Promise<WeatherData[]> {
    const response = await apiClient.get<WeatherData[]>('/api/weather');
    return handleApiResponse(response);
  }

  /**
   * Get weather data for specific location
   */
  async getWeatherByLocation(lat: number, lng: number): Promise<WeatherData> {
    const response = await apiClient.get<WeatherData>(`/api/weather/location?lat=${lat}&lng=${lng}`);
    return handleApiResponse(response);
  }

  /**
   * Get sensor data
   */
  async getSensorData(): Promise<SensorData[]> {
    const response = await apiClient.get<SensorData[]>('/api/sensors');
    return handleApiResponse(response);
  }

  /**
   * Get statistics
   */
  async getStats(): Promise<Stats> {
    const response = await apiClient.get<Stats>('/api/stats');
    return handleApiResponse(response);
  }

  /**
   * Generate AI prediction for location
   */
  async generatePrediction(lat: number, lng: number, disasterType: string): Promise<Prediction> {
    const response = await apiClient.post<Prediction>('/api/predictions/generate', {
      lat,
      lng,
      disaster_type: disasterType,
    });
    return handleApiResponse(response);
  }

  /**
   * Get historical data
   */
  async getHistoricalData(startDate?: string, endDate?: string): Promise<DisasterEvent[]> {
    let endpoint = '/api/historical';
    const params = new URLSearchParams();
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await apiClient.get<DisasterEvent[]>(endpoint);
    return handleApiResponse(response);
  }

  /**
   * Search disasters by criteria
   */
  async searchDisasters(criteria: {
    type?: string;
    location?: string;
    severity?: string;
    status?: string;
    limit?: number;
  }): Promise<DisasterEvent[]> {
    const params = new URLSearchParams();
    
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const endpoint = `/api/disasters/search?${params.toString()}`;
    const response = await apiClient.get<DisasterEvent[]>(endpoint);
    return handleApiResponse(response);
  }
}

// Export singleton instance
export const disasterService = new DisasterService();

// Export for use in React Query hooks
export default disasterService;
