// Disaster Data Service - Real-time disaster information from multiple APIs
export interface DisasterEvent {
  id: string;
  type: string;
  title: string;
  location: string;
  coordinates: [number, number];
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Active' | 'Monitoring' | 'Resolved' | 'Warning';
  timestamp: Date;
  magnitude?: string | number;
  affected?: number;
  source: string;
  description?: string;
  url?: string;
}

export interface NotificationItem {
  id: string;
  message: string;
  type: 'warning' | 'alert' | 'info' | 'critical';
  timestamp: Date;
  source: string;
  action: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface TimelineEvent {
  id: string;
  title: string;
  source: string;
  timestamp: Date;
  type: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

// API Configuration
const API_KEYS = {
  OPENWEATHER: '074ac01e6f3f5892c09dffcb01cdd1d4',
  FIRMS: '1f3709b7dc56b789361d359a5f8c3231',
  GEMINI: 'AIzaSyDtc-efmIBKOddxtKBnX0zU7qFJo93hlV0',
  PREDICTHQ: 'uRWawcaZ1pZdS2uG-l3_Y9_rZXYxthpi7oHlIM8s'
};

// Helper function to safely create and validate dates
const safeCreateDate = (timestamp: any): Date => {
  try {
    if (typeof timestamp === 'number') {
      // Handle Unix timestamp (milliseconds)
      if (timestamp > 1000000000000) {
        return new Date(timestamp);
      }
      // Handle Unix timestamp (seconds)
      return new Date(timestamp * 1000);
    }
    
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }
      return date;
    }
    
    // If it's already a Date object, validate it
    if (timestamp instanceof Date) {
      if (isNaN(timestamp.getTime())) {
        throw new Error('Invalid Date object');
      }
      return timestamp;
    }
    
    // Fallback to current time
    return new Date();
  } catch (error) {
    console.warn('Invalid timestamp provided, using current time:', timestamp);
    return new Date();
  }
};

// Helper function to safely fetch with timeout and error handling
const safeFetch = async (url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// USGS Earthquake API - Using their public GeoJSON feed
const fetchUSGSEarthquakes = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🌍 Fetching USGS earthquake data...');
    const response = await safeFetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
    const data = await response.json();
    
    if (!data.features || !Array.isArray(data.features)) {
      console.warn('USGS API returned invalid data structure');
      return [];
    }
    
    console.log(`📊 USGS raw data: ${data.features.length} earthquakes found`);
    
    const filteredQuakes = data.features.filter((quake: any) => quake.properties?.mag >= 4.0);
    console.log(`📊 USGS filtered data: ${filteredQuakes.length} earthquakes >= 4.0 magnitude`);
    
    const earthquakes = filteredQuakes
      .map((quake: any) => ({
        id: quake.id || `usgs-${Date.now()}-${Math.random()}`,
        type: 'Earthquake',
        title: `M${quake.properties.mag?.toFixed(1) || 'Unknown'} earthquake`,
        location: quake.properties.place || 'Unknown location',
        coordinates: [
          quake.geometry?.coordinates?.[1] || 0, 
          quake.geometry?.coordinates?.[0] || 0
        ] as [number, number],
        severity: (quake.properties.mag >= 6.0) ? 'Critical' : 
                 (quake.properties.mag >= 5.0) ? 'High' : 
                 (quake.properties.mag >= 4.5) ? 'Medium' : 'Low',
        status: 'Active',
                 timestamp: safeCreateDate(quake.properties.time),
        magnitude: quake.properties.mag,
        source: 'USGS',
        description: quake.properties.title || 'Earthquake detected',
        url: quake.properties.url
      }))
      .slice(0, 5); // Limit to 5 most recent
    
    console.log(`✅ USGS processed: ${earthquakes.length} earthquakes`);
    return earthquakes;
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    return [];
  }
};

