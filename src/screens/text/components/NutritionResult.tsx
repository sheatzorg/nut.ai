import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatQty, nutritionFor } from '../lib/nutrition';
import { FoodGlyph } from './FoodGlyph';
import type { FoodItem, Macros } from '../lib/types';

interface NutritionResultProps {
  items: FoodItem[];
  totals: Macros;
  onBack: () => void;
}

export function NutritionResult({ items, totals, onBack }: NutritionResultProps) {
  const pKcal = totals.protein * 4;
  const cKcal = totals.carbs * 4;
  const fKcal = totals.fat * 9;
  const sum = pKcal + cKcal + fKcal || 1;
  const pct = (k: number) => Math.round((k / sum) * 100);

  const macros = [
    { label: 'Protein', grams: totals.protein, color: '#3b82f6', kcal: pKcal },
    { label: 'Carbs', grams: totals.carbs, color: '#f59e0b', kcal: cKcal },
    { label: 'Fat', grams: totals.fat, color: '#ef4444', kcal: fKcal },
  ];

  return (
    <View style={styles.container}>
      {/* Total energy */}
      <View style={styles.energyCard}>
        <View style={styles.energyLeft}>
          <View style={styles.energyIcon}>
            <MaterialCommunityIcons name="fire" size={22} color="#f97316" />
          </View>
          <View>
            <Text style={styles.energyTitle}>Total energy</Text>
            <Text style={styles.energySubtitle}>{items.length} {items.length === 1 ? 'item' : 'items'} · this meal</Text>
          </View>
        </View>
        <View style={styles.energyRight}>
          <Text style={styles.energyKcal}>{totals.kcal}</Text>
          <Text style={styles.energyUnit}>kcal</Text>
        </View>
      </View>

      {/* Macros */}
      <View style={styles.macrosCard}>
        <Text style={styles.sectionLabel}>MACRONUTRIENTS</Text>
        {macros.map((m) => (
          <View key={m.label} style={styles.macroRow}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>{m.label}</Text>
              <Text style={styles.macroValue}>{formatQty(m.grams)}g · {pct(m.kcal)}%</Text>
            </View>
            <View style={styles.macroTrack}>
              <View style={[styles.macroFill, { width: `${pct(m.kcal)}%`, backgroundColor: m.color }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Per item */}
      <View>
        <Text style={styles.sectionLabel}>PER ITEM</Text>
        <View style={styles.itemsList}>
          {items.map((item, i) => {
            const n = nutritionFor(item);
            return (
              <View key={`${item.id}-${i}`} style={styles.itemCard}>
                <View style={styles.itemIcon}>
                  <FoodGlyph emoji={item.emoji} />
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.itemDetail} numberOfLines={1}>
                    {formatQty(item.quantity)} {item.unit} · P{n.protein} C{n.carbs} F{n.fat}
                  </Text>
                </View>
                <Text style={styles.itemKcal}>{n.kcal}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={15} color="#475569" />
        <Text style={styles.backText}>Back to review</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', gap: 16 },
  energyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 20,
  },
  energyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  energyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff7ed', alignItems: 'center', justifyContent: 'center' },
  energyTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  energySubtitle: { fontSize: 12, fontWeight: '500', color: '#475569', marginTop: 2 },
  energyRight: { alignItems: 'flex-end' },
  energyKcal: { fontSize: 30, fontWeight: '800', color: '#0f172a', fontVariant: ['tabular-nums'] },
  energyUnit: { fontSize: 14, fontWeight: '500', color: '#475569' },
  macrosCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 20, gap: 16,
  },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569' },
  macroRow: { gap: 6 },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  macroLabel: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  macroValue: { fontSize: 12, fontWeight: '500', color: '#475569' },
  macroTrack: { height: 8, borderRadius: 4, backgroundColor: '#f1f5f9', overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: 4 },
  itemsList: { gap: 8 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 14,
  },
  itemIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  itemDetail: { fontSize: 12, color: '#475569', marginTop: 2 },
  itemKcal: { fontSize: 14, fontWeight: '700', color: '#0f172a', fontVariant: ['tabular-nums'] },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center', paddingVertical: 8 },
  backText: { fontSize: 14, fontWeight: '600', color: '#475569' },
});
