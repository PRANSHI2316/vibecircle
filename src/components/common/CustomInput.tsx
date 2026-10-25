import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface CustomInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  error?: string;
  helperText?: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  isPhone?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharCount?: boolean;
  editable?: boolean;
  containerStyle?: ViewStyle;
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onSubmitEditing?: () => void;
}

export const CustomInput = React.forwardRef<React.ComponentRef<typeof TextInput>, CustomInputProps>(function CustomInput(
  {
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    showPasswordToggle = false,
    error,
    helperText,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    leftIcon,
    isPhone = false,
    multiline = false,
    numberOfLines = 1,
    maxLength,
    showCharCount = false,
    editable = true,
    containerStyle,
    returnKeyType,
    onSubmitEditing,
  },
  ref
) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const isSecured = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
          {showCharCount && maxLength && (
            <Text style={[styles.charCount, { color: colors.textMuted }]}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: editable ? colors.inputBg : colors.backgroundElement,
            borderColor: error
              ? colors.danger
              : isFocused
              ? colors.primary
              : colors.inputBorder,
            opacity: editable ? 1 : 0.8,
          },
          multiline && { minHeight: 90, alignItems: 'flex-start', paddingTop: 12 },
        ]}>
        {/* Phone Prefix Badge (+91 India) */}
        {isPhone && (
          <View style={[styles.phoneBadge, { borderRightColor: colors.inputBorder }]}>
            <Text style={styles.indiaFlag}>🇮🇳</Text>
            <Text style={[styles.phoneCode, { color: colors.text }]}>+91</Text>
          </View>
        )}

        {/* Left Icon (if not phone) */}
        {leftIcon && !isPhone && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}

        {/* Text Input */}
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecured}
          keyboardType={isPhone ? 'phone-pad' : keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
            },
          ]}
        />

        {/* Password Eye Toggle */}
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.rightIconBtn}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}

        {/* Read-only Lock Indicator */}
        {!editable && (
          <View style={styles.rightIconBtn}>
            <Ionicons name="lock-closed" size={18} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <View style={styles.helperRow}>
          <Ionicons name="alert-circle" size={14} color={colors.danger} style={{ marginRight: 4 }} />
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
        </View>
      ) : helperText ? (
        <View style={styles.helperRow}>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>{helperText}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  charCount: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  leftIcon: {
    marginRight: 10,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
  },
  indiaFlag: {
    fontSize: 16,
    marginRight: 4,
  },
  phoneCode: {
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  rightIconBtn: {
    padding: 6,
    marginLeft: 6,
  },
  helperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '400',
  },
});
