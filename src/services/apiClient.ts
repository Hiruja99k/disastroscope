import { environment } from '@/config/environment';
import { trackApiCall, trackError } from '@/utils/monitoring';

// Force Railway backend URL for disaster management
const RAILWAY_BACKEND_URL = 'https://web-production-47673.up.railway.app';

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

// Custom error class for API errors
export class ApiClientError extends Error {
  public status: number;
  public code?: string;
  public details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// HTTP client with monitoring and error handling
export class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(config: { baseURL?: string; timeout?: number } = {}) {
    // Force Railway backend URL for disaster management
    this.baseURL = config.baseURL || RAILWAY_BACKEND_URL;
    this.timeout = config.timeout || environment.api.timeout;
  }

  /**
   * Make an HTTP request with automatic error handling and monitoring
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const startTime = Date.now();
    const method = options.method || 'GET';

    try {
      // Set default headers
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Track API call performance
      const duration = Date.now() - startTime;
      trackApiCall(endpoint, method, duration, response.status);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        let errorDetails: any = null;

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errorDetails = errorData;
        } catch {
          // If response is not JSON, use status text
        }

        throw new ApiClientError(errorMessage, response.status, undefined, errorDetails);
      }

      // Parse response
      const data = await response.json();
      
      return {
        data,
        success: true,
        message: 'Request successful',
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      if (error instanceof ApiClientError) {
        // Track API error
        trackApiCall(endpoint, method, duration, error.status);
        trackError(error, {
          endpoint,
          method,
          duration,
          status: error.status,
        });
        throw error;
      }

      // Handle network errors, timeouts, etc.
      let apiError: ApiClientError;

      if (error instanceof TypeError && error.message.includes('fetch')) {
        apiError = new ApiClientError('Network error - please check your connection', 0, 'NETWORK_ERROR');
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        apiError = new ApiClientError('Request timeout', 408, 'TIMEOUT');
      } else {
        apiError = new ApiClientError(
          error instanceof Error ? error.message : 'Unknown error occurred',
          500,
          'UNKNOWN_ERROR'
        );
      }

      // Track the error
      trackApiCall(endpoint, method, duration, apiError.status);
      trackError(apiError, {
        endpoint,
        method,
        duration,
        originalError: error,
      });

      throw apiError;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Update base URL
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  /**
   * Update timeout
   */
  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper function for handling API responses
export function handleApiResponse<T>(
  response: ApiResponse<T>
): T {
  if (!response.success) {
    throw new Error(response.message || 'API request failed');
  }
  return response.data;
}

// Helper function for handling API errors in components
export function handleApiError(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
