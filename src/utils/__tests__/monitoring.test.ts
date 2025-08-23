import { monitoring, trackEvent, trackError, trackPageView } from '../monitoring';
import { environment } from '@/config/environment';

// Mock console methods
const originalConsole = global.console;
beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});

describe('Monitoring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('trackEvent', () => {
    it('should log events in development', () => {
      trackEvent('test_event', { key: 'value' });
      
      expect(console.log).toHaveBeenCalledWith(
        '📊 Event:',
        'test_event',
        { key: 'value' }
      );
    });

    it('should handle events without properties', () => {
      trackEvent('simple_event');
      
      expect(console.log).toHaveBeenCalledWith(
        '📊 Event:',
        'simple_event',
        undefined
      );
    });
  });

  describe('trackError', () => {
    it('should log errors in development', () => {
      const error = new Error('Test error');
      const context = { component: 'TestComponent' };
      
      trackError(error, context);
      
      expect(console.error).toHaveBeenCalledWith(
        '🚨 Error:',
        error,
        context
      );
    });

    it('should handle errors without context', () => {
      const error = new Error('Simple error');
      
      trackError(error);
      
      expect(console.error).toHaveBeenCalledWith(
        '🚨 Error:',
        error,
        undefined
      );
    });
  });

  describe('trackPageView', () => {
    it('should track page views with properties', () => {
      const mockHref = 'https://example.com/test';
      Object.defineProperty(window, 'location', {
        value: { href: mockHref },
        writable: true,
      });

      trackPageView('/test', { referrer: 'https://google.com' });
      
      expect(console.log).toHaveBeenCalledWith(
        '📊 Event:',
        'page_view',
        {
          page: '/test',
          url: mockHref,
          referrer: 'https://google.com',
        }
      );
    });
  });

  describe('error handling', () => {
    it('should handle monitoring errors gracefully', () => {
      // Mock console.log to throw an error
      const originalLog = console.log;
      console.log = jest.fn().mockImplementation(() => {
        throw new Error('Console error');
      });

      // Should not throw
      expect(() => {
        trackEvent('failing_event');
      }).not.toThrow();

      expect(console.warn).toHaveBeenCalledWith(
        'Failed to track event:',
        expect.any(Error)
      );

      console.log = originalLog;
    });
  });
});
