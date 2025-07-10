import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Crosshair, 
  Navigation, 
  Satellite,
  Wifi,
  Signal,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Search,
  Globe,
  Clock
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  speed?: number;
  heading?: number;
  timestamp: number;
}

interface GeocodeResult {
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  address?: string;
  district?: string;
  timezone?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface EnhancedLocationDetectorProps {
  onLocationDetected?: (location: LocationData & GeocodeResult) => void;
  showDetails?: boolean;
  autoDetect?: boolean;
}

export default function EnhancedLocationDetector({ 
  onLocationDetected, 
  showDetails = true,
  autoDetect = false 
}: EnhancedLocationDetectorProps) {
  const { getCurrentPosition, watchPosition } = useGeolocation();
  
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [geocodeResult, setGeocodeResult] = useState<GeocodeResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<'gps' | 'network' | 'passive' | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [watchId, setWatchId] = useState<(() => void) | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([]);
  const [manualLocation, setManualLocation] = useState('');

  // Enhanced reverse geocoding with multiple providers
  const reverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult> => {
    try {
      // Try multiple geocoding services for better accuracy
      const providers = [
        {
          name: 'OpenStreetMap',
          url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          parser: (data: any) => ({
            city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
            state: data.address?.state || data.address?.province || 'Unknown',
            country: data.address?.country || 'Unknown',
            postalCode: data.address?.postcode,
            address: data.display_name,
            district: data.address?.suburb || data.address?.district,
            coordinates: { lat, lng }
          })
        },
        {
          name: 'BigDataCloud',
          url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
          parser: (data: any) => ({
            city: data.city || data.locality || 'Unknown',
            state: data.principalSubdivision || 'Unknown',
            country: data.countryName || 'Unknown',
            postalCode: data.postcode,
            address: data.localityInfo?.LookupSource?.localityName,
            district: data.localityInfo?.administrative?.[0]?.name,
            coordinates: { lat, lng }
          })
        }
      ];

      for (const provider of providers) {
        try {
          const response = await fetch(provider.url);
          if (response.ok) {
            const data = await response.json();
            const result = provider.parser(data);
            if (result.city !== 'Unknown' || result.state !== 'Unknown') {
              return result;
            }
          }
        } catch (error) {
          console.warn(`Geocoding failed for ${provider.name}:`, error);
        }
      }

      // Fallback mock data based on coordinates
      return getFallbackLocation(lat, lng);
    } catch (error) {
      console.error('All geocoding services failed:', error);
      return getFallbackLocation(lat, lng);
    }
  };

  const getFallbackLocation = (lat: number, lng: number): GeocodeResult => {
    // Provide rough location estimates based on coordinate ranges
    let region = 'Unknown Region';
    let country = 'Unknown Country';

    // Very basic coordinate-based region detection
    if (lat >= 5.9 && lat <= 9.9 && lng >= 79.5 && lng <= 81.9) {
      country = 'Sri Lanka';
      region = lat > 7 ? 'Northern Province' : 'Southern Province';
    } else if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
      country = 'India';
      region = 'India Region';
    } else if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      // Global fallback
      if (lat > 0) {
        country = lat > 45 ? 'Northern Region' : 'Tropical Region';
      } else {
        country = 'Southern Hemisphere';
      }
    }

