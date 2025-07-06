-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  location TEXT,
  coordinates JSONB,
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "sms": false}',
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create disaster_events table for tracking real disasters
CREATE TABLE public.disaster_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('earthquake', 'hurricane', 'flood', 'wildfire', 'tornado', 'landslide', 'tsunami', 'volcanic')),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  severity TEXT NOT NULL,
  magnitude TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('predicted', 'active', 'ended', 'monitoring')),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  affected_population INTEGER,
  economic_impact DECIMAL,
  description TEXT,
  metadata JSONB,
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table for AI model predictions
CREATE TABLE public.predictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  prediction_type TEXT NOT NULL,
  location TEXT NOT NULL, 
  coordinates JSONB NOT NULL,
  probability INTEGER NOT NULL CHECK (probability >= 0 AND probability <= 100),
  confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  severity_level TEXT NOT NULL CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  timeframe_start TIMESTAMP WITH TIME ZONE NOT NULL,
  timeframe_end TIMESTAMP WITH TIME ZONE NOT NULL,
  details JSONB,
  is_active BOOLEAN DEFAULT true,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table for user notifications
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  disaster_event_id UUID REFERENCES public.disaster_events(id),
  prediction_id UUID REFERENCES public.predictions(id),
  alert_type TEXT NOT NULL CHECK (alert_type IN ('prediction', 'warning', 'update', 'all_clear')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sensor_data table for monitoring station data
CREATE TABLE public.sensor_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  station_id TEXT NOT NULL,
  station_name TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  sensor_type TEXT NOT NULL CHECK (sensor_type IN ('seismic', 'weather', 'flood', 'air_quality', 'temperature')),
  reading_value DECIMAL NOT NULL,
  reading_unit TEXT NOT NULL,
  reading_time TIMESTAMP WITH TIME ZONE NOT NULL,
  data_quality TEXT DEFAULT 'good' CHECK (data_quality IN ('excellent', 'good', 'fair', 'poor')),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create historical_data table for trend analysis
CREATE TABLE public.historical_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  coordinates JSONB NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER CHECK (month >= 1 AND month <= 12),
  frequency INTEGER DEFAULT 0,
  severity_avg DECIMAL,
  impact_economic DECIMAL,
  impact_casualties INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disaster_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historical_data ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policies for disaster_events (public read, admin write)
CREATE POLICY "Anyone can view disaster events" ON public.disaster_events
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create disaster events" ON public.disaster_events
FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for predictions (public read)
CREATE POLICY "Anyone can view predictions" ON public.predictions
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create predictions" ON public.predictions
FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for alerts (user-specific)
CREATE POLICY "Users can view their own alerts" ON public.alerts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts" ON public.alerts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create alerts" ON public.alerts
FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for sensor_data (public read)
CREATE POLICY "Anyone can view sensor data" ON public.sensor_data
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert sensor data" ON public.sensor_data
FOR INSERT TO authenticated WITH CHECK (true);

-- Create policies for historical_data (public read)
CREATE POLICY "Anyone can view historical data" ON public.historical_data
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert historical data" ON public.historical_data
FOR INSERT TO authenticated WITH CHECK (true);

-- Create functions for updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disaster_events_updated_at
  BEFORE UPDATE ON public.disaster_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
  BEFORE UPDATE ON public.predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_disaster_events_type ON public.disaster_events(event_type);
CREATE INDEX idx_disaster_events_status ON public.disaster_events(status);
CREATE INDEX idx_disaster_events_coordinates ON public.disaster_events USING GIN(coordinates);
CREATE INDEX idx_predictions_type ON public.predictions(prediction_type);
CREATE INDEX idx_predictions_active ON public.predictions(is_active);
CREATE INDEX idx_predictions_coordinates ON public.predictions USING GIN(coordinates);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_read ON public.alerts(is_read);
CREATE INDEX idx_sensor_data_station ON public.sensor_data(station_id);
CREATE INDEX idx_sensor_data_type ON public.sensor_data(sensor_type);
CREATE INDEX idx_sensor_data_time ON public.sensor_data(reading_time);
CREATE INDEX idx_historical_data_type ON public.historical_data(event_type);
CREATE INDEX idx_historical_data_year ON public.historical_data(year);

-- Enable realtime for tables that need live updates
ALTER TABLE public.disaster_events REPLICA IDENTITY FULL;
ALTER TABLE public.predictions REPLICA IDENTITY FULL;
ALTER TABLE public.alerts REPLICA IDENTITY FULL;
ALTER TABLE public.sensor_data REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.disaster_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.predictions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;