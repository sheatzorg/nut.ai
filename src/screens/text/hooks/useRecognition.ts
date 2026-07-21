import { useEffect, useState } from 'react';
import type { FoodItem } from '../lib/types';

export type RecognitionStatus = 'idle' | 'loading' | 'error';

/**
 * Placeholder recognition hook. Replace with real backend integration.
 * Returns mock items for demo purposes.
 */
export function useRecognition(text: string) {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [status, setStatus] = useState<RecognitionStatus>('idle');

  useEffect(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setItems([]);
      setStatus('idle');
      return;
    }

    if (trimmed.length > 5) {
      setStatus('loading');
      const timer = setTimeout(() => {
        setItems([
          {
            id: '1', name: 'Grilled Chicken', emoji: '🍗', quantity: 1, unit: 'piece',
            step: 0.5, matchedText: trimmed.slice(0, 20),
            perUnit: { kcal: 230, protein: 35, carbs: 0, fat: 8 },
          },
          {
            id: '2', name: 'Brown Rice', emoji: '🍚', quantity: 1, unit: 'cup',
            step: 0.25, matchedText: 'rice',
            perUnit: { kcal: 216, protein: 5, carbs: 45, fat: 2 },
          },
        ]);
        setStatus('idle');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return { items, status };
}
