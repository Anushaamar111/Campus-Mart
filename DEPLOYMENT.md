# CampusConnect - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- MongoDB Atlas database

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/campus-connect.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. **Go to [Vercel](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import your GitHub repository**
4. Vercel will auto-detect the configuration

### Step 3: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/campusconnect
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Step 4: Deploy
- Click **"Deploy"**
- Wait 2-3 minutes for build to complete
- Your app will be live!

## 📋 Environment Variables Reference

### Backend (.env in root)
```env
MONGODB_URI=          # MongoDB connection string
JWT_SECRET=           # Secret key for JWT tokens
PORT=5000            # Server port (auto-set by Vercel)
NODE_ENV=production  # Environment mode
CLIENT_URL=          # Frontend URL (your Vercel URL)
```

### Frontend (client/.env.production)
```env
VITE_API_URL=/api    # API endpoint (relative path for Vercel)
```

## 🔧 Project Structure for Vercel

```
campus-connect/
├── api/
│   └── index.js              # Vercel serverless entry
├── server/
│   ├── index.js              # Express app (exported)
│   ├── models/
│   ├── routes/
│   └── ...
├── client/
│   ├── dist/                 # Build output
│   ├── src/
│   └── vite.config.js        # Build configuration
├── vercel.json               # Vercel configuration
└── package.json              # Root dependencies
```

## ✅ What's Configured

- ✅ Serverless backend on `/api/*` routes
- ✅ Static frontend on all other routes
- ✅ Automatic HTTPS
- ✅ MongoDB connection pooling
- ✅ CORS configured for production
- ✅ Environment variables support
- ✅ Build optimizations (code splitting, minification)

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Verify MongoDB connection string is correct
- Ensure JWT_SECRET is set in Vercel env vars

### API Not Working
- Check Vercel logs: Dashboard → Deployments → [Your Deployment] → Functions
- Verify environment variables are set
- Check that API routes start with `/api/`

### Socket.io Issues
- Note: Socket.io may have limitations on Vercel's serverless
- Consider using Vercel's Edge Functions or Railway/Render for real-time features

## 🔄 Redeploy

After making changes:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel auto-deploys on every push to main branch!

## 📱 Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` in environment variables

## 💡 Tips

- Use Vercel's preview deployments for testing branches
- Enable "Automatically expose System Environment Variables" in Vercel
- Monitor usage in Vercel dashboard (free tier: 100GB bandwidth, serverless execution time)
- Consider upgrading to Vercel Pro for production apps with high traffic

## 🚨 Important Notes

1. **Socket.io Real-time Features**: May need alternative hosting (Railway, Render) for full Socket.io support
2. **MongoDB Atlas**: Ensure IP whitelist includes `0.0.0.0/0` for Vercel
3. **Cold Starts**: First request after inactivity may be slower (serverless limitation)
4. **File Uploads**: Use Cloudinary/AWS S3 (no local file storage on Vercel)

## 📊 Alternative Deployment Options

If Socket.io is critical:
- **Railway.app** - Full Node.js support, easy deployment
- **Render.com** - Free tier with persistent connections
- **Fly.io** - Global edge deployment
- **DigitalOcean App Platform** - Simple PaaS

---

Need help? Check [Vercel Docs](https://vercel.com/docs) or open an issue!
