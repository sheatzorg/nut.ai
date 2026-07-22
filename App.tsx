import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
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

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    Promise.all([initDatabase(), initUserDatabase(), Promise.resolve(initAI())])
      .then(() => setReady(true))
      .catch((e) => {
        console.error('Init failed:', e);
        setReady(true);
      });
  }, [fontsLoaded]);

  const navigate = (s: string) => setScreen(s as Screen);

  if (!fontsLoaded || !ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Nut.ai...</Text>
      </View>
    );
  }

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
