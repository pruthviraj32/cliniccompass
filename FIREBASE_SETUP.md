# 🔥 Firebase Setup Guide for ClinicCompass

This guide will help you set up Firebase for the ClinicCompass project.

---

## 📋 Table of Contents
1. [Create Firebase Project](#1-create-firebase-project)
2. [Enable Authentication](#2-enable-authentication)
3. [Create Firestore Database](#3-create-firestore-database)
4. [Set Up Security Rules](#4-set-up-security-rules)
5. [Get Firebase Config](#5-get-firebase-config)
6. [Add to .env File](#6-add-to-env-file)

---

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `cliniccompass` (or your choice)
4. Disable Google Analytics (optional - not needed for this app)
5. Click **"Create project"**
6. Wait for project creation to complete

---

## 2. Enable Authentication

1. In Firebase Console, click **"Build"** in left sidebar
2. Click **"Authentication"**
3. Click **"Get started"**
4. Go to **"Sign-in method"** tab
5. Click on **"Email/Password"**
6. Toggle **"Enable"** to ON
7. Click **"Save"**

✅ Email/Password authentication is now enabled!

---

## 3. Create Firestore Database

1. Click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add secure rules next)
4. Choose your database location (closest to your users):
   - US: `us-central1`
   - Europe: `europe-west1`
   - Asia: `asia-southeast1`
5. Click **"Enable"**
6. Wait for database creation (~30 seconds)

✅ Firestore database is now created!

---

## 4. Set Up Security Rules

### Step 1: Go to Rules Tab
1. In **Firestore Database**, click the **"Rules"** tab (top of page)
2. You'll see the default test rules

### Step 2: Replace with Secure Rules
1. **Delete all existing rules**
2. **Copy and paste these secure rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Medications Collection
    match /medications/{medicationId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // Hospital Visits Collection
    match /hospital_visits/{visitId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && 
                               request.auth.uid == resource.data.userId;
    }
    
    // User Profiles (optional)
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Symptom Checks History (optional)
    match /symptom_checks/{checkId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
    
    // Chat History (optional)
    match /chat_history/{chatId} {
      allow read: if request.auth != null && 
                     request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Step 3: Publish Rules
1. Click **"Publish"** button (top right corner)
2. Wait for success message: "Rules published successfully"

✅ Your Firestore is now secured!

### What These Rules Do:
- ✅ Only authenticated users can access data
- ✅ Users can only see their own medications and visits
- ✅ Users cannot access other people's health information
- ✅ Prevents unauthorized data access
- ✅ HIPAA-compliant security approach

---

## 5. Get Firebase Config

1. Click the **⚙️ (gear icon)** next to "Project Overview" (top left)
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. If no app exists:
   - Click the **Web icon** (`</>`)
   - App nickname: `cliniccompass-web`
   - Don't check "Firebase Hosting"
   - Click **"Register app"**
5. You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

6. **Copy all these values** (you'll need them next)

---

## 6. Add to .env File

1. Open the `.env` file in your project root
2. Replace the values with your Firebase config:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration (optional - demo mode available)
VITE_OPENAI_API_KEY=your_openai_key_here
```

3. Save the file
4. **NEVER commit `.env` to Git** (it's in `.gitignore`)

---

## ✅ Setup Complete!

Your Firebase is now fully configured! 🎉

### Test Your Setup:

1. Start your dev server:
```bash
npm run dev
```

2. Go to `http://localhost:5173`
3. Try signing up with a new account
4. Add a medication
5. Add a hospital visit
6. Check symptoms
7. Use the AI chatbot

Everything should work perfectly! 🚀

---

## 🔒 Security Notes

### Production Checklist:
- ✅ Firestore rules are secure (users can only access their own data)
- ✅ Authentication is enabled
- ✅ `.env` file is in `.gitignore`
- ✅ API keys are kept private
- ⚠️ Consider adding rate limiting for API calls
- ⚠️ Monitor Firebase usage in console

### Cost Management:
- Firebase Free Tier:
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day
  - 1 GB storage
- Should be sufficient for hundreds of users!

---

## 🆘 Troubleshooting

### "Missing or insufficient permissions" error:
- ✅ Make sure you published the Firestore rules
- ✅ Check that you're logged in
- ✅ Verify the rules in Firebase Console → Firestore → Rules tab

### "Authentication failed" error:
- ✅ Check that Email/Password auth is enabled
- ✅ Verify your `.env` file has correct Firebase config
- ✅ Restart your dev server after changing `.env`

### "Cannot find module 'firebase'" error:
- Run: `npm install`
- Restart dev server

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Pricing](https://firebase.google.com/pricing)

---

**Need help?** Check the [main README](./README.md) or [Setup Instructions](./SETUP_INSTRUCTIONS.md)

