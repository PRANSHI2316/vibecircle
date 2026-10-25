import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';
import { Checkbox } from '@/components/common/Checkbox';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth, validateDob } from '@/context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { signup } = useAuth();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Date of Birth: Day, Month, Year
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Input refs for auto-advancing DOB inputs
  const monthInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);
  const yearInputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  // Terms and Privacy Policy acceptance
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Errors & Loading state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Live DOB evaluation
  const dobResult = validateDob(day, month, year);
  const isDobComplete = day.trim().length >= 1 && month.trim().length >= 1 && year.trim().length === 4;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    // 1. Full name validation
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    // 2. Email address validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else if (!emailRegex.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // 3. Indian Phone number validation (+91)
    const cleanedPhone = phone.replace(/\D/g, '');
    if (!cleanedPhone) {
      errs.phone = 'Please enter your 10-digit mobile number';
    } else if (cleanedPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    // 4. Date of Birth & 18+ check
    if (!day.trim() || !month.trim() || !year.trim()) {
      errs.dob = 'Please enter your complete date of birth (DD / MM / YYYY)';
    } else if (!dobResult.valid) {
      errs.dob = dobResult.error || 'Please enter a valid date of birth';
    }

    // 5. Password validation
    if (!password) {
      errs.password = 'Please enter a password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // 6. Confirm password validation
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // 7. Terms and Privacy Policy checkbox
    if (!agreeTerms) {
      errs.terms = 'You must accept the Terms of Service and Privacy Policy to continue';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formattedDob = dobResult.formattedDob || `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      // Sign-up saves in temporary local state without storing password in memory/state
      await signup({
        fullName,
        email,
        phone: `+91 ${phone.replace(/\D/g, '')}`,
        dob: formattedDob,
      });

      // After sign-up, open Profile Creation screen
      router.replace('/profile-creation' as any);
    } catch (e: any) {
      setErrors({ form: e.message || 'Registration failed. Please check your information.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header & Back Button */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={[styles.backBtn, { borderColor: colors.cardBorder }]}>
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Join verified members for clubbing, nightlife & social hangouts
              </Text>
            </View>
          </View>

          {/* Form-level Error Banner */}
          {Boolean(errors.form) && (
            <View style={[styles.bannerError, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.bannerErrorText, { color: colors.danger }]}>
                {errors.form}
              </Text>
            </View>
          )}

          {/* Input Fields Form */}
          <View style={styles.formSection}>
            {/* 1. Full Name */}
            <CustomInput
              label="Full Name"
              placeholder="e.g. Pranav Sharma"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
              }}
              leftIcon="person-outline"
              error={errors.fullName}
              autoCapitalize="words"
              returnKeyType="next"
            />

            {/* 2. Email Address */}
            <CustomInput
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
              }}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              returnKeyType="next"
            />

            {/* 3. Phone Number with India (+91) code */}
            <CustomInput
              label="Mobile Number (India)"
              placeholder="98765 43210"
              value={phone}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 10);
                setPhone(digits);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
              }}
              isPhone
              maxLength={10}
              keyboardType="phone-pad"
              error={errors.phone}
              helperText="10-digit Indian mobile number for verification"
            />

            {/* 4. Date of Birth Section with 18+ enforcement */}
            <View style={styles.dobContainer}>
              <View style={styles.dobLabelRow}>
                <Text style={[styles.dobLabel, { color: colors.textSecondary }]}>
                  Date of Birth
                </Text>

                {/* Real-time Age / Eligibility Indicator */}
                {isDobComplete && (
                  <View
                    style={[
                      styles.ageBadge,
                      {
                        backgroundColor:
                          dobResult.valid ? '#05966920' : '#EF444420',
                      },
                    ]}>
                    <Text
                      style={[
                        styles.ageBadgeText,
                        {
                          color: dobResult.valid ? colors.emerald : colors.danger,
                        },
                      ]}>
                      {dobResult.valid
                        ? `✓ Age: ${dobResult.age} yrs (Eligible 18+)`
                        : dobResult.age !== undefined && dobResult.age < 18
                        ? `⚠️ Age: ${dobResult.age} yrs (Must be 18+)`
                        : 'Invalid Date'}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.dobInputsRow}>
                {/* Day */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <CustomInput
                    placeholder="DD"
                    value={day}
                    onChangeText={(val) => {
                      const num = val.replace(/\D/g, '').slice(0, 2);
                      setDay(num);
                      if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
                      if (num.length === 2) {
                        monthInputRef.current?.focus();
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                  />
                </View>

                {/* Month */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <CustomInput
                    ref={monthInputRef}
                    placeholder="MM"
                    value={month}
                    onChangeText={(val) => {
                      const num = val.replace(/\D/g, '').slice(0, 2);
                      setMonth(num);
                      if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
                      if (num.length === 2) {
                        yearInputRef.current?.focus();
                      }
                    }}
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                  />
                </View>

                {/* Year */}
                <View style={{ flex: 1.5 }}>
                  <CustomInput
                    ref={yearInputRef}
                    placeholder="YYYY"
                    value={year}
                    onChangeText={(val) => {
                      const num = val.replace(/\D/g, '').slice(0, 4);
                      setYear(num);
                      if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
                    }}
                    keyboardType="number-pad"
                    maxLength={4}
                    returnKeyType="done"
                  />
                </View>
              </View>

              {Boolean(errors.dob) ? (
                <View style={styles.dobErrorRow}>
                  <Ionicons name="alert-circle" size={14} color={colors.danger} />
                  <Text style={[styles.errorText, { color: colors.danger }]}>
                    {errors.dob}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.dobHint, { color: colors.textMuted }]}>
                  Must be aged 18 or above. Age will be verified on your public profile.
                </Text>
              )}
            </View>

            {/* 5. Password with show/hide toggle */}
            <CustomInput
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              secureTextEntry
              showPasswordToggle
              leftIcon="lock-closed-outline"
              error={errors.password}
              returnKeyType="next"
            />

            {/* 6. Confirm Password with show/hide toggle */}
            <CustomInput
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              secureTextEntry
              showPasswordToggle
              leftIcon="shield-checkmark-outline"
              error={errors.confirmPassword}
              returnKeyType="done"
            />

            {/* 7. Checkbox to accept Terms and Privacy Policy */}
            <Checkbox
              checked={agreeTerms}
              onToggle={() => {
                setAgreeTerms(!agreeTerms);
                if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
              }}
              error={errors.terms}>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                {'I accept the '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  Terms of Service
                </Text>
                {' and '}
                <Text style={{ color: colors.primary, fontWeight: '700' }}>
                  Privacy Policy
                </Text>
                {', and confirm I am aged 18 or above.'}
              </Text>
            </Checkbox>
          </View>

          {/* Submit Action */}
          <View style={styles.submitSection}>
            <CustomButton
              title="Continue to Profile"
              onPress={handleSignup}
              loading={loading}
              variant="primary"
              size="lg"
              icon="arrow-forward"
              iconPosition="right"
            />

            {/* Link to Login screen */}
            <View style={styles.loginLinkRow}>
              <Text style={[styles.loginPromptText, { color: colors.textSecondary }]}>
                {'Already have an account? '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={[styles.loginLinkText, { color: colors.primary }]}>
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    gap: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  bannerErrorText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formSection: {
    marginTop: 4,
  },
  dobContainer: {
    marginBottom: 14,
  },
  dobLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dobLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dobInputsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dobErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -8,
    marginBottom: 6,
    gap: 4,
  },
  dobHint: {
    fontSize: 11,
    marginTop: -8,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  termsText: {
    fontSize: 13,
    lineHeight: 18,
  },
  submitSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  loginPromptText: {
    fontSize: 14,
  },
  loginLinkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
