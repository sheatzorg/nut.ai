import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface MacroBarProps {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

export function MacroBar({ label, value, percentage, color }: MacroBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
  value: {
    ...typography.labelSm,
    color: colors.onSurface,
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: `${colors.surfaceVariant}66`,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
});
