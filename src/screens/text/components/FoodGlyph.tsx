import React from 'react';
import { Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function FoodGlyph({ emoji }: { emoji?: string }) {
  if (emoji && emoji.trim()) {
    return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
  }
  return <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="#2563eb" />;
}
