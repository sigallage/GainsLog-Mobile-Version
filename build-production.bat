@echo off
REM Production Build Script for GainsLog (Windows)

echo 🚀 Building GainsLog for Production...

REM Step 1: Build Frontend
echo 📦 Building frontend...
cd Front-End
call npm run build

REM Step 2: Copy to Capacitor
echo 📱 Updating mobile app...
call npx cap copy android
call npx cap sync android

REM Step 3: Build APK
echo 🔨 Building APK...
cd android
call gradlew.bat assembleDebug

echo ✅ Production build complete!
echo 📱 APK location: Front-End\android\app\build\outputs\apk\debug\app-debug.apk
echo 🌐 Make sure your backend is deployed and VITE_API_URL is updated!
pause
