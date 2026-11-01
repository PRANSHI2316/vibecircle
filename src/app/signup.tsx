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
import { AvatarPicker } from '@/components/common/AvatarPicker';
import { LocationInput } from '@/components/common/LocationInput';
import { KycVerificationSection } from '@/components/common/KycVerificationSection';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth, validateDob } from '@/context/AuthContext';

export default function SignupScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { signup, user } = useAuth();

  // Profile Photo state
  const [avatarId, setAvatarId] = useState('photo_1');
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Mumbai');
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
  const isDobComplete =
    day.trim().length >= 1 && month.trim().length >= 1 && year.trim().length === 4;

  const isKycUnderage = user?.verificationStatus === 'Underage – Access Denied';

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

    // 4. City / Location validation
    if (!city.trim()) {
      errs.city = 'Please specify your location or use current location';
    }

    // 5. Date of Birth & 18+ check
    if (!day.trim() || !month.trim() || !year.trim()) {
      errs.dob = 'Please enter your complete date of birth (DD / MM / YYYY)';
    } else if (!dobResult.valid) {
      errs.dob = dobResult.error || 'Please enter a valid date of birth';
    }

    // 6. Password validation
    if (!password) {
      errs.password = 'Please enter a password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // 7. Confirm password validation
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // 8. Terms and Privacy Policy checkbox
    if (!agreeTerms) {
      errs.terms =
        'You must accept the Terms of Service and Privacy Policy to continue';
    }

    // 9. Mandatory KYC Check
    if (isKycUnderage) {
      errs.form =
        'Access Denied: Verification confirms age below 18. Registration rejected.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formattedDob =
        dobResult.formattedDob ||
        `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      await signup({
        fullName,
        email,
        phone: `+91 ${phone.replace(/\D/g, '')}`,
        dob: formattedDob,
        customAvatarUri: customPhotoUri,
        city,
      });

      // Guide to profile setup & verification completion
      router.replace('/profile-creation' as any);
    } catch (e: any) {
      setErrors({
        form: e.message || 'Registration failed. Please check your information.',
      });
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
                Join 100% verified members for clubbing, nightlife & social hangouts
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

          {/* Section 1: Profile Photo Upload */}
          <View style={styles.sectionCard}>
            <Text style={[styles.sectionHeading, { color: colors.text }]}>
              1. Profile Photo (Choose from Gallery)
            </Text>
            <AvatarPicker
              selectedId={avatarId}
              customPhotoUri={customPhotoUri}
              onSelect={setAvatarId}
              onPhotoSelected={(uri) => {
                setCustomPhotoUri(uri);
                if (uri) setAvatarId('custom');
              }}
            />
          </View>

          {/* Input Fields Form */}
          <View style={styles.formSection}>
            {/* Full Name */}
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

            {/* Email Address */}
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

            {/* Phone Number */}
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

            {/* Current Location Field with 'Use Current Location' Button */}
            <LocationInput
              label="Current Location / City"
              value={city}
              onChangeText={(txt) => {
                setCity(txt);
                if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
              }}
              error={errors.city}
            />

            {/* Date of Birth Section with Strict 18+ enforcement */}
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
                <Text style={[styles.helperText, { color: colors.textMuted }]}>
                  Must be at least 18 years old to join VibeCircle.
                </Text>
              )}
            </View>

            {/* Password */}
            <CustomInput
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              leftIcon="lock-closed-outline"
              secureTextEntry
              showPasswordToggle
              error={errors.password}
              helperText="Minimum 6 characters with mixed characters"
              returnKeyType="next"
            />

            {/* Confirm Password */}
            <CustomInput
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: '' }));
              }}
              leftIcon="lock-closed-outline"
              secureTextEntry
              showPasswordToggle
              error={errors.confirmPassword}
              returnKeyType="done"
            />

            {/* Terms and Privacy Checkbox */}
            <View style={styles.checkboxContainer}>
              <Checkbox
                checked={agreeTerms}
                onToggle={() => {
                  setAgreeTerms((prev) => !prev);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: '' }));
                }}
                label="I agree to the Terms of Service & Privacy Policy and confirm I am 18+ years of age."
                error={errors.terms}
              />
            </View>

            {/* Mandatory KYC & Identity Verification Section */}
            <KycVerificationSection
              onSuccess={() => {
                if (errors.form) setErrors((prev) => ({ ...prev, form: '' }));
              }}
              onUnderageBlocked={() => {
                setErrors({
                  form: 'Access Denied: Under 18 years old. Registration blocked.',
                });
              }}
            />

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <CustomButton
                title={
                  isKycUnderage
                    ? 'Access Denied (Underage)'
                    : 'Create Account & Continue'
                }
                onPress={handleSignup}
                loading={loading}
                disabled={isKycUnderage}
                variant="primary"
                size="lg"
                icon="arrow-forward"
                iconPosition="right"
              />
            </View>

            {/* Log In Link */}
            <View style={styles.loginRow}>
              <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/login' as any)}>
                <Text style={[styles.loginLink, { color: colors.primary }]}>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
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
  sectionCard: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  formSection: {
    gap: 2,
  },
  dobContainer: {
    marginBottom: 16,
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
  },
  ageBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dobInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dobErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 11.5,
    marginTop: 4,
  },
  checkboxContainer: {
    marginVertical: 14,
  },
  checkboxError: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 28,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
