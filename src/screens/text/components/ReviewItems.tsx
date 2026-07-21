import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatQty, nutritionFor } from '../lib/nutrition';
import { FoodGlyph } from './FoodGlyph';
import type { EditItem } from '../lib/types';

interface ReviewItemsProps {
  items: EditItem[];
  onSetQty: (uid: string, qty: number) => void;
  onToggle: (uid: string) => void;
  onRemove: (uid: string) => void;
  onEdit: () => void;
}

export function ReviewItems({ items, onSetQty, onToggle, onRemove, onEdit }: ReviewItemsProps) {
  const selected = items.filter((i) => i.approved);
  const kcal = selected.reduce((s, i) => s + nutritionFor(i).kcal, 0);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelLeft}>
          <Text style={styles.label}>REVIEW ITEMS</Text>
          <Text style={styles.count}>{selected.length} · {kcal} kcal</Text>
        </View>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>Edit text</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="search" size={22} color="#94a3b8" />
          </View>
          <Text style={styles.emptyText}>
            Nothing to review yet. Go back and describe your meal.
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={onEdit}>
            <Text style={styles.emptyButtonText}>Edit description</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.itemsList}>
          {items.map((item) => {
            const n = nutritionFor(item);
            return (
              <View key={item.uid} style={[styles.itemCard, !item.approved && styles.itemCardDisabled]}>
                <View style={styles.itemHeader}>
                  <TouchableOpacity
                    style={[styles.checkbox, item.approved && styles.checkboxChecked]}
                    onPress={() => onToggle(item.uid)}
                  >
                    {item.approved && <MaterialIcons name="check" size={14} color="#fff" />}
                  </TouchableOpacity>
                  <View style={styles.itemIcon}>
                    <FoodGlyph emoji={item.emoji} />
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.itemDetail} numberOfLines={1}>
                      {item.matchedText ? `"${item.matchedText}" · ` : ''}{n.kcal} kcal
                    </Text>
                  </View>
                </View>

                <View style={styles.quantityRow}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onSetQty(item.uid, item.quantity - item.step)}
                    >
                      <MaterialIcons name="remove" size={14} color="#0f172a" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{formatQty(item.quantity)} {item.unit}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onSetQty(item.uid, item.quantity + item.step)}
                    >
                      <MaterialIcons name="add" size={14} color="#0f172a" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onRemove(item.uid)}>
                    <MaterialIcons name="delete-outline" size={15} color="#94a3b8" />
                  </TouchableOpacity>
                </View>

                {item.approved && (
                  <View style={styles.macroChips}>
                    <View style={styles.chip}><View style={[styles.chipDot, { backgroundColor: '#3b82f6' }]} /><Text style={styles.chipText}>{n.protein}g protein</Text></View>
                    <View style={styles.chip}><View style={[styles.chipDot, { backgroundColor: '#f59e0b' }]} /><Text style={styles.chipText}>{n.carbs}g carbs</Text></View>
                    <View style={styles.chip}><View style={[styles.chipDot, { backgroundColor: '#ef4444' }]} /><Text style={styles.chipText}>{n.fat}g fat</Text></View>
                  </View>
                )}
              </View>
            );
          })}
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
  editText: { fontSize: 12, fontWeight: '600', color: '#3b82f6' },
  emptyCard: {
    alignItems: 'center', gap: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2',
    borderRadius: 16, paddingVertical: 48,
  },
  emptyIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, fontWeight: '500', color: '#475569', textAlign: 'center', maxWidth: 240 },
  emptyButton: { marginTop: 4, backgroundColor: '#3b82f6', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  emptyButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  itemsList: { gap: 10 },
  itemCard: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 14,
  },
  itemCardDisabled: { opacity: 0.45 },
  itemHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#e6ebf2',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  itemIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  itemDetail: { fontSize: 12, color: '#475569', marginTop: 2 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', gap: 0,
    borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 999, backgroundColor: '#fff', padding: 2,
  },
  qtyButton: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 13, fontWeight: '700', color: '#0f172a', minWidth: 64, textAlign: 'center' },
  deleteButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  macroChips: { flexDirection: 'row', gap: 6, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f8fafc', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  chipText: { fontSize: 11, fontWeight: '600', color: '#475569' },
});
