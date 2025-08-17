#!/usr/bin/env python3
"""
Test script to verify weather API integration and AI predictions
"""

import asyncio
import requests
import json
from datetime import datetime

def test_backend_health():
    """Test if the backend is running"""
    try:
        response = requests.get('http://localhost:5000/api/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend is running!")
            print(f"   - Events: {data.get('events_count', 0)}")
            print(f"   - Predictions: {data.get('predictions_count', 0)}")
            print(f"   - Sensors: {data.get('sensors_count', 0)}")
            print(f"   - Weather Locations: {data.get('weather_locations', 0)}")
            print(f"   - AI Models: {data.get('ai_models_loaded', 0)}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_weather_api():
    """Test weather API endpoints"""
    try:
        # Test weather data endpoint
        response = requests.get('http://localhost:5000/api/weather', timeout=10)
        if response.status_code == 200:
            weather_data = response.json()
            print(f"✅ Weather API working! Found {len(weather_data)} locations")
            
            if weather_data:
                # Show sample weather data
                sample = weather_data[0]
                print(f"   Sample location: {sample.get('location', 'Unknown')}")
                print(f"   Temperature: {sample.get('temperature', 'N/A')}°C")
                print(f"   Humidity: {sample.get('humidity', 'N/A')}%")
                print(f"   Weather: {sample.get('weather_condition', 'N/A')}")
            return True
        else:
            print(f"❌ Weather API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Weather API error: {e}")
        return False

def test_ai_prediction():
    """Test AI prediction endpoint"""
    try:
        # Test AI prediction for New York
        prediction_data = {
            "lat": 40.7128,
            "lon": -74.0060,
            "location_name": "New York"
        }
        
        response = requests.post(
            'http://localhost:5000/api/ai/predict',
            json=prediction_data,
            timeout=10
        )
        
        if response.status_code == 200:
            prediction = response.json()
            print("✅ AI Prediction working!")
            print(f"   Location: {prediction.get('location', 'Unknown')}")
            
            predictions = prediction.get('predictions', {})
            for disaster_type, risk in predictions.items():
                print(f"   {disaster_type.replace('_', ' ').title()}: {(risk * 100):.1f}%")
            return True
        else:
            print(f"❌ AI Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ AI Prediction error: {e}")
        return False

def test_stats():
    """Test statistics endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/stats', timeout=5)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Statistics API working!")
            print(f"   Total Events: {stats.get('total_events', 0)}")
            print(f"   Active Events: {stats.get('active_events', 0)}")
            print(f"   High Probability Predictions: {stats.get('high_probability_predictions', 0)}")
            print(f"   Weather Locations Monitored: {stats.get('weather_locations_monitored', 0)}")
            print(f"   AI Models Active: {stats.get('ai_models_active', 0)}")
            return True
        else:
            print(f"❌ Stats API failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Stats API error: {e}")
        return False

def main():
    """Run all tests"""
    print("🌪️  DisastroScope Weather Integration Test")
    print("=" * 50)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test backend health
    if not test_backend_health():
        print("\n❌ Backend is not running. Please start it with: python backend/app.py")
        return
    
    print()
    
    # Test weather API
    test_weather_api()
    print()
    
    # Test AI predictions
    test_ai_prediction()
    print()
    
    # Test statistics
    test_stats()
    print()
    
    print("🎉 All tests completed!")
    print("\n📱 Your app should now be running at: http://localhost:3000")
    print("🔧 Backend API at: http://localhost:5000")
    print("\n✨ Features available:")
    print("   - Real-time weather data from 10 major cities")
    print("   - AI-powered disaster predictions")
    print("   - Live weather dashboard")
    print("   - Real-time updates via WebSocket")

if __name__ == "__main__":
    main()
