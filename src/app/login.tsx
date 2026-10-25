import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '@/components/common/CustomInput';
import { CustomButton } from '@/components/common/CustomButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { login, loginDemo } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!email.trim()) {
      errs.email = 'Please enter your email address';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address';
      }
    }

    if (!password) {
      errs.password = 'Please enter your password';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await login(email);
      if (result && !result.hasCompletedProfile) {
        router.replace('/profile-creation' as any);
      } else {
        // Route to home tabs upon successful login
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      setErrors({ form: e.message || 'Login failed. Please check credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    router.replace('/(tabs)');
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
              <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {"Log in to discover tonight's verified clubbing & hangouts"}
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

          {/* Form Inputs */}
          <View style={styles.formSection}>
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
            />

            <CustomInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
              }}
              secureTextEntry
              showPasswordToggle
              leftIcon="lock-closed-outline"
              error={errors.password}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.submitSection}>
            <CustomButton
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              size="lg"
              icon="log-in-outline"
            />

            {/* Quick Demo Login Option */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDemoLogin}
              style={[
                styles.quickDemoCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Ionicons name="flash" size={18} color={colors.gold} />
              <View style={styles.quickDemoTextCol}>
                <Text style={[styles.quickDemoTitle, { color: colors.text }]}>
                  Instant Demo Login
                </Text>
                <Text style={[styles.quickDemoSub, { color: colors.textSecondary }]}>
                  Test Phase 1 & Step 2 without typing
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.gold} />
            </TouchableOpacity>

            {/* Link to Sign-up */}
            <View style={styles.signupLinkRow}>
              <Text style={[styles.signupPromptText, { color: colors.textSecondary }]}>
                {"Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={() => router.push('/signup' as any)}>
                <Text style={[styles.signupLinkText, { color: colors.primary }]}>
                  Sign Up
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
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    marginBottom: 24,
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
    gap: 6,
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
    marginTop: 10,
  },
  submitSection: {
    marginTop: 24,
    alignItems: 'center',
  },
  quickDemoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  quickDemoTextCol: {
    flex: 1,
    marginLeft: 10,
  },
  quickDemoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  quickDemoSub: {
    fontSize: 11,
    marginTop: 2,
  },
  signupLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  signupPromptText: {
    fontSize: 14,
  },
  signupLinkText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
