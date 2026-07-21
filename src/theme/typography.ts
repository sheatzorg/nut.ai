import { StyleSheet } from 'react-native';

const FONT_FAMILY = 'Plus-Jakarta-Sans';

export const typography = StyleSheet.create({
  displayLg: {
    fontFamily: FONT_FAMILY,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -0.02,
    fontWeight: '700',
  },
  headlineLg: {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.02,
    fontWeight: '700',
  },
  headlineLgMobile: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
  },
  headlineMd: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
  },
  bodyLg: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
  },
  bodyMd: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  labelMd: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.01,
    fontWeight: '600',
  },
  labelSm: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
});