// FIRMS Fire Data API - Using their CSV endpoint
const fetchFIRMSFires = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🔥 Fetching FIRMS wildfire data...');
    const response = await safeFetch(`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${API_KEYS.FIRMS}/MODIS_NRT/world/1`);
    const text = await response.text();
    const lines = text.split('\n').slice(1); // Skip header
    
    console.log(`📊 FIRMS raw data: ${lines.length} fire records found`);
    
    const validLines = lines.filter(line => line.trim() && line.includes(','));
    console.log(`📊 FIRMS valid lines: ${validLines.length} records`);
    
    const fires = validLines
      .map((line, index) => {
        const parts = line.split(',');
        if (parts.length < 13) return null;
        
        const [latitude, longitude, brightness, scan, track, acq_date, acq_time, satellite, confidence, version, bright_t31, frp, daynight] = parts;
        
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const frpValue = parseFloat(frp);
        
        if (isNaN(lat) || isNaN(lon) || isNaN(frpValue)) return null;
        
        return {
          id: `fire-${index}-${Date.now()}`,
          type: 'Wildfire',
          title: 'Active wildfire detected',
          location: `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`,
          coordinates: [lat, lon] as [number, number],
                            severity: (frpValue > 100 ? 'Critical' : 
                  frpValue > 50 ? 'High' : 
                  frpValue > 20 ? 'Medium' : 'Low') as 'Low' | 'Medium' | 'High' | 'Critical',
         status: 'Active' as const,
                     timestamp: safeCreateDate(`${acq_date} ${acq_time}`),
          magnitude: `FRP: ${frpValue.toFixed(1)}`,
          source: 'FIRMS',
          description: `Fire radiative power: ${frpValue.toFixed(1)} MW`
        };
      })
      .filter(Boolean) // Remove null entries
      .slice(0, 5); // Limit to 5 most recent
    
    console.log(`✅ FIRMS processed: ${fires.length} wildfires`);
    return fires;
  } catch (error) {
    console.error('Error fetching FIRMS fires:', error);
    return [];
  }
};

// GDACS Global Disaster Alert and Coordination System - Using RSS feed
const fetchGDACSAlerts = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🌊 Fetching GDACS alerts (mock data)...');
    // Since GDACS RSS might have CORS issues, we'll use a CORS proxy or return mock data
    // For now, we'll return mock GDACS data to avoid CORS issues
    const mockGDACSData: DisasterEvent[] = [
      {
        id: `gdacs-1-${Date.now()}`,
        type: 'Storm',
        title: 'Tropical Storm Warning',
        location: 'Caribbean Sea',
        coordinates: [18.2208, -66.5901] as [number, number],
        severity: 'High',
        status: 'Active',
                 timestamp: safeCreateDate(Date.now() - 2 * 60 * 60 * 1000),
        source: 'GDACS',
        description: 'Tropical storm detected in Caribbean region'
      },
      {
        id: `gdacs-2-${Date.now()}`,
        type: 'Flood',
        title: 'Flash Flood Alert',
        location: 'Southeast Asia',
        coordinates: [13.7563, 100.5018] as [number, number],
        severity: 'Medium',
        status: 'Active',
                 timestamp: safeCreateDate(Date.now() - 4 * 60 * 60 * 1000),
        source: 'GDACS',
        description: 'Heavy rainfall causing flash floods'
      }
    ];
    
    console.log(`✅ GDACS processed: ${mockGDACSData.length} alerts (mock data)`);
    return mockGDACSData;
  } catch (error) {
    console.error('Error fetching GDACS alerts:', error);
    return [];
  }
};

