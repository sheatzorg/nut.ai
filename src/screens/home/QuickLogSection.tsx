import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface QuickLogButton {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  filled?: boolean;
}

interface QuickLogSectionProps {
  onAudioPress?: () => void;
  onTextPress?: () => void;
  onPhotoPress?: () => void;
}

const buttons: QuickLogButton[] = [
  { icon: 'mic', label: 'Audio', filled: true },
  { icon: 'edit-note', label: 'Text' },
  { icon: 'photo-camera', label: 'Photo' },
];

export function QuickLogSection({ onAudioPress, onTextPress, onPhotoPress }: QuickLogSectionProps) {
  const onPress = [onAudioPress, onTextPress, onPhotoPress];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Log</Text>
      <View style={styles.buttonRow}>
        {buttons.map((btn, i) => (
          <TouchableOpacity
            key={btn.label}
            style={styles.button}
            onPress={onPress[i]}
            activeOpacity={0.7}
          >
            <View style={[styles.iconCircle, btn.filled && styles.iconCircleFilled]}>
              <MaterialIcons
                name={btn.icon}
                size={20}
                color={colors.primary}
              />
            </View>
            <Text style={styles.buttonLabel}>{btn.label}</Text>
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
  sectionTitle: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: `${colors.surfaceVariant}80`,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}1A`,
  },
  iconCircleFilled: {
    backgroundColor: `${colors.primary}1A`,
  },
  buttonLabel: {
    ...typography.labelSm,
    color: colors.onSurface,
  },
});
