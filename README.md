# Immortal Stories

An interactive role-playing web game where users create characters and develop unique stories across different fantasy worlds.

## Game Concept

**Immortal Stories** is a creative writing RPG where imagination brings stories to life. Players:

- Choose from **4 worlds**: Action World, Romance World, Science Fiction World, Fantasy World
- Create unique characters with custom profiles, names, and backstories
- Write and shape their own story outcomes through scenarios
- Decide character actions and relationships (friend or enemy)
- Battle with characters in online and offline modes
- Experience constantly evolving stories shaped by user creativity

## Quick Start (Web)

1. Install dependencies:
```bash
npm install
```

2. Start the web development server:
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:8081`

### Alternative Commands

```bash
npm run dev          # Start web dev server
npm run build        # Build for production
npm run web          # Explicitly start web
```

## Features

- 🌍 4 distinct story worlds to explore
- 👤 Character creation and profile management
- 📖 Interactive scenario-based storytelling
- ✍️ Creative writing mechanics
- ⚔️ Character battle system (online/offline)
- 🌓 Dark mode support
- 📱 Responsive web design
- 🔒 TypeScript for type safety
- 🎨 Modern, intuitive UI

## Project Structure

```
app/
  _layout.tsx           # Root layout configuration
  index.tsx             # Title page
  worlds.tsx            # World selection screen
  character-create.tsx  # Character creation
  story.tsx             # Story/scenario interface
```

## Tech Stack

- **React** 18.2.0
- **React Native Web** - Cross-platform components for web
- **Expo SDK 51** - Development framework
- **Expo Router** - File-based routing
- **TypeScript** - Type safety
- **Metro Bundler** - Fast bundling

## Deployment to Netlify

### Quick Deploy (Drag & Drop)

1. **Build the project:**
```bash
npm run build
```

2. **Go to Netlify:**
   - Visit https://app.netlify.com/drop
   - Drag the `dist` folder onto the page
   - Done! Your site is live! 🎉

### Deploy from GitHub (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repo
   - Build settings are auto-detected from `netlify.toml`
   - Click "Deploy site"

3. **Set up GitHub OAuth (After Deploy):**
   - Get your Netlify URL (e.g., `https://your-site.netlify.app`)
   - Go to https://github.com/settings/developers
   - Create OAuth App:
     - Homepage: `https://your-site.netlify.app`
     - Callback: `https://your-site.netlify.app/auth/callback`
   - Copy Client ID and Secret
   - In Netlify: Site settings → Environment variables
   - Add:
     - `EXPO_PUBLIC_GITHUB_CLIENT_ID` = your client id
     - `GITHUB_CLIENT_SECRET` = your client secret
   - Redeploy site

### Custom Domain (Optional)

In Netlify:
- Site settings → Domain management
- Add custom domain
- Update GitHub OAuth App URLs to use your domain
