import { useTensorflowModel } from 'react-native-fast-tflite';
import { Platform } from 'react-native';
import { searchFood, type FoodResult } from './DatabaseService';

// Food mapping type
interface IngredientMapping {
  name: string;
  grams: number;
}

// Load food mapping
let foodMapping: Record<string, IngredientMapping[]> = {};
try {
  foodMapping = require('../../assets/model/food_mapping.json');
} catch (e) {
  console.warn('Could not load food_mapping.json');
}

// Load labels
let labels: string[] = [];
try {
  // Labels will be loaded from the bundled file at runtime
  // For now, use the food_mapping keys as our label set
  labels = Object.keys(foodMapping);
} catch (e) {
  console.warn('Could not load labels');
}

export interface AIResult {
  foodName: string;
  confidence: number;
  ingredients: string[];
  nutritionResults: FoodResult[];
}

/**
 * Initialize the AI model. Call once at app startup.
 */
export function initAI(): void {
  // Model is loaded lazily by useTensorflowModel hook
  console.log('AI service initialized');
  console.log(`Loaded ${labels.length} food labels`);
  console.log(`Loaded ${Object.keys(foodMapping).length} food mappings`);
}

/**
 * Recognize food from an image URI.
 * Returns the predicted food name, confidence, mapped ingredients, and their nutrition data.
 */
export async function recognizeFood(
  imageUri: string,
  model: any
): Promise<AIResult | null> {
  try {
    if (!model?.model) {
      throw new Error('Model not loaded');
    }

    // 1. Run inference
    // The model expects a [1, 224, 224, 3] Float32Array
    // For now, we'll use a simplified approach - the actual image preprocessing
    // depends on the specific model architecture
    const inputTensor = await preprocessImage(imageUri);
    const outputs = model.model.run([inputTensor]);

    // 2. Find the highest probability
    const probabilities = outputs[0];
    let maxProb = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < probabilities.length; i++) {
      if (probabilities[i] > maxProb) {
        maxProb = probabilities[i];
        maxIndex = i;
      }
    }

    // 3. Get food name
    const foodName = labels[maxIndex] || 'unknown';
    const confidence = maxProb;

    // 4. Map to ingredients
    const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
    const mapping = foodMapping[foodKey] || [];
    const ingredientNames = mapping.map((m) => m.name);

    // 5. Query database for nutrition
    const nutritionResults: FoodResult[] = [];
    for (const name of ingredientNames) {
      const results = await searchFood(name);
      if (results.length > 0) {
        nutritionResults.push(results[0]);
      }
    }

    return {
      foodName,
      confidence,
      ingredients: ingredientNames,
      nutritionResults,
    };
  } catch (error) {
    console.error('AI recognition error:', error);
    return null;
  }
}

/**
 * Preprocess image for TFLite model.
 * Converts image URI to a Float32Array of shape [1, 224, 224, 3].
 */
async function preprocessImage(imageUri: string): Promise<Float32Array> {
  // This is a placeholder - actual implementation depends on:
  // 1. react-native-fast-tflite's image input format
  // 2. The specific model's expected input (normalized? INT8? Float32?)
  //
  // For a real implementation, you would:
  // 1. Use expo-image-manipulator to resize to 224x224
  // 2. Read pixels as base64
  // 3. Decode to RGB array
  // 4. Normalize to model's expected range

  // Placeholder: return zeros (model won't work but won't crash)
  return new Float32Array(224 * 224 * 3);
}

/**
 * Map a food name to its typical ingredients.
 */
export function mapToIngredients(foodName: string): string[] {
  const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
  const mapping = foodMapping[foodKey] || [];
  return mapping.map((m) => m.name);
}

/**
 * Get ingredient quantities for a food.
 */
export function getIngredientQuantities(foodName: string): IngredientMapping[] {
  const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
  return foodMapping[foodKey] || [];
}
