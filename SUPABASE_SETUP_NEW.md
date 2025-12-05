# 🆕 Create NEW Supabase Project for Immortal Stories

## Step 1: Create New Supabase Project

1. Go to: https://supabase.com/dashboard
2. Click **"New project"**
3. Fill in:
   - **Name**: `immortal-stories`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup

## Step 2: Get Your API Keys

1. In your new project, click **"Project Settings"** (gear icon, bottom left)
2. Click **"API"** in the left menu
3. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Step 3: Add to Your .env File

Open `.env` and update:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Create Database Tables

1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Copy ALL the SQL from `SUPABASE_MODERATION_SETUP.sql`
4. **IMPORTANT**: On line 104, change:
   ```sql
   VALUES ('your-email@example.com', 'admin')
   ```
   Replace with YOUR email address!
5. Click **"Run"** (or Cmd/Ctrl + Enter)

## Step 5: Add to Netlify

```bash
netlify env:set EXPO_PUBLIC_SUPABASE_URL "your_url_here"
netlify env:set EXPO_PUBLIC_SUPABASE_ANON_KEY "your_key_here"
```

## Step 6: Deploy

```bash
git add .
git commit -m "Update Supabase config"
git push
```

## Why a New Project?

The old Supabase credentials belonged to a different app. This ensures:
- ✅ Clean database just for Immortal Stories
- ✅ No conflicts with other apps
- ✅ Your own moderation system
- ✅ Full control

## Cost

**FREE forever** for:
- 500 MB database
- 50,000 monthly active users
- Unlimited API requests

Perfect for your storytelling app! 🎉
