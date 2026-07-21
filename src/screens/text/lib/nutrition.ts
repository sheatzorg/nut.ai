import type { FoodItem, Macros } from './types';

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scaleMacros(m: Macros, factor: number): Macros {
  return {
    kcal: Math.round(m.kcal * factor),
    protein: round1(m.protein * factor),
    carbs: round1(m.carbs * factor),
    fat: round1(m.fat * factor),
  };
}

export function nutritionFor(item: FoodItem): Macros {
  return scaleMacros(item.perUnit, item.quantity);
}

export function emptyMacros(): Macros {
  return { kcal: 0, protein: 0, carbs: 0, fat: 0 };
}

export function sumMacros(items: FoodItem[]): Macros {
  return items.reduce(
    (acc, item) => {
      const n = nutritionFor(item);
      return {
        kcal: acc.kcal + n.kcal,
        protein: acc.protein + n.protein,
        carbs: acc.carbs + n.carbs,
        fat: acc.fat + n.fat,
      };
    },
    emptyMacros(),
  );
}

export function roundMacros(m: Macros): Macros {
  return {
    kcal: Math.round(m.kcal),
    protein: round1(m.protein),
    carbs: round1(m.carbs),
    fat: round1(m.fat),
  };
}

export function formatQty(n: number): string {
  return n % 1 === 0 ? n.toString() : n.toFixed(1);
}
