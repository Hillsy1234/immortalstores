import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { gistStorage } from '../../utils/githubGist';

export default function AuthCallback() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code?: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function handleAuth() {
      if (!code) {
        setStatus('error');
        setError('No authorization code received');
        return;
      }

      try {
        const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID || '';
        const clientSecret = process.env.GITHUB_CLIENT_SECRET || '';

        if (!clientId || !clientSecret) {
          throw new Error('GitHub OAuth credentials not configured');
        }

        await gistStorage.handleCallback(code as string, clientId, clientSecret);
        setStatus('success');
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.replace('/');
        }, 2000);
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Authentication failed');
        
        // Redirect to home after 5 seconds even on error
        setTimeout(() => {
          router.replace('/');
        }, 5000);
      }
    }

    handleAuth();
  }, [code, router]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {status === 'loading' && (
          <>
            <ActivityIndicator size="large" color="#ffffff" />
            <Text style={styles.title}>Connecting to GitHub...</Text>
            <Text style={styles.subtitle}>Please wait</Text>
          </>
        )}

        {status === 'success' && (
          <>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.title}>Success!</Text>
            <Text style={styles.subtitle}>
              You're now connected to GitHub
            </Text>
            <Text style={styles.info}>
              Your stories will sync automatically
            </Text>
          </>
        )}

        {status === 'error' && (
          <>
            <Text style={styles.errorIcon}>✕</Text>
            <Text style={styles.title}>Authentication Failed</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.info}>
              Redirecting to home...
            </Text>
          </>
        )}
      </View>
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
  },
  content: {
    alignItems: 'center',
    gap: 20,
  },
  successIcon: {
    fontSize: 72,
    color: '#10b981',
  },
  errorIcon: {
    fontSize: 72,
    color: '#ef4444',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
    textAlign: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
});
