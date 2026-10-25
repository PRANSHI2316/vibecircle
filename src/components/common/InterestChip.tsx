import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { InterestOption } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface InterestChipProps {
  item: InterestOption;
  selected: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}

export function InterestChip({ item, selected, onToggle, size = 'md' }: InterestChipProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const isSmall = size === 'sm';

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onToggle}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? item.color : colors.card,
          borderColor: selected ? item.color : colors.cardBorder,
          paddingVertical: isSmall ? 6 : 10,
          paddingHorizontal: isSmall ? 10 : 14,
        },
      ]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text
        style={[
          styles.name,
          {
            color: selected ? '#FFFFFF' : colors.text,
            fontSize: isSmall ? 12 : 14,
            fontWeight: selected ? '700' : '500',
          },
        ]}>
        {item.name}
      </Text>
      {selected && (
        <View style={styles.checkIcon}>
          <Ionicons name="checkmark-circle" size={isSmall ? 14 : 16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1.5,
    marginRight: 8,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  name: {
    letterSpacing: 0.2,
  },
  checkIcon: {
    marginLeft: 6,
  },
});
