import { useState, useCallback } from 'react';
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { searchFoodsFromTranscript } from '../../../services/VoiceService';
import type { FoodResult } from '../../../services/DatabaseService';

export type VoiceRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

/**
 * Hook that wraps speech recognition and food detection.
 * Returns recognized foods from spoken words.
 */
export function useVoiceRecognition() {
  const [foods, setFoods] = useState<FoodResult[]>([]);
  const [status, setStatus] = useState<VoiceRecognitionStatus>('idle');
  const [transcript, setTranscript] = useState('');

  // Listen for speech results
  useSpeechRecognitionEvent('result', async (event) => {
    const text = event.results?.[0]?.transcript || '';
    if (text) {
      setTranscript(text);

      // If this is a final result, process it
      if (event.isFinal) {
        setStatus('processing');
        const results = await searchFoodsFromTranscript(text);
        setFoods(results);
        setStatus('idle');
      }
    }
  });

  // Listen for errors
  useSpeechRecognitionEvent('error', (event) => {
    console.error('Speech error:', event.error);
    setStatus('error');
  });

  // Listen for speech end
  useSpeechRecognitionEvent('speechend', () => {
    if (status === 'listening') {
      setStatus('idle');
    }
  });

  const startListening = useCallback(async () => {
    try {
      // Request permissions first
      const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!result.granted) {
        setStatus('error');
        return;
      }

      setStatus('listening');
      setTranscript('');

      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
      });
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setStatus('error');
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (e) {
      // Ignore
    }

    // Process whatever transcript we have
    if (transcript.trim()) {
      setStatus('processing');
      const results = await searchFoodsFromTranscript(transcript);
      setFoods(results);
    }
    setStatus('idle');
  }, [transcript]);

  const clearFoods = useCallback(() => {
    setFoods([]);
    setTranscript('');
  }, []);

  const addFoods = useCallback((newFoods: FoodResult[]) => {
    setFoods((prev) => {
      const existing = new Set(prev.map(f => f.id));
      const unique = newFoods.filter(f => !existing.has(f.id));
      return [...prev, ...unique];
    });
  }, []);

  return {
    foods,
    status,
    transcript,
    startListening,
    stopListening,
    clearFoods,
    addFoods,
  };
}
