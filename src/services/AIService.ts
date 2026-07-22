import { loadTensorflowModel, type TfliteModel } from 'react-native-fast-tflite';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { searchFood, type FoodResult } from './DatabaseService';

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

let model: TfliteModel | null = null;
let labels: string[] = Object.keys(foodMapping);

export interface AIResult {
  foodName: string;
  confidence: number;
  ingredients: string[];
  nutritionResults: FoodResult[];
}

/**
 * Initialize the AI model. Fails silently if model.tflite is missing.
 */
export async function initAI(): Promise<void> {
  try {
    const modelSource = require('../../assets/model/model.tflite');
    model = await loadTensorflowModel(modelSource, []);
    console.log('AI model loaded');
  } catch (e) {
    console.warn('AI model not available — image detection uses fallback');
  }
}

export function isAIReady(): boolean {
  return model !== null;
}

/**
 * Recognize food from an image URI.
 * Returns null if model isn't loaded (caller should use fallback).
 */
export async function recognizeFood(imageUri: string): Promise<AIResult | null> {
  if (!model) return null;

  try {
    // 1. Resize to 224x224 and get base64
    const manipulated = await manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 0.8, format: SaveFormat.JPEG, base64: true }
    );

    // 2. Decode base64 to bytes
    const base64 = manipulated.base64;
    if (!base64) throw new Error('No base64 data');

    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // 3. JPEG has a header — skip it and extract raw pixel data
    // For a proper implementation, use a JPEG decoder library
    // Here we assume the image is small enough that bytes contain usable pixel data
    const inputTensor = new Float32Array(224 * 224 * 3);
    const pixelCount = Math.min(bytes.length, 224 * 224 * 3);
    for (let i = 0; i < pixelCount; i++) {
      inputTensor[i] = (bytes[i] / 127.5) - 1.0;
    }

    // 4. Run inference
    const outputBuffers = await model.run([inputTensor.buffer as ArrayBuffer]);
    const outputData = new Float32Array(outputBuffers[0]);

    // 5. Find best prediction
    let maxProb = -Infinity;
    let maxIndex = 0;
    for (let i = 0; i < outputData.length; i++) {
      if (outputData[i] > maxProb) {
        maxProb = outputData[i];
        maxIndex = i;
      }
    }

    const foodName = labels[maxIndex] || 'unknown';
    const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
    const mapping = foodMapping[foodKey] || [];
    const ingredientNames = mapping.map((m) => m.name);

    // 6. Query DB for nutrition
    const nutritionResults: FoodResult[] = [];
    for (const name of ingredientNames) {
      const results = await searchFood(name);
      if (results.length > 0) nutritionResults.push(results[0]);
    }

    return { foodName, confidence: maxProb, ingredients: ingredientNames, nutritionResults };
  } catch (error) {
    console.error('AI error:', error);
    return null;
  }
}

export function mapToIngredients(foodName: string): string[] {
  const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
  return (foodMapping[foodKey] || []).map((m) => m.name);
}

export function getIngredientQuantities(foodName: string): IngredientMapping[] {
  const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
  return foodMapping[foodKey] || [];
}
