import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ProgressRing } from './ProgressRing';
import { MacroBar } from './MacroBar';

interface DailyProgressSectionProps {
  calories: number;
  calorieGoal: number;
  protein: { current: number; goal: number };
  carbs: { current: number; goal: number };
  fats: { current: number; goal: number };
  onPressSeeMore?: () => void;
}

export function DailyProgressSection({
  calories,
  calorieGoal,
  protein,
  carbs,
  fats,
  onPressSeeMore,
}: DailyProgressSectionProps) {
  const progress = Math.round((calories / calorieGoal) * 100);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>TODAY&apos;S SUMMARY</Text>
        <TouchableOpacity style={styles.seeMoreButton} onPress={onPressSeeMore}>
          <Text style={styles.seeMoreText}>See More</Text>
          <MaterialIcons name="chevron-right" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.calorieRow}>
        <View>
          <Text style={styles.calorieCount}>
            {calories.toLocaleString()}{' '}
            <Text style={styles.calorieGoal}>/ {calorieGoal.toLocaleString()} kcal</Text>
          </Text>
        </View>
        <ProgressRing progress={progress} />
      </View>

      <View style={styles.macroRow}>
        <MacroBar
          label="Protein"
          value={`${protein.current}g`}
          percentage={(protein.current / protein.goal) * 100}
          color={colors.secondaryContainer}
        />
        <MacroBar
          label="Carbs"
          value={`${carbs.current}g`}
          percentage={(carbs.current / carbs.goal) * 100}
          color={colors.primary}
        />
        <MacroBar
          label="Fats"
          value={`${fats.current}g`}
          percentage={(fats.current / fats.goal) * 100}
          color={colors.tertiaryContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: `${colors.surfaceVariant}80`,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
    letterSpacing: 0.05,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeMoreText: {
    ...typography.labelSm,
    color: colors.primary,
    fontWeight: '600',
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  calorieCount: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  calorieGoal: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontWeight: '400',
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: `${colors.surfaceVariant}80`,
  },
});
