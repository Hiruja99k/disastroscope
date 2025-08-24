from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timedelta, timezone
import random
import threading
import time
from typing import Dict, List, Any
import logging
import asyncio
from contextlib import suppress

# Load environment variables from .env (must happen BEFORE importing modules that read env)
load_dotenv()

from weather_service import weather_service, WeatherData
from ai_models import ai_prediction_service
from openfema_service import openfema_service, FEMADeclaration
from eonet_service import eonet_service, EONETEvent

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
# Allow SPA frontends on Vercel/preview and custom domains
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:8080",
    "https://disastroscope.site",
    "https://www.disastroscope.site",
    "https://api.disastroscope.site",
    "https://*.vercel.app",
    "https://*.vercel.dev"
]}})
socketio = SocketIO(app, cors_allowed_origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080", 
    "https://disastroscope.site",
    "https://www.disastroscope.site",
    "https://api.disastroscope.site",
    "https://*.vercel.app",
    "https://*.vercel.dev"
])

# In-memory storage (replace with database in production)
disaster_events = []
predictions = []
sensor_data = []
historical_data = []
weather_data_cache = []
fema_disasters = []  # OpenFEMA disaster declarations (list of dicts)
eonet_events = []    # NASA EONET events (list of dicts)

# Optional: Gemini configuration for natural-language summaries
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai_model = None
with suppress(Exception):
    if GEMINI_API_KEY:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        # Prefer a fast, cost-effective model for summaries
        genai_model = genai.GenerativeModel('gemini-1.5-flash')

def generate_prediction_summary(event_type: str, location: str, weather: Dict[str, Any], risk_score: float) -> str:
    """Generate a brief, professional summary for a predicted disaster.
    Returns an empty string if Gemini is not configured or on any error.
    """
    if not genai_model:
        return ""
    try:
        prompt = (
            "You are a disaster risk analyst. Given live weather features and an AI risk score, "
            "write a concise (2-3 sentences) professional summary for a potential {etype} at {loc}. "
            "Focus on risk drivers (e.g., wind, precipitation), expected timeframe (~24-72h), and a clear actionable note.\n\n"
            f"Disaster: {event_type}\n"
            f"Location: {location}\n"
            f"Risk score (0-1): {risk_score:.2f}\n"
            f"Weather: {json.dumps(weather, ensure_ascii=False)}\n"
        ).format(etype=event_type, loc=location)
        resp = genai_model.generate_content(prompt)
        text = getattr(resp, 'text', None)
        if isinstance(text, str):
            return text.strip()
    except Exception as e:
        logger.warning(f"Gemini summary generation failed: {e}")
    return ""

# Major cities for weather monitoring
MONITORED_LOCATIONS = [
    {'name': 'San Francisco, CA', 'coords': {'lat': 37.7749, 'lng': -122.4194}},
    {'name': 'Los Angeles, CA', 'coords': {'lat': 34.0522, 'lng': -118.2437}},
    {'name': 'Miami, FL', 'coords': {'lat': 25.7617, 'lng': -80.1918}},
    {'name': 'New York, NY', 'coords': {'lat': 40.7128, 'lng': -74.0060}},
    {'name': 'Houston, TX', 'coords': {'lat': 29.7604, 'lng': -95.3698}},
    {'name': 'Seattle, WA', 'coords': {'lat': 47.6062, 'lng': -122.3321}},
    {'name': 'New Orleans, LA', 'coords': {'lat': 29.9511, 'lng': -90.0715}},
    {'name': 'Portland, OR', 'coords': {'lat': 45.5152, 'lng': -122.6784}},
    {'name': 'Chicago, IL', 'coords': {'lat': 41.8781, 'lng': -87.6298}},
    {'name': 'Denver, CO', 'coords': {'lat': 39.7392, 'lng': -104.9903}}
]

