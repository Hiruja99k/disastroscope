// Tinybird Service for Real-time Data
// This service handles user data and real-time analytics using Tinybird

interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences?: {
    theme: string;
    notifications: boolean;
    language: string;
  };
}

interface DisasterEvent {
  id: string;
  type: string;
  severity: number;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  description: string;
  userId?: string;
}

class TinybirdService {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_TINYBIRD_API_URL || 'https://api.tinybird.co';
    this.token = import.meta.env.VITE_TINYBIRD_TOKEN || '';
  }

  // User Management Methods
  async createUser(userData: UserData): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v0/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'user_created',
          data: {
            uid: userData.uid,
            email: userData.email,
            display_name: userData.displayName,
            photo_url: userData.photoURL,
            email_verified: userData.emailVerified,
            created_at: userData.createdAt,
            last_login_at: userData.lastLoginAt,
            theme: userData.preferences?.theme || 'light',
            notifications: userData.preferences?.notifications || true,
            language: userData.preferences?.language || 'en'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating user in Tinybird:', error);
      throw error;
    }
  }

  async updateUser(uid: string, updates: Partial<UserData>): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v0/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'user_updated',
          data: {
            uid,
            ...updates,
            updated_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating user in Tinybird:', error);
      throw error;
    }
  }

  async trackUserLogin(uid: string, email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v0/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'user_login',
          data: {
            uid,
            email,
            login_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to track login: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error tracking login in Tinybird:', error);
      throw error;
    }
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v0/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'user_deleted',
          data: {
            uid,
            deleted_at: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting user in Tinybird:', error);
      throw error;
    }
  }

  // Disaster Data Methods
  async createDisasterEvent(event: DisasterEvent): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v0/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'disaster_event',
          data: {
            id: event.id,
            type: event.type,
            severity: event.severity,
            latitude: event.location.lat,
            longitude: event.location.lng,
            timestamp: event.timestamp,
            description: event.description,
            user_id: event.userId
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create disaster event: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating disaster event in Tinybird:', error);
      throw error;
    }
  }

  async getDisasterEvents(limit: number = 100): Promise<DisasterEvent[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v0/pipes/disaster_events.json?limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch disaster events: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching disaster events from Tinybird:', error);
      throw error;
    }
  }

  async getUserAnalytics(uid: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v0/pipes/user_analytics.json?uid=${uid}`,
        {
          headers: {
            'Authorization': `Bearer ${this.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch user analytics: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching user analytics from Tinybird:', error);
      throw error;
    }
  }

  // Real-time Data Streaming (using Tinybird's real-time capabilities)
  async subscribeToDisasterEvents(
    callback: (event: DisasterEvent) => void,
    filters?: { type?: string; severity?: number }
  ): Promise<() => void> {
    // This would typically use WebSockets or Server-Sent Events
    // For now, we'll use polling as an example
    const pollInterval = 5000; // 5 seconds
    
    const poll = async () => {
      try {
        const events = await this.getDisasterEvents(10);
        events.forEach(callback);
      } catch (error) {
        console.error('Error polling disaster events:', error);
      }
    };

    // Start polling
    const intervalId = setInterval(poll, pollInterval);
    
    // Return cleanup function
    return () => clearInterval(intervalId);
  }
}

// Export singleton instance
export const tinybirdService = new TinybirdService();
export default tinybirdService;
