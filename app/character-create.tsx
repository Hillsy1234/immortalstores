import { useState } from 'react';
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

export default function CharacterCreateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { world } = useLocalSearchParams<{ world: string }>();

  const [characterName, setCharacterName] = useState('');
  const [origin, setOrigin] = useState('');
  const [backstory, setBackstory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerateBackstory() {
    if (!characterName.trim() || !origin.trim()) {
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/.netlify/functions/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          world,
          characterName: characterName.trim(),
          origin: origin.trim(),
        }),
      });

      const data = await response.json();
      if (data.backstory) {
        setBackstory(data.backstory);
      }
    } catch (error) {
      console.error('Failed to generate backstory:', error);
    } finally {
      setIsGenerating(false);
    }
  }

  function handleContinue() {
    if (!characterName.trim() || !origin.trim() || !backstory.trim()) {
      return;
    }

    router.push({
      pathname: '/story',
      params: {
        world,
        characterName: characterName.trim(),
        origin: origin.trim(),
        backstory: backstory.trim(),
      },
    });
  }

  const isFormValid = characterName.trim() && origin.trim() && backstory.trim();

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style="light" />
      
      <View style={[styles.headerBackground, isDark && styles.headerBackgroundDark]} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>👤</Text>
          <Text style={styles.title}>
            Create Your Character
          </Text>
          <Text style={styles.subtitle}>
            Bring your hero to life with imagination
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>✨</Text>
              <Text style={styles.label}>
                Character Name
              </Text>
            </View>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={characterName}
              onChangeText={setCharacterName}
              placeholder="Enter your character's name"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              accessibilityLabel="Character name input"
            />
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>🗺️</Text>
              <Text style={styles.label}>
                Where are they from?
              </Text>
            </View>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              value={origin}
              onChangeText={setOrigin}
              placeholder="Their homeland or origin"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              accessibilityLabel="Character origin input"
            />
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.labelIcon}>📖</Text>
              <Text style={styles.label}>
                Backstory
              </Text>
              <TouchableOpacity
                style={styles.aiButton}
                onPress={handleGenerateBackstory}
                disabled={!characterName.trim() || !origin.trim() || isGenerating}
                accessibilityLabel="Generate backstory with AI"
                accessibilityRole="button"
              >
                <Text style={styles.aiButtonText}>
                  {isGenerating ? '✨ Generating...' : '✨ AI Generate'}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                isDark && styles.inputDark,
              ]}
              value={backstory}
              onChangeText={setBackstory}
              placeholder="Tell us about their past, motivations, and personality... (or use AI to generate)"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              accessibilityLabel="Character backstory input"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.createButton,
            !isFormValid && styles.createButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!isFormValid}
          accessibilityLabel="Create character and start story"
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid }}
        >
          <View style={styles.createButtonInner}>
            <Text style={styles.createButtonIcon}>🚀</Text>
            <Text
              style={[
                styles.createButtonText,
                !isFormValid && styles.createButtonTextDisabled,
              ]}
            >
              Begin Adventure
            </Text>
            <Text style={styles.createButtonArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back to world selection"
          accessibilityRole="button"
        >
          <Text style={[styles.backButtonText, isDark && styles.backButtonTextDark]}>
            ← Back to Worlds
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    position: 'relative',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    background: 'linear-gradient(180deg, #764ba2 0%, rgba(118, 75, 162, 0) 100%)',
  },
  headerBackgroundDark: {
    background: 'linear-gradient(180deg, #1a1a2e 0%, rgba(26, 26, 46, 0) 100%)',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  headerEmoji: {
    fontSize: 56,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  form: {
    gap: 24,
  },
  fieldContainer: {
    gap: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelIcon: {
    fontSize: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 56,
  },
  inputDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  createButton: {
    marginTop: 32,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 18,
    backgroundColor: '#ffd700',
    minHeight: 60,
  },
  createButtonIcon: {
    fontSize: 24,
  },
  createButtonText: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  createButtonArrow: {
    color: '#1a1a2e',
    fontSize: 24,
    fontWeight: '700',
  },
  createButtonTextDisabled: {
    color: '#666666',
  },
  backButton: {
    marginTop: 24,
    alignSelf: 'center',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  backButtonTextDark: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
