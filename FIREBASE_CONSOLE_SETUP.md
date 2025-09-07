# Firebase Console Setup for DisastroScope (Free Tier)

## 🎯 Quick Setup Checklist

Your Firebase project `disastroscope-aa0c2` is ready! Since you're on the Firebase free tier, we'll configure authentication without Firestore. User data will be handled by your backend/Tinybird instead.

### 1. 🔐 Enable Authentication Methods

Go to [Firebase Console](https://console.firebase.google.com/project/disastroscope-aa0c2/authentication/providers)

#### Email/Password Authentication:
1. Click on "Email/Password"
2. Toggle "Enable" for the first option
3. Click "Save"

#### Google Sign-In:
1. Click on "Google"
2. Toggle "Enable"
3. Set your project support email
4. Click "Save"

#### Phone Authentication (Optional):
1. Click on "Phone"
2. Toggle "Enable"
3. Click "Save"

### 2. 🌐 Configure Authorized Domains

Go to [Authentication Settings](https://console.firebase.google.com/project/disastroscope-aa0c2/authentication/settings)

1. Scroll down to "Authorized domains"
2. Add these domains:
   - `localhost` (for development)
   - Your production domain (when you deploy)

### 3. 🗄️ Skip Firestore Database (Free Tier)

Since you're on the Firebase free tier, we'll skip Firestore and use your backend/Tinybird for data storage instead. This is actually better for your use case as it provides:

- ✅ Better real-time analytics
- ✅ More cost-effective for large datasets
- ✅ Better integration with your existing backend
- ✅ No Firestore limitations

### 4. 🔧 Optional: Set Up Tinybird for User Data

If you want to track user analytics and store user data, you can set up Tinybird:

1. Sign up at [Tinybird](https://www.tinybird.co/)
2. Create a new workspace
3. Add your Tinybird token to your `.env` file:
   ```env
   VITE_TINYBIRD_API_URL=https://api.tinybird.co
   VITE_TINYBIRD_TOKEN=your_tinybird_token_here
   ```
4. Use the provided `tinybirdService.ts` for user data management

## 🚀 Test Your Setup

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the auth page:**
   ```
   http://localhost:5173/auth
   ```

3. **Test each authentication method:**
   - ✅ Email/Password registration
   - ✅ Email/Password sign-in
   - ✅ Google Sign-In
   - ✅ Phone authentication (if enabled)

## 🎉 You're All Set!

Your Firebase Authentication is now fully configured and ready to use. The authentication system will:

- ✅ Create user accounts
- ✅ Handle email verification
- ✅ Provide persistent login sessions
- ✅ Protect your application routes
- ✅ Work with your backend/Tinybird for user data (optional)

## 🔧 Troubleshooting

### Common Issues:

1. **"Unauthorized domain" error:**
   - Make sure `localhost` is added to authorized domains

2. **Google Sign-In not working:**
   - Check that Google provider is enabled
   - Verify the project support email is set

3. **Phone authentication issues:**
   - Ensure phone provider is enabled
   - Check that reCAPTCHA is working

4. **User data not persisting:**
   - Check that Tinybird is configured (if using)
   - Verify your backend is handling user data
   - Check browser console for any errors

### Need Help?

- Check the browser console for detailed error messages
- Review the [Firebase Documentation](https://firebase.google.com/docs/auth)
- Ensure all environment variables are set correctly

Happy coding! 🚀