class DisasterEvent:
    def __init__(self, event_id: str, name: str, event_type: str, location: str, 
                 severity: str, status: str, coordinates: Dict[str, float], 
                 affected_population: int = 0, economic_impact: float = 0.0,
                 weather_data: Dict = None, ai_confidence: float = 0.0):
        self.id = event_id
        self.name = name
        self.event_type = event_type
        self.location = location
        self.severity = severity
        self.status = status
        self.coordinates = coordinates
        self.affected_population = affected_population
        self.economic_impact = economic_impact
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)
        self.description = f"{event_type.title()} event in {location}"
        self.source = "AI Weather Analysis System"
        self.confidence_score = ai_confidence
        self.weather_data = weather_data or {}

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'event_type': self.event_type,
            'location': self.location,
            'severity': self.severity,
            'status': self.status,
            'coordinates': self.coordinates,
            'affected_population': self.affected_population,
            'economic_impact': self.economic_impact,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'description': self.description,
            'source': self.source,
            'confidence_score': self.confidence_score,
            'weather_data': self.weather_data
        }

class Prediction:
    def __init__(self, prediction_id: str, event_type: str, location: str, 
                 probability: float, severity: str, timeframe: str, coordinates: Dict[str, float],
                 weather_data: Dict = None, ai_model: str = "PyTorch Neural Network"):
        self.id = prediction_id
        self.event_type = event_type
        self.location = location
        self.probability = probability
        self.severity = severity
        self.timeframe = timeframe
        self.coordinates = coordinates
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = datetime.now(timezone.utc)
        self.confidence_level = probability
        self.affected_area_km2 = random.uniform(100, 5000)
        self.potential_impact = f"Potential {severity.lower()} {event_type} affecting {location}"
        self.weather_data = weather_data or {}
        self.ai_model = ai_model

    def to_dict(self):
        return {
            'id': self.id,
            'event_type': self.event_type,
            'location': self.location,
            'probability': self.probability,
            'severity': self.severity,
            'timeframe': self.timeframe,
            'coordinates': self.coordinates,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'confidence_level': self.confidence_level,
            'affected_area_km2': self.affected_area_km2,
            'potential_impact': self.potential_impact,
            'weather_data': self.weather_data,
            'ai_model': self.ai_model
        }

class SensorData:
    def __init__(self, sensor_id: str, sensor_type: str, station_id: str, 
                 station_name: str, location: str, coordinates: Dict[str, float],
                 reading_value: float, reading_unit: str, weather_data: Dict = None):
        self.id = sensor_id
        self.sensor_type = sensor_type
        self.station_id = station_id
        self.station_name = station_name
        self.location = location
        self.coordinates = coordinates
        self.reading_value = reading_value
        self.reading_unit = reading_unit
        self.reading_time = datetime.now(timezone.utc)
        self.data_quality = 'excellent'  # Real data from weather API
        self.metadata = weather_data or {}
        self.created_at = datetime.now(timezone.utc)

    def to_dict(self):
        return {
            'id': self.id,
            'sensor_type': self.sensor_type,
            'station_id': self.station_id,
            'station_name': self.station_name,
            'location': self.location,
            'coordinates': self.coordinates,
            'reading_value': self.reading_value,
            'reading_unit': self.reading_unit,
            'reading_time': self.reading_time.isoformat(),
            'data_quality': self.data_quality,
            'metadata': self.metadata,
            'created_at': self.created_at.isoformat()
        }

async def fetch_weather_data():
    """Fetch weather data for all monitored locations"""
    try:
        weather_data = await weather_service.get_multiple_locations_weather(MONITORED_LOCATIONS)
        return weather_data
    except Exception as e:
        logger.error(f"Error fetching weather data: {e}")
        return []

def create_sensor_from_weather(weather: WeatherData, sensor_type: str) -> SensorData:
    """Create sensor data from weather data"""
    sensor_id = f"sensor_{weather.location.replace(' ', '_').replace(',', '')}_{sensor_type}"
    
    # Map weather data to sensor readings
    if sensor_type == 'temperature':
        reading_value = weather.temperature
        reading_unit = 'celsius'
    elif sensor_type == 'humidity':
        reading_value = weather.humidity
        reading_unit = 'percent'
    elif sensor_type == 'pressure':
        reading_value = weather.pressure
        reading_unit = 'hPa'
    elif sensor_type == 'wind':
        reading_value = weather.wind_speed
        reading_unit = 'm/s'
    elif sensor_type == 'precipitation':
        reading_value = weather.precipitation
        reading_unit = 'mm'
    else:
        reading_value = weather.temperature
        reading_unit = 'celsius'
    
    weather_dict = {
        'temperature': weather.temperature,
        'humidity': weather.humidity,
        'pressure': weather.pressure,
        'wind_speed': weather.wind_speed,
        'wind_direction': weather.wind_direction,
        'precipitation': weather.precipitation,
        'visibility': weather.visibility,
        'cloud_cover': weather.cloud_cover,
        'weather_condition': weather.weather_condition
    }
    
    return SensorData(
        sensor_id=sensor_id,
        sensor_type=sensor_type,
        station_id=f"weather_station_{weather.location}",
        station_name=f"Weather Station {weather.location}",
        location=weather.location,
        coordinates=weather.coordinates,
        reading_value=reading_value,
        reading_unit=reading_unit,
        weather_data=weather_dict
    )

