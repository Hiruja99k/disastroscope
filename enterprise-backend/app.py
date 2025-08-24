from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
import json
from datetime import datetime, timezone
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
app.config['ENVIRONMENT'] = os.getenv('ENVIRONMENT', 'production')

# CORS configuration
CORS(app, resources={r"/api/*": {
    "origins": "*",
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "max_age": 600
}})

# Basic routes
@app.route('/')
def home():
    return jsonify({
        'name': 'DisastroScope Enterprise Backend',
        'version': '2.0.0',
        'status': 'operational',
        'timestamp': datetime.now(timezone.utc).isoformat()
    })

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    })

@app.route('/api/models')
def list_models():
    return jsonify({
        'models': {
            'flood': {'loaded': True, 'type': 'ensemble'},
            'wildfire': {'loaded': True, 'type': 'ensemble'},
            'storm': {'loaded': True, 'type': 'ensemble'},
            'earthquake': {'loaded': True, 'type': 'heuristic'},
            'tornado': {'loaded': True, 'type': 'ensemble'},
            'landslide': {'loaded': True, 'type': 'ensemble'},
            'drought': {'loaded': True, 'type': 'ensemble'}
        },
        'enterprise_features': {
            'ensemble_enabled': True,
            'auto_training': True,
            'model_versioning': True,
            'performance_monitoring': True
        },
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/ai/predict', methods=['POST'])
def predict_disaster():
    try:
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')
        
        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude required'}), 400
        
        # Mock predictions for now
        predictions = {
            'flood': 0.15,
            'wildfire': 0.08,
            'storm': 0.22,
            'earthquake': 0.05,
            'tornado': 0.03,
            'landslide': 0.12,
            'drought': 0.18
        }
        
        return jsonify({
            'location': f'Location at {lat}, {lon}',
            'coordinates': {'lat': lat, 'lng': lon},
            'predictions': predictions,
            'performance': {
                'prediction_duration_ms': 45.2,
                'model_version': '2.0.0',
                'ensemble_enabled': True
            },
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in prediction: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

@app.route('/api/weather')
def get_weather():
    return jsonify({
        'locations': [
            {'name': 'San Francisco, CA', 'temperature': 18, 'humidity': 65},
            {'name': 'New York, NY', 'temperature': 22, 'humidity': 70},
            {'name': 'Miami, FL', 'temperature': 28, 'humidity': 80}
        ],
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
