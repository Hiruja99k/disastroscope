#!/usr/bin/env python3
"""
DisastroScope Setup Script
Helps configure the weather API integration and AI models
"""

import os
import sys
import subprocess
import requests
from pathlib import Path

def print_banner():
    """Print setup banner"""
    print("=" * 60)
    print("🌪️  DisastroScope Weather API & AI Setup")
    print("=" * 60)
    print()

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")

def install_dependencies():
    """Install required dependencies"""
    print("📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        sys.exit(1)

def create_env_file():
    """Create .env file with user input"""
    print("\n🔧 Configuration Setup")
    print("-" * 30)
    
    # Check if .env already exists
    env_path = Path(".env")
    if env_path.exists():
        print("⚠️  .env file already exists")
        overwrite = input("Do you want to overwrite it? (y/N): ").lower()
        if overwrite != 'y':
            print("Skipping .env creation")
            return
    
    # Get OpenWeatherMap API key
    print("\n🌤️  OpenWeatherMap API Setup")
    print("1. Go to https://openweathermap.org/api")
    print("2. Sign up for a free account")
    print("3. Get your API key from the dashboard")
    print("4. Enter it below:")
    
    api_key = input("OpenWeatherMap API Key: ").strip()
    if not api_key:
        print("❌ API key is required")
        sys.exit(1)
    
    # Test API key
    print("🔍 Testing API key...")
    try:
        response = requests.get(
            "http://api.openweathermap.org/data/2.5/weather",
            params={
                "q": "London",
                "appid": api_key,
                "units": "metric"
            },
            timeout=10
        )
        if response.status_code == 200:
            print("✅ API key is valid")
        else:
            print("❌ Invalid API key")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Error testing API key: {e}")
        sys.exit(1)
    
    # Generate secret key
    import secrets
    secret_key = secrets.token_hex(32)
    
    # Create .env file
    env_content = f"""# DisastroScope Environment Configuration

# OpenWeatherMap API Key
OPENWEATHER_API_KEY={api_key}

# Flask Secret Key
FLASK_SECRET_KEY={secret_key}

# Flask Environment
FLASK_ENV=development

# Debug Mode
DEBUG=True

# Server Configuration
HOST=0.0.0.0
PORT=5000
"""
    
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("✅ .env file created successfully")

def test_installation():
    """Test the installation"""
    print("\n🧪 Testing Installation")
    print("-" * 25)
    
    try:
        # Test imports
        print("Testing imports...")
        import torch
        import flask
        import aiohttp
        print("✅ All imports successful")
        
        # Test AI models
        print("Testing AI models...")
        from ai_models import ai_prediction_service
        print("✅ AI models loaded successfully")
        
        # Test weather service
        print("Testing weather service...")
        from weather_service import weather_service
        print("✅ Weather service loaded successfully")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

def print_next_steps():
    """Print next steps for the user"""
    print("\n🎉 Setup Complete!")
    print("=" * 30)
    print("\nNext steps:")
    print("1. Start the backend server:")
    print("   python app.py")
    print("\n2. Start the frontend (in another terminal):")
    print("   npm run dev")
    print("\n3. Open your browser to:")
    print("   http://localhost:3000")
    print("\n4. The system will automatically:")
    print("   - Train AI models on startup")
    print("   - Fetch weather data every 5 minutes")
    print("   - Make disaster predictions")
    print("\n📚 For more information, see README.md")

def main():
    """Main setup function"""
    print_banner()
    
    # Check Python version
    check_python_version()
    
    # Install dependencies
    install_dependencies()
    
    # Create environment file
    create_env_file()
    
    # Test installation
    test_installation()
    
    # Print next steps
    print_next_steps()

if __name__ == "__main__":
    main()