def analyze_weather_for_disasters(weather_data: List[WeatherData]) -> List[Dict]:
    """Analyze weather data for potential disasters using AI models"""
    predictions = []
    
    for weather in weather_data:
        weather_dict = {
            'temperature': weather.temperature,
            'humidity': weather.humidity,
            'pressure': weather.pressure,
            'wind_speed': weather.wind_speed,
            'wind_direction': weather.wind_direction,
            'precipitation': weather.precipitation,
            'visibility': weather.visibility,
            'cloud_cover': weather.cloud_cover
        }
        
        # Get AI predictions
        try:
            ai_predictions = ai_prediction_service.predict_disaster_risks(weather_dict)
            
            for disaster_type, risk_score in ai_predictions.items():
                if risk_score > 0.3:  # Only create predictions for significant risks
                    severity = ai_prediction_service.get_disaster_severity(risk_score)
                    
                    prediction = {
                        'disaster_type': disaster_type,
                        'location': weather.location,
                        'coordinates': weather.coordinates,
                        'risk_score': risk_score,
                        'severity': severity,
                        'weather_data': weather_dict,
                        'timestamp': datetime.now(timezone.utc).isoformat()
                    }
                    predictions.append(prediction)
                    
        except Exception as e:
            logger.error(f"Error in AI prediction for {weather.location}: {e}")
    
    return predictions

@app.route('/')
def index():
    return jsonify({
        'message': 'DisastroScope API with Real Weather Data & AI Predictions',
        'version': '2.0.0',
        'status': 'running',
        'features': ['Real-time Weather Data', 'AI Disaster Prediction', 'PyTorch Models']
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'events_count': len(disaster_events),
        'predictions_count': len(predictions),
        'sensors_count': len(sensor_data),
        'weather_locations': len(MONITORED_LOCATIONS),
        'ai_models_loaded': len(ai_prediction_service.models),
        'fema_disasters_count': len(fema_disasters),
        'eonet_events_count': len(eonet_events)
    })

@app.route('/api/weather')
def get_weather_data():
    """Get current weather data for all monitored locations"""
    return jsonify([weather.to_dict() for weather in weather_data_cache])

@app.route('/api/weather/<location>')
def get_weather_location(location):
    """Get weather data for a specific location"""
    for weather in weather_data_cache:
        if location.lower() in weather.location.lower():
            return jsonify(weather.to_dict())
    return jsonify({'error': 'Location not found'}), 404

# New worldwide weather endpoints
@app.route('/api/geocode')
def geocode_location():
    """Geocode a place name to coordinates using OpenWeather Geocoding API"""
    query = request.args.get('query') or request.args.get('q')
    limit = int(request.args.get('limit', '5'))
    if not query:
        return jsonify({'error': 'Missing query'}), 400
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        results = loop.run_until_complete(weather_service.geocode(query, limit=limit))
        loop.close()
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in geocoding: {e}")
        return jsonify({'error': 'Geocoding failed'}), 500

