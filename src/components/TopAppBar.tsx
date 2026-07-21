import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TopAppBarProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  onMore?: () => void;
}

export function TopAppBar({ title, subtitle, onBack, onMore }: TopAppBarProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.iconButton} onPress={onBack} accessibilityLabel="Go back">
        <MaterialIcons name="chevron-left" size={22} color="#0f172a" />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <TouchableOpacity style={styles.iconButton} onPress={onMore ?? (() => {})} accessibilityLabel="More options">
        <MaterialIcons name="more-horiz" size={20} color="#0f172a" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, height: 64,
    borderBottomWidth: 0.5, borderBottomColor: 'rgba(230,235,242,0.7)',
    backgroundColor: 'rgba(251,253,255,0.75)',
  },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  titleContainer: { alignItems: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: '#0f172a', letterSpacing: -0.01 },
  subtitle: { fontSize: 11, fontWeight: '500', color: '#475569', letterSpacing: 0.02 },
});
