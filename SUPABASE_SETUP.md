# 🚀 Supabase Setup Guide

## Why Supabase?

- ✅ **Free forever** - 500MB database, 50,000 monthly active users
- ✅ **No credit card** required
- ✅ **Permanent storage** - Never lose data
- ✅ **Multi-device** - Access from anywhere
- ✅ **Real-time sync** - Updates instantly
- ✅ **Built-in auth** - Anonymous or email login

## Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (easiest) or email
4. Create a new project:
   - **Name**: `immortal-stories`
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
   - Click "Create new project"
5. Wait 2-3 minutes for setup

## Step 2: Create Database Table

1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Paste this SQL:

```sql
-- Create stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  world TEXT NOT NULL,
  origin TEXT NOT NULL,
  backstory TEXT NOT NULL,
  entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own stories
CREATE POLICY "Users can view own stories"
  ON stories FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own stories
CREATE POLICY "Users can insert own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own stories
CREATE POLICY "Users can update own stories"
  ON stories FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy: Users can delete their own stories
CREATE POLICY "Users can delete own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX stories_user_id_idx ON stories(user_id);
CREATE INDEX stories_updated_at_idx ON stories(updated_at DESC);
```

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 3: Get Your API Keys

1. Click **"Project Settings"** (gear icon, bottom left)
2. Click **"API"** in the left menu
3. Copy these two values:

   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 4: Add to Your App

1. Open your `.env` file
2. Add these lines:

```env
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace with your actual values from Step 3

## Step 5: Enable Anonymous Auth (Optional but Recommended)

This lets users save stories without creating an account!

1. In Supabase dashboard, go to **"Authentication"** → **"Providers"**
2. Scroll to **"Anonymous Sign-ins"**
3. Toggle it **ON**
4. Click **"Save"**

## Step 6: Deploy

1. Add environment variables to Netlify:

```bash
netlify env:set EXPO_PUBLIC_SUPABASE_URL "your_url_here"
netlify env:set EXPO_PUBLIC_SUPABASE_ANON_KEY "your_key_here"
```

2. Push to GitHub:

```bash
git add .
git commit -m "Add Supabase cloud storage"
git push
```

3. Netlify will auto-deploy!

## How It Works

### For Users:

1. **First visit**: Auto-signs in anonymously
2. **Write story**: Saves to cloud automatically
3. **Close browser**: Story is safe in cloud
4. **Different device**: Can access with email login (optional)

### Anonymous vs Email:

- **Anonymous**: No signup, instant access, device-specific
- **Email**: Optional, access from any device, can recover account

## Testing

1. Go to your live site
2. Create a story
3. Check Supabase dashboard → **"Table Editor"** → **"stories"**
4. You should see your story data!

## Free Tier Limits

- **Database**: 500 MB (thousands of stories)
- **Users**: 50,000 monthly active users
- **API requests**: Unlimited
- **Bandwidth**: 5 GB/month

You won't hit these limits! 🎉

## Security

- ✅ Row Level Security enabled (users only see their own stories)
- ✅ API keys are public-safe (anon key is meant to be exposed)
- ✅ All data encrypted in transit (HTTPS)
- ✅ Automatic backups

## Troubleshooting

### "relation 'stories' does not exist"
- Run the SQL query from Step 2 again

### "JWT expired" or auth errors
- Check that EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are correct

### Stories not saving
- Check browser console for errors
- Verify Row Level Security policies are created
- Make sure anonymous auth is enabled

## Next Steps

Your app now has:
- ✅ Permanent cloud storage
- ✅ Multi-device access
- ✅ Never lose data
- ✅ Free forever

Enjoy! 🚀
