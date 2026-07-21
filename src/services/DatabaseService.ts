import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'nutrients.db';

let db: SQLite.SQLiteDatabase | null = null;

export interface FoodResult {
  id: number;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
}

export interface NutrientTotals {
  totalKcal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  totalFiber: number;
}

/**
 * Initialize the database. Copies from assets on first launch, then opens.
 */
export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  const dbPath = `${FileSystem.documentDirectory}${DB_NAME}`;
  const fileInfo = await FileSystem.getInfoAsync(dbPath);

  if (!fileInfo.exists) {
    // Try to find the asset in the bundle
    try {
      const asset = require('../../assets/nutrients.db');
      // Expo assets have a uri property
      if (asset && asset.uri) {
        await FileSystem.copyAsync({ from: asset.uri, to: dbPath });
        console.log('Database copied from bundle asset');
      } else {
        throw new Error('Asset URI not found');
      }
    } catch (e) {
      // Fallback: try copying from the constant
      try {
        const Constants = require('expo-constants');
        const assets = Constants.default?.assets || [];
        const dbAsset = assets.find((a: any) =>
          a.name === 'nutrients' || a.uri?.includes('nutrients.db')
        );
        if (dbAsset) {
          await FileSystem.copyAsync({ from: dbAsset.uri, to: dbPath });
          console.log('Database copied from constants');
        } else {
          throw new Error('Database asset not found in bundle');
        }
      } catch (e2) {
        console.error('Could not copy database:', e2);
        throw new Error('Database not found in app bundle. Make sure nutrients.db is in assets/');
      }
    }
  }

  db = await SQLite.openDatabaseAsync(DB_NAME);
  console.log('Database opened');
  return db;
}

/**
 * Search foods using FTS5 full-text search.
 * Supports partial matching with wildcard.
 */
export async function searchFood(query: string): Promise<FoodResult[]> {
  if (!db) throw new Error('Database not initialized');

  const sanitized = query.trim().toLowerCase();
  if (!sanitized) return [];

  try {
    const results = await db.getAllAsync<FoodResult>(
      `SELECT f.id, f.name, f.kcal, f.protein, f.fat, f.carb, f.fiber
       FROM foods_fts
       JOIN foods f ON foods_fts.rowid = f.id
       WHERE foods_fts.name MATCH ?
       LIMIT 20`,
      [`${sanitized}*`]
    );
    return results;
  } catch (e) {
    console.error('Search error:', e);
    return [];
  }
}

/**
 * Calculate total nutrients for a list of ingredients.
 * Each item should have per-100g values and a `grams` field.
 */
export function calculateNutrients(
  ingredients: Array<{ kcal: number; protein: number; fat: number; carb: number; fiber: number; grams: number }>
): NutrientTotals {
  if (!ingredients.length) {
    return { totalKcal: 0, totalProtein: 0, totalFat: 0, totalCarb: 0, totalFiber: 0 };
  }

  let totalKcal = 0, totalProtein = 0, totalFat = 0, totalCarb = 0, totalFiber = 0;

  for (const item of ingredients) {
    const ratio = (item.grams || 0) / 100;
    totalKcal += (item.kcal || 0) * ratio;
    totalProtein += (item.protein || 0) * ratio;
    totalFat += (item.fat || 0) * ratio;
    totalCarb += (item.carb || 0) * ratio;
    totalFiber += (item.fiber || 0) * ratio;
  }

  const r = (n: number) => Math.round(n * 10) / 10;
  return {
    totalKcal: r(totalKcal),
    totalProtein: r(totalProtein),
    totalFat: r(totalFat),
    totalCarb: r(totalCarb),
    totalFiber: r(totalFiber),
  };
}

/**
 * Get a food item by ID.
 */
export async function getFoodById(id: number): Promise<FoodResult | null> {
  if (!db) throw new Error('Database not initialized');

  try {
    const result = await db.getFirstAsync<FoodResult>(
      'SELECT id, name, kcal, protein, fat, carb, fiber FROM foods WHERE id = ?',
      [id]
    );
    return result || null;
  } catch (e) {
    console.error('Get food error:', e);
    return null;
  }
}
