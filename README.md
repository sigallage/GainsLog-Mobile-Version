# GainsLog Mobile Application

A cross-platform fitness tracking application built with React + Vite and Capacitor, featuring AI-powered workout and recipe generation.

## Features

- 📱 **Cross-Platform**: Works on Web, Android, and iOS
- 🏋️ **Workout Tracking**: Log and track your workouts
- 🤖 **AI Integration**: Generate personalized workouts and recipes
- 📊 **Progress Monitoring**: View workout history and progress
- 🔐 **Authentication**: Secure login with Auth0
- 🌐 **Dynamic Network Detection**: Automatically adapts to your network

## Quick Setup for Developers

### Prerequisites

- **Node.js** (v16 or higher)
- **Android Studio** (for Android development)
- **MongoDB Atlas Account** (free tier available)
- **Auth0 Account** (free tier available)

### 1. Clone and Install

```bash
git clone https://github.com/your-username/GainsLog-Mobile-Version.git
cd GainsLog-Mobile-Version

# Install backend dependencies
cd Back-End
npm install

# Install frontend dependencies
cd ../Front-End
npm install
```

### 2. Configure Environment Variables

#### Backend Configuration (`Back-End/.env`):
```env
MONGO_URI=your-mongodb-connection-string
PORT=3000
JWT_SECRET=your-jwt-secret
# Add your API keys for AI features
RAPIDAPI_KEY=your-rapidapi-key
HUGGINGFACE_API_KEY=your-huggingface-key
YOUR_API_KEY=your-google-api-key
```

#### Frontend Configuration (`Front-End/.env`):
```env
# Leave empty for auto-detection, or set manually
VITE_API_URL=

# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-auth0-domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_CLIENT_SECRET=your-auth0-client-secret
VITE_AUTH0_AUDIENCE=your-auth0-audience
VITE_AUTH0_ISSUER_BASE_URL=your-auth0-issuer-url
```

### 3. Start Development Servers

#### Backend Server:
```bash
cd Back-End
node server.js
```
The server will start on `http://localhost:3000` and automatically detect your network IP.

#### Frontend Development:
```bash
cd Front-End
npm run dev
```
The web app will start on `http://localhost:5173`.

### 4. Build Mobile App

#### For Android:
```bash
cd Front-End
npm run build
npx cap copy android
npx cap sync android
npx cap open android
```

Then in Android Studio:
- Build → Build Bundle(s) / APK(s) → Build APK(s)
- Find your APK in: `android/app/build/outputs/apk/debug/`

#### For iOS:
```bash
cd Front-End
npm run build
npx cap copy ios
npx cap sync ios
npx cap open ios
```

## Network Configuration

### Automatic Detection
The app automatically detects your network configuration:

- **Web Browser**: Uses `localhost:3000`
- **Android Emulator**: Uses `localhost:3000` with adb port forwarding
- **Physical Device**: Auto-detects your computer's WiFi IP address

### Manual Override
If auto-detection doesn't work, set the API URL manually in `Front-End/.env`:

```env
# For your specific network
VITE_API_URL=http://192.168.1.100:3000

# Or for different port
VITE_API_URL=http://localhost:8080
```

### For Android Emulator
Run this command to set up port forwarding:
```bash
adb forward tcp:3000 tcp:3000
```

## Common IP Address Ranges

If you need to find your computer's IP address:

**Windows:**
```cmd
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

**Common private IP ranges:**
- `192.168.1.x` (most home routers)
- `192.168.0.x` (some home routers)
- `10.0.0.x` (corporate networks)
- `172.16.x.x` (some networks)

## Troubleshooting

### Backend Server Issues
1. **Port already in use**: Change `PORT` in `Back-End/.env`
2. **MongoDB connection failed**: Check your `MONGO_URI`
3. **Firewall blocking**: Add firewall exception for Node.js

### Mobile App Connection Issues
1. **Can't connect**: Ensure phone and computer are on same WiFi
2. **Different network**: Update `VITE_API_URL` in `.env`
3. **Android emulator**: Use adb port forwarding

### Build Issues
1. **Gradle sync failed**: Open Android Studio and sync manually
2. **Capacitor errors**: Run `npx cap doctor` for diagnostics
3. **Node modules**: Delete `node_modules` and run `npm install`

## Project Structure

```
GainsLog-Mobile-Version/
├── Back-End/                 # Node.js/Express API
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   └── server.js           # Main server file
├── Front-End/               # React + Vite app
│   ├── src/                # Source code
│   ├── android/            # Android Capacitor project
│   └── public/             # Static assets
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Ensure all environment variables are set correctly
3. Verify your network configuration
4. Check that all dependencies are installed

For more help, please open an issue on GitHub.
