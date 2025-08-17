# DisastroScope Deployment Guide

## Issue Description
After deploying to Vercel, location-based analysis and advanced analysis features are not working, showing errors:
- "Could not compute prediction for your location"
- "Location not found"

## Root Cause
The frontend is deployed on Vercel but the Flask backend is still configured to run on `localhost:5000`. Vercel doesn't support Python/Flask directly.

## Solution: Deploy Backend Separately

### Option 1: Railway (Recommended - Free Tier Available)

1. **Sign up for Railway** at [railway.app](https://railway.app)

2. **Connect your GitHub repository**

3. **Deploy the backend folder:**
   ```bash
   # In Railway dashboard, create new project
   # Select "Deploy from GitHub repo"
   # Choose the backend/ folder from your repository
   ```

4. **Set environment variables in Railway:**
   ```
   OPENWEATHER_API_KEY=your_actual_api_key
   GEMINI_API_KEY=your_actual_gemini_key
   ```

5. **Get your Railway URL** (e.g., `https://your-app.railway.app`)

6. **Update Vercel environment variables:**
   ```
   VITE_API_BASE_URL=https://your-app.railway.app
   VITE_SOCKET_URL=https://your-app.railway.app
   ```

### Option 2: Render (Free Tier Available)

1. **Sign up for Render** at [render.com](https://render.com)

2. **Create new Web Service**

3. **Connect your GitHub repository**

4. **Configure:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn --worker-class eventlet -w 1 app:app`
   - **Environment:** Python 3

5. **Set environment variables**

6. **Deploy and get your URL**

### Option 3: Heroku (Paid)

1. **Install Heroku CLI**
2. **Create new app**
3. **Deploy using the Procfile**

## Frontend Configuration

### Environment Variables

Create `.env.local` for development:
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

For production (Vercel), set these in Vercel dashboard:
```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_SOCKET_URL=https://your-backend-url.com
```

### Update API Service

The API service has been updated to use environment variables:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
```

## Testing

1. **Deploy backend to Railway/Render**
2. **Update Vercel environment variables**
3. **Redeploy frontend to Vercel**
4. **Test location-based analysis features**

## Common Issues

### CORS Errors
- Backend CORS has been updated to allow your Vercel domain
- Ensure your backend URL is in the allowed origins

### Socket.IO Issues
- Backend uses eventlet worker for WebSocket support
- Frontend automatically reconnects on connection loss

### Model Loading Issues
- Ensure all model files are in the backend/models/ directory
- Check file permissions on the hosting platform

## Monitoring

- Check Railway/Render logs for backend errors
- Check Vercel function logs for frontend issues
- Monitor API response times and success rates

## Cost Considerations

- **Railway:** Free tier includes 500 hours/month
- **Render:** Free tier available with sleep after inactivity
- **Heroku:** Basic dyno starts at $7/month

## Next Steps

1. Choose a backend hosting platform
2. Deploy the backend
3. Update Vercel environment variables
4. Test the application
5. Monitor performance and costs
