export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          alert_type: string
          created_at: string
          disaster_event_id: string | null
          id: string
          is_read: boolean | null
          message: string
          prediction_id: string | null
          sent_at: string | null
          severity: string
          title: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          disaster_event_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          prediction_id?: string | null
          sent_at?: string | null
          severity: string
          title: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          disaster_event_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          prediction_id?: string | null
          sent_at?: string | null
          severity?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_disaster_event_id_fkey"
            columns: ["disaster_event_id"]
            isOneToOne: false
            referencedRelation: "disaster_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "predictions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      disaster_events: {
        Row: {
          affected_population: number | null
          coordinates: Json
          created_at: string
          created_by: string | null
          description: string | null
          economic_impact: number | null
          end_time: string | null
          event_type: string
          id: string
          location: string
          magnitude: string | null
          metadata: Json | null
          name: string
          probability: number | null
          severity: string
          start_time: string | null
          status: string
          updated_at: string
        }
        Insert: {
          affected_population?: number | null
          coordinates: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          economic_impact?: number | null
          end_time?: string | null
          event_type: string
          id?: string
          location: string
          magnitude?: string | null
          metadata?: Json | null
          name: string
          probability?: number | null
          severity: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          affected_population?: number | null
          coordinates?: Json
          created_at?: string
          created_by?: string | null
          description?: string | null
          economic_impact?: number | null
          end_time?: string | null
          event_type?: string
          id?: string
          location?: string
          magnitude?: string | null
          metadata?: Json | null
          name?: string
          probability?: number | null
          severity?: string
          start_time?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disaster_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      historical_data: {
        Row: {
          coordinates: Json
          created_at: string
          event_type: string
          frequency: number | null
          id: string
          impact_casualties: number | null
          impact_economic: number | null
          location: string
          metadata: Json | null
          month: number | null
          severity_avg: number | null
          year: number
        }
        Insert: {
          coordinates: Json
          created_at?: string
          event_type: string
          frequency?: number | null
          id?: string
          impact_casualties?: number | null
          impact_economic?: number | null
          location: string
          metadata?: Json | null
          month?: number | null
          severity_avg?: number | null
          year: number
        }
        Update: {
          coordinates?: Json
          created_at?: string
          event_type?: string
          frequency?: number | null
          id?: string
          impact_casualties?: number | null
          impact_economic?: number | null
          location?: string
          metadata?: Json | null
          month?: number | null
          severity_avg?: number | null
          year?: number
        }
        Relationships: []
      }
      predictions: {
        Row: {
          confidence_score: number
          coordinates: Json
          created_at: string
          details: Json | null
          id: string
          is_active: boolean | null
          location: string
          model_name: string
          prediction_type: string
          probability: number
          severity_level: string
          timeframe_end: string
          timeframe_start: string
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          confidence_score: number
          coordinates: Json
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          location: string
          model_name: string
          prediction_type: string
          probability: number
          severity_level: string
          timeframe_end: string
          timeframe_start: string
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          confidence_score?: number
          coordinates?: Json
          created_at?: string
          details?: Json | null
          id?: string
          is_active?: boolean | null
          location?: string
          model_name?: string
          prediction_type?: string
          probability?: number
          severity_level?: string
          timeframe_end?: string
          timeframe_start?: string
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          coordinates: Json | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          location: string | null
          notification_preferences: Json | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          coordinates?: Json | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          notification_preferences?: Json | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          coordinates?: Json | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          notification_preferences?: Json | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          coordinates: Json
          created_at: string
          data_quality: string | null
          id: string
          location: string
          metadata: Json | null
          reading_time: string
          reading_unit: string
          reading_value: number
          sensor_type: string
          station_id: string
          station_name: string
        }
        Insert: {
          coordinates: Json
          created_at?: string
          data_quality?: string | null
          id?: string
          location: string
          metadata?: Json | null
          reading_time: string
          reading_unit: string
          reading_value: number
          sensor_type: string
          station_id: string
          station_name: string
        }
        Update: {
          coordinates?: Json
          created_at?: string
          data_quality?: string | null
          id?: string
          location?: string
          metadata?: Json | null
          reading_time?: string
          reading_unit?: string
          reading_value?: number
          sensor_type?: string
          station_id?: string
          station_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