    return {
      city: `Location ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      state: region,
      country,
      coordinates: { lat, lng }
    };
  };

  const detectLocationWithHighAccuracy = useCallback(async () => {
    setIsDetecting(true);
    setDetectionMethod(null);

    try {
      // First attempt: High accuracy GPS
      setDetectionMethod('gps');
      const position = await getCurrentPosition();
      
      const locationData: LocationData = {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy || 0,
        altitude: position.altitude,
        speed: position.speed,
        heading: position.heading,
        timestamp: Date.now()
      };

      setCurrentLocation(locationData);
      setAccuracy(position.accuracy || 0);
      
      // Add to history
      setLocationHistory(prev => [...prev.slice(-4), locationData]);

      // Reverse geocode
      const geocode = await reverseGeocode(position.latitude, position.longitude);
      setGeocodeResult(geocode);

      // Notify parent component
      onLocationDetected?.({ ...locationData, ...geocode });

      toast.success(`Location detected with ${position.accuracy?.toFixed(0)}m accuracy`);
      
    } catch (error: any) {
      console.error('Location detection failed:', error);
      
      // Fallback to IP-based location
      try {
        setDetectionMethod('network');
        const ipLocation = await fetch('https://ipapi.co/json/');
        const ipData = await ipLocation.json();
        
        if (ipData.latitude && ipData.longitude) {
          const networkLocation: LocationData = {
            latitude: ipData.latitude,
            longitude: ipData.longitude,
            accuracy: 10000, // IP-based location is very rough
            timestamp: Date.now()
          };
          
          setCurrentLocation(networkLocation);
          setAccuracy(10000);
          
          const geocode: GeocodeResult = {
            city: ipData.city || 'Unknown',
            state: ipData.region || 'Unknown',
            country: ipData.country_name || 'Unknown',
            postalCode: ipData.postal,
            timezone: ipData.timezone,
            coordinates: { lat: ipData.latitude, lng: ipData.longitude }
          };
          
          setGeocodeResult(geocode);
          onLocationDetected?.({ ...networkLocation, ...geocode });
          
          toast.warning('Using approximate location based on IP address');
        }
      } catch (ipError) {
        toast.error('Unable to detect location. Please enter manually.');
      }
    } finally {
      setIsDetecting(false);
    }
  }, [getCurrentPosition, onLocationDetected]);

  const startContinuousTracking = useCallback(() => {
    if (watchId) {
      watchId();
      setWatchId(null);
      return;
    }

    const cleanup = watchPosition((position) => {
      const locationData: LocationData = {
        latitude: position.latitude,
        longitude: position.longitude,
        accuracy: position.accuracy || 0,
        altitude: position.altitude,
        speed: position.speed,
        heading: position.heading,
        timestamp: Date.now()
      };

      setCurrentLocation(locationData);
      setAccuracy(position.accuracy || 0);
      setLocationHistory(prev => [...prev.slice(-9), locationData]);

      // Update geocoding periodically (every 10 location updates)
      if (locationHistory.length % 10 === 0) {
        reverseGeocode(position.latitude, position.longitude).then(setGeocodeResult);
      }
    });

    setWatchId(() => cleanup);
    toast.success('Started continuous location tracking');
  }, [watchPosition, watchId, locationHistory.length]);

  const searchManualLocation = async () => {
    if (!manualLocation.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(manualLocation)}&limit=1&addressdetails=1`
      );
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        const locationData: LocationData = {
          latitude: lat,
          longitude: lng,
          accuracy: 100, // Manual location assumed accuracy
          timestamp: Date.now()
        };

        const geocode: GeocodeResult = {
          city: result.address?.city || result.address?.town || 'Unknown',
          state: result.address?.state || 'Unknown',
          country: result.address?.country || 'Unknown',
          address: result.display_name,
          coordinates: { lat, lng }
        };

        setCurrentLocation(locationData);
        setGeocodeResult(geocode);
        onLocationDetected?.({ ...locationData, ...geocode });
        
