# DisastroScope Backend with Real Weather Data & AI Predictions

This backend provides real-time weather data integration and AI-powered disaster prediction using PyTorch neural networks.

## Features

- **Real-time Weather Data**: Integration with OpenWeatherMap API for live weather data
- **AI Disaster Prediction**: PyTorch-based neural networks for predicting floods, wildfires, and storms
- **Real-time Updates**: WebSocket support for live data streaming
- **Multiple Locations**: Monitor weather data from 10 major cities
- **Weather Risk Analysis**: Automatic calculation of disaster risk factors

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
FLASK_SECRET_KEY=your_secret_key_here
```

### 3. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### 4. Run the Application

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Weather Data
- `GET /api/weather` - Get weather data for all monitored locations
- `GET /api/weather/<location>` - Get weather data for specific location

### AI Predictions
- `POST /api/ai/predict` - Get AI prediction for a location
- `POST /api/ai/train` - Train AI models

### Disaster Events
- `GET /api/events` - Get all disaster events
- `POST /api/events` - Create new disaster event

### Predictions
- `GET /api/predictions` - Get all predictions
- `POST /api/predictions` - Create new prediction

### Sensor Data
- `GET /api/sensors` - Get all sensor data
- `GET /api/sensors/<id>` - Get specific sensor data

### Statistics
- `GET /api/stats` - Get real-time statistics
- `GET /api/health` - Health check

## AI Models

The system includes three specialized neural networks:

1. **Flood Prediction Model**: Predicts flood risk based on precipitation, humidity, pressure, wind speed, visibility, and cloud cover
2. **Wildfire Prediction Model**: Predicts wildfire risk based on temperature, humidity, wind speed, precipitation, and visibility
3. **Storm Prediction Model**: Predicts storm risk based on temperature, humidity, pressure, wind speed, wind direction, and cloud cover

### Model Training

Models are automatically trained on startup with synthetic data. You can retrain them manually:

```bash
curl -X POST http://localhost:5000/api/ai/train
```

## Monitored Locations

The system monitors weather data from these major cities:
- San Francisco, CA
- Los Angeles, CA
- Miami, FL
- New York, NY
- Houston, TX
- Seattle, WA
- New Orleans, LA
- Portland, OR
- Chicago, IL
- Denver, CO

## Real-time Updates

The system provides real-time updates via WebSocket:
- Weather data updates every 5 minutes
- AI predictions when risk thresholds are exceeded
- Sensor data updates
- Disaster event notifications

## Data Flow

1. **Weather Data Collection**: Fetches real-time weather data from OpenWeatherMap API
2. **Risk Analysis**: Calculates weather-based risk factors
3. **AI Prediction**: Neural networks analyze weather patterns for disaster prediction
4. **Real-time Broadcasting**: Updates are sent to connected clients via WebSocket
5. **Data Storage**: Weather and prediction data is cached in memory

## Error Handling

- API rate limiting for weather data
- Graceful fallback for API failures
- Automatic retry mechanisms
- Comprehensive logging

## Performance

- Weather data caching (5-minute cache)
- Concurrent API requests
- Efficient neural network inference
- Optimized WebSocket broadcasting

## Security

- CORS configuration for frontend access
- Environment variable protection
- Input validation
- Rate limiting considerations

## Troubleshooting

### Common Issues

1. **Weather API Errors**: Check your API key and rate limits
2. **Model Loading Errors**: Ensure PyTorch is properly installed
3. **WebSocket Connection Issues**: Check CORS configuration
4. **Memory Issues**: Monitor cache size and model memory usage

### Logs

Check the console output for detailed logs about:
- Weather API requests
- AI model training and predictions
- WebSocket connections
- Error messages

## Development

### Adding New Locations

Edit the `MONITORED_LOCATIONS` list in `app.py`:

```python
MONITORED_LOCATIONS = [
    {'name': 'New City, State', 'coords': {'lat': latitude, 'lng': longitude}},
    # ... existing locations
]
```

### Customizing AI Models

Modify the neural network architectures in `ai_models.py`:

```python
class CustomDisasterModel(DisasterPredictionModel):
    def __init__(self):
        super().__init__(input_size=your_input_size, hidden_size=256, num_classes=1)
```

### Adding New Weather Parameters

Update the `WeatherData` class in `weather_service.py` and corresponding API calls.

## License

This project is licensed under the MIT License.
