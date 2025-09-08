# GainsLog Mobile - Cross-Platform Deployment Guide

## Quick Start

The app now automatically detects the environment and configures the correct API URL:

- **Android Emulator**: Automatically uses `10.0.2.2:5000`
- **Physical Device**: Automatically uses your WiFi IP address
- **Web Browser**: Uses `localhost:5000`

## Environment Setup

### 1. Backend Server
Start your backend server:
```bash
cd Back-End
npm install
npm start
```
The server will run on port 5000.

### 2. Get Your WiFi IP Address
Find your computer's WiFi IP address:

**Windows:**
```cmd
ipconfig
```
Look for "Wireless LAN adapter Wi-Fi" → "IPv4 Address"

**Mac/Linux:**
```bash
ifconfig | grep inet
```

### 3. Update Environment Configuration
Update your `.env` file in the Front-End directory:
```env
VITE_API_URL=http://YOUR_WIFI_IP:5000
```
Replace `YOUR_WIFI_IP` with the IP address you found (e.g., `http://172.27.0.174:5000`)

## Building and Deployment

### For Development (Web Browser)
```bash
cd Front-End
npm run dev
```

### For Android Emulator
1. Build the app:
```bash
cd Front-End
npm run build
npx cap sync
```

2. Open in Android Studio:
```bash
npx cap open android
```

3. Run in emulator - the app will automatically use `10.0.2.2:5000` to connect to your backend

### For Physical Device APK
1. Build the app:
```bash
cd Front-End
npm run build
npx cap sync
```

2. Build APK:
```bash
cd android
./gradlew assembleDebug
```

3. Install on device - the app will automatically use your WiFi IP address to connect to the backend

## How It Works

The app uses `/src/utils/apiConfig.js` to automatically detect the environment:

- **Environment Detection**: Checks if running on native platform vs web
- **Platform Detection**: Identifies Android emulator vs physical device
- **Automatic Configuration**: Sets the appropriate API URL without manual intervention

## Troubleshooting

### Backend Connection Issues
1. Ensure your computer and mobile device are on the same WiFi network
2. Check if Windows Firewall is blocking port 5000
3. Verify the backend server is running on `0.0.0.0:5000` (not just `localhost`)

### Android Emulator Issues
- If `10.0.2.2:5000` doesn't work, try `localhost:5000`
- Ensure the backend is running before starting the app

### Physical Device Issues
- Double-check your WiFi IP address
- Ensure both devices are on the same network
- Test the API URL in a mobile browser first: `http://YOUR_IP:5000`

## Network Configuration for Backend

Make sure your backend server (`Back-End/server.js`) is configured to accept connections from all interfaces:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

This allows connections from both emulator (`10.0.2.2`) and physical devices (WiFi IP).
