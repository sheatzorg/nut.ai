import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { type FoodItem, type Phase } from '../lib/app';

interface IdentifiedItemsProps {
  items: FoodItem[];
  phase: Phase;
  kcal: number;
  confirmed: boolean;
}

export function IdentifiedItems({ items, phase, kcal, confirmed }: IdentifiedItemsProps) {
  const recording = phase === 'recording';

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>IDENTIFIED</Text>
        <Text style={styles.count}>
          {items.length ? `${items.length} · ${kcal} kcal` : '—'}
        </Text>
      </View>

      <View style={styles.itemsList}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemLeft}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={item.icon as any} size={20} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetail}>{item.detail}</Text>
              </View>
            </View>
            {confirmed ? (
              <View style={styles.checkCircle}>
                <MaterialIcons name="check" size={17} color="#10b981" />
              </View>
            ) : (
              <View style={styles.editCircle}>
                <MaterialIcons name="edit" size={15} color="#94a3b8" />
              </View>
            )}
          </View>
        ))}

        {/* Live detection placeholder */}
        {recording && (
          <View style={styles.detectingCard}>
            <View style={styles.detectingIcon}>
              <MaterialCommunityIcons name="auto-fix" size={18} color="rgba(59,130,246,0.5)" />
            </View>
            <View style={styles.detectingLines}>
              <View style={[styles.skeleton, { width: '66%' }]} />
              <View style={[styles.skeleton, { width: '33%' }]} />
            </View>
          </View>
        )}

        {/* Empty state */}
        {items.length === 0 && !recording && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <MaterialCommunityIcons name="silverware-fork-knife" size={22} color="#94a3b8" />
            </View>
            <Text style={styles.emptyText}>
              Start talking — detected foods show up here automatically.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 4 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569' },
  count: { fontSize: 12, fontWeight: '500', color: '#475569' },
  itemsList: { gap: 10 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, padding: 14,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  itemDetail: { fontSize: 12, fontWeight: '500', color: '#475569', marginTop: 2 },
  checkCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ecfdf5', alignItems: 'center', justifyContent: 'center' },
  editCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  detectingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderWidth: 1, borderColor: 'rgba(59,130,246,0.25)', borderStyle: 'dashed',
    borderRadius: 16, padding: 14,
  },
  detectingIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.06)', alignItems: 'center', justifyContent: 'center' },
  detectingLines: { flex: 1, gap: 6 },
  skeleton: { height: 12, borderRadius: 6, backgroundColor: 'rgba(226,232,240,0.8)' },
  emptyState: { alignItems: 'center', gap: 12, paddingVertical: 40 },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontWeight: '500', color: '#475569', textAlign: 'center', maxWidth: 220, lineHeight: 20 },
});
