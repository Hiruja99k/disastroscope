# Backend Endpoints Needed for Full Location-Based Risk Analysis

## Current Status ✅
Your backend already has:
- `/api/health` - Health check endpoint
- `/api/ai/predict` - AI prediction endpoint (expects `latitude`, `longitude`)

## Missing Endpoints ❌
To make the location-based risk analysis fully functional, you need to add these endpoints to your `disastroscope-backend/app.py`:

### 1. Weather Endpoint for Coordinates
```python
@app.route('/api/weather/current')
@rate_limit
def get_weather_by_coords():
    """Get weather data for coordinates"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if not lat or not lon:
            return jsonify({'error': 'Missing lat/lon parameters'}), 400
            
        # You can integrate with OpenWeatherMap API here
        # For now, return mock data
        weather_data = {
            'temperature': random.uniform(15, 35),
            'humidity': random.uniform(30, 90),
            'pressure': random.uniform(1000, 1020),
            'wind_speed': random.uniform(0, 25),
            'precipitation': random.uniform(0, 50),
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
        
        return jsonify(weather_data)
        
    except Exception as e:
        logger.error(f"Error getting weather by coordinates: {e}")
        return jsonify({"error": "Failed to get weather data"}), 500
```

### 2. Location Analysis Endpoint
```python
@app.route('/api/location/analyze/coords', methods=['POST'])
@rate_limit
def analyze_location_by_coords():
    """Analyze location by coordinates"""
    try:
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Missing lat/lon parameters'}), 400
            
        # You can integrate with elevation APIs, soil data, etc.
        # For now, return mock data
        location_data = {
            'elevation': random.uniform(0, 2000),
            'soil_type': random.choice(['Loamy', 'Sandy', 'Clay', 'Rocky']),
            'land_use': random.choice(['Urban', 'Rural', 'Forest', 'Agricultural']),
            'historical_events': 'Sample historical data',
            'population_density': random.uniform(10, 1000)
        }
        
        return jsonify(location_data)
        
    except Exception as e:
        logger.error(f"Error analyzing location: {e}")
        return jsonify({"error": "Failed to analyze location"}), 500
```

### 3. Geocoding Endpoint
```python
@app.route('/api/geocode')
@rate_limit
def geocode_location():
    """Geocode a location query"""
    try:
        query = request.args.get('query')
        limit = request.args.get('limit', 5, type=int)
        
        if not query:
            return jsonify({'error': 'Missing query parameter'}), 400
            
        # You can integrate with OpenCage, Google Maps, or other geocoding services
        # For now, return mock data
        geocode_results = [
            {
                'name': query,
                'lat': random.uniform(-90, 90),
                'lon': random.uniform(-180, 180),
                'country': 'Sample Country',
                'state': 'Sample State'
            }
        ]
        
        return jsonify(geocode_results[:limit])
        
    except Exception as e:
        logger.error(f"Error geocoding location: {e}")
        return jsonify({"error": "Failed to geocode location"}), 500
```

## Implementation Priority

### High Priority (Core Functionality)
1. **Weather endpoint** - Provides real environmental data for risk assessment
2. **Location analysis** - Gives terrain and historical context

### Medium Priority (Enhanced Features)
3. **Geocoding** - Allows users to search by city names instead of coordinates

## Current Workaround
The frontend now uses mock data for missing endpoints, so it will work but won't show real weather or location data. The AI predictions from your backend will still work.

## Testing
After implementing these endpoints, test them with:
```bash
# Weather by coordinates
curl "https://your-railway-app.railway.app/api/weather/current?lat=40.7128&lon=-74.0060"

# Location analysis
curl -X POST "https://your-railway-app.railway.app/api/location/analyze/coords" \
  -H "Content-Type: application/json" \
  -d '{"lat":40.7128,"lon":-74.0060}'

# Geocoding
curl "https://your-railway-app.railway.app/api/geocode?query=New%20York&limit=1"
```

## Next Steps
1. Add these endpoints to your `disastroscope-backend/app.py`
2. Deploy to Railway
3. Test the endpoints
4. The frontend will automatically start using real data instead of mock data
