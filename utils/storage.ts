// Storage utility for persisting user data
export interface StoryEntry {
  id: string;
  type: 'scenario' | 'action';
  content: string;
  timestamp: Date;
}

export interface SavedStory {
  world: string;
  characterName: string;
  origin: string;
  backstory: string;
  entries: StoryEntry[];
  lastUpdated: string;
}

const STORAGE_KEY = 'immortal_stories_data';

export const storage = {
  // Save a story
  saveStory: (story: SavedStory): void => {
    try {
      const stories = storage.getAllStories();
      const existingIndex = stories.findIndex(
        s => s.characterName === story.characterName && s.world === story.world
      );

      if (existingIndex >= 0) {
        stories[existingIndex] = { ...story, lastUpdated: new Date().toISOString() };
      } else {
        stories.push({ ...story, lastUpdated: new Date().toISOString() });
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (error) {
      console.error('Failed to save story:', error);
    }
  },

  // Get all saved stories
  getAllStories: (): SavedStory[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load stories:', error);
      return [];
    }
  },

  // Get a specific story
  getStory: (characterName: string, world: string): SavedStory | null => {
    const stories = storage.getAllStories();
    return stories.find(
      s => s.characterName === characterName && s.world === world
    ) || null;
  },

  // Delete a story
  deleteStory: (characterName: string, world: string): void => {
    try {
      const stories = storage.getAllStories();
      const filtered = stories.filter(
        s => !(s.characterName === characterName && s.world === world)
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete story:', error);
    }
  },

  // Clear all stories
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};
