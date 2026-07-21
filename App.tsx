import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { DashboardScreen } from './src';
import { VoiceScreen } from './src/screens/voice/VoiceScreen';
import { TextScreen } from './src/screens/text/TextScreen';
import { ImageScreen } from './src/screens/image/ImageScreen';
import { initDatabase } from './src/services/DatabaseService';
import { initUserDatabase } from './src/services/UserDataService';
import { initAI } from './src/services/AIService';

type Screen = 'home' | 'voice' | 'text' | 'image';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([initDatabase(), initUserDatabase(), Promise.resolve(initAI())])
      .then(() => setReady(true))
      .catch((e) => {
        console.error('Init failed:', e);
        setError(e.message || 'Failed to initialize');
        setReady(true);
      });
  }, []);

  const navigate = (s: string) => setScreen(s as Screen);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Nut.ai...</Text>
      </View>
    );
  }

  if (error) console.warn('Init warning:', error);

  switch (screen) {
    case 'voice': return <VoiceScreen onNavigate={navigate} />;
    case 'text': return <TextScreen onNavigate={navigate} />;
    case 'image': return <ImageScreen onNavigate={navigate} />;
    default: return <DashboardScreen onNavigate={navigate} />;
  }
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fbfdff', gap: 12 },
  loadingText: { fontSize: 14, color: '#475569' },
});
