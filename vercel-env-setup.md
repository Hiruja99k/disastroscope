# Vercel Environment Variables Setup

To fix the backend connection issues, you need to set the following environment variables in your Vercel deployment:

## Required Environment Variables

1. **VITE_API_BASE_URL**: `https://web-production-47673.up.railway.app`
2. **VITE_SOCKET_URL**: `https://web-production-47673.up.railway.app`

## How to Set Environment Variables in Vercel

### Option 1: Vercel Dashboard
1. Go to your Vercel dashboard
2. Select your DisastroScope project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `VITE_API_BASE_URL` = `https://web-production-47673.up.railway.app`
   - `VITE_SOCKET_URL` = `https://web-production-47673.up.railway.app`

### Option 2: Vercel CLI
```bash
vercel env add VITE_API_BASE_URL
# Enter: https://web-production-47673.up.railway.app

vercel env add VITE_SOCKET_URL
# Enter: https://web-production-47673.up.railway.app
```

### Option 3: vercel.json (Alternative)
You can also add these to your `vercel.json` file:

```json
{
  "env": {
    "VITE_API_BASE_URL": "https://web-production-47673.up.railway.app",
    "VITE_SOCKET_URL": "https://web-production-47673.up.railway.app"
  }
}
```

## After Setting Environment Variables

1. **Redeploy your Vercel app** - Environment variables require a new deployment to take effect
2. **Clear browser cache** - Your browser might be caching the old localhost URLs
3. **Test the connection** - The app should now connect to your Railway backend

## Verification

Your backend is working correctly at:
- Health: https://web-production-47673.up.railway.app/health
- Events: https://web-production-47673.up.railway.app/api/events
- Predictions: https://web-production-47673.up.railway.app/api/predictions
- Global Risk Analysis: https://web-production-47673.up.railway.app/api/global-risk-analysis
- Weather: https://web-production-47673.up.railway.app/api/weather/current

## Troubleshooting

If you're still seeing connection issues:

1. **Check browser console** for any CORS or network errors
2. **Verify environment variables** are set correctly in Vercel
3. **Ensure you've redeployed** after setting the environment variables
4. **Check if your Vercel domain** is in the CORS allowed origins (currently set to `*`)

The backend is configured to allow all origins (`*`), so CORS should not be an issue.