        toast.success(`Location set to: ${geocode.city}, ${geocode.country}`);
      } else {
        toast.error('Location not found');
      }
    } catch (error) {
      toast.error('Search failed');
    }
  };

  useEffect(() => {
    if (autoDetect) {
      detectLocationWithHighAccuracy();
    }
  }, [autoDetect, detectLocationWithHighAccuracy]);

  const getAccuracyLevel = (acc: number) => {
    if (acc <= 5) return { level: 'Excellent', color: 'text-success', icon: CheckCircle };
    if (acc <= 20) return { level: 'Good', color: 'text-primary', icon: CheckCircle };
    if (acc <= 100) return { level: 'Moderate', color: 'text-warning', icon: Signal };
    return { level: 'Poor', color: 'text-destructive', icon: AlertTriangle };
  };

  const accuracyInfo = accuracy > 0 ? getAccuracyLevel(accuracy) : null;

  return (
    <Card className="p-6 bg-gradient-card border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Location Detection</h3>
            <p className="text-sm text-muted-foreground">High-precision geospatial positioning</p>
          </div>
          <div className="flex items-center space-x-2">
            {detectionMethod && (
              <Badge variant="outline" className="text-xs">
                {detectionMethod === 'gps' && <Satellite className="h-3 w-3 mr-1" />}
                {detectionMethod === 'network' && <Wifi className="h-3 w-3 mr-1" />}
                {detectionMethod?.toUpperCase()}
              </Badge>
            )}
            {isDetecting && (
              <Badge variant="secondary" className="animate-pulse">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Detecting...
              </Badge>
            )}
          </div>
        </div>

        {/* Location Controls */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Button
              onClick={detectLocationWithHighAccuracy}
              disabled={isDetecting}
              className="w-full"
            >
              <Crosshair className="h-4 w-4 mr-2" />
              {isDetecting ? 'Detecting...' : 'Detect Location'}
            </Button>
            
            <Button
              variant="outline"
              onClick={startContinuousTracking}
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {watchId ? 'Stop Tracking' : 'Start Tracking'}
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                placeholder="Enter location manually..."
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchManualLocation()}
              />
              <Button variant="outline" onClick={searchManualLocation}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Location Display */}
        {currentLocation && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Coordinates */}
              <Card className="p-4 bg-background">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-medium">Coordinates</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>Lat: <span className="font-mono">{currentLocation.latitude.toFixed(6)}</span></div>
                    <div>Lng: <span className="font-mono">{currentLocation.longitude.toFixed(6)}</span></div>
                    {currentLocation.altitude && (
                      <div>Alt: <span className="font-mono">{currentLocation.altitude.toFixed(1)}m</span></div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Accuracy */}
              <Card className="p-4 bg-background">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {accuracyInfo?.icon && <accuracyInfo.icon className={`h-4 w-4 ${accuracyInfo.color}`} />}
                    <span className="font-medium">Accuracy</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className={accuracyInfo?.color}>
                      {accuracyInfo?.level} ({accuracy.toFixed(0)}m)
                    </div>
                    <Progress value={Math.max(0, 100 - Math.min(accuracy / 2, 100))} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Geocoded Address */}
            {geocodeResult && showDetails && (
              <Card className="p-4 bg-background">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="font-medium">Detected Location</span>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <Label className="text-xs text-muted-foreground">City</Label>
                      <div className="font-medium">{geocodeResult.city}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">State/Province</Label>
                      <div className="font-medium">{geocodeResult.state}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Country</Label>
                      <div className="font-medium">{geocodeResult.country}</div>
                    </div>
                  </div>
                  
                  {geocodeResult.address && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Full Address</Label>
                      <div className="text-sm mt-1">{geocodeResult.address}</div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Movement Tracking */}
            {currentLocation.speed !== undefined && currentLocation.speed > 0 && (
              <Card className="p-4 bg-background">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Speed</Label>
                    <div className="font-medium">{(currentLocation.speed * 3.6).toFixed(1)} km/h</div>
                  </div>
                  {currentLocation.heading !== undefined && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Heading</Label>
                      <div className="font-medium">{currentLocation.heading.toFixed(0)}°</div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Location History */}
            {locationHistory.length > 1 && showDetails && (
              <Card className="p-4 bg-background">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Recent Locations</span>
                    <Badge variant="secondary">{locationHistory.length}</Badge>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {locationHistory.slice(-5).reverse().map((loc, index) => (
                      <div key={index} className="text-xs p-2 bg-muted/50 rounded flex justify-between">
                        <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                        <span className="text-muted-foreground">
                          {new Date(loc.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}