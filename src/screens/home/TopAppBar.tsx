import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export function TopAppBar() {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCocdMd29frJPEam_HXDW8Y7RFkWbO5DZWyQMfk-wvTYJ41rF8UdPritiLzd0J_JhpuHJieDBmc8GCO8ghB5GTO2McQoYEtl-WDJ7gxmDtlZlHop_oXBiJDEievwbGKJoKaED5uW-BSWbTIT_ck1psLRAxMotK5mujuHqdS9sH-Bkaoz9Xasb4QxGxrrSUMXE5VNpNOCmGkiAC3FFMAzqHwAAteDO56oa5MY65LkeTbHrmuRGeG81Mw5Exry1SyDR9FvIzxFPHcvyss',
            }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida/AP1WRLuECCyUGCYiYj31QU5AENUGMlxnNQYUqNBFQM8h0waPkLxFd4cXj0p594S-AUMokeTXk1-hqkmPdIW_jK0If2oy2q7sMm3CpSGVe1Jw77T6E7TWfuqWlHYBcx-Kh74bz-8Hk5g7QY30qokm7PYzcpjC97mzQzjTYDq_APkfzjaYxlwu8iYLrm58IoLtb1JvZTvyGwkGAPGs0TuqfUwxT_TUhwwx_wvlYN_LpXFH7qnjws2Ndf3DuBDi-TrB',
          }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Calendar">
          <MaterialIcons name="calendar-today" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Settings">
          <MaterialIcons name="settings" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 40,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  logo: {
    height: 28,
    width: 80,
    marginLeft: 4,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
