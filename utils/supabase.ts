import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

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
