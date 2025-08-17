# DisastroScope Architecture

This document illustrates the end-to-end request flow, key components, and the real-time update pipeline used by DisastroScope.

## Component Overview

```mermaid
flowchart LR
  subgraph Frontend [Frontend (React + TypeScript)]
    UI[Pages & Components]\n(Landing, Predictions, Dashboard)
    Hooks[Hooks]\n(useDisasterEvents, usePredictions, useSensorData, useStats)
    API[ApiService]\n(REST + Socket.IO client)
  end

  subgraph Backend [Backend (Flask + Socket.IO + PyTorch)]
    FLASK[Flask App]\n(app.py: REST endpoints)
    SIO[Socket.IO Server]\n(real-time events)
    WEATHER[WeatherService]\n(async OpenWeather + cache)
    AI[AI Models]\n(PyTorch models + scalers)
    STORE[In-Memory Stores]\n(events, predictions, sensors, weather_cache)
    BG[Background Scheduler]\n(thread: fetch -> analyze -> broadcast)
  end

  subgraph External [External Services]
    OWM[OpenWeatherMap API]
    MAPBOX[Mapbox]
  end

  UI <--> Hooks
  Hooks <--> API
  API <--> FLASK
  API <-.-> SIO
  FLASK <--> WEATHER
  FLASK <--> AI
  FLASK <--> STORE
  BG --> WEATHER
  BG --> AI
  BG --> STORE
  BG --> SIO
  UI --> MAPBOX
  WEATHER --> OWM
```

## Sequence: On-demand AI Prediction (POST /api/ai/predict)

```mermaid
sequenceDiagram
  participant FE as Frontend (ApiService)
  participant BE as Flask (app.py)
  participant WS as WeatherService
  participant AI as AI Models (PyTorch)
  participant ST as In-Memory Store

  FE->>BE: POST /api/ai/predict { lat, lon, location_name }
  BE->>WS: get_current_weather(lat, lon)
  WS->>OWM: fetch current weather
  OWM-->>WS: weather JSON
  WS-->>BE: WeatherData
  BE->>AI: predict_disaster_risks(weather)
  AI-->>BE: { flood, wildfire, storm } risks
  BE->>ST: (optional) append prediction
  BE-->>FE: { location, coords, weather, predictions }
  BE-)FE: (optional) Socket.IO new_prediction event
```

## Sequence: Background Scheduler (Real-time updates)

```mermaid
sequenceDiagram
  participant BG as Background Thread
  participant WS as WeatherService
  participant AI as AI Models
  participant ST as In-Memory Store
  participant SIO as Socket.IO Server

  loop every 5 minutes
    BG->>WS: fetch_multiple_locations_weather()
    WS->>OWM: concurrent requests for monitored cities
    OWM-->>WS: weather data (list)
    WS-->>BG: WeatherData[]
    BG->>ST: update weather_data_cache
    BG->>ST: derive SensorData[] (temp/humidity/pressure/wind/precip)
    BG->>AI: analyze_weather_for_disasters(weather[])
    AI-->>BG: list of risk assessments
    BG->>ST: append significant predictions (>0.5)
    BG->>SIO: emit weather_update (WeatherData[])
    BG->>SIO: emit sensor_update (SensorData[])
    alt high risk detected
      BG->>SIO: emit new_prediction (Prediction)
    end
  end
```

## Socket.IO Events

Server (backend/app.py)
- connect, disconnect
- subscribe_events -> emits events_update
- subscribe_predictions -> emits predictions_update
- subscribe_weather -> emits weather_update
- new_event: emitted when POST /api/events creates an event
- new_prediction: emitted by background scheduler and POST /api/predictions
- sensor_update: emitted by background scheduler
- weather_update: emitted by background scheduler

Client (src/services/api.ts)
- Subscribes to: new_event, new_prediction, sensor_update, weather_update, events_update, predictions_update
- Exposes: subscribeToEvents(), subscribeToPredictions(), subscribeToWeather()

Hooks (src/hooks/useFlaskData.ts)
- useDisasterEvents: subscribes to new_event + events_update
- usePredictions: subscribes to new_prediction + predictions_update
- useSensorData: subscribes to sensor_update
- useStats: periodic /api/stats polling every 30s

## Data Flow Summary
- REST: CRUD for events/predictions/sensors, AI predict, stats, health, and weather endpoints.
- WebSockets: push weather/sensors/predictions for real-time UX.
- Background thread: runs every 5 minutes to fetch weather, update stores, run AI, and broadcast.

## Configuration & Keys
- Backend: set OPENWEATHER_API_KEY (environment variable)
- Frontend: set MAPBOX_ACCESS_TOKEN (e.g., in .env for Vite)

## Notes
- Persistence is currently in-memory; integrate a DB for durability.
- The background scheduler is started in app.py (__main__). Adjust interval in background_task if needed.
- To receive weather pushes on the client, call apiService.subscribeToWeather() in a page or a global effect.
