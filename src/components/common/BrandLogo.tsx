import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BRAND } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BrandLogoProps {
  size?: 'small' | 'medium' | 'large';
  showTagline?: boolean;
}

export function BrandLogo({ size = 'medium', showTagline = true }: BrandLogoProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const iconSizes = {
    small: 20,
    medium: 30,
    large: 44,
  };

  const containerSizes = {
    small: 36,
    medium: 56,
    large: 80,
  };

  const titleSizes = {
    small: 18,
    medium: 26,
    large: 34,
  };

  return (
    <View style={styles.wrapper}>
      {/* Visual Logo Placeholder Badge */}
      <View
        style={[
          styles.logoContainer,
          {
            width: containerSizes[size],
            height: containerSizes[size],
            borderRadius: containerSizes[size] / 2,
            backgroundColor: '#1E1B4B',
            borderColor: '#8B5CF6',
            shadowColor: '#8B5CF6',
          },
        ]}>
        <View style={styles.innerGlow}>
          <Ionicons name="sparkles" size={iconSizes[size]} color="#C4B5FD" />
        </View>
      </View>

      {/* Brand Title */}
      <Text
        style={[
          styles.brandText,
          {
            fontSize: titleSizes[size],
            color: colors.text,
          },
        ]}>
        {BRAND.name.slice(0, 4)}
        <Text style={{ color: colors.primary }}>{BRAND.name.slice(4)}</Text>
      </Text>

      {showTagline && (
        <Text style={[styles.taglineText, { color: colors.textSecondary }]}>
          {BRAND.tagline}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  innerGlow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  taglineText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
