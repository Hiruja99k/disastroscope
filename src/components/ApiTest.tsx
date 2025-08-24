import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [eventsStatus, setEventsStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [predictionsStatus, setPredictionsStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Get the API URL from environment
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    setApiUrl(baseUrl);

    // Test health endpoint
    fetch(`${baseUrl}/health`)
      .then(response => {
        if (response.ok) {
          setHealthStatus('success');
        } else {
          setHealthStatus('error');
        }
      })
      .catch(() => {
        setHealthStatus('error');
      });

    // Test events endpoint
    fetch(`${baseUrl}/api/events`)
      .then(response => {
        if (response.ok) {
          setEventsStatus('success');
        } else {
          setEventsStatus('error');
        }
      })
      .catch(() => {
        setEventsStatus('error');
      });

    // Test predictions endpoint
    fetch(`${baseUrl}/api/predictions`)
      .then(response => {
        if (response.ok) {
          setPredictionsStatus('success');
        } else {
          setPredictionsStatus('error');
        }
      })
      .catch(() => {
        setPredictionsStatus('error');
      });
  }, []);

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return 'Testing...';
      case 'success':
        return 'Connected';
      case 'error':
        return 'Failed';
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">API URL:</span>
          <Badge variant="outline" className="text-xs font-mono">
            {apiUrl}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Health Check:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(healthStatus)}
            <span className="text-sm">{getStatusText(healthStatus)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Events API:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(eventsStatus)}
            <span className="text-sm">{getStatusText(eventsStatus)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm">Predictions API:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(predictionsStatus)}
            <span className="text-sm">{getStatusText(predictionsStatus)}</span>
          </div>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          className="w-full mt-4"
          variant="outline"
        >
          Refresh Test
        </Button>
      </div>
    </Card>
  );
};

export default ApiTest;
