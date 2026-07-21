import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface MealInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function MealInput({ value, onChange }: MealInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>DESCRIBE YOUR MEAL</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          multiline
          numberOfLines={5}
          maxLength={1000}
          placeholder="Type or paste your meal, recipe, or ingredient list…"
          placeholderTextColor="#94a3b8"
          textAlignVertical="top"
        />
      </View>
      <Text style={styles.hint}>
        Foods are recognized and analyzed by your nutrition service.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.12, color: '#475569', marginBottom: 8, paddingHorizontal: 4 },
  card: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e6ebf2', borderRadius: 16, padding: 12,
  },
  input: { fontSize: 15, lineHeight: 28, color: '#0f172a', minHeight: 120 },
  hint: { fontSize: 11, color: '#94a3b8', marginTop: 8, paddingHorizontal: 8 },
});
