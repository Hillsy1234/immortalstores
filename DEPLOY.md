# 🚀 Deployment Guide

## Deploy to Netlify (Easiest)

### Option 1: Drag & Drop (Fastest)

1. **Build your app:**
```bash
npm run build
```

2. **Deploy:**
   - Go to https://app.netlify.com/drop
   - Drag the `dist` folder
   - Get your live URL instantly!

### Option 2: GitHub Integration (Best for Updates)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "🎉 Initial commit - Immortal Stories"
git branch -M main
git remote add origin https://github.com/yourusername/immortal-stories.git
git push -u origin main
```

2. **Connect Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your repository
   - Settings auto-detected from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

3. **Your site is live!** 🎉
   - You'll get a URL like: `https://random-name-123.netlify.app`
   - You can customize this in Site settings

## Set Up GitHub OAuth (After Deploy)

### Step 1: Get Your Live URL

After deploying, you'll have a URL like:
```
https://your-site-name.netlify.app
```

### Step 2: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `Immortal Stories`
   - **Homepage URL**: `https://your-site-name.netlify.app`
   - **Callback URL**: `https://your-site-name.netlify.app/auth/callback`
4. Click "Register application"
5. Copy your **Client ID**
6. Generate and copy your **Client Secret**

### Step 3: Add Environment Variables to Netlify

1. In Netlify, go to: **Site settings → Environment variables**
2. Click "Add a variable"
3. Add these two variables:

```
EXPO_PUBLIC_GITHUB_CLIENT_ID = your_actual_client_id
GITHUB_CLIENT_SECRET = your_actual_client_secret
```

4. **Important:** Click "Save"

### Step 4: Redeploy

1. Go to **Deploys** tab
2. Click "Trigger deploy" → "Deploy site"
3. Wait for build to complete
4. Test GitHub login - it should work now! ✨

## Custom Domain (Optional)

### Add Your Own Domain

1. In Netlify: **Site settings → Domain management**
2. Click "Add custom domain"
3. Enter your domain (e.g., `immortalstories.com`)
4. Follow DNS setup instructions
5. Update GitHub OAuth App URLs to use your custom domain

## Continuous Deployment

Once connected to GitHub:
- Every `git push` automatically deploys
- Pull requests get preview deployments
- Rollback to any previous version anytime

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `EXPO_PUBLIC_GITHUB_CLIENT_ID` | For GitHub sync | Your GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | For GitHub sync | Your GitHub OAuth Client Secret |

## Troubleshooting

### Build Fails

Check the build log in Netlify. Common issues:
- Missing dependencies: Run `npm install` locally first
- Node version: We use Node 20 (set in `netlify.toml`)

### GitHub Login Doesn't Work

1. Check environment variables are set in Netlify
2. Verify GitHub OAuth callback URL matches your Netlify URL exactly
3. Redeploy after adding environment variables

### Site Works Locally But Not on Netlify

1. Make sure you ran `npm run build` successfully locally
2. Check browser console for errors
3. Verify all environment variables are set

## Performance Tips

Your site is already optimized:
- ✅ Static export (no server needed)
- ✅ Automatic CDN distribution
- ✅ HTTPS enabled by default
- ✅ Instant global deployment

## Cost

**Netlify Free Tier includes:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- HTTPS
- Continuous deployment

**Perfect for your app!** You won't need to pay anything. 🎉

## What Users Get

Once deployed:
- ✅ Access from any device
- ✅ Fast loading worldwide (CDN)
- ✅ HTTPS security
- ✅ GitHub cloud sync (if configured)
- ✅ localStorage backup
- ✅ No database needed!

## Next Steps After Deploy

1. Share your URL with friends
2. Add custom domain (optional)
3. Set up GitHub OAuth for cloud sync
4. Monitor usage in Netlify dashboard
5. Keep building features!

Your app is production-ready! 🚀
