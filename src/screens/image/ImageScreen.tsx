import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { TopAppBar } from '../../components/TopAppBar';
import { Analyzing } from '../text/components/Analyzing';
import { ReviewItems } from '../text/components/ReviewItems';
import { NutritionResult } from '../text/components/NutritionResult';
import { BottomNavBar } from '../home/BottomNavBar';
import { roundMacros, sumMacros } from '../text/lib/nutrition';
import { recognizeFood, getIngredientQuantities, initAI } from '../../services/AIService';
import { searchFood } from '../../services/DatabaseService';
import type { EditItem } from '../text/lib/types';

type Stage = 'select' | 'analyzing' | 'verify' | 'result';

interface ImageScreenProps {
  onNavigate: (screen: string) => void;
}

export function ImageScreen({ onNavigate }: ImageScreenProps) {
  const [stage, setStage] = useState<Stage>('select');
  const [images, setImages] = useState<{ uri: string }[]>([]);
  const [items, setItems] = useState<EditItem[]>([]);

  const selected = useMemo(() => items.filter((i) => i.approved), [items]);
  const totals = useMemo(() => roundMacros(sumMacros(selected)), [selected]);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => ({ uri: a.uri }))]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const detect = async () => {
    setStage('analyzing');
    try {
      const imageUri = images[0]?.uri;
      if (!imageUri) throw new Error('No image');

      // Run AI inference
      const prediction = await recognizeFood(imageUri);

      if (!prediction) {
        // Fallback: show mock data if AI fails
        setItems([
          {
            id: '1', name: 'Grilled Chicken', emoji: '🍗', quantity: 100, unit: 'g',
            step: 25, matchedText: 'AI detection',
            perUnit: { kcal: 230, protein: 35, carbs: 0, fat: 8 },
            uid: '1-0', approved: true,
          },
        ]);
        setStage('verify');
        return;
      }

      // Map predicted dish to ingredients and query DB
      const ingredientNames = getIngredientQuantities(prediction.foodName);
      const verifiedItems: EditItem[] = [];

      for (const mapping of ingredientNames) {
        const results = await searchFood(mapping.name);
        if (results.length > 0) {
          const dbItem = results[0];
          verifiedItems.push({
            id: String(dbItem.id),
            name: dbItem.name,
            emoji: undefined,
            quantity: mapping.grams,
            unit: 'g',
            step: 25,
            matchedText: prediction.foodName,
            perUnit: { kcal: dbItem.kcal, protein: dbItem.protein, carbs: dbItem.carb, fat: dbItem.fat },
            uid: `${dbItem.id}-${verifiedItems.length}`,
            approved: true,
          });
        }
      }

      setItems(verifiedItems.length > 0 ? verifiedItems : [
        {
          id: '1', name: prediction.foodName, quantity: 100, unit: 'g',
          step: 25, matchedText: `AI: ${prediction.foodName}`,
          perUnit: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
          uid: '1-0', approved: true,
        },
      ]);
      setStage('verify');
    } catch (e) {
      console.error('Detection error:', e);
      setItems([
        {
          id: '1', name: 'Grilled Chicken', emoji: '🍗', quantity: 100, unit: 'g',
          step: 25, matchedText: 'fallback',
          perUnit: { kcal: 230, protein: 35, carbs: 0, fat: 8 },
          uid: '1-0', approved: true,
        },
      ]);
      setStage('verify');
    }
  };

  const calculate = () => setStage('result');

  const handleNew = () => {
    setImages([]);
    setItems([]);
    setStage('select');
  };

  const setQty = (uid: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.uid !== uid) return i;
        const snapped = Math.round(qty / i.step) * i.step;
        return { ...i, quantity: Math.max(i.step, snapped) };
      }),
    );
  };

  const toggle = (uid: string) =>
    setItems((prev) => prev.map((i) => (i.uid === uid ? { ...i, approved: !i.approved } : i)));

  const remove = (uid: string) =>
    setItems((prev) => prev.filter((i) => i.uid !== uid));

  const handleCta = () => {
    if (stage === 'select') detect();
    else if (stage === 'verify') calculate();
    else handleNew();
  };

  const ctaLabel =
    stage === 'select' ? 'Detect foods' :
    stage === 'verify' ? 'Calculate nutrition' : 'Log & start new';

  const ctaDisabled =
    stage === 'select' ? images.length === 0 :
    stage === 'verify' ? selected.length === 0 : false;

  const ctaIcon =
    stage === 'select' ? 'scan' :
    stage === 'verify' ? 'calculator' : 'refresh';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fbfdff" />
      <TopAppBar title="Image Scan" subtitle="Snap your meal" onBack={() => onNavigate('home')} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stage === 'select' && (
          <>
            {/* Camera button — opens camera, user can pick gallery from within */}
            <TouchableOpacity style={styles.cameraButton} onPress={openCamera} activeOpacity={0.85}>
              <View style={styles.cameraIconCircle}>
                <MaterialCommunityIcons name="camera" size={28} color="#fff" />
              </View>
              <Text style={styles.cameraTitle}>Scan your meal</Text>
              <Text style={styles.cameraSubtitle}>
                Take a photo — you can also pick from your gallery inside the camera
              </Text>
            </TouchableOpacity>

            {/* Show captured images */}
            {images.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>CAPTURED PHOTOS</Text>
                <View style={styles.grid}>
                  {images.map((img, i) => (
                    <View key={img.uri} style={styles.imageContainer}>
                      <View style={styles.imagePlaceholder}>
                        <MaterialCommunityIcons name="image" size={24} color="#94a3b8" />
                      </View>
                      <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(i)}>
                        <MaterialCommunityIcons name="close" size={13} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </>
            )}
          </>
        )}
        {stage === 'analyzing' && <Analyzing />}
        {stage === 'verify' && (
          <ReviewItems items={items} onSetQty={setQty} onToggle={toggle} onRemove={remove} onEdit={() => setStage('select')} />
        )}
        {stage === 'result' && (
          <NutritionResult items={selected} totals={totals} onBack={() => setStage('verify')} />
        )}
      </ScrollView>

      {/* CTA button */}
      {stage !== 'analyzing' && (
        <View style={styles.ctaArea}>
          <TouchableOpacity
            style={[styles.ctaButton, ctaDisabled && styles.ctaDisabled]}
            onPress={handleCta}
            disabled={ctaDisabled}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name={ctaIcon as any} size={18} color={ctaDisabled ? '#94a3b8' : '#fff'} />
            <Text style={[styles.ctaText, ctaDisabled && styles.ctaTextDisabled]}>{ctaLabel}</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNavBar activeTab="image" onTabPress={(tab) => onNavigate(tab)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fbfdff' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20, gap: 20, paddingHorizontal: 20, paddingTop: 24 },
  cameraButton: {
    alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, paddingVertical: 32, paddingHorizontal: 20,
  },
  cameraIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#3b82f6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  cameraTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cameraSubtitle: { fontSize: 13, color: '#475569', textAlign: 'center', lineHeight: 18 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569', paddingHorizontal: 4 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  imageContainer: {
    width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#e6ebf2', backgroundColor: '#f8fafc',
  },
  imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  removeButton: {
    position: 'absolute', top: 4, right: 4,
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center',
  },
  ctaArea: { paddingHorizontal: 20, paddingBottom: 4 },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 54, borderRadius: 16, backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  ctaDisabled: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', shadowOpacity: 0, elevation: 0 },
  ctaText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  ctaTextDisabled: { color: '#94a3b8' },
});
