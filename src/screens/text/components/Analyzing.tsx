import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const STEPS = [
  'Reading your description…',
  'Detecting food items…',
  'Matching ingredients…',
  'Estimating portions…',
  'Calculating nutrition…',
];

export function Analyzing() {
  const [step, setStep] = useState(0);
  const [pct, setPct] = useState(8);

  useEffect(() => {
    const s = setInterval(() => setStep((v) => (v + 1) % STEPS.length), 420);
    const p = setInterval(() => setPct((v) => Math.min(96, v + 7 + Math.floor(Math.random() * 11))), 180);
    return () => { clearInterval(s); clearInterval(p); };
  }, []);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <View style={styles.iconBg} />
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#fff" />
        </View>
      </View>
      <Text style={styles.title}>Analyzing your meal</Text>
      <Text style={styles.step}>{STEPS[step]}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, padding: 28, alignItems: 'center',
  },
  iconContainer: { width: 80, height: 80, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  iconBg: { position: 'absolute', width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(59,130,246,0.15)' },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#3b82f6',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  step: { fontSize: 14, fontWeight: '500', color: '#475569', marginTop: 4 },
  progressTrack: {
    width: '100%', height: 6, borderRadius: 3, backgroundColor: '#f1f5f9', marginTop: 20, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3, backgroundColor: '#3b82f6' },
});
