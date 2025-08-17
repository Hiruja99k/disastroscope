# DisastroScope - Real-Time Disaster Prediction Platform

A comprehensive disaster prediction and monitoring web application built with React, Flask, and real-time WebSocket communication.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI/UX**: Built with Tailwind CSS and shadcn/ui components
- **Real-time Animations**: Advanced Anime.js animations for engaging user experience
- **Interactive Maps**: Real-time disaster mapping with Mapbox integration
- **Responsive Design**: Works seamlessly across all devices
- **Real-time Updates**: WebSocket connections for live data updates

### Backend (Flask + Python)
- **RESTful API**: Complete CRUD operations for disaster data
- **Real-time Communication**: WebSocket support with Flask-SocketIO
- **Data Models**: Structured disaster events, predictions, and sensor data
- **Background Tasks**: Automated data generation and updates
- **CORS Support**: Cross-origin resource sharing enabled

## 🏗️ Architecture

```
disastroscope/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   └── assets/            # Static assets
├── backend/               # Flask backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend documentation
└── start-dev.bat         # Development startup script
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Anime.js** for animations
- **Socket.io-client** for real-time updates
- **Mapbox GL** for interactive maps
- **Framer Motion** for animations
- **React Query** for data fetching

### Backend
- **Flask** web framework
- **Flask-SocketIO** for WebSocket support
- **Flask-CORS** for cross-origin requests
- **Python 3.8+** runtime

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd disastroscope
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory (copy `.env.example`):
```env
OPENWEATHER_API_KEY=your_openweather_api_key_here
FLASK_SECRET_KEY=your_secret_key_here
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

To get your OpenWeatherMap API key:
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Copy your API key from the dashboard
4. Add it to the `.env` file above (used for worldwide geocoding and weather/forecast)

Note: The backend loads environment variables from a `.env` file in the backend working directory when running `python backend/app.py`. If you run the backend from `backend/`, place your `.env` inside `backend/`. An example is provided at `backend/.env.example`.

## 🚀 Development

### Quick Start (Windows)
```bash
start-dev.bat
```

### Manual Start

#### Start Flask Backend
```bash
cd backend
python app.py
```
Backend will be available at: http://localhost:5000

#### Start React Frontend
```bash
npm run dev
```
Frontend will be available at: http://localhost:8080

## 📡 API Endpoints

### Events
- `GET /api/events` - Get all disaster events
- `GET /api/events/<id>` - Get specific event
- `POST /api/events` - Create new event

### Predictions
- `GET /api/predictions` - Get all predictions
- `GET /api/predictions/<id>` - Get specific prediction
- `POST /api/predictions` - Create new prediction

### Sensors
- `GET /api/sensors` - Get all sensor data
- `GET /api/sensors/<id>` - Get specific sensor

### Statistics
- `GET /api/stats` - Get real-time statistics
- `GET /api/health` - Health check

## 🔌 WebSocket Events

### Client to Server
- `subscribe_events` - Subscribe to event updates
- `subscribe_predictions` - Subscribe to prediction updates

### Server to Client
- `connected` - Connection confirmation
- `new_event` - New disaster event
- `new_prediction` - New prediction
- `sensor_update` - Sensor data update
- `events_update` - All events update
- `predictions_update` - All predictions update

## 🎨 Frontend Features

### Real-time Dashboard
- Live disaster event monitoring
- Interactive maps with real-time markers
- Statistical overview with charts
- Real-time sensor data display

### Advanced Animations
- Entrance animations for all components
- Particle systems and floating elements
- Mouse-responsive interactions
- Smooth transitions and morphing effects

### Interactive Maps
- Real-time disaster event mapping
- Prediction visualization
- Sensor station locations
- Search and navigation features

## 🔧 Backend Features

### Data Models
- **DisasterEvent**: Complete disaster event tracking
- **Prediction**: AI-powered disaster predictions
- **SensorData**: Real-time sensor readings

### Real-time Updates
- WebSocket connections for live data
- Background task for data generation
- Automatic updates every 30 seconds

### API Features
- RESTful endpoints for all data types
- CORS support for frontend integration
- Error handling and validation
- Health monitoring

## 🚀 Production Deployment

### Frontend Build
```bash
npm run build
```

### Backend Deployment
```bash
cd backend
gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 app:app
```

## 🔮 Future Enhancements

### Backend
- Database integration (PostgreSQL/MongoDB)
- Authentication and authorization
- Machine learning prediction models
- Real sensor data integration
- Alert system
- Caching layer (Redis)
- Rate limiting
- API documentation (Swagger)

### Frontend
- User authentication
- Advanced filtering and search
- Data export functionality
- Mobile app (React Native)
- Offline support
- Advanced analytics dashboard
- Notification system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/backend/README.md`

---

**DisastroScope** - Protecting communities through advanced disaster intelligence.
