import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addCustomFood } from '../../../services/UserDataService';
import type { FoodResult } from '../../../services/DatabaseService';

interface CustomFoodFormProps {
  searchQuery: string;
  onSaved: (food: FoodResult) => void;
  onCancel: () => void;
}

export function CustomFoodForm({ searchQuery, onSaved, onCancel }: CustomFoodFormProps) {
  const [name, setName] = useState(searchQuery);
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carb, setCarb] = useState('');
  const [fiber, setFiber] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);

    try {
      const id = await addCustomFood(
        name.trim(),
        parseFloat(kcal) || 0,
        parseFloat(protein) || 0,
        parseFloat(fat) || 0,
        parseFloat(carb) || 0,
        parseFloat(fiber) || 0
      );

      onSaved({
        id: 1000000 + id,
        name: name.trim(),
        kcal: parseFloat(kcal) || 0,
        protein: parseFloat(protein) || 0,
        fat: parseFloat(fat) || 0,
        carb: parseFloat(carb) || 0,
        fiber: parseFloat(fiber) || 0,
      });
    } catch (e) {
      console.error('Failed to save custom food:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="plus-circle" size={20} color="#3b82f6" />
        <Text style={styles.title}>Add Custom Food</Text>
      </View>

      <Text style={styles.subtitle}>
        Enter nutrition values per 100g (from food label or online lookup)
      </Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Food Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Mom's Moin Moin"
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              value={kcal}
              onChangeText={setKcal}
              keyboardType="numeric"
              placeholder="kcal"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Protein</Text>
            <TextInput
              style={styles.input}
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
              placeholder="g"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.field}>
            <Text style={styles.label}>Fat</Text>
            <TextInput
              style={styles.input}
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
              placeholder="g"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Carbs</Text>
            <TextInput
              style={styles.input}
              value={carb}
              onChangeText={setCarb}
              keyboardType="numeric"
              placeholder="g"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Fiber (optional)</Text>
          <TextInput
            style={styles.input}
            value={fiber}
            onChangeText={setFiber}
            keyboardType="numeric"
            placeholder="g"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveButton, (!name.trim() || saving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!name.trim() || saving}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="check" size={18} color="#fff" />
          <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Food'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6ebf2',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  form: {
    gap: 12,
  },
  field: {
    flex: 1,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e6ebf2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6ebf2',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
