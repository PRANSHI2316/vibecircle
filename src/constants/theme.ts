/**
 * VibeCircle Premium Theme System
 * Supports rich dark aesthetics, vibrant neon accents, glassmorphic card borders,
 * and responsive spacing tokens.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    background: '#F8FAFC',
    backgroundElement: '#EDF2F7',
    backgroundSelected: '#E2E8F0',
    card: '#FFFFFF',
    cardBorder: '#E2E8F0',
    inputBg: '#F1F5F9',
    inputBorder: '#CBD5E1',
    primary: '#7C3AED',
    primaryLight: '#8B5CF6',
    primaryDark: '#6D28D9',
    secondary: '#EC4899',
    accent: '#06B6D4',
    gold: '#D97706',
    emerald: '#059669',
    danger: '#EF4444',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#090A10',
    backgroundElement: '#141622',
    backgroundSelected: '#1F2236',
    card: '#121420',
    cardBorder: '#23273D',
    inputBg: '#171A2B',
    inputBorder: '#2B314C',
    primary: '#8B5CF6',
    primaryLight: '#A78BFA',
    primaryDark: '#7C3AED',
    secondary: '#F472B6',
    accent: '#22D3EE',
    gold: '#FBBF24',
    emerald: '#34D399',
    danger: '#F87171',
    tabBarBg: '#0D0F18',
    tabBarBorder: '#1E2235',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 75 }) ?? 75;
export const MaxContentWidth = 800;
