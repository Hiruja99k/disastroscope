import { useEffect } from 'react';
import { apiService } from '@/services/api';

/**
 * RealTimeBridge subscribes to Socket.IO channels globally so the app
 * receives server pushes (weather/events/predictions) regardless of route.
 * It also logs connection status for debugging.
 * 
 * TEMPORARILY DISABLED: WebSocket connections disabled to prevent connection errors
 * while backend Socket.IO server is being configured.
 */
export default function RealTimeBridge() {
  useEffect(() => {
    // Temporarily disable WebSocket connections to prevent errors
    console.log('[RT] WebSocket connections temporarily disabled for backend stability');
    
    // TODO: Re-enable when Socket.IO server is properly configured on Railway
    /*
    const handleConnect = () => console.log('[RT] socket connected');
    const handleDisconnect = () => console.log('[RT] socket disconnected');
    const handleConnectError = (err: unknown) => console.warn('[RT] socket error', err);

    apiService.on('connect', handleConnect);
    apiService.on('disconnect', handleDisconnect);
    apiService.on('connect_error', handleConnectError);

    // Subscribe to server channels (server will emit current snapshots)
    apiService.subscribeToEvents();
    apiService.subscribeToPredictions();
    apiService.subscribeToWeather();
    apiService.subscribeToDisasters();
    apiService.subscribeToEONET();

    return () => {
      apiService.off('connect', handleConnect);
      apiService.off('disconnect', handleDisconnect);
      apiService.off('connect_error', handleConnectError);
    };
    */
  }, []);

  return null;
}
