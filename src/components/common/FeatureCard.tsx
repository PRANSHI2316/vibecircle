import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export interface FeatureCardData {
  id: 'clubbing' | 'hangouts' | 'companion' | 'marriage';
  title: string;
  subtitle: string;
  badge: string;
  tags: string[];
  icon: keyof typeof Ionicons.glyphMap;
  accentColor: string;
  bgColor: string;
  borderColor: string;
}

interface FeatureCardProps {
  data: FeatureCardData;
  onPress: () => void;
  style?: ViewStyle;
}

export function FeatureCard({ data, onPress, style }: FeatureCardProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: data.bgColor,
          borderColor: data.borderColor,
        },
        style,
      ]}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: data.accentColor + '25', // 15% opacity hex
              borderColor: data.accentColor,
            },
          ]}>
          <Ionicons name={data.icon} size={22} color={data.accentColor} />
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: data.accentColor + '20',
              borderColor: data.accentColor + '40',
            },
          ]}>
          <Text style={[styles.badgeText, { color: data.accentColor }]}>
            {data.badge}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{data.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {data.subtitle}
        </Text>
      </View>

      {/* Tags & Action Row */}
      <View style={styles.footerRow}>
        <View style={styles.tagList}>
          {data.tags.map((tag, idx) => (
            <View
              key={idx}
              style={[
                styles.tagPill,
                {
                  backgroundColor: colors.backgroundElement,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.chevronCircle,
            { backgroundColor: colors.backgroundElement },
          ]}>
          <Ionicons name="chevron-forward" size={16} color={data.accentColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  content: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
