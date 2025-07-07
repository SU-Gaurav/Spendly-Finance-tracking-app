# 🔧 Google OAuth Setup Instructions

## Step 1: Firebase Project Setup

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Create a new project** or select existing project
3. **Enable Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains

## Step 2: Get Firebase Configuration

1. Go to Project Settings → General tab
2. Scroll down to "Your apps" section
3. Add a web app if you haven't already
4. Copy the firebaseConfig object

## Step 3: Update Environment Variables

Replace the values in your `.env` file with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:xxxxxxxxxx
```

## Step 4: Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select your Firebase project**
3. **Enable Google+ API** (if required)
4. **Configure OAuth consent screen**:
   - Go to APIs & Services → OAuth consent screen
   - Add your app information
   - Add authorized domains

## Step 5: Add Authorized Domains

In Firebase Authentication settings, add these domains:
- `localhost` (for development)
- Your production domain

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Try the "Continue with Google" button
3. Check browser console for any errors

## Common Issues & Solutions

### Issue: "Popup blocked"
**Solution**: Allow popups for localhost in browser settings

### Issue: "Invalid domain"
**Solution**: Add your domain to Firebase authorized domains

### Issue: "API key not valid"
**Solution**: Check if you copied the correct API key from Firebase

### Issue: "Google+ API not enabled"
**Solution**: Enable Google+ API in Google Cloud Console

## Testing

The app now includes:
- ✅ Email/password authentication
- ✅ Google OAuth sign-in
- ✅ User state management
- ✅ Logout functionality
- ✅ Error handling
- ✅ Loading states
