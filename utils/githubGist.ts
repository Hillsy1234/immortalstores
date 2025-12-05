// GitHub Gist integration for cloud storage (no database!)

export interface GistConfig {
  clientId: string; // GitHub OAuth App Client ID
  redirectUri: string;
}

export interface GistStory {
  gistId?: string;
  world: string;
  characterName: string;
  origin: string;
  backstory: string;
  entries: Array<{
    id: string;
    type: 'scenario' | 'action';
    content: string;
    timestamp: string;
  }>;
  lastUpdated: string;
}

const GITHUB_API = 'https://api.github.com';
const STORAGE_KEY_TOKEN = 'github_access_token';
const STORAGE_KEY_USER = 'github_user';

export class GitHubGistStorage {
  private accessToken: string | null = null;
  private user: any = null;

  constructor() {
    // Load saved token from localStorage
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem(STORAGE_KEY_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEY_USER);
      this.user = userStr ? JSON.parse(userStr) : null;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // Get current user info
  getUser(): any {
    return this.user;
  }

  // Start GitHub OAuth flow
  startAuth(config: GistConfig): void {
    const scope = 'gist'; // Only need gist permission
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&scope=${scope}`;
    window.location.href = authUrl;
  }

  // Handle OAuth callback (call this on redirect page)
  async handleCallback(code: string, clientId: string, clientSecret: string): Promise<void> {
    try {
      // Exchange code for access token
      // Note: In production, this should be done via a serverless function to keep client_secret secure
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        }),
      });

      const data = await response.json();
      this.accessToken = data.access_token;
      localStorage.setItem(STORAGE_KEY_TOKEN, this.accessToken!);

      // Fetch user info
      await this.fetchUserInfo();
    } catch (error) {
      console.error('GitHub auth failed:', error);
      throw error;
    }
  }

  // Fetch user information
  private async fetchUserInfo(): Promise<void> {
    if (!this.accessToken) return;

    try {
      const response = await fetch(`${GITHUB_API}/user`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      this.user = await response.json();
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.user));
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  }

  // Logout
  logout(): void {
    this.accessToken = null;
    this.user = null;
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
  }

  // Save story as a Gist
  async saveStory(story: GistStory): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login with GitHub.');
    }

    const filename = `${story.characterName}_${story.world}.json`;
    const content = JSON.stringify(story, null, 2);

    const gistData = {
      description: `Immortal Stories: ${story.characterName} in ${story.world}`,
      public: false, // Private by default
      files: {
        [filename]: {
          content: content,
        },
      },
    };

    try {
      let response;
      
      if (story.gistId) {
        // Update existing gist
        response = await fetch(`${GITHUB_API}/gists/${story.gistId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gistData),
        });
      } else {
        // Create new gist
        response = await fetch(`${GITHUB_API}/gists`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gistData),
        });
      }

      const result = await response.json();
      return result.id; // Return gist ID
    } catch (error) {
      console.error('Failed to save story to Gist:', error);
      throw error;
    }
  }

  // Load all user's story gists
  async loadAllStories(): Promise<GistStory[]> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login with GitHub.');
    }

    try {
      const response = await fetch(`${GITHUB_API}/gists`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const gists = await response.json();
      const stories: GistStory[] = [];

      // Filter for Immortal Stories gists
      for (const gist of gists) {
        if (gist.description?.startsWith('Immortal Stories:')) {
          // Get the first file (should only be one)
          const files = Object.values(gist.files) as any[];
          if (files.length > 0) {
            const content = files[0].content;
            const story = JSON.parse(content) as GistStory;
            story.gistId = gist.id; // Add gist ID for updates
            stories.push(story);
          }
        }
      }

      return stories;
    } catch (error) {
      console.error('Failed to load stories from Gists:', error);
      throw error;
    }
  }

  // Load a specific story by gist ID
  async loadStory(gistId: string): Promise<GistStory | null> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login with GitHub.');
    }

    try {
      const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const gist = await response.json();
      const files = Object.values(gist.files) as any[];
      
      if (files.length > 0) {
        const content = files[0].content;
        const story = JSON.parse(content) as GistStory;
        story.gistId = gist.id;
        return story;
      }

      return null;
    } catch (error) {
      console.error('Failed to load story from Gist:', error);
      return null;
    }
  }

  // Delete a story gist
  async deleteStory(gistId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login with GitHub.');
    }

    try {
      await fetch(`${GITHUB_API}/gists/${gistId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
    } catch (error) {
      console.error('Failed to delete story from Gist:', error);
      throw error;
    }
  }

  // Make a gist public (for sharing)
  async makePublic(gistId: string): Promise<string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Please login with GitHub.');
    }

    try {
      const response = await fetch(`${GITHUB_API}/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public: true }),
      });

      const gist = await response.json();
      return gist.html_url; // Return shareable URL
    } catch (error) {
      console.error('Failed to make gist public:', error);
      throw error;
    }
  }
}

// Singleton instance
export const gistStorage = new GitHubGistStorage();
