export type Phase = 'idle' | 'recording' | 'paused';
export type NavId = 'home' | 'audio' | 'text' | 'image';

export type FoodItem = {
  id: string;
  name: string;
  detail: string;
  kcal: number;
  icon: string;
};

export type BackendFoodItem = {
  id: string;
  name: string;
  detail: string;
  kcal: number;
  category?: string;
};

export function formatTime(total: number) {
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
