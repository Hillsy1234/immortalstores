import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://ydnclgvibyjwtfvelruf.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbmNsZ3ZpYnlqd3RmdmVscnVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNDU1MzksImV4cCI6MjA2MzkyMTUzOX0.eZJc33XUCuTM1pSeaz6R9lQPFNg5O_ipO00j5RdCBMA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Story {
  id?: string;
  user_id?: string;
  character_name: string;
  world: string;
  origin: string;
  backstory: string;
  entries: StoryEntry[];
  created_at?: string;
  updated_at?: string;
}

export interface StoryEntry {
  id: string;
  type: 'scenario' | 'action';
  content: string;
  timestamp: string;
}

// Save story to Supabase
export async function saveStoryToCloud(story: Story): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const storyData = {
      user_id: user.id,
      character_name: story.character_name,
      world: story.world,
      origin: story.origin,
      backstory: story.backstory,
      entries: story.entries,
      updated_at: new Date().toISOString(),
    };

    // Check if story exists
    const { data: existing } = await supabase
      .from('stories')
      .select('id')
      .eq('user_id', user.id)
      .eq('character_name', story.character_name)
      .eq('world', story.world)
      .single();

    if (existing) {
      // Update existing story
      const { error } = await supabase
        .from('stories')
        .update(storyData)
        .eq('id', existing.id);

      if (error) throw error;
    } else {
      // Insert new story
      const { error } = await supabase
        .from('stories')
        .insert([storyData]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving story:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to save' };
  }
}

// Load all stories for current user
export async function loadStoriesFromCloud(): Promise<{ stories: Story[]; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { stories: [], error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return { stories: data || [] };
  } catch (error) {
    console.error('Error loading stories:', error);
    return { stories: [], error: error instanceof Error ? error.message : 'Failed to load' };
  }
}

// Sign in anonymously (no email required)
export async function signInAnonymously(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sign in' };
  }
}

// Sign in with email (optional)
export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sign in' };
  }
}

// Sign up with email (optional)
export async function signUpWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to sign up' };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  return !!user;
}

// Public Stories Management
export interface PublicStory {
  id?: string;
  user_id: string;
  user_name?: string;
  character_name: string;
  world: string;
  origin: string;
  backstory: string;
  story_entries: any[];
  status?: 'pending' | 'approved' | 'rejected';
  moderator_notes?: string;
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
}

// Submit story for moderation
export async function submitStoryForModeration(story: PublicStory): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const { data, error } = await supabase
      .from('public_stories')
      .insert([{
        ...story,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) throw error;

    return { success: true, id: data.id };
  } catch (error) {
    console.error('Error submitting story:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to submit' };
  }
}

// Get approved stories (public gallery)
export async function getApprovedStories(world?: string): Promise<{ stories: PublicStory[]; error?: string }> {
  try {
    let query = supabase
      .from('public_stories')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (world) {
      query = query.eq('world', world);
    }

    const { data, error } = await query;

    if (error) throw error;

    return { stories: data || [] };
  } catch (error) {
    console.error('Error loading stories:', error);
    return { stories: [], error: error instanceof Error ? error.message : 'Failed to load' };
  }
}

// Get pending stories (for moderators)
export async function getPendingStories(): Promise<{ stories: PublicStory[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('public_stories')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return { stories: data || [] };
  } catch (error) {
    console.error('Error loading pending stories:', error);
    return { stories: [], error: error instanceof Error ? error.message : 'Failed to load' };
  }
}

// Approve story (moderators only)
export async function approveStory(storyId: string, moderatorEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('public_stories')
      .update({
        status: 'approved',
        moderated_at: new Date().toISOString(),
        moderated_by: moderatorEmail,
      })
      .eq('id', storyId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error approving story:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to approve' };
  }
}

// Reject story (moderators only)
export async function rejectStory(storyId: string, moderatorEmail: string, notes?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('public_stories')
      .update({
        status: 'rejected',
        moderator_notes: notes,
        moderated_at: new Date().toISOString(),
        moderated_by: moderatorEmail,
      })
      .eq('id', storyId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error rejecting story:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reject' };
  }
}

// Check if user is a moderator
export async function isModerator(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('moderators')
      .select('id')
      .eq('email', email)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
}
