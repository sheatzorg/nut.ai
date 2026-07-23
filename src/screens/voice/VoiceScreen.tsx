import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TopAppBar } from '../../components/TopAppBar';
import { Toast } from '../../components/Toast';
import { RecordingVisualizer } from './components/RecordingVisualizer';
import { LiveTranscript } from './components/LiveTranscript';
import { IdentifiedItems } from './components/IdentifiedItems';
import { ManualEntry, ManualEntryToggle } from './components/ManualEntry';
import { BottomNavBar } from '../home/BottomNavBar';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { searchFoodsFromTranscript } from '../../services/VoiceService';
import { logMeal } from '../../services/UserDataService';

interface VoiceScreenProps {
  onNavigate: (screen: string) => void;
}

export function VoiceScreen({ onNavigate }: VoiceScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { foods, status, transcript, startListening, stopListening, clearFoods, addFoods } = useVoiceRecognition();
  const isListening = status === 'listening';
  const isProcessing = status === 'processing';

  // Timer
  useEffect(() => {
    if (!isListening) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [isListening]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const totalKcal = foods.reduce((sum, f) => sum + f.kcal, 0);

  const handleToggleMic = () => {
    if (confirmed) return;
    if (isListening) {
      setElapsed(0);
      stopListening();
    } else {
      setElapsed(0);
      startListening();
    }
  };

  const handleConfirm = async () => {
    if (foods.length === 0 || confirmed) return;

    // Save to database
    try {
      await logMeal(
        foods.map((f) => ({
          food_name: f.name,
          grams: 100,
          kcal: f.kcal,
          protein: f.protein,
          fat: f.fat,
          carb: f.carb,
          fiber: f.fiber,
          source: 'voice' as const,
        }))
      );
    } catch (e) {
      console.error('Failed to save meal:', e);
    }

    setConfirmed(true);
  };

  const handleReset = () => {
    setElapsed(0);
    setConfirmed(false);
    setManualOpen(false);
    clearFoods();
  };

  const handleManualAdd = async (text: string) => {
    const results = await searchFoodsFromTranscript(text);
    if (results.length > 0) {
      addFoods(results);
    }
  };

  const paused = !isListening && !isProcessing && elapsed > 0;
  const ctaEnabled = paused && foods.length > 0 && !confirmed;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fbfdff" />
      <TopAppBar title="Voice Log" subtitle="Speak your meal" onBack={() => onNavigate('home')} />

      <Toast message={toast} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <RecordingVisualizer
          phase={isListening ? 'recording' : paused ? 'paused' : 'idle'}
          elapsed={elapsed}
          onToggle={handleToggleMic}
        />

        <LiveTranscript words={transcript.split(/\s+/).filter(Boolean)} phase={isListening ? 'recording' : 'idle'} />

        <View style={styles.manualSection}>
          <ManualEntryToggle open={manualOpen} onToggle={() => setManualOpen((o) => !o)} />
          {manualOpen && <ManualEntry onAdd={handleManualAdd} />}
        </View>

        {confirmed && (
          <View style={styles.successCard}>
            <View style={styles.successLeft}>
              <View style={styles.successIcon}><View style={styles.checkDot} /></View>
              <View>
                <Text style={styles.successTitle}>Logged successfully</Text>
                <Text style={styles.successSubtitle}>{foods.length} items captured</Text>
              </View>
            </View>
            <Text style={styles.successKcal}>{totalKcal} kcal</Text>
          </View>
        )}

        <IdentifiedItems
          items={foods.map(f => ({
            id: String(f.id),
            name: f.name,
            detail: `per 100g`,
            kcal: f.kcal,
            icon: 'food-variant',
          }))}
          phase={isListening ? 'recording' : 'paused' ? 'paused' : 'idle'}
          kcal={totalKcal}
          confirmed={confirmed}
        />
      </ScrollView>

      {/* CTA button */}
      <View style={styles.ctaArea}>
        {confirmed ? (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.8}>
            <MaterialIcons name="refresh" size={18} color="#2563eb" />
            <Text style={styles.resetText}>Log another meal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, !ctaEnabled && styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={!ctaEnabled}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="calculator" size={18} color={ctaEnabled ? '#fff' : '#94a3b8'} />
            <Text style={[styles.confirmText, !ctaEnabled && styles.confirmTextDisabled]}>
              Confirm & Calculate
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <BottomNavBar activeTab="voice" onTabPress={(tab) => onNavigate(tab)} />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fbfdff' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 20, alignItems: 'center', gap: 28, paddingHorizontal: 20, paddingTop: 24 },
  manualSection: { width: '100%', alignItems: 'center', gap: 8 },
  successCard: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#3b82f6', borderRadius: 16, padding: 20,
  },
  successLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  successIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  checkDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' },
  successTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  successSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  successKcal: { fontSize: 20, fontWeight: '800', color: '#fff' },
  ctaArea: { paddingHorizontal: 20, paddingBottom: 4 },
  confirmButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  confirmButtonDisabled: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', shadowOpacity: 0, elevation: 0 },
  confirmText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  confirmTextDisabled: { color: '#94a3b8' },
  resetButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 16, borderWidth: 1, borderColor: '#e6ebf2', backgroundColor: '#fff',
  },
  resetText: { fontSize: 14, fontWeight: '600', color: '#2563eb' },
});