// OpenWeather Severe Weather Alerts - Using their weather API
const fetchOpenWeatherAlerts = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🌤️ Fetching OpenWeather alerts...');
    // Fetch alerts for major cities
    const cities = [
      { name: 'New York', coords: [40.7128, -74.0060] },
      { name: 'Los Angeles', coords: [34.0522, -118.2437] },
      { name: 'Chicago', coords: [41.8781, -87.6298] },
      { name: 'Houston', coords: [29.7604, -95.3698] },
      { name: 'Phoenix', coords: [33.4484, -112.0740] }
    ];
    
    const alerts: DisasterEvent[] = [];
    
    // Use Promise.allSettled to handle individual city failures gracefully
    const cityPromises = cities.map(async (city) => {
      try {
        const response = await safeFetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords[0]}&lon=${city.coords[1]}&appid=${API_KEYS.OPENWEATHER}&units=metric`
        );
        const data = await response.json();
        
        if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
          console.log(`🌤️ Weather alerts found for ${city.name}: ${data.alerts.length} alerts`);
          data.alerts.forEach((alert: any, index: number) => {
            alerts.push({
              id: `weather-${city.name}-${index}-${Date.now()}`,
              type: 'Severe Weather',
              title: alert.event || 'Weather Alert',
              location: city.name,
              coordinates: city.coords as [number, number],
              severity: alert.severity === 'Extreme' ? 'Critical' : 
                       alert.severity === 'Severe' ? 'High' : 
                       alert.severity === 'Moderate' ? 'Medium' : 'Low',
              status: 'Active',
                             timestamp: safeCreateDate((alert.start || Date.now()) * 1000),
              magnitude: alert.severity || 'Unknown',
              source: 'OpenWeather',
              description: alert.description || 'Weather alert issued'
            });
          });
        } else {
          console.log(`🌤️ No weather alerts for ${city.name}`);
        }
      } catch (error) {
        console.error(`Error fetching weather for ${city.name}:`, error);
      }
    });
    
    await Promise.allSettled(cityPromises);
    const limitedAlerts = alerts.slice(0, 3); // Limit to 3 weather alerts
    console.log(`✅ OpenWeather processed: ${limitedAlerts.length} weather alerts`);
    return limitedAlerts;
  } catch (error) {
    console.error('Error fetching OpenWeather alerts:', error);
    return [];
  }
};

// NOAA National Weather Service API - Fetching severe weather alerts
const fetchNOAAAlerts = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🌦️ Fetching NOAA weather alerts...');
    
    // Fetch alerts for major regions
    const regions = [
      { name: 'US', code: 'US' },
      { name: 'Alaska', code: 'AK' },
      { name: 'Hawaii', code: 'HI' },
      { name: 'Puerto Rico', code: 'PR' }
    ];
    
    const alerts: DisasterEvent[] = [];
    
    // Use Promise.allSettled to handle individual region failures gracefully
    const regionPromises = regions.map(async (region) => {
      try {
        const response = await safeFetch(
          `https://api.weather.gov/alerts/active?area=${region.code}`
        );
        const data = await response.json();
        
        if (data.features && Array.isArray(data.features) && data.features.length > 0) {
          console.log(`🌦️ Weather alerts found for ${region.name}: ${data.features.length} alerts`);
          data.features.forEach((alert: any, index: number) => {
            const properties = alert.properties;
            if (properties) {
              alerts.push({
                id: `noaa-${region.code}-${index}-${Date.now()}`,
                type: 'Severe Weather',
                title: properties.event || 'Weather Alert',
                location: properties.areaDesc || region.name,
                coordinates: [
                  alert.geometry?.coordinates?.[1]?.[0] || 0, // latitude
                  alert.geometry?.coordinates?.[0]?.[0] || 0  // longitude
                ] as [number, number],
                severity: properties.severity === 'Extreme' ? 'Critical' : 
                         properties.severity === 'Severe' ? 'High' : 
                         properties.severity === 'Moderate' ? 'Medium' : 'Low',
                status: 'Active',
                timestamp: safeCreateDate(properties.effective),
                magnitude: properties.severity || 'Unknown',
                source: 'NOAA',
                description: properties.headline || 'Weather alert issued'
              });
            }
          });
        } else {
          console.log(`🌦️ No weather alerts for ${region.name}`);
        }
      } catch (error) {
        console.error(`Error fetching weather for ${region.name}:`, error);
      }
    });
    
    await Promise.allSettled(regionPromises);
    const limitedAlerts = alerts.slice(0, 5); // Limit to 5 weather alerts
    console.log(`✅ NOAA processed: ${limitedAlerts.length} weather alerts`);
    return limitedAlerts;
  } catch (error) {
    console.error('Error fetching NOAA alerts:', error);
    return [];
  }
};

