# Story Moderation System

## Current State:
- ✅ Users create characters with AI-generated backstories
- ✅ Users write their own stories (no AI during gameplay)
- ✅ Stories save to localStorage + GitHub Gists (private)
- ❌ **No public sharing yet**
- ❌ **No moderation system yet**

## Proposed Moderation Flow:

### Option 1: Pre-Moderation (Safest)
```
User writes story
    ↓
User clicks "Share Story"
    ↓
Story marked as "Pending Review"
    ↓
Moderator reviews in admin panel
    ↓
Moderator approves/rejects
    ↓
If approved → Story goes public
If rejected → User notified
```

### Option 2: Post-Moderation (Faster)
```
User writes story
    ↓
User clicks "Share Story"
    ↓
Story immediately public
    ↓
Moderators can flag/remove later
    ↓
Flagged stories hidden pending review
```

### Option 3: Community Moderation
```
User writes story
    ↓
Story goes public
    ↓
Users can report inappropriate content
    ↓
After X reports → Auto-hidden
    ↓
Moderator reviews flagged stories
```

## What Needs to Be Built:

### 1. Story Sharing Feature
- [ ] "Share Story" button in story screen
- [ ] Make Gist public or save to database
- [ ] Story visibility toggle (private/pending/public)

### 2. Database for Public Stories
**Options:**
- **Supabase** (already set up!) - Free, easy
- **GitHub Gists** (current) - Limited moderation features
- **Firebase** - Good for real-time

### 3. Moderation Dashboard
- [ ] Admin login (separate from users)
- [ ] List of pending stories
- [ ] Preview story content
- [ ] Approve/Reject buttons
- [ ] Reason for rejection (optional)

### 4. User Notifications
- [ ] Email when story approved/rejected
- [ ] In-app notification system
- [ ] Status badge on story (Pending/Approved/Rejected)

## Recommended Approach:

### Phase 1: Basic Sharing (No Moderation Yet)
1. Add "Share Story" button
2. Stories save to Supabase as public
3. Public gallery page to browse stories
4. No moderation - trust users initially

### Phase 2: Add Moderation
1. Add "status" field to stories (pending/approved/rejected)
2. New stories start as "pending"
3. Build admin dashboard
4. Only approved stories show in gallery

### Phase 3: Advanced Features
1. Community reporting
2. Auto-moderation with AI (flag inappropriate content)
3. User reputation system
4. Featured stories

## Quick Implementation:

### Using Supabase (Recommended):

**Stories Table:**
```sql
CREATE TABLE public_stories (
  id UUID PRIMARY KEY,
  user_id UUID,
  character_name TEXT,
  world TEXT,
  backstory TEXT,
  story_content JSONB,
  status TEXT DEFAULT 'pending', -- pending/approved/rejected
  created_at TIMESTAMP,
  moderator_notes TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- Moderators table
CREATE TABLE moderators (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'moderator'
);
```

**Admin Dashboard:**
- Simple page at `/admin`
- Login with moderator email
- List pending stories
- Click to preview
- Approve/Reject buttons

## Content Guidelines:

What to moderate for:
- ✅ Appropriate language
- ✅ No hate speech
- ✅ No explicit content
- ✅ No spam
- ✅ Original content (not plagiarized)

## Timeline Estimate:

- **Phase 1 (Sharing)**: 2-3 hours
- **Phase 2 (Moderation)**: 4-5 hours
- **Phase 3 (Advanced)**: 8-10 hours

## Questions to Decide:

1. **Pre or post-moderation?** (Pre is safer, post is faster)
2. **Who are the moderators?** (Just you, or a team?)
3. **What content is allowed?** (Need clear guidelines)
4. **How to notify users?** (Email, in-app, both?)

---

**Want me to implement this? Let me know which approach you prefer!**
