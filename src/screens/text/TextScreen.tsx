import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TopAppBar } from '../../components/TopAppBar';
import { Toast } from '../../components/Toast';
import { MealInput } from './components/MealInput';
import { LiveRecognition } from './components/LiveRecognition';
import { ReviewItems } from './components/ReviewItems';
import { Analyzing } from './components/Analyzing';
import { NutritionResult } from './components/NutritionResult';
import { BottomNavBar } from '../home/BottomNavBar';
import { useRecognition } from './hooks/useRecognition';
import { roundMacros, sumMacros } from './lib/nutrition';
import { logMeal } from '../../services/UserDataService';
import type { EditItem } from './lib/types';

type Stage = 'compose' | 'verify' | 'analyzing' | 'result';

interface TextScreenProps {
  onNavigate: (screen: string) => void;
}

export function TextScreen({ onNavigate }: TextScreenProps) {
  const [stage, setStage] = useState<Stage>('compose');
  const [rawText, setRawText] = useState('');
  const [items, setItems] = useState<EditItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { items: liveItems, status } = useRecognition(rawText);
  const recognizing = status === 'loading';
  const recognitionError = status === 'error';

  const selected = useMemo(() => items.filter((i) => i.approved), [items]);
  const totals = useMemo(() => roundMacros(sumMacros(selected)), [selected]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const handleVerify = () => {
    setItems(
      liveItems.map((item, idx) => ({
        id: String(item.id),
        name: item.name,
        emoji: undefined,
        quantity: 100,
        unit: 'g',
        step: 25,
        matchedText: rawText.trim().slice(0, 20),
        perUnit: {
          kcal: item.kcal,
          protein: item.protein,
          carbs: item.carb,
          fat: item.fat,
        },
        uid: `${item.id}-${idx}`,
        approved: true,
      })),
    );
    setStage('verify');
    setToast(
      liveItems.length
        ? `Verify ${liveItems.length} ${liveItems.length === 1 ? 'item' : 'items'}`
        : 'Nothing recognized yet',
    );
  };

  const handleCalculate = () => {
    setStage('analyzing');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStage('result'), 1100);
  };

  const handleNew = async () => {
    if (timer.current) clearTimeout(timer.current);

    // Save approved items to database
    if (selected.length > 0) {
      try {
        await logMeal(
          selected.map((item) => ({
            food_name: item.name,
            grams: item.quantity,
            kcal: (item.perUnit.kcal * item.quantity) / 100,
            protein: (item.perUnit.protein * item.quantity) / 100,
            fat: (item.perUnit.fat * item.quantity) / 100,
            carb: (item.perUnit.carbs * item.quantity) / 100,
            fiber: 0,
            source: 'text' as const,
          }))
        );
      } catch (e) {
        console.error('Failed to save meal:', e);
      }
    }

    setStage('compose');
    setRawText('');
    setItems([]);
    setToast('Meal logged!');
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

  const ctaLabel =
    stage === 'compose' ? 'Review & verify' :
    stage === 'verify' ? 'Calculate nutrition' : 'Log & start new';

  const ctaDisabled =
    stage === 'compose' ? liveItems.length === 0 :
    stage === 'verify' ? selected.length === 0 : false;

  const ctaIcon =
    stage === 'compose' ? 'auto-fix' :
    stage === 'verify' ? 'calculator' : 'refresh';

  const handleCta = () => {
    if (stage === 'compose') handleVerify();
    else if (stage === 'verify') handleCalculate();
    else handleNew();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fbfdff" />

      <Toast message={toast} />
      <TopAppBar title="Text Log" subtitle="Describe a meal" onBack={() => onNavigate('home')} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {stage === 'compose' && (
          <>
            <MealInput value={rawText} onChange={setRawText} />
            <LiveRecognition items={liveItems} recognizing={recognizing} hasText={rawText.trim().length > 0} error={recognitionError} />
          </>
        )}
        {stage === 'verify' && (
          <ReviewItems items={items} onSetQty={setQty} onToggle={toggle} onRemove={remove} onEdit={() => setStage('compose')} />
        )}
        {stage === 'analyzing' && <Analyzing />}
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

      <BottomNavBar activeTab="text" onTabPress={(tab) => onNavigate(tab)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fbfdff' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20, gap: 20, paddingHorizontal: 20, paddingTop: 24 },
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
