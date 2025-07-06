-- Insert sample disaster events
INSERT INTO public.disaster_events (event_type, name, location, coordinates, severity, magnitude, status, probability, affected_population, economic_impact, description) VALUES
('hurricane', 'Hurricane Alexander', 'Gulf of Mexico', '{"lat": 26.5, "lng": -89.2}', 'Category 4', '150 mph winds', 'active', 89, 2300000, 45200000000, 'Major hurricane approaching Louisiana coast with 150 mph winds and life-threatening storm surge.'),
('earthquake', 'San Andreas Fault Activity', 'Southern California', '{"lat": 34.0522, "lng": -118.2437}', 'Major', 'Magnitude 6.2', 'monitoring', 34, 8700000, 28700000000, 'Increased seismic activity detected along San Andreas fault system.'),
('wildfire', 'Redwood Complex Fire', 'Northern California', '{"lat": 37.7749, "lng": -122.4194}', 'Extreme', '125,000 acres', 'active', 91, 650000, 15800000000, 'Rapidly spreading wildfire threatening residential areas with extreme fire weather conditions.'),
('flood', 'Mississippi River Flood', 'Louisiana Delta', '{"lat": 29.9511, "lng": -90.0715}', 'Major', 'Record levels', 'active', 76, 1200000, 12400000000, 'Historic flooding along Mississippi River with water levels 8 feet above flood stage.'),
('tornado', 'Moore Tornado Outbreak', 'Oklahoma Plains', '{"lat": 35.3493, "lng": -97.4894}', 'EF4', '200 mph winds', 'monitoring', 67, 450000, 2100000000, 'Severe tornado outbreak with multiple EF4+ tornadoes possible across tornado alley.');

-- Insert sample predictions
INSERT INTO public.predictions (model_name, prediction_type, location, coordinates, probability, confidence_score, severity_level, timeframe_start, timeframe_end, details) VALUES
('HurricaneNet-v3', 'hurricane', 'Florida Keys', '{"lat": 24.5557, "lng": -81.7775}', 78, 94.2, 'high', now() + interval '24 hours', now() + interval '72 hours', '{"wind_speed": "125 mph", "storm_surge": "8-12 feet", "rainfall": "6-10 inches"}'),
('SeismicAI-Pro', 'earthquake', 'San Francisco Bay Area', '{"lat": 37.7749, "lng": -122.4194}', 23, 87.5, 'medium', now() + interval '5 days', now() + interval '14 days', '{"magnitude": "5.5-6.0", "depth": "8-15 km", "fault": "Hayward Fault"}'),
('FloodPredict-ML', 'flood', 'Houston Metro', '{"lat": 29.7604, "lng": -95.3698}', 65, 91.8, 'high', now() + interval '6 hours', now() + interval '24 hours', '{"rainfall": "4-8 inches", "flood_depth": "2-4 feet", "duration": "12-18 hours"}'),
('WildfireAI-2024', 'wildfire', 'Los Angeles County', '{"lat": 34.0522, "lng": -118.2437}', 89, 96.3, 'critical', now() + interval '2 hours', now() + interval '48 hours', '{"fire_weather_index": "extreme", "wind_speed": "45-65 mph", "humidity": "8-15%"}'),
('TornadoNet-Advanced', 'tornado', 'Kansas City Area', '{"lat": 39.0997, "lng": -94.5786}', 45, 82.1, 'medium', now() + interval '18 hours', now() + interval '36 hours', '{"ef_scale": "EF2-EF3", "wind_speed": "120-165 mph", "path_width": "0.5-1 mile"}');

-- Insert sample sensor data
INSERT INTO public.sensor_data (station_id, station_name, location, coordinates, sensor_type, reading_value, reading_unit, reading_time, data_quality, metadata) VALUES
('SEISM_001', 'San Andreas Monitor Station Alpha', 'Parkfield, CA', '{"lat": 35.8969, "lng": -120.4958}', 'seismic', 2.1, 'magnitude', now() - interval '5 minutes', 'excellent', '{"depth": "12.3 km", "frequency": "2.5 Hz"}'),
('WEATHER_SF_01', 'San Francisco Weather Station', 'San Francisco, CA', '{"lat": 37.7749, "lng": -122.4194}', 'weather', 18.5, 'mph', now() - interval '2 minutes', 'good', '{"humidity": 65, "pressure": "30.15 inHg", "temperature": "68°F"}'),
('FLOOD_NOLA_03', 'New Orleans Flood Monitor', 'New Orleans, LA', '{"lat": 29.9511, "lng": -90.0715}', 'flood', 24.7, 'feet', now() - interval '1 minute', 'excellent', '{"flood_stage": "17 feet", "trend": "rising", "rate": "0.3 ft/hr"}'),
('TEMP_PHX_05', 'Phoenix Temperature Station', 'Phoenix, AZ', '{"lat": 33.4484, "lng": -112.0740}', 'temperature', 115.2, 'fahrenheit', now() - interval '30 seconds', 'excellent', '{"heat_index": "125°F", "humidity": 15, "uv_index": 11}'),
('AIR_LA_02', 'Los Angeles Air Quality Monitor', 'Los Angeles, CA', '{"lat": 34.0522, "lng": -118.2437}', 'air_quality', 165, 'AQI', now() - interval '3 minutes', 'good', '{"pm2.5": 45, "pm10": 78, "ozone": 89, "no2": 34}');

-- Insert historical data for trends
INSERT INTO public.historical_data (event_type, location, coordinates, year, month, frequency, severity_avg, impact_economic, impact_casualties) VALUES
('hurricane', 'Gulf Coast', '{"lat": 29.0, "lng": -90.0}', 2024, 8, 3, 2.7, 25000000000, 45),
('hurricane', 'Gulf Coast', '{"lat": 29.0, "lng": -90.0}', 2023, 9, 2, 3.1, 45000000000, 127),
('earthquake', 'California', '{"lat": 36.0, "lng": -119.0}', 2024, 6, 15, 4.2, 2500000000, 12),
('earthquake', 'California', '{"lat": 36.0, "lng": -119.0}', 2023, 8, 12, 3.8, 1200000000, 3),
('wildfire', 'Western US', '{"lat": 40.0, "lng": -120.0}', 2024, 7, 45, 8.5, 18000000000, 89),
('wildfire', 'Western US', '{"lat": 40.0, "lng": -120.0}', 2023, 8, 52, 9.2, 22000000000, 156),
('flood', 'Midwest', '{"lat": 41.0, "lng": -95.0}', 2024, 5, 8, 6.2, 8500000000, 23),
('tornado', 'Tornado Alley', '{"lat": 36.0, "lng": -98.0}', 2024, 4, 125, 2.1, 4200000000, 67);