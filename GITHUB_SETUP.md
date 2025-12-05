# 🔧 GitHub Gist Integration Setup

Follow these steps to enable cloud storage via GitHub Gists!

## Step 1: Create a GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `Immortal Stories`
   - **Homepage URL**: `http://localhost:8081` (for development)
   - **Authorization callback URL**: `http://localhost:8081/auth/callback`
4. Click **"Register application"**
5. You'll get a **Client ID** - copy this!
6. Click **"Generate a new client secret"** - copy this too!

## Step 2: Configure Your App

1. Create a `.env` file in your project root:
```bash
cp .env.example .env
```

2. Add your credentials to `.env`:
```env
EXPO_PUBLIC_GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
EXPO_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:8081/auth/callback
```

## Step 3: Update for Production

When deploying to production:

1. Update your GitHub OAuth App:
   - **Homepage URL**: `https://yourdomain.com`
   - **Callback URL**: `https://yourdomain.com/auth/callback`

2. Update `.env`:
```env
EXPO_PUBLIC_GITHUB_REDIRECT_URI=https://yourdomain.com/auth/callback
```

## Security Note: Client Secret

⚠️ **Important**: Never expose your `GITHUB_CLIENT_SECRET` in client-side code!

### For Production, Use a Serverless Function:

**Option A: Netlify Function**
```javascript
// netlify/functions/github-auth.js
exports.handler = async (event) => {
  const { code } = JSON.parse(event.body);
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });
  
  const data = await response.json();
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
```

**Option B: Vercel Function**
```javascript
// api/github-auth.js
export default async function handler(req, res) {
  const { code } = req.body;
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
    }),
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
```

## How It Works

### User Flow:
1. User clicks "Login with GitHub"
2. Redirected to GitHub authorization page
3. User approves (only needs `gist` permission)
4. GitHub redirects back with a `code`
5. Exchange code for access token
6. Store token securely in localStorage
7. Use token to create/read/update Gists

### Storage Structure:
```
GitHub Account
└── Gists (Private by default)
    ├── Character1_ActionWorld.json
    ├── Character2_FantasyWorld.json
    └── Character3_SciFiWorld.json
```

### Each Gist Contains:
```json
{
  "world": "action",
  "characterName": "Aragorn",
  "origin": "Gondor",
  "backstory": "...",
  "entries": [...],
  "lastUpdated": "2025-12-05T20:30:00.000Z"
}
```

## Benefits

✅ **Free Unlimited Storage** - GitHub Gists are free forever
✅ **Version Control** - Every save creates a new version
✅ **Shareable** - Make public to share with friends
✅ **Accessible** - Access from any device
✅ **Secure** - Private by default
✅ **No Database** - Zero infrastructure costs!

## API Limits

GitHub API limits:
- **Authenticated**: 5,000 requests/hour
- **Per user**: More than enough for normal usage
- **Gist size**: 100MB per file (way more than needed)

## Testing

1. Start your dev server: `npm start`
2. Click "Login with GitHub" button
3. Authorize the app
4. Create a story
5. Check your GitHub Gists: https://gist.github.com/

You should see your story saved as a private Gist! 🎉

## Troubleshooting

**"redirect_uri_mismatch" error**:
- Make sure callback URL in GitHub OAuth App matches exactly
- Check for trailing slashes

**"Bad credentials" error**:
- Verify your Client ID and Secret are correct
- Make sure token is being sent in Authorization header

**Stories not syncing**:
- Check browser console for errors
- Verify you're logged in (check localStorage for `github_access_token`)
- Check GitHub API rate limits

## Next Steps

Once working:
1. Add "Sync Now" button in UI
2. Show sync status (synced/syncing/error)
3. Add conflict resolution for multi-device edits
4. Implement auto-sync on story changes
