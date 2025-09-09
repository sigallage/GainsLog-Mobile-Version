#!/bin/bash
# Production Build Script for GainsLog

echo "🚀 Building GainsLog for Production..."

# Step 1: Build Frontend
echo "📦 Building frontend..."
cd Front-End
npm run build

# Step 2: Copy to Capacitor
echo "📱 Updating mobile app..."
npx cap copy android
npx cap sync android

# Step 3: Build APK
echo "🔨 Building APK..."
cd android
./gradlew assembleDebug

echo "✅ Production build complete!"
echo "📱 APK location: Front-End/android/app/build/outputs/apk/debug/app-debug.apk"
echo "🌐 Make sure your backend is deployed and VITE_API_URL is updated!"
