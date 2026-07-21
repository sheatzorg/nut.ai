export type NavId = 'home' | 'audio' | 'text' | 'image';

export type Macros = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type FoodItem = {
  id: string;
  name: string;
  emoji?: string;
  quantity: number;
  unit: string;
  step: number;
  matchedText?: string;
  perUnit: Macros;
};

export type EditItem = FoodItem & {
  uid: string;
  approved: boolean;
};
