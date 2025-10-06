# Environment Variables Setup for Vercel

## Backend Environment Variables (Vercel Dashboard)

Set these environment variables in your Vercel backend deployment:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://anushaamar11nov2004_db_user:OPXK5hMtObOxLz3V@cluster0.bu4qtun.mongodb.net/campusmart?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
JWT_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
CLOUDINARY_CLOUD_NAME=dlqofzsll
CLOUDINARY_API_KEY=191843267855353
CLOUDINARY_API_SECRET=hq2ogptgNtN2CTETVV3WGx3RdkY
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=anushaamar11nov2004@gmail.com
EMAIL_PASS=beinghuman
FRONTEND_URL=https://campus-mart-frontend-chi.vercel.app
```

## Frontend Environment Variables (Vercel Dashboard)

Set this environment variable in your Vercel frontend deployment:

```
VITE_API_URL=https://campus-mart-eta.vercel.app/api
```

## Steps to Set Environment Variables on Vercel:

1. Go to your Vercel dashboard
2. Select your project (backend or frontend)
3. Go to Settings → Environment Variables
4. Add each variable with Name and Value
5. Set Environment to "Production"
6. Save and redeploy

## Important Notes:

- The backend CORS is now configured to accept your frontend URL
- Make sure FRONTEND_URL in backend matches your actual frontend deployment URL
- The frontend VITE_API_URL should point to your backend API endpoint with `/api` path
- After setting environment variables, trigger a new deployment for changes to take effect