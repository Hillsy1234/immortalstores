import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { storage } from '../utils/storage';
import { gistStorage } from '../utils/githubGist';

interface StoryEntry {
  id: string;
  type: 'scenario' | 'action';
  content: string;
  timestamp: Date;
}

export default function StoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { world, characterName, origin, backstory } = useLocalSearchParams<{
    world: string;
    characterName: string;
    origin: string;
    backstory: string;
  }>();

  const [storyEntries, setStoryEntries] = useState<StoryEntry[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [currentAction, setCurrentAction] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [gistId, setGistId] = useState<string | null>(null);

  // Load saved story on mount
  useEffect(() => {
    if (characterName && world) {
      const savedStory = storage.getStory(characterName, world);
      if (savedStory && savedStory.entries.length > 0) {
        // Convert timestamp strings back to Date objects
        const entries = savedStory.entries.map(entry => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setStoryEntries(entries);
        setLastSaved(new Date(savedStory.lastUpdated));
      } else {
        // Start with welcome message
        const welcomeEntry: StoryEntry = {
          id: '1',
          type: 'scenario',
          content: `Welcome to your adventure, ${characterName}! You find yourself at the beginning of an epic journey. What will you do first?`,
          timestamp: new Date(),
        };
        setStoryEntries([welcomeEntry]);
      }
    }
  }, [characterName, world]);

  // Auto-save to localStorage whenever story entries change
  useEffect(() => {
    if (storyEntries.length > 0 && characterName && world && origin && backstory) {
      const saveData = {
        world,
        characterName,
        origin,
        backstory,
        entries: storyEntries,
        lastUpdated: new Date().toISOString(),
      };
      storage.saveStory(saveData);
      setLastSaved(new Date());

      // Auto-sync to GitHub if logged in
      if (gistStorage.isAuthenticated()) {
        syncToGitHub();
      }
    }
  }, [storyEntries, characterName, world, origin, backstory]);

  // Sync story to GitHub Gist
  async function syncToGitHub() {
    if (!gistStorage.isAuthenticated()) return;

    try {
      setIsSyncing(true);
      setSyncError(null);

      const gistData = {
        gistId: gistId || undefined,
        world,
        characterName,
        origin,
        backstory,
        entries: storyEntries.map(e => ({
          ...e,
          timestamp: e.timestamp.toISOString(),
        })),
        lastUpdated: new Date().toISOString(),
      };

      const newGistId = await gistStorage.saveStory(gistData);
      if (!gistId) {
        setGistId(newGistId);
      }
      setIsSyncing(false);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncError(error instanceof Error ? error.message : 'Sync failed');
      setIsSyncing(false);
    }
  }

  function handleSubmitAction() {
    if (!currentAction.trim()) return;

    const newEntry: StoryEntry = {
      id: Date.now().toString(),
      type: 'action',
      content: currentAction,
      timestamp: new Date(),
    };

    setStoryEntries([...storyEntries, newEntry]);
    setCurrentAction('');
    
    // Pure human storytelling - no AI responses
    // Users write their own story, or others can contribute
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style="light" />

      <View style={[styles.header, isDark && styles.headerDark]}>
        <View style={styles.headerContent}>
          <View style={styles.characterInfo}>
            <Text style={styles.characterEmoji}>⚔️</Text>
            <Text style={styles.characterName}>
              {characterName}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* Sync Status */}
            {gistStorage.isAuthenticated() && (
              <View style={styles.syncStatus}>
                {isSyncing ? (
                  <Text style={styles.syncingIndicator}>
                    ↻ Syncing...
                  </Text>
                ) : syncError ? (
                  <Text style={styles.syncErrorIndicator}>
                    ⚠️ Sync Error
                  </Text>
                ) : lastSaved ? (
                  <Text style={styles.syncedIndicator}>
                    ☁️ Synced
                  </Text>
                ) : null}
              </View>
            )}
            {lastSaved && !gistStorage.isAuthenticated() && (
              <Text style={styles.savedIndicator}>
                ✓ Saved
              </Text>
            )}
            <View style={styles.worldBadgeContainer}>
              <Text style={styles.worldBadge}>
                {world?.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.storyContainer}
        contentContainerStyle={styles.storyContent}
        showsVerticalScrollIndicator={false}
      >
        {storyEntries.map((entry) => (
          <View
            key={entry.id}
            style={styles.storyEntryWrapper}
          >
            <View style={[
              styles.storyEntry,
              entry.type === 'scenario' ? styles.scenarioEntry : styles.actionEntry,
            ]}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryIcon}>
                  {entry.type === 'scenario' ? '📖' : '✍️'}
                </Text>
                <Text style={styles.entryLabel}>
                  {entry.type === 'scenario' ? 'Scenario' : 'Your Action'}
                </Text>
              </View>
              <Text style={styles.entryContent}>
                {entry.content}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actionPanel}>
        {!isWriting ? (
          <TouchableOpacity
            style={styles.writeButton}
            onPress={() => setIsWriting(true)}
            accessibilityLabel="Write your action"
            accessibilityRole="button"
          >
            <View style={styles.writeButtonInner}>
              <Text style={styles.writeButtonIcon}>✍️</Text>
              <Text style={styles.writeButtonText}>
                Write Your Action
              </Text>
              <Text style={styles.writeButtonArrow}>→</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.writeContainer}>
            <TextInput
              style={[styles.actionInput, isDark && styles.actionInputDark]}
              value={currentAction}
              onChangeText={setCurrentAction}
              placeholder="What does your character do next?"
              placeholderTextColor={isDark ? '#666666' : '#999999'}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              autoFocus
              accessibilityLabel="Action input"
            />
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsWriting(false);
                  setCurrentAction('');
                }}
                accessibilityLabel="Cancel"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>
                  ✕ Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  !currentAction.trim() && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmitAction}
                disabled={!currentAction.trim()}
                accessibilityLabel="Submit action"
                accessibilityRole="button"
              >
                <Text
                  style={[
                    styles.submitButtonText,
                    !currentAction.trim() && styles.submitButtonTextDisabled,
                  ]}
                >
                  ✓ Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
          accessibilityLabel="Return to title"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>
            ← Return to Title
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerDark: {
    backgroundColor: 'rgba(26, 26, 46, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  characterEmoji: {
    fontSize: 32,
  },
  characterName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  syncedIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  syncingIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  syncErrorIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  worldBadgeContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  worldBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffd700',
    letterSpacing: 1.5,
  },
  storyContainer: {
    flex: 1,
  },
  storyContent: {
    padding: 24,
    gap: 20,
  },
  storyEntryWrapper: {
    marginBottom: 4,
  },
  storyEntry: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scenarioEntry: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 2,
    borderColor: '#3b82f6',
    marginRight: 40,
  },
  actionEntry: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 2,
    borderColor: '#f59e0b',
    marginLeft: 40,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  entryIcon: {
    fontSize: 20,
  },
  entryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  entryContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ffffff',
  },
  actionPanel: {
    padding: 24,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
  },
  writeButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  writeButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    backgroundColor: '#ffd700',
    minHeight: 56,
  },
  writeButtonIcon: {
    fontSize: 20,
  },
  writeButtonText: {
    color: '#1a1a2e',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  writeButtonArrow: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: '700',
  },
  writeContainer: {
    gap: 12,
  },
  actionInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 120,
  },
  actionInputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButtonText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 15,
    fontWeight: '600',
  },
});
