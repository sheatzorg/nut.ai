import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import type { DailyLog } from '../../services/UserDataService';

interface RecentEntriesSectionProps {
  entries: DailyLog[];
  onViewAll?: () => void;
}

const SOURCE_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  text: 'edit-note',
  voice: 'mic',
  image: 'photo-camera',
};

function formatTime(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function RecentEntriesSection({ entries, onViewAll }: RecentEntriesSectionProps) {
  const isEmpty = entries.length === 0;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        {!isEmpty && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {isEmpty ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="restaurant" size={24} color={colors.onSurfaceVariant} />
            <Text style={styles.emptyText}>No entries yet. Log a meal to get started.</Text>
          </View>
        ) : (
          entries.map((entry, index) => (
            <View
              key={entry.id}
              style={[styles.entryItem, index < entries.length - 1 && styles.entryItemBorder]}
            >
              <View style={styles.entryLeft}>
                <View style={styles.entryIconContainer}>
                  <MaterialIcons
                    name={SOURCE_ICONS[entry.source] || 'restaurant'}
                    size={20}
                    color={colors.onSurfaceVariant}
                  />
                </View>
                <View>
                  <Text style={styles.entryName} numberOfLines={1}>{entry.food_name}</Text>
                  <Text style={styles.entryTime}>
                    {formatTime(entry.timestamp)} · {entry.grams}g
                  </Text>
                </View>
              </View>
              <Text style={styles.entryCalories}>{Math.round(entry.kcal)} kcal</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  viewAllText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  listContainer: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: `${colors.surfaceVariant}80`,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  entryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  entryItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: `${colors.surfaceVariant}80`,
  },
  entryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  entryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryName: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  entryTime: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontWeight: '400',
  },
  entryCalories: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
});
