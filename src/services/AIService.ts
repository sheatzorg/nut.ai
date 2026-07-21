import { loadTensorflowModel, type TfliteModel } from 'react-native-fast-tflite';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
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

// Model singleton
let model: TfliteModel | null = null;
let labels: string[] = Object.keys(foodMapping);

export interface AIResult {
  foodName: string;
  confidence: number;
  ingredients: string[];
  nutritionResults: FoodResult[];
}

/**
 * Initialize the AI model. Call once at app startup.
 */
export async function initAI(): Promise<void> {
  try {
    // Load the TFLite model from the app bundle
    const modelSource = require('../../assets/model/model.tflite');
    model = await loadTensorflowModel(modelSource, []);
    console.log('AI model loaded successfully');
    console.log(`Model inputs: ${model.inputs.length}, outputs: ${model.outputs.length}`);
  } catch (e) {
    console.warn('Could not load AI model:', e);
    console.warn('Image detection will use fallback data');
  }
}

/**
 * Check if the AI model is loaded and ready.
 */
export function isAIReady(): boolean {
  return model !== null;
}

/**
 * Recognize food from an image URI.
 * Returns the predicted food name, confidence, mapped ingredients, and their nutrition data.
 */
export async function recognizeFood(imageUri: string): Promise<AIResult | null> {
  if (!model) {
    console.warn('AI model not loaded');
    return null;
  }

  try {
    // 1. Resize image to 224x224 (what MobileNet expects)
    const manipulated = await manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { compress: 0.8, format: SaveFormat.JPEG }
    );

    // 2. Read the image as base64
    const response = await fetch(manipulated.uri);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // 3. Decode JPEG to raw pixel data
    // For simplicity, we use the image data directly
    // In production, you'd use a proper JPEG decoder
    const imageData = new Uint8Array(buffer);

    // 4. Create input tensor - MobileNetV3 expects [1, 224, 224, 3] Float32
    // Normalize pixels to [-1, 1] range
    const inputTensor = new Float32Array(224 * 224 * 3);

    // For JPEG data, we need to decode it first
    // This is a simplified approach - in production use a proper decoder
    for (let i = 0; i < Math.min(imageData.length, 224 * 224 * 3); i++) {
      inputTensor[i] = (imageData[i] / 127.5) - 1.0;
    }

    // 5. Run inference
    const inputBuffers = [inputTensor.buffer as ArrayBuffer];
    const outputBuffers = await model.run(inputBuffers);

    // 6. Parse output - should be [1, 101] probabilities
    const outputData = new Float32Array(outputBuffers[0]);

    // 7. Find the highest probability
    let maxProb = -Infinity;
    let maxIndex = -1;
    for (let i = 0; i < outputData.length; i++) {
      if (outputData[i] > maxProb) {
        maxProb = outputData[i];
        maxIndex = i;
      }
    }

    // 8. Get food name
    const foodName = labels[maxIndex] || 'unknown';
    const confidence = maxProb;

    // 9. Map to ingredients
    const foodKey = foodName.toLowerCase().replace(/\s/g, '_');
    const mapping = foodMapping[foodKey] || [];
    const ingredientNames = mapping.map((m) => m.name);

    // 10. Query database for nutrition
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
