# DisastroScope Configuration Guide

## Real Weather Data Setup

✅ **API Key Configured!** You have your OpenWeatherMap API key ready.

To get real-time weather data and accurate AI disaster predictions, you need to configure the environment variables.

### 1. ✅ API Key Ready

Your OpenWeatherMap API key is configured: `074ac01e6f3f5892c09dffcb01cdd1d4`
- Free tier includes 1000 calls/day (sufficient for testing)
- Real-time weather data access enabled

### 2. Configure Environment Variables

I've created `env_config.txt` for you. **Rename it to `.env`**:

```bash
# In your backend directory, run:
mv env_config.txt .env
```

Or manually create `.env` with this content:

```bash
# Required for real weather data
OPENWEATHER_API_KEY=074ac01e6f3f5892c09dffcb01cdd1d4

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=true
SECRET_KEY=disastroscope-secret-key-2024
```

### 3. Restart the Backend

After setting the API key, restart your backend server:

```bash
cd backend
python app.py
```

### 4. Verify Configuration

Check the health endpoint to confirm real weather data is working:

```bash
curl http://localhost:5000/api/health
```

You should see:
- `ai_models_loaded: 3`
- `weather_locations_monitored: 10`
- Real-time weather data being fetched

## Features Enabled with Real Weather Data

✅ **Automatic Location Detection** - Users can get disaster predictions for their current area
✅ **Real-time Weather Analysis** - AI models analyze actual weather conditions
✅ **Accurate Risk Assessment** - Predictions based on real meteorological data
✅ **Continuous Monitoring** - Background task updates every 5 minutes
✅ **Personalized Alerts** - Location-specific disaster warnings

## Troubleshooting

### No Weather Data
- Check if `.env` file exists and has correct API key
- Verify API key is valid and not expired
- Check backend logs for weather service errors

### Location Not Working
- Ensure browser location permissions are enabled
- Check if HTTPS is required (some browsers require secure context)
- Verify the geolocation hook is working

### AI Predictions Empty
- Confirm weather data is being fetched
- Check if AI models are trained (`/api/ai/train`)
- Verify background task is running

## Next Steps

With real weather data configured, your DisastroScope dashboard will:
1. Automatically detect user locations
2. Provide real-time disaster risk analysis
3. Show personalized predictions for each user's area
4. Continuously monitor weather conditions
5. Generate accurate AI-powered risk assessments
