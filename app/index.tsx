import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { gistStorage } from '../utils/githubGist';

export default function TitlePage() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if user is logged in
    setIsLoggedIn(gistStorage.isAuthenticated());
    setUser(gistStorage.getUser());
  }, []);

  function handleGitHubLogin() {
    const config = {
      clientId: 'Ov23livv873s7GqFqlTz',
      redirectUri: window.location.origin + '/auth/callback',
    };
    
    gistStorage.startAuth(config);
  }

  function handleLogout() {
    gistStorage.logout();
    setIsLoggedIn(false);
    setUser(null);
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style="light" />
      
      {/* Gradient Background */}
      <View style={[styles.gradientBackground, isDark && styles.gradientBackgroundDark]} />
      
      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
      
      {/* User Profile - Top Right */}
      {isLoggedIn && user && (
        <View style={styles.userProfile}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>👤 {user.login}</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              accessibilityLabel="Logout"
              accessibilityRole="button"
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ INTERACTIVE RPG ✨</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleEmoji}>⚔️</Text>
          <Text style={styles.title}>
            Immortal Stories
          </Text>
          <View style={styles.titleUnderline} />
        </View>
        
        <Text style={styles.author}>
          by Raymond Hill
        </Text>

        <Text style={styles.tagline}>
          Where imagination becomes reality
        </Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push('/worlds')}
          accessibilityLabel="Start your adventure"
          accessibilityRole="button"
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.startButtonIcon}>🎮</Text>
            <Text style={styles.startButtonText}>
              Begin Your Adventure
            </Text>
            <Text style={styles.startButtonArrow}>→</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌍</Text>
            <Text style={styles.featureText}>4 Worlds</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✍️</Text>
            <Text style={styles.featureText}>Create Stories</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>⚔️</Text>
            <Text style={styles.featureText}>Epic Battles</Text>
          </View>
        </View>

        {/* GitHub Login - Coming Soon */}
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>💾 Auto-Save Enabled</Text>
          <Text style={styles.comingSoonSubtext}>Stories saved to your browser</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  gradientBackgroundDark: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -50,
  },
  decorativeCircle3: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: '50%',
    left: -75,
  },
  content: {
    alignItems: 'center',
    gap: 20,
    zIndex: 1,
    maxWidth: 600,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  titleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  titleEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  titleUnderline: {
    width: 100,
    height: 4,
    backgroundColor: '#ffd700',
    borderRadius: 2,
  },
  author: {
    fontSize: 20,
    fontWeight: '300',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  tagline: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  startButton: {
    marginTop: 32,
    minWidth: 280,
    minHeight: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 32,
    paddingVertical: 18,
    backgroundColor: '#ffd700',
    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
  },
  startButtonIcon: {
    fontSize: 24,
  },
  startButtonText: {
    color: '#1a1a2e',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  startButtonArrow: {
    color: '#1a1a2e',
    fontSize: 24,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 40,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  feature: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
    fontSize: 28,
  },
  featureText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  userProfile: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  githubButton: {
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  githubButtonInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  githubIcon: {
    fontSize: 24,
  },
  githubButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  githubSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  syncBadge: {
    marginTop: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  syncBadgeText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  comingSoonBadge: {
    marginTop: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignItems: 'center',
  },
  comingSoonText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  comingSoonSubtext: {
    color: 'rgba(59, 130, 246, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },
});
