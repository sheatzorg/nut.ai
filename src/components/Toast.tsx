import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 16, alignSelf: 'center', maxWidth: '90%',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 1, borderColor: '#e6ebf2',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, zIndex: 60,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3b82f6' },
  text: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
});
