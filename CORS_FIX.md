# URGENT: Update Vercel Environment Variables

## The Issue:
Your frontend URL has changed to:
`https://campus-mart-frontend-39lelgo9t-anushas-projects-1d5c268a.vercel.app`

But your backend CORS configuration doesn't recognize this URL pattern.

## Quick Fix:

### Option 1: Set Environment Variable on Vercel Backend
1. Go to https://vercel.com/dashboard
2. Select your backend project (`campus-mart-eta`)
3. Go to Settings → Environment Variables
4. Update or add:
   ```
   FRONTEND_URL=https://campus-mart-frontend-39lelgo9t-anushas-projects-1d5c268a.vercel.app
   ```
5. Redeploy the backend

### Option 2: Use Production Domain (Recommended)
1. In your frontend Vercel project settings
2. Go to Domains section
3. Add a custom domain or use the production URL (not preview URL)
4. Update the FRONTEND_URL environment variable to use the production URL

## Current CORS Configuration:
The backend now accepts:
- `localhost` URLs for development
- Any URL matching `https://campus-mart-frontend*.vercel.app`
- Any URL matching `https://campus-mart-frontend*-anushas-projects*.vercel.app`

## Test After Fix:
1. Wait 2-3 minutes for Vercel redeployment
2. Clear browser cache
3. Try logging in again
4. Check browser console for any remaining CORS errors

The backend has been updated with flexible CORS rules, but Vercel needs to redeploy with the new code.