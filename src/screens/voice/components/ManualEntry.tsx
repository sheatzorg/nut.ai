import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../../theme/colors';

interface ManualEntryProps {
  onAdd: (text: string) => void;
}

export function ManualEntry({ onAdd }: ManualEntryProps) {
  const [text, setText] = useState('');

  const submit = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <MaterialIcons name="keyboard" size={18} color="#94a3b8" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          onSubmitEditing={submit}
          placeholder="Type what you ate…"
          placeholderTextColor="#94a3b8"
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.addButton, !text.trim() && styles.addButtonDisabled]}
          onPress={submit}
          disabled={!text.trim()}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface ManualEntryToggleProps {
  open: boolean;
  onToggle: () => void;
}

export function ManualEntryToggle({ open, onToggle }: ManualEntryToggleProps) {
  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.toggleButton}>
      <MaterialIcons name="keyboard" size={16} color="#475569" />
      <Text style={styles.toggleText}>{open ? 'Hide' : 'Enter manually'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6ebf2',
    borderRadius: 16,
    paddingRight: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
});
