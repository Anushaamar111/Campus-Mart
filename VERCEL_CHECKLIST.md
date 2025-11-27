# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checklist

### Files Created
- [x] `vercel.json` - Vercel configuration
- [x] `.vercelignore` - Files to ignore during build
- [x] `api/index.js` - Serverless function entry point
- [x] `.env.production` - Production environment template
- [x] `client/.env.production` - Frontend production config
- [x] `DEPLOYMENT.md` - Complete deployment guide

### Code Updates
- [x] Server exports app for serverless
- [x] Database connection pooling for serverless
- [x] API URLs updated for production
- [x] Socket.io configured with fallback transports
- [x] Build scripts added to package.json
- [x] Vite config optimized for production

## 📋 Deployment Steps

### 1. Prepare MongoDB Atlas
```
□ Login to MongoDB Atlas
□ Create cluster (if not exists)
□ Add database user
□ Whitelist IP: 0.0.0.0/0 (for Vercel)
□ Get connection string
```

### 2. Push to GitHub
```bash
git init
git add .
git commit -m "Ready for Vercel deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/campus-connect.git
git push -u origin main
```

### 3. Deploy on Vercel
```
□ Go to vercel.com and login
□ Click "Add New Project"
□ Import your GitHub repository
□ Vercel auto-detects configuration
□ Click "Deploy"
```

### 4. Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Required Variables:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campusconnect
JWT_SECRET=your_secure_random_string_minimum_32_chars
NODE_ENV=production
CLIENT_URL=https://your-project.vercel.app
```

**Optional Variables:**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```

### 5. Redeploy After Setting Variables
```
□ Go to Deployments tab
□ Click "..." on latest deployment
□ Click "Redeploy"
□ Wait for completion
```

## 🧪 Post-Deployment Testing

### Test Endpoints
```
□ Visit: https://your-app.vercel.app
□ Test: https://your-app.vercel.app/api/health
□ Register with .edu or .ac.in email
□ Login and browse products
□ Create a product (Seller mode)
□ Place a bid (Buyer mode)
□ Test saved items
□ Check analytics dashboard
```

### Common Issues & Solutions

#### Build Fails
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure environment variables are set

#### API 404 Errors
```
□ Verify VITE_API_URL=/api in client/.env.production
□ Check vercel.json routes configuration
□ Ensure api/index.js exists
```

#### Database Connection Failed
```
□ Verify MONGODB_URI is correct
□ Check MongoDB Atlas whitelist includes 0.0.0.0/0
□ Test connection string locally first
```

#### Socket.io Not Working
```
Note: Socket.io has limitations on Vercel serverless
□ Check browser console for errors
□ Verify fallback to polling transport
□ Consider alternative hosting for real-time (Railway, Render)
```

## 🔧 Maintenance

### Update Production
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push

# Vercel auto-deploys!
```

### Environment Variables Updates
```
□ Update in Vercel Dashboard
□ Redeploy to apply changes
```

### Monitor Performance
```
□ Check Vercel Analytics
□ Monitor MongoDB Atlas metrics
□ Review Vercel Functions logs
```

## 🎯 Production URLs

After deployment, save these:
- **Frontend**: https://your-project.vercel.app
- **API**: https://your-project.vercel.app/api
- **Health**: https://your-project.vercel.app/api/health

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **GitHub Issues**: Open an issue in your repo

---

## ✨ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ /api/health returns {"status":"ok"}
- ✅ Can register with educational email
- ✅ Can login and see dashboard
- ✅ Products load correctly
- ✅ Can create and bid on products

## 🚨 Important Notes

1. **Free Tier Limits**:
   - Vercel: 100GB bandwidth/month
   - MongoDB Atlas: 512MB storage
   - Suitable for development and small-scale production

2. **Socket.io Limitation**:
   - Real-time bidding may not work perfectly on Vercel
   - Consider Railway or Render for full Socket.io support

3. **Environment Variables**:
   - Never commit .env files to Git
   - Always set in Vercel Dashboard
   - Update CLIENT_URL after first deploy

4. **Custom Domain** (Optional):
   - Add in Vercel Dashboard → Domains
   - Update DNS records
   - Update CLIENT_URL environment variable

---

**Ready to deploy? Follow the steps above!** 🚀
