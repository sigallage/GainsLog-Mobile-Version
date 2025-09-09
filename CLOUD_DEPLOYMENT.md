# GainsLog - Cloud Deployment Guide

## Quick Cloud Deployment for Public APK Distribution

### Option 1: Render.com (Free Tier - Recommended)

#### Step 1: Prepare Backend for Cloud
1. **Create render.yaml** in your project root:
```yaml
services:
  - type: web
    name: gainslog-backend
    env: node
    buildCommand: cd Back-End && npm install
    startCommand: cd Back-End && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

2. **Update server.js** for cloud deployment:
```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server accessible at: http://0.0.0.0:${PORT}`);
});
```

#### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create new "Web Service"
4. Settings:
   - **Build Command**: `cd Back-End && npm install`
   - **Start Command**: `cd Back-End && npm start`
   - **Environment**: Add your MongoDB URI and other secrets

#### Step 3: Update Frontend
1. Update `Front-End/.env`:
```env
VITE_API_URL=https://your-app-name.onrender.com
```

2. Rebuild APK:
```bash
npm run build
npx cap copy android
npx cap sync android
cd android && ./gradlew assembleDebug
```

---

### Option 2: Railway.app (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub
3. Set environment variables
4. Get your deployed URL
5. Update frontend `.env` with the Railway URL

---

### Option 3: Netlify Functions (Serverless)

1. Install Netlify CLI: `npm i -g netlify-cli`
2. Create `netlify/functions` folder
3. Convert your Express routes to Netlify functions
4. Deploy: `netlify deploy --prod`

---

## Database Options

### MongoDB Atlas (Free Tier - 512MB)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update backend `.env`

### Alternative: Supabase (PostgreSQL)
1. Go to [supabase.com](https://supabase.com)
2. Create free project
3. Use Supabase client in backend
4. 500MB free storage

---

## Final APK Configuration

After deploying backend, your final `.env` should look like:

```env
# Production API URL
VITE_API_URL=https://your-backend.onrender.com

# Auth0 Configuration (keep existing)
VITE_AUTH0_DOMAIN=dev-o87gtr0hl6pu381w.us.auth0.com
VITE_AUTH0_CLIENT_ID=xqrbTdmsTw4g7TfTVZVC5KGqPuq7sFrk
# ... other Auth0 settings
```

## Benefits of Cloud Deployment

✅ **Universal Access**: Anyone can use your APK anywhere  
✅ **Always Online**: 24/7 availability  
✅ **Professional**: Looks better for LinkedIn showcase  
✅ **Scalable**: Can handle multiple users  
✅ **Free**: Most platforms offer generous free tiers  

## LinkedIn Post Template

```
🚀 Introducing GainsLog - Your AI-Powered Fitness Companion!

📱 Download the APK: [link]
🌐 Try the web version: [deployed-frontend-url]
🛠️ Tech Stack: React + Capacitor + Node.js + MongoDB + AI

Features:
✅ AI Workout Generation
✅ AI Recipe Suggestions  
✅ Workout Tracking
✅ Progress Analytics
✅ Cross-platform (Web + Mobile)

#ReactNative #Capacitor #AI #Fitness #MobileApp #WebDev
```

---

## Quick Start Checklist

- [ ] Choose cloud platform (Render recommended)
- [ ] Set up MongoDB Atlas
- [ ] Deploy backend
- [ ] Update frontend API URL
- [ ] Rebuild APK
- [ ] Test with friends
- [ ] Share on LinkedIn! 🎉
