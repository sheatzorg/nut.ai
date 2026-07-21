import { useEffect, useState, useRef } from 'react';
import { searchFood, type FoodResult } from '../../../services/DatabaseService';

export type RecognitionStatus = 'idle' | 'loading' | 'error';

/**
 * Debounced FTS5 search against the local nutrients.db.
 * Returns recognized foods as the user types.
 */
export function useRecognition(text: string, delay = 300) {
  const [items, setItems] = useState<FoodResult[]>([]);
  const [status, setStatus] = useState<RecognitionStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2) {
      setItems([]);
      setStatus('idle');
      return;
    }

    setStatus('loading');

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const results = await searchFood(trimmed);
        setItems(results);
        setStatus('idle');
      } catch (e) {
        console.error('Recognition error:', e);
        setStatus('error');
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, delay]);

  return { items, status };
}
