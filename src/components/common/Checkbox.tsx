import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  children?: React.ReactNode;
  error?: string;
  style?: ViewStyle;
}

export function Checkbox({
  checked,
  onToggle,
  label,
  children,
  error,
  style,
}: CheckboxProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <View style={[styles.wrapper, style]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggle}
        style={styles.touchableRow}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: checked ? colors.primary : colors.inputBg,
              borderColor: error
                ? colors.danger
                : checked
                ? colors.primary
                : colors.inputBorder,
            },
          ]}>
          {checked && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>

        <View style={styles.textContainer}>
          {children ? (
            children
          ) : label ? (
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>

      {Boolean(error) && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  touchableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 32,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
