import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';
import { searchFood, type FoodResult } from './DatabaseService';

// Common English filler words to strip from speech
const STOP_WORDS = new Set([
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'his', 'she', 'her', 'it',
  'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'this',
  'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a',
  'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while',
  'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up',
  'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further',
  'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any',
  'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
  'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can',
  'will', 'just', 'don', 'should', 'now', 'ate', 'eat', 'drank', 'drink',
  'had', 'have', 'having', 'bowl', 'plate', 'cup', 'piece', 'slice', 'glass',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'with', 'and', 'also', 'some', 'little', 'bit',
  'for', 'lunch', 'dinner', 'breakfast', 'snack', 'meal',
  'want', 'need', 'like', 'love', 'try', 'order', 'get',
]);

export type VoiceResult = {
  foods: FoodResult[];
  transcript: string;
};

/**
 * Request speech recognition permissions.
 */
export async function requestVoicePermissions(): Promise<boolean> {
  try {
    const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    return result.granted;
  } catch (e) {
    console.warn('Voice permission error:', e);
    return false;
  }
}

/**
 * Start listening for speech.
 */
export function startListening(
  onResult: (result: VoiceResult) => void,
  onError: (error: string) => void
): void {
  ExpoSpeechRecognitionModule.start({
    lang: 'en-US',
    interimResults: false,
  });
}

/**
 * Stop listening for speech.
 */
export function stopListening(): void {
  ExpoSpeechRecognitionModule.stop();
}

/**
 * Search foods from transcript text.
 * Strips filler words and queries SQLite for each remaining word.
 */
export async function searchFoodsFromTranscript(transcript: string): Promise<FoodResult[]> {
  const cleaned = transcript
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
    .trim();

  const words = cleaned.split(/\s+/);
  const potentialFoods = words.filter(
    (word) => !STOP_WORDS.has(word) && word.length > 1
  );
  const unique = [...new Set(potentialFoods)];

  const foundMap = new Map<number, FoodResult>();

  for (const word of unique) {
    try {
      const results = await searchFood(word);
      if (results.length > 0) {
        foundMap.set(results[0].id, results[0]);
      }
    } catch (e) {
      console.warn(`Search failed for "${word}":`, e);
    }
  }

  return Array.from(foundMap.values());
}
