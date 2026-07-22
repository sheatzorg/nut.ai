import * as SQLite from 'expo-sqlite';

const DB_NAME = 'user_data.db';
let db: SQLite.SQLiteDatabase | null = null;

export interface LogEntry {
  food_name: string;
  grams: number;
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
  source: 'text' | 'voice' | 'image';
}

export interface DailyLog {
  id: number;
  timestamp: string;
  food_name: string;
  grams: number;
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
  source: string;
}

export interface DailyTotals {
  totalKcal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  totalFiber: number;
  mealCount: number;
}

/**
 * Initialize the user database. Creates tables if they don't exist.
 */
export async function initUserDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS daily_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      food_name TEXT NOT NULL,
      grams REAL DEFAULT 100,
      kcal REAL DEFAULT 0,
      protein REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      carb REAL DEFAULT 0,
      fiber REAL DEFAULT 0,
      source TEXT DEFAULT 'text'
    );

    CREATE TABLE IF NOT EXISTS custom_foods (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      kcal REAL DEFAULT 0,
      protein REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      carb REAL DEFAULT 0,
      fiber REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('User database initialized');
  return db;
}

/**
 * Save a meal (multiple food items) to the daily log.
 */
export async function logMeal(items: LogEntry[]): Promise<void> {
  if (!db) throw new Error('User database not initialized');
  if (items.length === 0) return;

  for (const item of items) {
    await db.runAsync(
      `INSERT INTO daily_logs (food_name, grams, kcal, protein, fat, carb, fiber, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.food_name,
        item.grams,
        item.kcal,
        item.protein,
        item.fat,
        item.carb,
        item.fiber,
        item.source,
      ]
    );
  }

  console.log(`Logged ${items.length} food items`);
}

/**
 * Get total macros for today.
 */
export async function getTodayTotals(): Promise<DailyTotals> {
  if (!db) throw new Error('User database not initialized');

  const result = await db.getFirstAsync<{
    totalKcal: number;
    totalProtein: number;
    totalFat: number;
    totalCarb: number;
    totalFiber: number;
    mealCount: number;
  }>(
    `SELECT
       COALESCE(SUM(kcal), 0) as totalKcal,
       COALESCE(SUM(protein), 0) as totalProtein,
       COALESCE(SUM(fat), 0) as totalFat,
       COALESCE(SUM(carb), 0) as totalCarb,
       COALESCE(SUM(fiber), 0) as totalFiber,
       COUNT(*) as mealCount
     FROM daily_logs
     WHERE date(timestamp) = date('now', 'localtime')`
  );

  return result || {
    totalKcal: 0,
    totalProtein: 0,
    totalFat: 0,
    totalCarb: 0,
    totalFiber: 0,
    mealCount: 0,
  };
}

/**
 * Get recent entries (last N meals, grouped by timestamp).
 */
export async function getRecentEntries(limit: number = 10): Promise<DailyLog[]> {
  if (!db) throw new Error('User database not initialized');

  const results = await db.getAllAsync<DailyLog>(
    `SELECT * FROM daily_logs
     ORDER BY timestamp DESC
     LIMIT ?`,
    [limit]
  );

  return results;
}

// ==================== Custom Foods ====================

export interface CustomFood {
  id: number;
  name: string;
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
  created_at: string;
}

/**
 * Add a custom food to the database.
 */
export async function addCustomFood(
  name: string,
  kcal: number,
  protein: number,
  fat: number,
  carb: number,
  fiber: number = 0
): Promise<number> {
  if (!db) throw new Error('User database not initialized');

  const result = await db.runAsync(
    `INSERT INTO custom_foods (name, kcal, protein, fat, carb, fiber)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, kcal, protein, fat, carb, fiber]
  );

  console.log(`Added custom food: ${name}`);
  return result.lastInsertRowId;
}

/**
 * Search custom foods by name (partial match).
 */
export async function searchCustomFoods(query: string): Promise<CustomFood[]> {
  if (!db) throw new Error('User database not initialized');

  const results = await db.getAllAsync<CustomFood>(
    `SELECT * FROM custom_foods
     WHERE name LIKE ?
     ORDER BY name ASC
     LIMIT 20`,
    [`%${query}%`]
  );

  return results;
}
