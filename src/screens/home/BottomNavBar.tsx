import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

interface NavItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
}

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', label: 'Home' },
  { icon: 'mic', label: 'Voice' },
  { icon: 'edit-note', label: 'Text' },
  { icon: 'photo-camera', label: 'Photo' },
];

export function BottomNavBar({ activeTab, onTabPress }: BottomNavBarProps) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.label.toLowerCase();
        return (
          <TouchableOpacity
            key={item.label}
            style={styles.tab}
            onPress={() => onTabPress(item.label.toLowerCase())}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name={item.icon}
              size={24}
              color={isActive ? colors.primary : colors.onSurfaceVariant}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 0.5,
    borderTopColor: `${colors.surfaceVariant}4D`,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 64,
  },
  tabLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500',
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});