@app.route('/api/weather/current')
def get_current_weather_by_coords():
    """Fetch current weather for arbitrary coordinates (lat, lon). Optional: name, units"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        name = request.args.get('name')
        units = request.args.get('units', default='metric')
        if lat is None or lon is None:
            return jsonify({'error': 'lat and lon are required'}), 400
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        weather = loop.run_until_complete(weather_service.get_current_weather(lat, lon, name, units))
        loop.close()
        if not weather:
            return jsonify({'error': 'Failed to fetch weather'}), 502
        return jsonify(weather.to_dict())
    except Exception as e:
        logger.error(f"Error fetching current weather: {e}")
        return jsonify({'error': 'Failed to fetch weather'}), 500

@app.route('/api/weather/forecast')
def get_forecast_by_coords():
    """Fetch forecast for arbitrary coordinates (lat, lon)."""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        days = request.args.get('days', default=5, type=int)
        units = request.args.get('units', default='metric')
        if lat is None or lon is None:
            return jsonify({'error': 'lat and lon are required'}), 400
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        forecast = loop.run_until_complete(weather_service.get_weather_forecast(lat, lon, days=days, units=units))
        loop.close()
        return jsonify(forecast)
    except Exception as e:
        logger.error(f"Error fetching forecast: {e}")
        return jsonify({'error': 'Failed to fetch forecast'}), 500

@app.route('/api/weather/by-city')
def get_weather_by_city():
    """Resolve a city/place query, then fetch its current weather for the best match."""
    query = request.args.get('query') or request.args.get('q')
    units = request.args.get('units', default='metric')
    if not query:
        return jsonify({'error': 'Missing query'}), 400
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        # Fetch multiple candidates to improve worldwide matching
        results = loop.run_until_complete(weather_service.geocode(query, limit=5))
        if not results:
            loop.close()
            return jsonify({'error': 'No results for query'}), 404

        # Choose the best candidate: prefer exact (case-insensitive) name match, else first
        qnorm = query.strip().lower()
        def score(item: dict) -> int:
            name = str(item.get('name') or '').lower()
            state = str(item.get('state') or '')
            country = str(item.get('country') or '')
            # exact name gets higher score
            s = 0
            if name == qnorm:
                s += 3
            if qnorm in name:
                s += 1
            # presence of state/country boosts confidence
            if state:
                s += 1
            if country:
                s += 1
            return s

        best = sorted(results, key=score, reverse=True)[0]
        lat = best['lat']
        lon = best['lon']
        name = f"{best.get('name')}{', ' + best.get('state') if best.get('state') else ''}{' ' + best.get('country') if best.get('country') else ''}".strip()
        weather = loop.run_until_complete(weather_service.get_current_weather(lat, lon, name, units))
        loop.close()
        if not weather:
            return jsonify({'error': 'Failed to fetch weather'}), 502
        return jsonify(weather.to_dict())
    except Exception as e:
        logger.error(f"Error fetching weather by city: {e}")
        return jsonify({'error': 'Failed to fetch weather by city'}), 500

# Enhanced location-based analysis endpoint
@app.route('/api/location/analyze', methods=['POST'])
def analyze_location():
    """Analyze a location for disaster risks, current weather, and near-term forecast"""
    data = request.get_json() or {}
    query = data.get('query')
    if not query:
        return jsonify({'error': 'Location query required'}), 400

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        # Step 1: Geocode the location with robust fallbacks
        results = loop.run_until_complete(weather_service.geocode(query, limit=5))
        if not results:
            loop.close()
            return jsonify({'error': 'Location not found'}), 404

        # Step 2: Score and pick the best match
        qnorm = query.strip().lower()
        def score(item: dict) -> int:
            name = str(item.get('name') or '').lower()
            state = str(item.get('state') or '')
            country = str(item.get('country') or '')
            s = 0
            if name == qnorm:
                s += 3
            if qnorm in name:
                s += 1
            if state:
                s += 1
            if country:
                s += 1
            return s

        best = sorted(results, key=score, reverse=True)[0]
        lat = best['lat']
        lon = best['lon']
        location_name = f"{best.get('name')}{', ' + best.get('state') if best.get('state') else ''}{' ' + best.get('country') if best.get('country') else ''}".strip()

        # Step 3: Fetch current weather
        weather = loop.run_until_complete(weather_service.get_current_weather(lat, lon, location_name, 'metric'))
        if not weather:
            loop.close()
            return jsonify({'error': 'Could not compute prediction for your location - weather data unavailable'}), 502

        weather_dict = {
            'temperature': weather.temperature,
            'humidity': weather.humidity,
            'pressure': weather.pressure,
            'wind_speed': weather.wind_speed,
            'wind_direction': weather.wind_direction,
            'precipitation': weather.precipitation,
            'visibility': weather.visibility,
            'cloud_cover': weather.cloud_cover
        }

        # Step 4: AI predictions
        predictions_map = ai_prediction_service.predict_disaster_risks(weather_dict)

        # Step 5: Short-term forecast (fallback-safe)
        forecast = loop.run_until_complete(weather_service.get_weather_forecast(lat, lon, 5, 'metric'))
        loop.close()

        # Step 6: Build response
        analysis = {
            'location': {
                'name': location_name,
                'coordinates': {'lat': lat, 'lng': lon},
                'geocoding_confidence': 'high' if best.get('state') and best.get('country') else 'medium'
            },
            'current_weather': weather_dict,
            'disaster_risks': predictions_map,
            'forecast': (forecast or [])[:8],
            'analysis_timestamp': datetime.now(timezone.utc).isoformat(),
            'risk_summary': _generate_risk_summary(predictions_map, weather_dict)
        }

        return jsonify(analysis)
    except Exception as e:
        logger.error(f"Error in location analysis: {e}")
        return jsonify({'error': 'Could not compute prediction for your location'}), 500


def _generate_risk_summary(predictions_map: Dict[str, float], weather: Dict[str, Any]) -> str:
    """Generate a concise natural-language summary of risks using heuristics."""
    high = [k for k, v in predictions_map.items() if v > 0.6]
    med = [k for k, v in predictions_map.items() if 0.3 < v <= 0.6]

    summary = (
        f"Current: {weather.get('temperature', 0):.1f}°C, "
        f"{weather.get('humidity', 0):.0f}% RH, "
        f"{weather.get('wind_speed', 0):.1f} m/s wind. "
    )
    if high:
        summary += f"High risks: {', '.join(sorted(high))}. "
    if med:
        summary += f"Moderate risks: {', '.join(sorted(med))}. "
    if not high and not med:
        summary += "No significant risks detected."
    return summary

@app.route('/api/events')
def get_events():
    """Get all disaster events"""
    return jsonify([event.to_dict() for event in disaster_events])

@app.route('/api/events/<event_id>')
def get_event(event_id):
    """Get specific disaster event"""
    event = next((e for e in disaster_events if e.id == event_id), None)
    if event:
        return jsonify(event.to_dict())
    return jsonify({'error': 'Event not found'}), 404

@app.route('/api/predictions')
def get_predictions():
    """Get all predictions"""
    return jsonify([pred.to_dict() for pred in predictions])

@app.route('/api/predictions/<prediction_id>')
def get_prediction(prediction_id):
    """Get specific prediction"""
    prediction = next((p for p in predictions if p.id == prediction_id), None)
    if prediction:
        return jsonify(prediction.to_dict())
    return jsonify({'error': 'Prediction not found'}), 404

@app.route('/api/sensors')
def get_sensor_data():
    """Get all sensor data"""
    return jsonify([sensor.to_dict() for sensor in sensor_data])

@app.route('/api/sensors/<sensor_id>')
def get_sensor(sensor_id):
    """Get specific sensor data"""
    sensor = next((s for s in sensor_data if s.id == sensor_id), None)
    if sensor:
        return jsonify(sensor.to_dict())
    return jsonify({'error': 'Sensor not found'}), 404

@app.route('/api/stats')
def get_stats():
    """Get real-time statistics"""
    active_events = [e for e in disaster_events if e.status in ['active', 'monitoring']]
    critical_events = [e for e in disaster_events if 'critical' in e.severity.lower() or 'extreme' in e.severity.lower()]
    
    return jsonify({
        'total_events': len(disaster_events),
        'active_events': len(active_events),
        'critical_events': len(critical_events),
        'total_predictions': len(predictions),
        'high_probability_predictions': len([p for p in predictions if p.probability > 0.7]),
        'total_sensors': len(sensor_data),
        'weather_locations_monitored': len(MONITORED_LOCATIONS),
        'ai_models_active': len(ai_prediction_service.models),
        'last_updated': datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/ai/predict', methods=['POST'])
def predict_disaster():
    """Make AI prediction for a specific location"""
    data = request.get_json()
    lat = data.get('lat')
    lon = data.get('lon')
    location_name = data.get('location_name')
    
    if not lat or not lon:
        return jsonify({'error': 'Latitude and longitude required'}), 400
    
    try:
        # Fetch weather data for the location
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        weather = loop.run_until_complete(weather_service.get_current_weather(lat, lon, location_name))
        loop.close()
        
        if not weather:
            return jsonify({'error': 'Failed to fetch weather data'}), 500
        
        weather_dict = {
            'temperature': weather.temperature,
            'humidity': weather.humidity,
            'pressure': weather.pressure,
            'wind_speed': weather.wind_speed,
            'wind_direction': weather.wind_direction,
            'precipitation': weather.precipitation,
            'visibility': weather.visibility,
            'cloud_cover': weather.cloud_cover
        }
        
        # Get AI predictions
        predictions_map = ai_prediction_service.predict_disaster_risks(weather_dict)

        # Optional Gemini summaries for each predicted type
        summaries = {}
        for etype, score in predictions_map.items():
            summary = generate_prediction_summary(etype, weather.location, weather_dict, float(score))
            if summary:
                summaries[etype] = summary
        
        # Store predictions in the global predictions list
        for etype, score in predictions_map.items():
            if score > 0.1:  # Only store predictions with significant risk
                severity = 'extreme' if score > 0.8 else 'high' if score > 0.6 else 'moderate' if score > 0.4 else 'low'
                
                prediction = Prediction(
                    prediction_id=f"ai_pred_{len(predictions) + 1}",
                    event_type=etype,
                    location=weather.location,
                    probability=float(score),
                    severity=severity,
                    timeframe='24-72h',
                    coordinates=weather.coordinates,
                    weather_data=weather_dict,
                    ai_model='PyTorch + Gemini' if summaries.get(etype) else 'PyTorch Neural Network'
                )
                if summaries.get(etype):
                    prediction.potential_impact = summaries[etype]
                
                predictions.append(prediction)
                # Emit real-time update
                socketio.emit('new_prediction', prediction.to_dict())
        
        return jsonify({
            'location': weather.location,
            'coordinates': weather.coordinates,
            'weather_data': weather_dict,
            'predictions': predictions_map,
            'summaries': summaries,
            'timestamp': datetime.now(timezone.utc).isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in AI prediction: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/api/models')
def list_models():
    """List available AI models and their status"""
    try:
        hazards = {}
        # Data source hints per hazard
        sources = {
            'flood': ['ERA5', 'GDACS'],
            'storm': ['ERA5'],
            'wildfire': ['FIRMS', 'ERA5'],
            'landslide': ['GDACS', 'ERA5'],
            'drought': ['ERA5'],
            'earthquake': ['USGS']
        }
        for hz, model in ai_prediction_service.models.items():
            loaded = isinstance(model, dict) and 'clf' in model
            hazards[hz] = {
                'loaded': bool(loaded),
                'type': 'ml' if loaded else 'heuristic',
                'metrics': {},
                'sources': sources.get(hz, [])
            }
        return jsonify({'models': hazards, 'timestamp': datetime.now(timezone.utc).isoformat()})
    except Exception as e:
        logger.error(f"/api/models error: {e}")
        return jsonify({'error': 'failed to list models'}), 500

@app.route('/api/ai/train', methods=['POST'])
def train_models():
    """Train AI models"""
    try:
        ai_prediction_service.train_models(epochs=50)  # Reduced epochs for faster training
        return jsonify({'message': 'Models trained successfully'})
    except Exception as e:
        logger.error(f"Error training models: {e}")
        return jsonify({'error': 'Training failed'}), 500

@app.route('/api/events', methods=['POST'])
def create_event():
    """Create a new disaster event"""
    data = request.get_json()
    
    event = DisasterEvent(
        event_id=data.get('id', f"event_{len(disaster_events) + 1}"),
        name=data.get('name'),
        event_type=data.get('event_type'),
        location=data.get('location'),
        severity=data.get('severity'),
        status=data.get('status'),
        coordinates=data.get('coordinates'),
        affected_population=data.get('affected_population', 0),
        economic_impact=data.get('economic_impact', 0.0),
        weather_data=data.get('weather_data'),
        ai_confidence=data.get('ai_confidence', 0.0)
    )
    
    disaster_events.append(event)
    
    # Emit real-time update
    socketio.emit('new_event', event.to_dict())
    
    return jsonify(event.to_dict()), 201

@app.route('/api/predictions', methods=['POST'])
def create_prediction():
    """Create a new prediction"""
    data = request.get_json()
    
    prediction = Prediction(
        prediction_id=data.get('id', f"pred_{len(predictions) + 1}"),
        event_type=data.get('event_type'),
        location=data.get('location'),
        probability=data.get('probability'),
        severity=data.get('severity'),
        timeframe=data.get('timeframe'),
        coordinates=data.get('coordinates'),
        weather_data=data.get('weather_data'),
        ai_model=data.get('ai_model', 'PyTorch Neural Network')
    )
    
    predictions.append(prediction)
    
    # Emit real-time update
    socketio.emit('new_prediction', prediction.to_dict())
    
    return jsonify(prediction.to_dict()), 201

@socketio.on('connect')
def handle_connect():
    logger.info(f"Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to DisastroScope API with Real Weather Data'})

@socketio.on('disconnect')
def handle_disconnect():
    logger.info(f"Client disconnected: {request.sid}")

@socketio.on('subscribe_events')
def handle_subscribe_events():
    """Subscribe to real-time event updates"""
    logger.info(f"Client {request.sid} subscribed to events")
    emit('events_update', [event.to_dict() for event in disaster_events])

@socketio.on('subscribe_predictions')
def handle_subscribe_predictions():
    """Subscribe to real-time prediction updates"""
    logger.info(f"Client {request.sid} subscribed to predictions")
    emit('predictions_update', [pred.to_dict() for pred in predictions])

@socketio.on('subscribe_weather')
def handle_subscribe_weather():
    """Subscribe to real-time weather updates"""
    logger.info(f"Client {request.sid} subscribed to weather")
    emit('weather_update', [weather.to_dict() for weather in weather_data_cache])

@socketio.on('subscribe_disasters')
def handle_subscribe_disasters():
    """Subscribe to real-time FEMA disaster updates"""
    logger.info(f"Client {request.sid} subscribed to disasters")
    emit('disasters_update', fema_disasters)

@socketio.on('subscribe_eonet')
def handle_subscribe_eonet():
    """Subscribe to real-time NASA EONET event updates"""
    logger.info(f"Client {request.sid} subscribed to eonet")
    emit('eonet_update', eonet_events)

@app.route('/api/disasters')
def get_disasters():
    """Get recent FEMA disaster declarations (cached)"""
    return jsonify(fema_disasters)

@app.route('/api/disasters/state/<state_code>')
def get_disasters_by_state(state_code: str):
    """Filter cached FEMA declarations by state code (e.g., CA, TX)"""
    state = state_code.upper()
    return jsonify([d for d in fema_disasters if d.get('state') == state])

@app.route('/api/eonet')
def get_eonet_events():
    """Get recent NASA EONET events (cached)"""
    return jsonify(eonet_events)

@app.route('/api/eonet/category/<category>')
def get_eonet_by_category(category: str):
    """Filter cached EONET events by category id or title (case-insensitive)"""
    cat = category.lower()
    def has_cat(ev: dict) -> bool:
        cats = ev.get('categories', [])
        for c in cats:
            cid = str(c.get('id', '')).lower()
            title = str(c.get('title', '')).lower()
            if cid == cat or title == cat:
                return True
        return False
    return jsonify([e for e in eonet_events if has_cat(e)])

def background_task():
    """Background task to fetch real-time weather data and make AI predictions"""
    while True:
        try:
            # Fetch weather data
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            weather_data = loop.run_until_complete(fetch_weather_data())
            # Also fetch recent FEMA disaster declarations
            try:
                recent_decls = loop.run_until_complete(openfema_service.fetch_recent_disasters(days=14, top=200))
            except Exception as fe:
                logger.error(f"OpenFEMA fetch error: {fe}")
                recent_decls = []
            # Also fetch EONET events
            try:
                recent_eonet = loop.run_until_complete(eonet_service.fetch_events(status='open', limit=200, days=14))
            except Exception as ne:
                logger.error(f"EONET fetch error: {ne}")
                recent_eonet = []
            loop.close()
            
            if weather_data:
                global weather_data_cache
                weather_data_cache = weather_data
                
                # Create sensor data from weather
                new_sensors = []
                for weather in weather_data:
                    sensor_types = ['temperature', 'humidity', 'pressure', 'wind', 'precipitation']
                    for sensor_type in sensor_types:
                        sensor = create_sensor_from_weather(weather, sensor_type)
                        new_sensors.append(sensor)
                
                # Update sensor data
                global sensor_data
                sensor_data = new_sensors
                
                # Analyze for disasters
                disaster_predictions = analyze_weather_for_disasters(weather_data)
                
                # Create new predictions if significant risks detected
                for pred_data in disaster_predictions:
                    if pred_data['risk_score'] > 0.1:  # Lower threshold to capture more realistic risks
                        # Optional Gemini narrative
                        narrative = generate_prediction_summary(
                            pred_data['disaster_type'],
                            pred_data['location'],
                            pred_data['weather_data'],
                            float(pred_data['risk_score'])
                        )

                        prediction = Prediction(
                            prediction_id=f"ai_pred_{len(predictions) + 1}",
                            event_type=pred_data['disaster_type'],
                            location=pred_data['location'],
                            probability=pred_data['risk_score'],
                            severity=pred_data['severity'],
                            timeframe='24h',
                            coordinates=pred_data['coordinates'],
                            weather_data=pred_data['weather_data'],
                            ai_model='PyTorch + Gemini' if narrative else 'PyTorch Neural Network'
                        )
                        if narrative:
                            prediction.potential_impact = narrative
                        predictions.append(prediction)
                        socketio.emit('new_prediction', prediction.to_dict())
                
                # Emit weather updates
                socketio.emit('weather_update', [weather.to_dict() for weather in weather_data])
                socketio.emit('sensor_update', [sensor.to_dict() for sensor in new_sensors])
                
                logger.info(f"Updated weather data for {len(weather_data)} locations")

            # Update FEMA cache and emit updates
            if recent_decls:
                global fema_disasters
                # Convert to dicts
                fetched = [d.to_dict() for d in recent_decls]
                # Deduplicate by id
                known_ids = {d.get('id') for d in fema_disasters}
                new_items = [d for d in fetched if d.get('id') not in known_ids]
                if new_items:
                    fema_disasters = fetched  # keep latest snapshot
                    # Emit bulk update and individual new items
                    socketio.emit('disasters_update', fema_disasters)
                    for item in new_items:
                        socketio.emit('new_disaster', item)
                    logger.info(f"FEMA: {len(new_items)} new declarations; total cached {len(fema_disasters)}")

            # Update EONET cache and emit updates
            if recent_eonet:
                global eonet_events
                eonet_fetched = [e.to_dict() for e in recent_eonet]
                eonet_known_ids = {e.get('id') for e in eonet_events}
                eonet_new = [e for e in eonet_fetched if e.get('id') not in eonet_known_ids]
                if eonet_new:
                    eonet_events = eonet_fetched
                    socketio.emit('eonet_update', eonet_events)
                    for ev in eonet_new:
                        socketio.emit('new_eonet_event', ev)
                    logger.info(f"EONET: {len(eonet_new)} new events; total cached {len(eonet_events)}")
        
        except Exception as e:
            logger.error(f"Error in background task: {e}")
        
        time.sleep(300)  # Update every 5 minutes

if __name__ == '__main__':
    # Only run heavy startup tasks once (avoid double-run with reloader)
    run_main = os.environ.get('WERKZEUG_RUN_MAIN') == 'true'
    if not app.debug or run_main:
        # Train AI models on startup
        try:
            logger.info("Training AI models...")
            ai_prediction_service.train_models(epochs=30)  # Quick training for demo
            logger.info("AI models trained successfully")
        except Exception as e:
            logger.error(f"Error training AI models: {e}")

        # Start background task
        background_thread = threading.Thread(target=background_task, daemon=True)
        background_thread.start()

    logger.info("Starting DisastroScope Flask API with Real Weather Data & AI Predictions...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
