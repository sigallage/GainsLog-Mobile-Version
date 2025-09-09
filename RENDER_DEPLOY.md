# Render.com Deployment Instructions

## Quick Deploy to Render.com

### 1. Push to GitHub (if not already done)
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy on Render.com
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: "GainsLog-Mobile-Version"
5. Configure:
   - **Name**: `gainslog-backend`
   - **Root Directory**: `Back-End`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Add Environment Variables
In Render dashboard, add these environment variables:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `NODE_ENV`: `production`
- `JWT_SECRET`: Your JWT secret
- `RAPIDAPI_KEY`: Your RapidAPI key (if using)
- `HUGGINGFACE_API_KEY`: Your Hugging Face key (if using)
- `YOUR_API_KEY`: Your Google API key (if using)

### 4. Your App Will Be Available At:
`https://gainslog-backend.onrender.com`

### 5. Update Frontend Configuration
Update `Front-End/.env`:
```env
VITE_API_URL=https://gainslog-backend.onrender.com
```

### 6. Rebuild APK
```bash
cd Front-End
npm run build
npx cap copy android
npx cap sync android
cd android
./gradlew assembleDebug
```

Your APK will now work for anyone, anywhere! 🎉
