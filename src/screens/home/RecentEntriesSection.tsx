import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface Entry {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  name: string;
  time: string;
  calories: number;
}

interface RecentEntriesSectionProps {
  entries: Entry[];
  onViewAll?: () => void;
  onEntryPress?: (entry: Entry) => void;
}

const DEFAULT_ENTRIES: Entry[] = [
  { id: '1', icon: 'local-cafe', name: 'Oatmeal & Coffee', time: '8:30 AM', calories: 320 },
  { id: '2', icon: 'restaurant', name: 'Grilled Chicken Salad', time: '1:15 PM', calories: 450 },
];

export function RecentEntriesSection({
  entries = DEFAULT_ENTRIES,
  onViewAll,
  onEntryPress,
}: RecentEntriesSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Entries</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {entries.map((entry, index) => (
          <TouchableOpacity
            key={entry.id}
            style={[styles.entryItem, index < entries.length - 1 && styles.entryItemBorder]}
            onPress={() => onEntryPress?.(entry)}
            activeOpacity={0.7}
          >
            <View style={styles.entryLeft}>
              <View style={styles.entryIconContainer}>
                <MaterialIcons name={entry.icon} size={20} color={colors.onSurfaceVariant} />
              </View>
              <View>
                <Text style={styles.entryName}>{entry.name}</Text>
                <Text style={styles.entryTime}>{entry.time}</Text>
              </View>
            </View>
            <Text style={styles.entryCalories}>{entry.calories} kcal</Text>
          </TouchableOpacity>
        ))}
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
