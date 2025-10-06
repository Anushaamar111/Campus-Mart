# Frontend Deployment Guide

## Quick Deploy to Vercel

1. **Connect GitHub Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your `Campus-Mart` repository
   - Select the `frontend` folder as the root directory

2. **Environment Variables**:
   Set this environment variable in Vercel dashboard:
   ```
   VITE_API_URL=https://campus-mart-eta.vercel.app/api
   ```

3. **Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Alternative Deployment (Netlify)

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Import from Git: Select your repository
   - Base directory: `frontend`

2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`

3. **Environment Variables**:
   ```
   VITE_API_URL=https://campus-mart-eta.vercel.app/api
   ```

## Local Development

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173` and connect to your deployed backend.

## Troubleshooting

- ✅ Build succeeds locally
- ✅ Environment variables configured
- ✅ Backend API URL is correct
- ✅ Vercel configuration added

If deployment fails, check:
1. Environment variables are set correctly
2. Build command is `npm run build`
3. Output directory is `dist`
4. Root directory is set to `frontend`