import { useState, useCallback, useRef } from 'react';
import { searchFoodsFromTranscript } from '../../../services/VoiceService';
import type { FoodResult } from '../../../services/DatabaseService';

export type VoiceRecognitionStatus = 'idle' | 'listening' | 'processing' | 'error';

// Try to load speech module — fails gracefully in Expo Go
let ExpoSpeechRecognitionModule: any = null;
try {
  ExpoSpeechRecognitionModule = require('expo-speech-recognition').ExpoSpeechRecognitionModule;
} catch (e) {
  // Native module not available (Expo Go)
}

export function useVoiceRecognition() {
  const [foods, setFoods] = useState<FoodResult[]>([]);
  const [status, setStatus] = useState<VoiceRecognitionStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef(transcript);
  transcriptRef.current = transcript;

  const startListening = useCallback(async () => {
    if (!ExpoSpeechRecognitionModule) {
      setStatus('error');
      return;
    }

    try {
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

      // Listen for results
      ExpoSpeechRecognitionModule.addListener?.('result', async (event: any) => {
        const text = event.results?.[0]?.transcript || '';
        if (text) {
          setTranscript(text);
          if (event.isFinal) {
            setStatus('processing');
            const results = await searchFoodsFromTranscript(text);
            setFoods(results);
            setStatus('idle');
          }
        }
      });

      ExpoSpeechRecognitionModule.addListener?.('error', () => {
        setStatus('error');
      });

      ExpoSpeechRecognitionModule.addListener?.('speechend', () => {
        if (transcriptRef.current.trim()) {
          setStatus('processing');
          searchFoodsFromTranscript(transcriptRef.current).then((results) => {
            setFoods(results);
            setStatus('idle');
          });
        } else {
          setStatus('idle');
        }
      });
    } catch (e) {
      console.error('Speech recognition failed:', e);
      setStatus('error');
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      ExpoSpeechRecognitionModule?.stop();
    } catch (e) {
      // Ignore
    }

    if (transcriptRef.current.trim()) {
      setStatus('processing');
      const results = await searchFoodsFromTranscript(transcriptRef.current);
      setFoods(results);
    }
    setStatus('idle');
  }, []);

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
