# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your DisastroScope application.

## Prerequisites

1. Firebase project created in the [Firebase Console](https://console.firebase.google.com/)
2. Firebase SDK already installed (`npm install firebase`)

## Step 1: Get Firebase Configuration

1. Go to your Firebase project in the [Firebase Console](https://console.firebase.google.com/)
2. Click on the gear icon (⚙️) and select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app, click "Add app" and select the web icon (</>)
5. Register your app with a nickname (e.g., "DisastroScope Web")
6. Copy the Firebase configuration object

## Step 2: Configure Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Optional: Use Firebase emulators in development
VITE_USE_FIREBASE_EMULATORS=false
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 3: Enable Authentication Methods

In your Firebase Console:

1. Go to "Authentication" in the left sidebar
2. Click on "Sign-in method" tab
3. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and configure your project support email
   - **Phone**: Click on it and toggle "Enable" (requires additional setup for production)

## Step 4: Configure Authentication Settings

### Email/Password Authentication
- No additional configuration needed for basic setup
- For production, consider enabling email verification

### Google Sign-In
1. In the Google provider settings, add your domain to "Authorized domains"
2. For local development, add `localhost` to authorized domains
3. For production, add your actual domain

### Phone Authentication
1. Enable phone authentication in Firebase Console
2. For production, you'll need to:
   - Set up reCAPTCHA Enterprise (recommended)
   - Or configure App Check for additional security
   - Add your domain to authorized domains

## Step 5: Set Up Firestore Database (Optional)

If you want to store additional user data:

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location for your database

The authentication system will automatically create user documents in Firestore when users sign up.

## Step 6: Configure Security Rules

### Firestore Security Rules
Update your Firestore rules to allow authenticated users to read/write their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules (if using Firebase Storage)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Step 7: Test the Implementation

1. Start your development server: `npm run dev`
2. Navigate to `/auth` to test the authentication page
3. Try signing up with email/password
4. Test Google Sign-In
5. Test phone authentication (if enabled)

## Production Considerations

### Domain Configuration
- Add your production domain to Firebase authorized domains
- Update CORS settings if needed
- Configure custom domain for authentication (optional)

### Security
- Enable App Check for additional security
- Set up proper Firestore security rules
- Consider implementing rate limiting
- Enable email verification for production

### Monitoring
- Set up Firebase Analytics (optional)
- Monitor authentication events in Firebase Console
- Set up alerts for suspicious activity

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check that all environment variables are set correctly
   - Ensure the Firebase project ID matches

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - For local development, ensure `localhost` is added

3. **"Firebase: Error (auth/invalid-api-key)"**
   - Verify the API key in your environment variables
   - Check that the API key is from the correct Firebase project

4. **Phone authentication not working**
   - Ensure reCAPTCHA is properly configured
   - Check that the phone number format includes country code
   - Verify that phone authentication is enabled in Firebase Console

### Getting Help

- Check the [Firebase Documentation](https://firebase.google.com/docs/auth)
- Review the [Firebase Auth Web SDK Reference](https://firebase.google.com/docs/reference/js/auth)
- Check the browser console for detailed error messages

## Features Included

This implementation includes:

✅ **Email/Password Authentication**
- User registration with email verification
- Secure password requirements
- Password reset functionality

✅ **Google Sign-In**
- One-click Google authentication
- Automatic user profile creation

✅ **Phone Authentication**
- SMS OTP verification
- International phone number support
- reCAPTCHA integration

✅ **User Management**
- Profile updates
- Password changes
- Account deletion
- Persistent login sessions

✅ **Security Features**
- Protected routes
- Automatic redirects
- Form validation
- Error handling
- Loading states

✅ **Professional UI/UX**
- Modern, responsive design
- Tailwind CSS styling
- shadcn/ui components
- Smooth animations
- Mobile-friendly interface
