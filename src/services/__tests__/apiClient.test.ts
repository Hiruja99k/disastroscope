import { ApiClient, ApiClientError } from '../apiClient';

// Mock fetch
global.fetch = jest.fn();

describe('ApiClient', () => {
  let apiClient: ApiClient;

  beforeEach(() => {
    apiClient = new ApiClient({ baseURL: 'https://api.test.com', timeout: 5000 });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { message: 'success' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockData),
      });

      const response = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith('https://api.test.com/test', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: expect.any(AbortSignal),
      });
      expect(response.data).toEqual(mockData);
      expect(response.success).toBe(true);
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve({ message: 'Resource not found' }),
      });

      await expect(apiClient.get('/not-found')).rejects.toThrow(ApiClientError);
      await expect(apiClient.get('/not-found')).rejects.toThrow('Resource not found');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new TypeError('Network error'));

      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError);
      await expect(apiClient.get('/test')).rejects.toThrow('Network error - please check your connection');
    });

    it('should handle timeout errors', async () => {
      (fetch as jest.Mock).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new DOMException('Timeout', 'AbortError')), 100)
        )
      );

      await expect(apiClient.get('/test')).rejects.toThrow(ApiClientError);
      await expect(apiClient.get('/test')).rejects.toThrow('Request timeout');
    });
  });

  describe('POST requests', () => {
    it('should make successful POST request with data', async () => {
      const mockData = { id: 1, created: true };
      const postData = { name: 'test' };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(mockData),
      });

      const response = await apiClient.post('/test', postData);

      expect(fetch).toHaveBeenCalledWith('https://api.test.com/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
        signal: expect.any(AbortSignal),
      });
      expect(response.data).toEqual(mockData);
    });
  });

  describe('Configuration', () => {
    it('should allow updating base URL', () => {
      apiClient.setBaseURL('https://new-api.test.com');
      expect((apiClient as any).baseURL).toBe('https://new-api.test.com');
    });

    it('should allow updating timeout', () => {
      apiClient.setTimeout(10000);
      expect((apiClient as any).timeout).toBe(10000);
    });
  });
});
