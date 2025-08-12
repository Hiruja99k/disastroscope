import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Key, ExternalLink, Info } from 'lucide-react';

interface MapboxInputProps {
  onTokenSave: (token: string) => void;
}

export default function MapboxInput({ onTokenSave }: MapboxInputProps) {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    if (!token.trim()) return;
    
    setIsValidating(true);
    try {
      // Simple validation - check if token starts with 'pk.'
      if (!token.startsWith('pk.')) {
        throw new Error('Invalid token format');
      }
      
      onTokenSave(token);
    } catch (error) {
      console.error('Token validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
      <Card className="p-8 max-w-md w-full mx-4 bg-gradient-card border-border/50">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
              <MapPin className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Interactive Map Setup</h2>
            <p className="text-muted-foreground">
              To enable the interactive map features, please provide your Mapbox access token.
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-left">
              <div className="space-y-2">
                <p>To get your Mapbox token:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Visit <a href="https://mapbox.com" target="_blank" rel="noopener" className="text-primary hover:underline">mapbox.com</a></li>
                  <li>Create a free account</li>
                  <li>Go to your Account → Tokens</li>
                  <li>Copy your default public token</li>
                </ol>
              </div>
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91ciIsImEiOiJhY2Nlc3MtdG9rZW4ifQ..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="font-mono text-sm"
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Public token starting with "pk."</span>
                <Badge variant="outline" className="text-xs">
                  Free tier available
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleSave}
                disabled={!token.trim() || isValidating}
                className="flex-1"
              >
                <Key className="h-4 w-4 mr-2" />
                {isValidating ? 'Validating...' : 'Save Token'}
              </Button>
              <Button variant="outline" asChild>
                <a href="https://mapbox.com" target="_blank" rel="noopener">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Your token is stored locally and only used for map functionality.
              Without a token, you'll see a simplified fallback map.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}