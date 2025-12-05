import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

interface World {
  id: string;
  name: string;
  description: string;
  color: string;
  darkColor: string;
  icon: string;
  gradient: string;
}

const WORLDS: World[] = [
  {
    id: 'action',
    name: 'Action World',
    description: 'High-octane adventures filled with danger, heroism, and adrenaline-pumping challenges.',
    color: '#DC2626',
    darkColor: '#EF4444',
    icon: '💥',
    gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  },
  {
    id: 'romance',
    name: 'Romance World',
    description: 'Heartfelt stories of love, passion, and emotional connections that transcend time.',
    color: '#DB2777',
    darkColor: '#EC4899',
    icon: '💖',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'scifi',
    name: 'Science Fiction World',
    description: 'Explore futuristic realms, advanced technology, and the mysteries of the cosmos.',
    color: '#2563EB',
    darkColor: '#3B82F6',
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    id: 'fantasy',
    name: 'Fantasy World',
    description: 'Magical kingdoms, mythical creatures, and epic quests await in lands of wonder.',
    color: '#7C3AED',
    darkColor: '#8B5CF6',
    icon: '🔮',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
];

export default function WorldsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  function handleWorldSelect(worldId: string) {
    router.push(`/character-create?world=${worldId}`);
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style="light" />
      
      <View style={[styles.headerBackground, isDark && styles.headerBackgroundDark]} />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🌍</Text>
          <Text style={styles.title}>
            Choose Your World
          </Text>
          <Text style={styles.subtitle}>
            Select a realm where your story will unfold
          </Text>
        </View>

        <View style={styles.worldsContainer}>
          {WORLDS.map((world) => (
            <TouchableOpacity
              key={world.id}
              style={styles.worldCard}
              onPress={() => handleWorldSelect(world.id)}
              accessibilityLabel={`Select ${world.name}`}
              accessibilityRole="button"
              accessibilityHint={world.description}
            >
              <View style={[styles.worldCardInner, { borderColor: world.color }]}>
                <View style={styles.worldIconContainer}>
                  <Text style={styles.worldIcon}>{world.icon}</Text>
                </View>
                <View style={styles.worldContent}>
                  <Text style={styles.worldName}>
                    {world.name}
                  </Text>
                  <Text style={styles.worldDescription}>
                    {world.description}
                  </Text>
                </View>
                <View style={styles.worldArrow}>
                  <Text style={styles.worldArrowText}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={[styles.backButtonText, isDark && styles.backButtonTextDark]}>
            ← Back
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
    height: 250,
    background: 'linear-gradient(180deg, #667eea 0%, rgba(102, 126, 234, 0) 100%)',
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
  worldsContainer: {
    gap: 20,
  },
  worldCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  worldCardInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: 24,
    borderWidth: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 120,
  },
  worldIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldIcon: {
    fontSize: 40,
  },
  worldContent: {
    flex: 1,
    gap: 8,
  },
  worldName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  worldDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
  worldArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldArrowText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
  backButton: {
    marginTop: 32,
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
