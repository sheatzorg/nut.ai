import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { FoodResult } from '../../../services/DatabaseService';
import type { RecognitionStatus } from '../hooks/useRecognition';

interface LiveRecognitionProps {
  items: FoodResult[];
  recognizing: boolean;
  hasText: boolean;
  error: boolean;
}

export function LiveRecognition({ items, recognizing, hasText, error }: LiveRecognitionProps) {
  const empty = items.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Text style={styles.label}>RECOGNIZED</Text>
          {!empty && <Text style={styles.count}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>}
        </View>
        {error ? (
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: '#ef4444' }]} />
            <Text style={[styles.statusText, { color: '#ef4444' }]}>Error</Text>
          </View>
        ) : recognizing ? (
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: '#3b82f6' }]} />
            <Text style={[styles.statusText, { color: '#3b82f6' }]}>Recognizing…</Text>
          </View>
        ) : !empty ? (
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: '#10b981' }]} />
            <Text style={[styles.statusText, { color: '#10b981' }]}>Live</Text>
          </View>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorCard}>
          <View style={styles.errorIcon}>
            <MaterialIcons name="error-outline" size={20} color="#ef4444" />
          </View>
          <Text style={styles.errorText}>
            Couldn't recognize foods. Check your connection and try again.
          </Text>
        </View>
      ) : empty ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="card-search" size={20} color="#2563eb" />
          </View>
          <Text style={styles.emptyText}>
            {hasText
              ? 'No foods recognized — try different names.'
              : 'Start typing — foods from the USDA database appear here.'}
          </Text>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemIcon}>
                <MaterialCommunityIcons name="food-variant" size={20} color="#2563eb" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemDetail}>
                  per 100g
                </Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemKcal}>{Math.round(item.kcal)} kcal</Text>
                <Text style={styles.itemMacros}>P:{item.protein.toFixed(1)} C:{item.carb.toFixed(1)} F:{item.fat.toFixed(1)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  labelLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569' },
  count: { fontSize: 12, fontWeight: '500', color: '#475569' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: '600' },
  errorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 16,
  },
  errorIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fef2f2', alignItems: 'center', justifyContent: 'center' },
  errorText: { flex: 1, fontSize: 14, fontWeight: '500', color: '#475569' },
  emptyCard: {
    alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, paddingVertical: 32, paddingHorizontal: 20,
  },
  emptyIcon: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontWeight: '500', color: '#475569', textAlign: 'center', maxWidth: 240 },
  itemsList: { gap: 8 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 12, padding: 10,
  },
  itemIcon: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  itemDetail: { fontSize: 12, color: '#94a3b8' },
  itemRight: { alignItems: 'flex-end' },
  itemKcal: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  itemMacros: { fontSize: 10, fontWeight: '500', color: '#94a3b8', fontVariant: ['tabular-nums'] },
});
