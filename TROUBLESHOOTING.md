# 🔧 Troubleshooting GitHub Login 404 Error

## Quick Fix Steps

### 1. **Restart the Dev Server**
The auth route might not be loaded yet. Stop and restart:

```bash
# Press Ctrl+C to stop
# Then restart:
npm start
```

### 2. **Check if .env File Exists**
```bash
# Make sure you have a .env file
ls -la .env

# If not, create it:
cp .env.example .env
```

### 3. **Verify GitHub OAuth App Settings**

Go to your GitHub OAuth App settings:
https://github.com/settings/developers

Make sure:
- **Homepage URL**: `http://localhost:8081`
- **Authorization callback URL**: `http://localhost:8081/auth/callback`

⚠️ **Important**: The callback URL must match EXACTLY (no trailing slash!)

### 4. **Test the Callback Route Manually**

Open this URL in your browser:
```
http://localhost:8081/auth/callback
```

**Expected**: You should see a page saying "No authorization code received" (this is good!)
**If 404**: The route isn't loading - see Step 5

### 5. **Verify File Structure**

Check that the auth folder exists:
```bash
ls -la app/auth/
```

You should see:
```
callback.tsx
```

### 6. **Clear Metro Cache**

Sometimes Metro bundler caches old routes:
```bash
# Stop the server (Ctrl+C)
# Clear cache and restart:
npx expo start --clear
```

## Common Issues

### Issue: "404 Not Found" on /auth/callback

**Cause**: Route not registered or dev server needs restart

**Solution**:
1. Stop dev server (Ctrl+C)
2. Run: `npx expo start --clear`
3. Press `w` to open web
4. Try login again

### Issue: "redirect_uri_mismatch" from GitHub

**Cause**: GitHub OAuth App callback URL doesn't match

**Solution**:
1. Go to https://github.com/settings/developers
2. Click your OAuth App
3. Set callback URL to: `http://localhost:8081/auth/callback`
4. Save changes
5. Try login again

### Issue: "GitHub OAuth credentials not configured"

**Cause**: Missing .env file or empty values

**Solution**:
1. Create `.env` file: `cp .env.example .env`
2. Add your GitHub Client ID:
   ```env
   EXPO_PUBLIC_GITHUB_CLIENT_ID=your_actual_client_id_here
   GITHUB_CLIENT_SECRET=your_actual_client_secret_here
   ```
3. Restart dev server
4. Try login again

### Issue: Alert says "GitHub OAuth not configured"

**Cause**: EXPO_PUBLIC_GITHUB_CLIENT_ID not set

**Solution**:
1. Make sure `.env` file exists
2. Check the variable name is exactly: `EXPO_PUBLIC_GITHUB_CLIENT_ID`
3. Restart dev server (environment variables only load on start)

## Testing Without GitHub (Temporary)

If you want to test the app without GitHub login:
1. Just skip the login button
2. Stories will save to localStorage only
3. Everything else works normally

## Manual Test of Auth Flow

1. **Test callback route**:
   ```
   http://localhost:8081/auth/callback
   ```
   Should show: "No authorization code received"

2. **Test with fake code**:
   ```
   http://localhost:8081/auth/callback?code=test123
   ```
   Should show: "Authentication failed" (this is expected!)

3. **If both work**: Auth route is working, issue is with GitHub OAuth setup

4. **If 404**: Route not loading, restart dev server with `--clear`

## Debug Mode

Add this to see what's happening:

1. Open browser console (F12)
2. Look for errors
3. Check Network tab for failed requests
4. Look for the redirect URL GitHub is using

## Still Not Working?

Try this complete reset:

```bash
# 1. Stop server
Ctrl+C

# 2. Clear everything
rm -rf node_modules/.cache
rm -rf .expo
rm -rf dist

# 3. Restart
npm start

# 4. Press 'w' for web
# 5. Try login again
```

## Alternative: Skip GitHub for Now

The app works perfectly without GitHub login:
- Stories save to localStorage
- Everything functions normally
- You can add GitHub later

Just click "Begin Your Adventure" and skip the GitHub login!

## Need More Help?

Check these files:
- `GITHUB_SETUP.md` - Complete setup guide
- `.env.example` - Environment variable template
- `app/auth/callback.tsx` - Auth callback code

The route should work after restarting the dev server! 🚀
