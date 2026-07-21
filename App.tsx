import React, { useState } from 'react';
import { DashboardScreen } from './src';
import { VoiceScreen } from './src/screens/voice/VoiceScreen';
import { TextScreen } from './src/screens/text/TextScreen';
import { ImageScreen } from './src/screens/image/ImageScreen';

type Screen = 'home' | 'voice' | 'text' | 'image';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const navigate = (s: string) => setScreen(s as Screen);

  switch (screen) {
    case 'voice':
      return <VoiceScreen onNavigate={navigate} />;
    case 'text':
      return <TextScreen onNavigate={navigate} />;
    case 'image':
      return <ImageScreen onNavigate={navigate} />;
    case 'home':
    default:
      return <DashboardScreen onNavigate={navigate} />;
  }
}
