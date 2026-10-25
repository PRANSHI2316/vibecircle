import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function CustomButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
}: CustomButtonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      opacity: disabled ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
    };

    const sizePadding = {
      sm: { paddingVertical: 10, paddingHorizontal: 16 },
      md: { paddingVertical: 14, paddingHorizontal: 22 },
      lg: { paddingVertical: 18, paddingHorizontal: 28 },
    }[size];

    let variantStyle: ViewStyle = {};
    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 5,
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: colors.secondary,
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 5,
        };
        break;
      case 'gold':
        variantStyle = {
          backgroundColor: '#D97706',
          shadowColor: '#D97706',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 5,
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.cardBorder,
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
        };
        break;
    }

    return { ...base, ...sizePadding, ...variantStyle, ...style };
  };

  const getTextStyle = (): TextStyle => {
    const sizeFonts = {
      sm: { fontSize: 13, fontWeight: '600' as const },
      md: { fontSize: 15, fontWeight: '700' as const },
      lg: { fontSize: 17, fontWeight: '700' as const },
    }[size];

    let color = '#FFFFFF';
    if (variant === 'outline' || variant === 'ghost') {
      color = colors.text;
    }

    return {
      color,
      ...sizeFonts,
      letterSpacing: 0.3,
      ...textStyle,
    };
  };

  const iconColor = variant === 'outline' || variant === 'ghost' ? colors.text : '#FFFFFF';
  const iconSize = size === 'sm' ? 16 : size === 'md' ? 20 : 24;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}>
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