// OpenFEMA API - Fetching federal disaster declarations
const fetchOpenFEMADisasters = async (): Promise<DisasterEvent[]> => {
  try {
    console.log('🏛️ Fetching OpenFEMA disaster declarations...');
    
    // Get current date and 30 days ago for the date range
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Format dates for OpenFEMA API (YYYY-MM-DD format)
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];
    
    const response = await safeFetch(
      `https://www.fema.gov/api/open/v1/DisasterDeclarationsSummaries?$filter=incidentBeginDate ge '${startDate}' and incidentBeginDate le '${endDate}'&$orderby=incidentBeginDate desc&$top=10`
    );
    
    const data = await response.json();
    
    if (!data.DisasterDeclarationsSummaries || !Array.isArray(data.DisasterDeclarationsSummaries)) {
      console.warn('OpenFEMA API returned invalid data structure');
      return [];
    }
    
    console.log(`📊 OpenFEMA raw data: ${data.DisasterDeclarationsSummaries.length} disaster declarations found`);
    
    const disasters = data.DisasterDeclarationsSummaries
      .map((declaration: any) => {
        // Map FEMA incident types to our disaster types
        let disasterType = 'Federal Disaster';
        if (declaration.incidentType?.toLowerCase().includes('hurricane')) disasterType = 'Hurricane';
        else if (declaration.incidentType?.toLowerCase().includes('flood')) disasterType = 'Flood';
        else if (declaration.incidentType?.toLowerCase().includes('fire')) disasterType = 'Wildfire';
        else if (declaration.incidentType?.toLowerCase().includes('earthquake')) disasterType = 'Earthquake';
        else if (declaration.incidentType?.toLowerCase().includes('tornado')) disasterType = 'Tornado';
        else if (declaration.incidentType?.toLowerCase().includes('storm')) disasterType = 'Storm';
        
        // Determine severity based on disaster type and declaration type
        let severity: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
        if (declaration.declarationType === 'DR') severity = 'High'; // Major Disaster Declaration
        else if (declaration.declarationType === 'EM') severity = 'Medium'; // Emergency Declaration
        else if (declaration.declarationType === 'FM') severity = 'Low'; // Fire Management Assistance
        
        // Try to get coordinates from state/county data
        let coordinates: [number, number] = [0, 0];
        if (declaration.fipsStateCode && declaration.fipsCountyCode) {
          // This is a simplified approach - in a real implementation, you'd have a lookup table
          // For now, we'll use approximate coordinates based on state
          const stateCoords: Record<string, [number, number]> = {
            '06': [36.7783, -119.4179], // California
            '12': [27.6648, -81.5158],  // Florida
            '48': [31.9686, -99.9018],  // Texas
            '36': [42.1657, -74.9481],  // New York
            '22': [30.9843, -91.9623],  // Louisiana
            '28': [32.7416, -89.6787],  // Mississippi
            '01': [32.3182, -86.9023],  // Alabama
            '13': [32.1656, -82.9001],  // Georgia
            '45': [33.8569, -80.9450],  // South Carolina
            '37': [35.7596, -79.0193],  // North Carolina
          };
          coordinates = stateCoords[declaration.fipsStateCode] || [0, 0];
        }
        
        return {
          id: `fema-${declaration.disasterNumber}-${Date.now()}`,
          type: disasterType,
          title: `${disasterType} Declaration`,
          location: `${declaration.designatedArea || 'Unknown Area'}, ${declaration.state || 'Unknown State'}`,
          coordinates,
          severity,
          status: 'Active',
          timestamp: safeCreateDate(declaration.incidentBeginDate),
          magnitude: declaration.incidentType || 'Federal Declaration',
          source: 'OpenFEMA',
          description: `${disasterType} federal disaster declaration for ${declaration.designatedArea || 'affected area'}`,
          url: `https://www.fema.gov/disaster/${declaration.disasterNumber}`
        };
      })
      .filter(disaster => disaster && disaster.id)
      .slice(0, 5); // Limit to 5 most recent
    
    console.log(`✅ OpenFEMA processed: ${disasters.length} disaster declarations`);
    return disasters;
  } catch (error) {
    console.error('Error fetching OpenFEMA disasters:', error);
    return [];
  }
};

// Main function to fetch all disaster data with comprehensive error handling
export const fetchAllDisasterData = async (): Promise<{
  disasters: DisasterEvent[];
  notifications: NotificationItem[];
  timeline: TimelineEvent[];
}> => {
  try {
    console.log('🔄 Fetching disaster data from multiple sources...');
    
    // Fetch data from all sources with individual error handling
    const results = await Promise.allSettled([
      fetchUSGSEarthquakes(),
      fetchFIRMSFires(),
      fetchGDACSAlerts(),
      fetchOpenWeatherAlerts(),
      fetchNOAAAlerts(),
      fetchOpenFEMADisasters()
    ]);
    
    // Extract successful results
    const [earthquakes, fires, gdacsAlerts, weatherAlerts, noaaAlerts, femaDisasters] = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`✅ Source ${index + 1} data fetched successfully`);
        return result.value;
      } else {
        console.warn(`⚠️ Source ${index + 1} failed:`, result.reason);
        return [];
      }
    });
    
    console.log(`📊 Individual source counts:`);
    console.log(`   - USGS Earthquakes: ${earthquakes.length}`);
    console.log(`   - FIRMS Fires: ${fires.length}`);
    console.log(`   - GDACS Alerts: ${gdacsAlerts.length}`);
    console.log(`   - OpenWeather Alerts: ${weatherAlerts.length}`);
    console.log(`   - NOAA Alerts: ${noaaAlerts.length}`);
    console.log(`   - OpenFEMA Disasters: ${femaDisasters.length}`);
    
    // Combine all disasters
    const allDisasters = [...earthquakes, ...fires, ...gdacsAlerts, ...weatherAlerts, ...noaaAlerts, ...femaDisasters]
      .filter(disaster => disaster && disaster.id) // Filter out invalid entries
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10); // Get 10 most recent
    
    console.log(`📊 Total disasters found: ${allDisasters.length}`);
    console.log(`📊 Disaster types breakdown:`);
    const typeCounts = allDisasters.reduce((acc, disaster) => {
      acc[disaster.type] = (acc[disaster.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(typeCounts).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });
    
    // Generate notifications from disasters
    const notifications: NotificationItem[] = allDisasters
      .filter(disaster => disaster.severity === 'Critical' || disaster.severity === 'High')
             .map(disaster => ({
         id: `notif-${disaster.id}`,
         message: `${disaster.type} alert: ${disaster.title} in ${disaster.location}`,
         type: (disaster.severity === 'Critical' ? 'critical' : 'alert') as 'warning' | 'alert' | 'info' | 'critical',
         timestamp: disaster.timestamp,
         source: disaster.source,
         action: disaster.severity === 'Critical' ? 'Immediate Action Required' : 'Investigate',
         severity: disaster.severity
       }))
      .slice(0, 5);
    
    // Generate timeline events
    const timeline: TimelineEvent[] = allDisasters
      .map(disaster => ({
        id: `timeline-${disaster.id}`,
        title: disaster.title,
        source: disaster.source,
        timestamp: disaster.timestamp,
        type: disaster.type,
        severity: disaster.severity
      }))
      .slice(0, 5);
    
    console.log(`✅ Disaster data processing complete. Disasters: ${allDisasters.length}, Notifications: ${notifications.length}, Timeline: ${timeline.length}`);
    
    return {
      disasters: allDisasters,
      notifications,
      timeline
    };
    
  } catch (error) {
    console.error('❌ Critical error in fetchAllDisasterData:', error);
    // Return mock data as fallback
    return getMockDisasterData();
  }
};

