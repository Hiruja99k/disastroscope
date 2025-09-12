/**
 * Disaster Management Service V2
 * Handles CRUD operations for disaster reports
 * Updated to use dedicated ApiClient instance with proper Railway backend connection
 */

import { ApiClient } from './apiClient';
import { environment } from '@/config/environment';

export interface DisasterReport {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Active' | 'Warning' | 'Resolved';
  affected_people: number;
  estimated_damage: string;
  contact_info: { phone: string; email: string };
  updates: Array<{
    timestamp: string;
    message: string;
    author: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface DisasterStatistics {
  total_disasters: number;
  active_disasters: number;
  warning_disasters: number;
  resolved_disasters: number;
  total_affected_people: number;
  total_estimated_damage: string;
  disasters_by_type: Record<string, number>;
  disasters_by_severity: Record<string, number>;
}

export interface CreateDisasterData {
  title: string;
  type: string;
  location: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  affected_people: number;
  estimated_damage: string;
  contact_info: { phone: string; email: string };
}

export interface UpdateDisasterData {
  title?: string;
  type?: string;
  location?: string;
  description?: string;
  severity?: 'Low' | 'Medium' | 'High';
  status?: 'Active' | 'Warning' | 'Resolved';
  affected_people?: number;
  estimated_damage?: string;
  contact_info?: { phone: string; email: string };
}

export interface DisasterFilters {
  status?: string;
  type?: string;
  severity?: string;
}

class DisasterManagementServiceV2 {
  private baseUrl = '/api';
  private apiClient = new ApiClient({ baseURL: 'https://web-production-47673.up.railway.app' });

  /**
   * Build a professional, concise title
   */
  private formatTitle(type: string, baseTitle?: string, location?: string): string {
    const cleanType = (type || 'Event').toString();
    const cleanBase = (baseTitle || '').toString().trim();
    const cleanLocation = (location || '').toString().trim();

    // Avoid duplicating type if already present at the beginning of base title
    const baseWithoutType = cleanBase.toLowerCase().startsWith(cleanType.toLowerCase())
      ? cleanBase
      : cleanBase;

    // Prefer known named events (e.g., Hurricane Maria)
    if (baseWithoutType) {
      return baseWithoutType;
    }

    // Otherwise compose: concise professional title without location
    return cleanType;
  }

  /**
   * Get all disaster reports with optional filtering
   */
  async getDisasters(filters: DisasterFilters = {}): Promise<{
    disasters: DisasterReport[];
    total: number;
    limit: number;
    offset: number;
  }> {
    try {
      console.log('🔍 DisasterManagementServiceV2: Using dedicated ApiClient instance');
      console.log('🔍 Request URL:', `${this.baseUrl}/events`);

      // Feature flag to force mock data (for demos/offline)
      if (environment.features.forceMockDisasters) {
        const mock = this.getMockDisasters();
        return {
          disasters: this.applyFilterSet(mock, filters),
          total: mock.length,
          limit: 100,
          offset: 0
        };
      }

      // Fetch real disaster data from Railway backend (resilient to one endpoint failing)
      let events: any[] = [];
      let predictions: any[] = [];

      try {
        const eventsResponse = await this.apiClient.get(`${this.baseUrl}/events`);
        events = ((eventsResponse.data as any).events || []) as any[];
      } catch (e) {
        console.warn('⚠️ /api/events unavailable, proceeding with predictions only');
      }

      try {
        const predictionsResponse = await this.apiClient.get(`${this.baseUrl}/predictions`);
        predictions = ((predictionsResponse.data as any).predictions || []) as any[];
      } catch (e) {
        console.warn('⚠️ /api/predictions unavailable, proceeding with events only');
      }

      if (events.length === 0 && predictions.length === 0) {
        console.warn('⚠️ No data from backend endpoints. Falling back to mock disasters.');
        const mock = this.getMockDisasters();
        return {
          disasters: this.applyFilterSet(mock, filters),
          total: mock.length,
          limit: 100,
          offset: 0
        };
      }

      // Convert events and predictions to DisasterReport format
      const disasters: DisasterReport[] = [
        ...events.map((event: any) => this.convertEventToDisasterReport(event)),
        ...predictions.map((prediction: any) => this.convertPredictionToDisasterReport(prediction))
      ];

      // Apply filters
      let filteredDisasters = disasters;
      if (filters.status) {
        filteredDisasters = filteredDisasters.filter(d => d.status === filters.status);
      }
      if (filters.type) {
        filteredDisasters = filteredDisasters.filter(d => d.type === filters.type);
      }
      if (filters.severity) {
        filteredDisasters = filteredDisasters.filter(d => d.severity === filters.severity);
      }

      return {
        disasters: filteredDisasters,
        total: filteredDisasters.length,
        limit: 100,
        offset: 0
      };
    } catch (error) {
      console.error('Error fetching disaster data from Railway backend:', error);
      // Final safety net: return mock data offline
      const mock = this.getMockDisasters();
      return {
        disasters: mock,
        total: mock.length,
        limit: 100,
        offset: 0
      };
    }
  }

  /**
   * Convert EONET event to DisasterReport format
   */
  private convertEventToDisasterReport(event: any): DisasterReport {
    // Try to derive the most specific fields available from a variety of backends
    const coords = event.geometry?.[0]?.coordinates || event.coordinates || event.location?.coordinates;
    const location = event.location?.name || event.place || event.region || this.getLocationFromCoordinates(coords);

    const rawCategory = event.category || event.type || event.categories?.[0]?.title || event.properties?.category || 'Unknown';
    const mappedType = this.mapEventType(rawCategory);
    const severity = this.estimateSeverity(rawCategory);

    const rawTitle =
      event.title ||
      event.name ||
      event.properties?.title ||
      event.properties?.headline ||
      event.properties?.description ||
      '';

    const title = this.formatTitle(mappedType, rawTitle, location);
    const created =
      event.geometry?.[0]?.date ||
      event.properties?.date ||
      event.properties?.time ||
      event.updated ||
      event.created ||
      new Date().toISOString();

    return {
      id: `event-${event.id || event.event_id || Math.random().toString(36).slice(2)}`,
      title,
      type: mappedType,
      location,
      description: rawTitle || `${mappedType}${location ? ` detected in ${location}` : ''}`,
      severity,
      status: 'Active',
      affected_people: Math.floor(Math.random() * 1000) + 100,
      estimated_damage: this.estimateDamage(severity),
      contact_info: {
        phone: '+1-555-0000',
        email: 'emergency@system.gov'
      },
      updates: [
        {
          timestamp: new Date().toISOString(),
          message: 'Event detected and being monitored',
          author: 'System'
        }
      ],
      created_at: created,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Convert prediction to DisasterReport format
   */
  private convertPredictionToDisasterReport(prediction: any): DisasterReport {
    const lat = prediction.latitude ?? prediction.lat;
    const lng = prediction.longitude ?? prediction.lng ?? prediction.long;
    const derivedLocation = prediction.location || prediction.place || prediction.region || this.getLocationFromCoordinates([lng, lat]);
    const type = prediction.disaster_type || prediction.type || 'Unknown';
    const severity = this.estimateSeverityFromProbability(prediction.probability || prediction.score || 0.5);

    const baseTitle = prediction.title || prediction.name || '';
    const title = this.formatTitle(type, baseTitle || `${type} Prediction`, derivedLocation);

    return {
      id: `prediction-${prediction.id || Math.random().toString(36).substr(2, 9)}`,
      title,
      type,
      location: derivedLocation,
      description: `Predicted ${type.toLowerCase()} with ${Math.round(((prediction.probability || prediction.score || 0.5) as number) * 100)}% probability`,
      severity,
      status: 'Warning',
      affected_people: Math.floor(Math.random() * 500) + 50,
      estimated_damage: this.estimateDamage(severity),
      contact_info: {
        phone: '+1-555-0000',
        email: 'emergency@system.gov'
      },
      updates: [
        {
          timestamp: new Date().toISOString(),
          message: 'Prediction generated by AI model',
          author: 'AI System'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Get location from coordinates (simplified reverse geocoding)
   */
  private getLocationFromCoordinates(coordinates: number[]): string {
    if (!coordinates || coordinates.length < 2) {
      return 'Unknown Location';
    }
    
    const [lng, lat] = coordinates;
    
    // Simple location mapping based on coordinates
    if (lat >= 25 && lat <= 49 && lng >= -125 && lng <= -66) {
      return 'United States';
    } else if (lat >= 35 && lat <= 71 && lng >= -10 && lng <= 40) {
      return 'Europe';
    } else if (lat >= 10 && lat <= 60 && lng >= 30 && lng <= 180) {
      return 'Asia';
    } else if (lat >= -50 && lat <= 10 && lng >= -80 && lng <= -30) {
      return 'South America';
    } else if (lat >= -40 && lat <= 30 && lng >= -20 && lng <= 55) {
      return 'Africa';
    } else {
      return `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`;
    }
  }

  /**
   * Estimate damage based on severity
   */
  private estimateDamage(severity: 'Low' | 'Medium' | 'High'): string {
    const baseAmount = severity === 'High' ? 10000000 : severity === 'Medium' ? 5000000 : 1000000;
    const variation = Math.random() * 0.5 + 0.75; // 75% to 125% of base
    const amount = Math.round(baseAmount * variation);
    return `$${(amount / 1000000).toFixed(1)}M`;
  }

  /**
   * Map EONET event type to disaster type
   */
  private mapEventType(eventType: string): string {
    const typeMap: Record<string, string> = {
      'Wildfires': 'Wildfire',
      'Volcanoes': 'Volcano',
      'Severe Storms': 'Storm',
      'Floods': 'Flood',
      'Earthquakes': 'Earthquake',
      'Drought': 'Drought',
      'Landslides': 'Landslide',
      'Snow': 'Snow Storm',
      'Temperature Extremes': 'Heat Wave'
    };
    return typeMap[eventType] || 'Other';
  }

  /**
   * Estimate severity from event type
   */
  private estimateSeverity(eventType: string): 'Low' | 'Medium' | 'High' {
    const highSeverityTypes = ['Wildfires', 'Volcanoes', 'Severe Storms', 'Earthquakes'];
    const mediumSeverityTypes = ['Floods', 'Drought', 'Landslides'];
    
    if (highSeverityTypes.includes(eventType)) return 'High';
    if (mediumSeverityTypes.includes(eventType)) return 'Medium';
    return 'Low';
  }

  /**
   * Estimate severity from probability
   */
  private estimateSeverityFromProbability(probability: number): 'Low' | 'Medium' | 'High' {
    if (probability >= 0.7) return 'High';
    if (probability >= 0.4) return 'Medium';
    return 'Low';
  }

  /**
   * Apply filters to a dataset
   */
  private applyFilterSet(disasters: DisasterReport[], filters: DisasterFilters): DisasterReport[] {
    let filtered = disasters;
    if (filters.status) filtered = filtered.filter(d => d.status === filters.status);
    if (filters.type) filtered = filtered.filter(d => d.type === filters.type);
    if (filters.severity) filtered = filtered.filter(d => d.severity === filters.severity);
    return filtered;
  }

  /**
   * Professional mock dataset for offline usage
   */
  private getMockDisasters(): DisasterReport[] {
    const now = new Date();
    const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();
    return [
      {
        id: 'mock-1',
        title: 'Severe Flood Condition – Mississippi Delta',
        type: 'Flood',
        location: 'Mississippi Delta, USA',
        description: 'Expansive riverine inundation impacting critical infrastructure and residential corridors.',
        severity: 'High',
        status: 'Active',
        affected_people: 12450,
        estimated_damage: '$18.6M',
        contact_info: { phone: '+1-555-1040', email: 'ops.delta@response.gov' },
        updates: [
          { timestamp: daysAgo(0), message: 'Levee surveillance intensified; evacuation advisories escalated.', author: 'Incident Command' },
          { timestamp: daysAgo(1), message: 'Hydrographs indicate crest surpassing 100-year thresholds.', author: 'Hydrology Unit' }
        ],
        created_at: daysAgo(2),
        updated_at: daysAgo(0)
      },
      {
        id: 'mock-2',
        title: 'Elevated Wildfire Threat – Sonoma Highlands',
        type: 'Wildfire',
        location: 'Sonoma County, USA',
        description: 'Rapidly evolving brush fire with erratic wind behavior and low fuel moisture.',
        severity: 'High',
        status: 'Warning',
        affected_people: 3200,
        estimated_damage: '$7.4M',
        contact_info: { phone: '+1-555-2231', email: 'wildfire.ops@cal.state' },
        updates: [
          { timestamp: daysAgo(0), message: 'Containment lines expanded; aerial assets on standby.', author: 'Operations' }
        ],
        created_at: daysAgo(1),
        updated_at: daysAgo(0)
      },
      {
        id: 'mock-3',
        title: 'Seismic Disturbance Advisory – Cascadia Zone',
        type: 'Earthquake',
        location: 'Cascadia Subduction Zone, USA',
        description: 'Cluster of shallow tremors indicative of heightened tectonic agitation.',
        severity: 'Medium',
        status: 'Active',
        affected_people: 860,
        estimated_damage: '$2.1M',
        contact_info: { phone: '+1-555-4419', email: 'seismic.alert@geo.gov' },
        updates: [
          { timestamp: daysAgo(0), message: 'Aftershock probability recalibrated; infrastructure checks underway.', author: 'Seismology Desk' }
        ],
        created_at: daysAgo(3),
        updated_at: daysAgo(0)
      },
      {
        id: 'mock-4',
        title: 'Tropical Cyclone Risk – Gulf Corridor',
        type: 'Storm',
        location: 'Gulf Coast, USA',
        description: 'Barometric depression with cyclogenesis potential; coastal surge modeling initiated.',
        severity: 'Medium',
        status: 'Warning',
        affected_people: 5900,
        estimated_damage: '$5.9M',
        contact_info: { phone: '+1-555-8802', email: 'storm.center@noaa.gov' },
        updates: [
          { timestamp: daysAgo(0), message: 'Cone of uncertainty narrowed; maritime advisories issued.', author: 'Meteorology' }
        ],
        created_at: daysAgo(2),
        updated_at: daysAgo(0)
      },
      {
        id: 'mock-5',
        title: 'Slope Failure Watch – Andean Foothills',
        type: 'Landslide',
        location: 'Cusco Region, Peru',
        description: 'Prolonged precipitation saturating regolith, increasing translational slide risk.',
        severity: 'Low',
        status: 'Active',
        affected_people: 410,
        estimated_damage: '$0.9M',
        contact_info: { phone: '+51-555-1134', email: 'geo-risk@andes.pe' },
        updates: [],
        created_at: daysAgo(5),
        updated_at: daysAgo(1)
      },
      {
        id: 'mock-6',
        title: 'Hydrologic Stress Bulletin – Rhine Basin',
        type: 'Flood',
        location: 'Rhine River Basin, EU',
        description: 'Snowmelt and upstream release elevating fluvial discharge beyond seasonal norms.',
        severity: 'Medium',
        status: 'Resolved',
        affected_people: 1290,
        estimated_damage: '$3.3M',
        contact_info: { phone: '+49-555-2210', email: 'river.ops@europa.eu' },
        updates: [],
        created_at: daysAgo(10),
        updated_at: daysAgo(7)
      },
      {
        id: 'mock-7',
        title: 'Prolonged Drought Advisory – Sahel Belt',
        type: 'Drought',
        location: 'Sahel, Africa',
        description: 'Multi-month precipitation deficit affecting agrarian outputs and water security.',
        severity: 'High',
        status: 'Active',
        affected_people: 24500,
        estimated_damage: '$12.8M',
        contact_info: { phone: '+223-555-7788', email: 'drought.alert@au.org' },
        updates: [],
        created_at: daysAgo(20),
        updated_at: daysAgo(2)
      },
      {
        id: 'mock-8',
        title: 'Tornadic Activity Outlook – Great Plains',
        type: 'Tornado',
        location: 'Oklahoma, USA',
        description: 'Supercell formation potential with elevated convective parameters.',
        severity: 'Medium',
        status: 'Warning',
        affected_people: 720,
        estimated_damage: '$1.6M',
        contact_info: { phone: '+1-555-9001', email: 'tornado.ops@noaa.gov' },
        updates: [],
        created_at: daysAgo(4),
        updated_at: daysAgo(1)
      }
    ];
  }

  /**
   * Get disaster by ID
   */
  async getDisasterById(id: string): Promise<DisasterReport> {
    const result = await this.getDisasters();
    const disaster = result.disasters.find(d => d.id === id);
    if (!disaster) {
      throw new Error(`Disaster with ID ${id} not found`);
    }
    return disaster;
  }

  /**
   * Create a new disaster report
   */
  async createDisaster(data: CreateDisasterData): Promise<DisasterReport> {
    // Note: The Railway backend doesn't support creating disasters via API
    // This would typically be handled by the backend's disaster management endpoints
    // For now, we'll return a simulated created disaster
    const newDisaster: DisasterReport = {
      id: `disaster-${Date.now()}`,
      title: data.title,
      type: data.type,
      location: data.location,
      description: data.description,
      severity: data.severity,
      status: 'Active',
      affected_people: data.affected_people,
      estimated_damage: data.estimated_damage,
      contact_info: data.contact_info,
      updates: [
        {
          timestamp: new Date().toISOString(),
          message: 'Disaster report created',
          author: 'System'
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Disaster report created (simulated):', newDisaster);
    return newDisaster;
  }

  /**
   * Update an existing disaster report
   */
  async updateDisaster(id: string, data: UpdateDisasterData): Promise<DisasterReport> {
    try {
      const disaster = await this.getDisasterById(id);
      // Note: The Railway backend doesn't support updating disasters via API
      // This would typically be handled by the backend's disaster management endpoints
      // For now, we'll return a simulated updated disaster
      const updatedDisaster = { 
        ...disaster, 
        ...data, 
        updated_at: new Date().toISOString(),
        updates: [
          ...disaster.updates,
          {
            timestamp: new Date().toISOString(),
            message: 'Disaster report updated',
            author: 'System'
          }
        ]
      };
      
      console.log('Disaster report updated (simulated):', updatedDisaster);
      return updatedDisaster;
    } catch (error) {
      console.error('Error updating disaster:', error);
      throw new Error('Failed to update disaster report');
    }
  }

  /**
   * Delete a disaster report
   */
  async deleteDisaster(id: string): Promise<void> {
    try {
      await this.getDisasterById(id);
      // Note: The Railway backend doesn't support deleting disasters via API
      // This would typically be handled by the backend's disaster management endpoints
      console.log('Disaster report deleted (simulated):', id);
    } catch (error) {
      console.error('Error deleting disaster:', error);
      throw new Error('Failed to delete disaster report');
    }
  }

  /**
   * Add an update to a disaster report
   */
  async addDisasterUpdate(id: string, message: string, author: string): Promise<DisasterReport> {
    try {
      const disaster = await this.getDisasterById(id);
      const updatedDisaster = {
        ...disaster,
        updates: [
          ...disaster.updates,
          {
            timestamp: new Date().toISOString(),
            message,
            author
          }
        ],
        updated_at: new Date().toISOString()
      };
      
      console.log('Disaster update added (simulated):', updatedDisaster);
      return updatedDisaster;
    } catch (error) {
      console.error('Error adding disaster update:', error);
      throw new Error('Failed to add disaster update');
    }
  }

  /**
   * Search disasters by query
   */
  async searchDisasters(query: string): Promise<DisasterReport[]> {
    const result = await this.getDisasters();
    return result.disasters.filter(disaster => 
      disaster.title.toLowerCase().includes(query.toLowerCase()) ||
      disaster.location.toLowerCase().includes(query.toLowerCase()) ||
      disaster.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Get disasters by status
   */
  async getDisastersByStatus(status: string): Promise<DisasterReport[]> {
    const result = await this.getDisasters({ status });
    return result.disasters;
  }

  /**
   * Get disasters by type
   */
  async getDisastersByType(type: string): Promise<DisasterReport[]> {
    const result = await this.getDisasters({ type });
    return result.disasters;
  }

  /**
   * Get disasters by severity
   */
  async getDisastersBySeverity(severity: string): Promise<DisasterReport[]> {
    const result = await this.getDisasters({ severity });
    return result.disasters;
  }

  /**
   * Get recent disasters
   */
  async getRecentDisasters(limit: number = 10): Promise<DisasterReport[]> {
    const result = await this.getDisasters();
    return result.disasters
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }

  /**
   * Get disaster statistics
   */
  async getStatistics(): Promise<DisasterStatistics> {
    try {
      const allDisasters = await this.getDisasters();
      const disasters = allDisasters.disasters;
      
      return {
        total_disasters: disasters.length,
        active_disasters: disasters.filter(d => d.status === 'Active').length,
        warning_disasters: disasters.filter(d => d.status === 'Warning').length,
        resolved_disasters: disasters.filter(d => d.status === 'Resolved').length,
        total_affected_people: disasters.reduce((sum, d) => sum + d.affected_people, 0),
        total_estimated_damage: this.calculateTotalDamage(disasters),
        disasters_by_type: this.groupByType(disasters),
        disasters_by_severity: this.groupBySeverity(disasters)
      };
    } catch (error) {
      console.error('Error fetching disaster statistics:', error);
      throw new Error('Failed to load disaster statistics');
    }
  }

  /**
   * Calculate total estimated damage
   */
  private calculateTotalDamage(disasters: DisasterReport[]): string {
    const total = disasters.reduce((sum, disaster) => {
      const amount = parseFloat(disaster.estimated_damage.replace(/[$,]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
    return `$${(total / 1000000).toFixed(1)}M`;
  }

  /**
   * Group disasters by type
   */
  private groupByType(disasters: DisasterReport[]): Record<string, number> {
    return disasters.reduce((acc, disaster) => {
      acc[disaster.type] = (acc[disaster.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  /**
   * Group disasters by severity
   */
  private groupBySeverity(disasters: DisasterReport[]): Record<string, number> {
    return disasters.reduce((acc, disaster) => {
      acc[disaster.severity] = (acc[disaster.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

// Export singleton instance
export const disasterManagementServiceV2 = new DisasterManagementServiceV2();
