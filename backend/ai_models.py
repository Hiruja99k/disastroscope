import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Optional
import logging
from datetime import datetime, timedelta
import pickle
import os
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

logger = logging.getLogger(__name__)

# Conservative default for earthquake predictions unless explicitly enabled
EARTHQUAKE_RISK_MULTIPLIER: float = float(os.getenv('EARTHQUAKE_RISK_MULTIPLIER', '0.05'))
ALLOW_EARTHQUAKE_PREDICTIONS: bool = os.getenv('ALLOW_EARTHQUAKE_PREDICTIONS', 'false').lower() == 'true'

class DisasterPredictionModel(nn.Module):
    """Base neural network for disaster prediction"""
    
    def __init__(self, input_size: int, hidden_size: int = 128, num_classes: int = 1):
        super(DisasterPredictionModel, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size // 2)
        self.fc3 = nn.Linear(hidden_size // 2, hidden_size // 4)
        self.fc4 = nn.Linear(hidden_size // 4, num_classes)
        self.dropout = nn.Dropout(0.3)
        self.batch_norm1 = nn.BatchNorm1d(hidden_size)
        self.batch_norm2 = nn.BatchNorm1d(hidden_size // 2)
        self.batch_norm3 = nn.BatchNorm1d(hidden_size // 4)
    
    def forward(self, x):
        x = F.relu(self.batch_norm1(self.fc1(x)))
        x = self.dropout(x)
        x = F.relu(self.batch_norm2(self.fc2(x)))
        x = self.dropout(x)
        x = F.relu(self.batch_norm3(self.fc3(x)))
        x = torch.sigmoid(self.fc4(x))
        return x

class FloodPredictionModel(DisasterPredictionModel):
    """Specialized model for flood prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, pressure, wind_speed, precipitation, visibility, cloud_cover
        super().__init__(input_size=7, hidden_size=128, num_classes=1)
    
    def predict_flood_risk(self, weather_data: Dict) -> float:
        """Predict flood risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['pressure'],
            weather_data['wind_speed'],
            weather_data['precipitation'],
            weather_data['visibility'],
            weather_data['cloud_cover']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class WildfirePredictionModel(DisasterPredictionModel):
    """Specialized model for wildfire prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, wind_speed, precipitation, visibility
        super().__init__(input_size=5, hidden_size=128, num_classes=1)
    
    def predict_wildfire_risk(self, weather_data: Dict) -> float:
        """Predict wildfire risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['wind_speed'],
            weather_data['precipitation'],
            weather_data['visibility']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class StormPredictionModel(DisasterPredictionModel):
    """Specialized model for storm prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, pressure, wind_speed, wind_direction, cloud_cover
        super().__init__(input_size=6, hidden_size=128, num_classes=1)
    
    def predict_storm_risk(self, weather_data: Dict) -> float:
        """Predict storm risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['pressure'],
            weather_data['wind_speed'],
            weather_data['wind_direction'],
            weather_data['cloud_cover']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class EarthquakePredictionModel(DisasterPredictionModel):
    """Specialized model for earthquake prediction"""
    
    def __init__(self):
        # Input features: pressure, wind_speed, temperature, humidity, cloud_cover
        super().__init__(input_size=5, hidden_size=128, num_classes=1)
    
    def predict_earthquake_risk(self, weather_data: Dict) -> float:
        """Predict earthquake risk based on weather data"""
        features = torch.tensor([
            weather_data['pressure'],
            weather_data['wind_speed'],
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['cloud_cover']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class TornadoPredictionModel(DisasterPredictionModel):
    """Specialized model for tornado prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, pressure, wind_speed, wind_direction, cloud_cover
        super().__init__(input_size=6, hidden_size=128, num_classes=1)
    
    def predict_tornado_risk(self, weather_data: Dict) -> float:
        """Predict tornado risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['pressure'],
            weather_data['wind_speed'],
            weather_data['wind_direction'],
            weather_data['cloud_cover']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class LandslidePredictionModel(DisasterPredictionModel):
    """Specialized model for landslide prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, precipitation, wind_speed, pressure
        super().__init__(input_size=5, hidden_size=128, num_classes=1)
    
    def predict_landslide_risk(self, weather_data: Dict) -> float:
        """Predict landslide risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['precipitation'],
            weather_data['wind_speed'],
            weather_data['pressure']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class DroughtPredictionModel(DisasterPredictionModel):
    """Specialized model for drought prediction"""
    
    def __init__(self):
        # Input features: temperature, humidity, precipitation, wind_speed, pressure
        super().__init__(input_size=5, hidden_size=128, num_classes=1)
    
    def predict_drought_risk(self, weather_data: Dict) -> float:
        """Predict drought risk based on weather data"""
        features = torch.tensor([
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['precipitation'],
            weather_data['wind_speed'],
            weather_data['pressure']
        ], dtype=torch.float32).unsqueeze(0)
        
        with torch.no_grad():
            prediction = self.forward(features)
            return prediction.item()

class DisasterPredictionService:
    """Service for AI-based disaster prediction"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.model_path = "models"
        # Feature flags
        self.allow_earthquake_predictions = ALLOW_EARTHQUAKE_PREDICTIONS
        self.load_or_initialize_models()
    
    def load_or_initialize_models(self):
        """Load existing models or initialize new ones"""
        os.makedirs(self.model_path, exist_ok=True)
        
        # Initialize models
        self.models['flood'] = FloodPredictionModel()
        self.models['wildfire'] = WildfirePredictionModel()
        self.models['storm'] = StormPredictionModel()
        self.models['earthquake'] = EarthquakePredictionModel()
        self.models['tornado'] = TornadoPredictionModel()
        self.models['landslide'] = LandslidePredictionModel()
        self.models['drought'] = DroughtPredictionModel()
        
        # Load pre-trained models if they exist
        for disaster_type, model in self.models.items():
            model_file = os.path.join(self.model_path, f"{disaster_type}_model.pth")
            scaler_file = os.path.join(self.model_path, f"{disaster_type}_scaler.pkl")
            
            if os.path.exists(model_file):
                try:
                    model.load_state_dict(torch.load(model_file, map_location='cpu'))
                    model.eval()
                    logger.info(f"Loaded pre-trained {disaster_type} model")
                except Exception as e:
                    logger.error(f"Error loading {disaster_type} model: {e}")
            
            if os.path.exists(scaler_file):
                try:
                    with open(scaler_file, 'rb') as f:
                        self.scalers[disaster_type] = pickle.load(f)
                    logger.info(f"Loaded {disaster_type} scaler")
                except Exception as e:
                    logger.error(f"Error loading {disaster_type} scaler: {e}")
    
    def save_models(self):
        """Save trained models"""
        for disaster_type, model in self.models.items():
            model_file = os.path.join(self.model_path, f"{disaster_type}_model.pth")
            scaler_file = os.path.join(self.model_path, f"{disaster_type}_scaler.pkl")
            
            torch.save(model.state_dict(), model_file)
            if disaster_type in self.scalers:
                with open(scaler_file, 'wb') as f:
                    pickle.dump(self.scalers[disaster_type], f)
            
            logger.info(f"Saved {disaster_type} model and scaler")
    
    def generate_synthetic_training_data(self, num_samples: int = 10000) -> Dict[str, Tuple[np.ndarray, np.ndarray]]:
        """Generate synthetic training data for model training"""
        training_data = {}
        
        # Flood training data
        flood_features = []
        flood_labels = []
        for _ in range(num_samples):
            # Generate realistic weather data
            temp = np.random.uniform(-10, 40)
            humidity = np.random.uniform(20, 100)
            pressure = np.random.uniform(900, 1100)
            wind_speed = np.random.uniform(0, 50)
            precipitation = np.random.uniform(0, 100)
            visibility = np.random.uniform(0, 20)
            cloud_cover = np.random.uniform(0, 100)
            
            features = [temp, humidity, pressure, wind_speed, precipitation, visibility, cloud_cover]
            flood_features.append(features)
            
            # Calculate flood risk (high precipitation + low visibility + high humidity)
            flood_risk = min(1.0, (precipitation / 50) * (1 - visibility / 20) * (humidity / 100))
            flood_labels.append(flood_risk)
        
        training_data['flood'] = (np.array(flood_features), np.array(flood_labels))
        
        # Wildfire training data
        wildfire_features = []
        wildfire_labels = []
        for _ in range(num_samples):
            temp = np.random.uniform(10, 50)
            humidity = np.random.uniform(10, 80)
            wind_speed = np.random.uniform(0, 40)
            precipitation = np.random.uniform(0, 20)
            visibility = np.random.uniform(5, 25)
            
            features = [temp, humidity, wind_speed, precipitation, visibility]
            wildfire_features.append(features)
            
            # Calculate wildfire risk (high temp + low humidity + low precipitation)
            wildfire_risk = min(1.0, (temp / 50) * (1 - humidity / 100) * (1 - precipitation / 20))
            wildfire_labels.append(wildfire_risk)
        
        training_data['wildfire'] = (np.array(wildfire_features), np.array(wildfire_labels))
        
        # Storm training data
        storm_features = []
        storm_labels = []
        for _ in range(num_samples):
            temp = np.random.uniform(-20, 35)
            humidity = np.random.uniform(30, 100)
            pressure = np.random.uniform(850, 1050)
            wind_speed = np.random.uniform(0, 60)
            wind_direction = np.random.uniform(0, 360)
            cloud_cover = np.random.uniform(20, 100)
            
            features = [temp, humidity, pressure, wind_speed, wind_direction, cloud_cover]
            storm_features.append(features)
            
            # Calculate storm risk (high wind + low pressure + high humidity)
            storm_risk = min(1.0, (wind_speed / 60) * (1 - pressure / 1100) * (humidity / 100))
            storm_labels.append(storm_risk)
        
        training_data['storm'] = (np.array(storm_features), np.array(storm_labels))
        
        # Earthquake training data
        earthquake_features = []
        earthquake_labels = []
        for _ in range(num_samples):
            pressure = np.random.uniform(900, 1100)
            wind_speed = np.random.uniform(0, 30)
            temp = np.random.uniform(-10, 40)
            humidity = np.random.uniform(30, 100)
            cloud_cover = np.random.uniform(0, 100)
            
            features = [pressure, wind_speed, temp, humidity, cloud_cover]
            earthquake_features.append(features)
            
            # Calculate earthquake risk (low pressure + moderate wind + stable conditions)
            earthquake_risk = min(1.0, (1 - pressure / 1100) * (wind_speed / 30) * 0.3)
            earthquake_labels.append(earthquake_risk)
        
        training_data['earthquake'] = (np.array(earthquake_features), np.array(earthquake_labels))
        
        # Tornado training data
        tornado_features = []
        tornado_labels = []
        for _ in range(num_samples):
            temp = np.random.uniform(15, 35)
            humidity = np.random.uniform(40, 90)
            pressure = np.random.uniform(950, 1020)
            wind_speed = np.random.uniform(0, 50)
            wind_direction = np.random.uniform(0, 360)
            cloud_cover = np.random.uniform(60, 100)
            
            features = [temp, humidity, pressure, wind_speed, wind_direction, cloud_cover]
            tornado_features.append(features)
            
            # Calculate tornado risk (high wind + low pressure + high humidity)
            tornado_risk = min(1.0, (wind_speed / 50) * (1 - pressure / 1020) * (humidity / 90))
            tornado_labels.append(tornado_risk)
        
        training_data['tornado'] = (np.array(tornado_features), np.array(tornado_labels))
        
        # Landslide training data
        landslide_features = []
        landslide_labels = []
        for _ in range(num_samples):
            temp = np.random.uniform(-5, 35)
            humidity = np.random.uniform(50, 100)
            precipitation = np.random.uniform(0, 80)
            wind_speed = np.random.uniform(0, 25)
            pressure = np.random.uniform(950, 1050)
            
            features = [temp, humidity, precipitation, wind_speed, pressure]
            landslide_features.append(features)
            
            # Calculate landslide risk (high precipitation + moderate wind + stable temp)
            landslide_risk = min(1.0, (precipitation / 80) * (wind_speed / 25) * 0.7)
            landslide_labels.append(landslide_risk)
        
        training_data['landslide'] = (np.array(landslide_features), np.array(landslide_labels))
        
        # Drought training data
        drought_features = []
        drought_labels = []
        for _ in range(num_samples):
            temp = np.random.uniform(20, 45)
            humidity = np.random.uniform(10, 60)
            precipitation = np.random.uniform(0, 15)
            wind_speed = np.random.uniform(0, 20)
            pressure = np.random.uniform(980, 1030)
            
            features = [temp, humidity, precipitation, wind_speed, pressure]
            drought_features.append(features)
            
            # Calculate drought risk (high temp + low humidity + low precipitation)
            drought_risk = min(1.0, (temp / 45) * (1 - humidity / 60) * (1 - precipitation / 15))
            drought_labels.append(drought_risk)
        
        training_data['drought'] = (np.array(drought_features), np.array(drought_labels))
        
        return training_data
    
    def train_models(self, epochs: int = 100, batch_size: int = 32):
        """Train all disaster prediction models"""
        training_data = self.generate_synthetic_training_data()
        
        for disaster_type, (features, labels) in training_data.items():
            logger.info(f"Training {disaster_type} model...")
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                features, labels, test_size=0.2, random_state=42
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            self.scalers[disaster_type] = scaler
            
            # Convert to tensors
            X_train_tensor = torch.FloatTensor(X_train_scaled)
            y_train_tensor = torch.FloatTensor(y_train).unsqueeze(1)
            X_test_tensor = torch.FloatTensor(X_test_scaled)
            y_test_tensor = torch.FloatTensor(y_test).unsqueeze(1)
            
            # Training setup
            model = self.models[disaster_type]
            criterion = nn.BCELoss()
            optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
            
            # Training loop
            model.train()
            for epoch in range(epochs):
                optimizer.zero_grad()
                outputs = model(X_train_tensor)
                loss = criterion(outputs, y_train_tensor)
                loss.backward()
                optimizer.step()
                
                if (epoch + 1) % 20 == 0:
                    logger.info(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")
            
            # Evaluate
            model.eval()
            with torch.no_grad():
                test_outputs = model(X_test_tensor)
                test_loss = criterion(test_outputs, y_test_tensor)
                logger.info(f"{disaster_type} model test loss: {test_loss.item():.4f}")
        
        # Save trained models
        self.save_models()
        logger.info("All models trained and saved successfully")
    
    def predict_disaster_risks(self, weather_data: Dict) -> Dict[str, float]:
        """Predict risks for all disaster types"""
        predictions = {}
        
        # Scale weather data for each model
        for disaster_type, model in self.models.items():
            if disaster_type not in self.scalers:
                logger.warning(f"No scaler found for {disaster_type}, using raw data")
                continue
            
            # Prepare features based on disaster type
            if disaster_type == 'flood':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['pressure'],
                    weather_data['wind_speed'],
                    weather_data['precipitation'],
                    weather_data['visibility'],
                    weather_data['cloud_cover']
                ]
            elif disaster_type == 'wildfire':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['wind_speed'],
                    weather_data['precipitation'],
                    weather_data['visibility']
                ]
            elif disaster_type == 'storm':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['pressure'],
                    weather_data['wind_speed'],
                    weather_data['wind_direction'],
                    weather_data['cloud_cover']
                ]
            elif disaster_type == 'earthquake':
                features = [
                    weather_data['pressure'],
                    weather_data['wind_speed'],
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['cloud_cover']
                ]
            elif disaster_type == 'tornado':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['pressure'],
                    weather_data['wind_speed'],
                    weather_data['wind_direction'],
                    weather_data['cloud_cover']
                ]
            elif disaster_type == 'landslide':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['precipitation'],
                    weather_data['wind_speed'],
                    weather_data['pressure']
                ]
            elif disaster_type == 'drought':
                features = [
                    weather_data['temperature'],
                    weather_data['humidity'],
                    weather_data['precipitation'],
                    weather_data['wind_speed'],
                    weather_data['pressure']
                ]
            
            # Scale features
            features_scaled = self.scalers[disaster_type].transform([features])
            features_tensor = torch.FloatTensor(features_scaled)
            
            # Make prediction
            model.eval()
            with torch.no_grad():
                prediction = model(features_tensor)
                predictions[disaster_type] = prediction.item()
        
        # Clamp earthquake risk unless explicitly enabled via env
        if not self.allow_earthquake_predictions and 'earthquake' in predictions:
            try:
                predictions['earthquake'] = max(
                    0.0,
                    min(0.05, predictions['earthquake'] * EARTHQUAKE_RISK_MULTIPLIER)
                )
            except Exception:
                # On any error, degrade gracefully to near-zero
                predictions['earthquake'] = 0.0

        return predictions
    
    def get_disaster_severity(self, risk_score: float) -> str:
        """Convert risk score to severity level"""
        if risk_score < 0.2:
            return "low"
        elif risk_score < 0.4:
            return "medium"
        elif risk_score < 0.7:
            return "high"
        else:
            return "critical"

# Global AI prediction service instance
ai_prediction_service = DisasterPredictionService()
