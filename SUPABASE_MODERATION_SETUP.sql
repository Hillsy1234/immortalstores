-- Run this SQL in your Supabase SQL Editor to set up moderation

-- 1. Create public_stories table
CREATE TABLE IF NOT EXISTS public_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT,
  character_name TEXT NOT NULL,
  world TEXT NOT NULL,
  origin TEXT NOT NULL,
  backstory TEXT NOT NULL,
  story_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  moderator_notes TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  moderated_at TIMESTAMP WITH TIME ZONE,
  moderated_by TEXT
);

-- 2. Create moderators table
CREATE TABLE IF NOT EXISTS moderators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create story_reports table (for user reporting)
CREATE TABLE IF NOT EXISTS story_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES public_stories(id) ON DELETE CASCADE,
  reporter_id TEXT,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT
);

-- 4. Enable Row Level Security
ALTER TABLE public_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderators ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_reports ENABLE ROW LEVEL SECURITY;

-- 5. Policies for public_stories

-- Anyone can view approved stories
CREATE POLICY "Anyone can view approved stories"
  ON public_stories FOR SELECT
  USING (status = 'approved');

-- Users can insert their own stories (starts as pending)
CREATE POLICY "Users can insert own stories"
  ON public_stories FOR INSERT
  WITH CHECK (true);

-- Users can update their own pending stories
CREATE POLICY "Users can update own pending stories"
  ON public_stories FOR UPDATE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub' AND status = 'pending');

-- Users can delete their own stories
CREATE POLICY "Users can delete own stories"
  ON public_stories FOR DELETE
  USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 6. Policies for moderators

-- Only moderators can view moderator table
CREATE POLICY "Moderators can view moderators"
  ON moderators FOR SELECT
  USING (email = current_setting('request.jwt.claims', true)::json->>'email');

-- 7. Policies for story_reports

-- Anyone can insert reports
CREATE POLICY "Anyone can report stories"
  ON story_reports FOR INSERT
  WITH CHECK (true);

-- Only moderators can view reports (we'll handle this in app logic)
CREATE POLICY "Anyone can view own reports"
  ON story_reports FOR SELECT
  USING (reporter_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_public_stories_status ON public_stories(status);
CREATE INDEX IF NOT EXISTS idx_public_stories_created_at ON public_stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_public_stories_world ON public_stories(world);
CREATE INDEX IF NOT EXISTS idx_story_reports_story_id ON story_reports(story_id);
CREATE INDEX IF NOT EXISTS idx_story_reports_status ON story_reports(status);

-- 9. Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create trigger for updated_at
CREATE TRIGGER update_public_stories_updated_at BEFORE UPDATE ON public_stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Insert yourself as the first moderator (REPLACE WITH YOUR EMAIL!)
INSERT INTO moderators (email, role) 
VALUES ('your-email@example.com', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 12. Create a view for moderator dashboard
CREATE OR REPLACE VIEW moderator_dashboard AS
SELECT 
  ps.*,
  COUNT(sr.id) as report_count
FROM public_stories ps
LEFT JOIN story_reports sr ON ps.id = sr.story_id AND sr.status = 'pending'
GROUP BY ps.id
ORDER BY 
  CASE 
    WHEN ps.status = 'pending' THEN 1
    WHEN COUNT(sr.id) > 0 THEN 2
    ELSE 3
  END,
  ps.created_at DESC;

-- Done! Your moderation system is ready.
