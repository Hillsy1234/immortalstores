// File-based storage utilities (no database required)

export interface StoryData {
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

// Export story as downloadable JSON file
export function exportStoryAsJSON(story: StoryData): void {
  const jsonString = JSON.stringify(story, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.characterName}_${story.world}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export story as readable text file
export function exportStoryAsText(story: StoryData): void {
  let textContent = `IMMORTAL STORIES\n`;
  textContent += `${'='.repeat(50)}\n\n`;
  textContent += `Character: ${story.characterName}\n`;
  textContent += `World: ${story.world}\n`;
  textContent += `Origin: ${story.origin}\n`;
  textContent += `\nBackstory:\n${story.backstory}\n\n`;
  textContent += `${'='.repeat(50)}\n\n`;
  textContent += `STORY\n\n`;

  story.entries.forEach((entry, index) => {
    const date = new Date(entry.timestamp).toLocaleString();
    textContent += `[${index + 1}] ${entry.type.toUpperCase()} - ${date}\n`;
    textContent += `${entry.content}\n\n`;
  });

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.characterName}_${story.world}_story.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export story as Markdown
export function exportStoryAsMarkdown(story: StoryData): void {
  let markdown = `# ${story.characterName}'s Adventure\n\n`;
  markdown += `**World:** ${story.world}  \n`;
  markdown += `**Origin:** ${story.origin}  \n`;
  markdown += `**Last Updated:** ${new Date(story.lastUpdated).toLocaleString()}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Backstory\n\n${story.backstory}\n\n`;
  markdown += `---\n\n`;
  markdown += `## Story\n\n`;

  story.entries.forEach((entry) => {
    const icon = entry.type === 'scenario' ? '📖' : '✍️';
    markdown += `### ${icon} ${entry.type === 'scenario' ? 'Scenario' : 'Action'}\n\n`;
    markdown += `${entry.content}\n\n`;
  });

  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${story.characterName}_${story.world}_story.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import story from JSON file
export function importStoryFromJSON(file: File): Promise<StoryData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const story = JSON.parse(content) as StoryData;
        resolve(story);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Share story as URL (base64 encoded in URL)
export function generateShareableURL(story: StoryData): string {
  const jsonString = JSON.stringify(story);
  const base64 = btoa(encodeURIComponent(jsonString));
  return `${window.location.origin}/story/shared?data=${base64}`;
}

// Load story from shareable URL
export function loadStoryFromURL(base64Data: string): StoryData | null {
  try {
    const jsonString = decodeURIComponent(atob(base64Data));
    return JSON.parse(jsonString) as StoryData;
  } catch (error) {
    console.error('Failed to load story from URL:', error);
    return null;
  }
}

// Export all stories as a single backup file
export function exportAllStoriesBackup(stories: StoryData[]): void {
  const backup = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    stories: stories,
  };

  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `immortal_stories_backup_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import backup file
export function importBackup(file: File): Promise<StoryData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backup = JSON.parse(content);
        resolve(backup.stories || []);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