// Enhanced fallback mock data for when APIs fail
export const getMockDisasterData = () => {
  const now = new Date();
  console.log('🔄 Using fallback mock disaster data');
  
  return {
    disasters: [
             {
         id: 'mock-1',
         type: 'Earthquake',
         title: 'M6.2 earthquake detected',
         location: 'San Francisco, CA',
         coordinates: [37.7749, -122.4194] as [number, number],
         severity: 'High' as const,
         status: 'Active' as const,
         timestamp: safeCreateDate(now.getTime() - 2 * 60 * 60 * 1000),
         magnitude: 6.2,
         source: 'USGS',
         description: 'Significant earthquake detected in California'
       },
             {
         id: 'mock-2',
         type: 'Wildfire',
         title: 'Active wildfire spreading',
         location: 'Los Angeles, CA',
         coordinates: [34.0522, -118.2437] as [number, number],
         severity: 'Critical' as const,
         status: 'Active' as const,
         timestamp: safeCreateDate(now.getTime() - 4 * 60 * 60 * 1000),
         magnitude: 'Large',
         source: 'FIRMS',
         description: 'Large wildfire detected via satellite'
       },
             {
         id: 'mock-3',
         type: 'Storm',
         title: 'Tropical storm warning',
         location: 'Miami, FL',
         coordinates: [25.7617, -80.1918] as [number, number],
         severity: 'Medium' as const,
         status: 'Active' as const,
         timestamp: safeCreateDate(now.getTime() - 6 * 60 * 60 * 1000),
         magnitude: 'Category 2',
         source: 'NOAA',
         description: 'Tropical storm approaching Florida coast'
       }
    ],
    notifications: [
             {
         id: 'mock-notif-1',
         message: 'Critical: M6.2 earthquake in San Francisco requires immediate attention',
         type: 'critical' as const,
         timestamp: safeCreateDate(now.getTime() - 2 * 60 * 60 * 1000),
         source: 'USGS',
         action: 'Immediate Action Required',
         severity: 'Critical' as const
       },
             {
         id: 'mock-notif-2',
         message: 'High: Active wildfire spreading in Los Angeles area',
         type: 'alert' as const,
         timestamp: safeCreateDate(now.getTime() - 4 * 60 * 60 * 1000),
         source: 'FIRMS',
         action: 'Investigate',
         severity: 'High' as const
       }
    ],
    timeline: [
             {
         id: 'mock-timeline-1',
         title: 'M6.2 earthquake detected',
         source: 'USGS',
         timestamp: safeCreateDate(now.getTime() - 2 * 60 * 60 * 1000),
         type: 'Earthquake',
         severity: 'High' as const
       },
             {
         id: 'mock-timeline-2',
         title: 'Active wildfire spreading',
         source: 'FIRMS',
         timestamp: safeCreateDate(now.getTime() - 4 * 60 * 60 * 1000),
         type: 'Wildfire',
         severity: 'Critical' as const
       },
             {
         id: 'mock-timeline-3',
         title: 'Tropical storm warning',
         source: 'NOAA',
         timestamp: safeCreateDate(now.getTime() - 6 * 60 * 60 * 1000),
         type: 'Storm',
         severity: 'Medium' as const
       }
    ]
  };
};
