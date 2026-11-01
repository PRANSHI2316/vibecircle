import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { KycVerificationSection } from '@/components/common/KycVerificationSection';
import { CustomButton } from '@/components/common/CustomButton';

export default function KycVerificationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, logout } = useAuth();

  const status = user?.verificationStatus || 'Not Submitted';
  const isVerified = status === 'Verified';
  const isUnderage = status === 'Underage – Access Denied';
  const isPending = status === 'Pending Verification';

  const handleContactSupport = () => {
    const msg =
      'Please email support@vibecircle.app with your registered email and high-resolution ID photo for manual verification.';
    if (Platform.OS === 'web') {
      window.alert(`KYC Support\n\n${msg}`);
    } else {
      Alert.alert('KYC Support', msg);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          18+ Identity Verification
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Verification Status Banner */}
        <View style={styles.statusCard}>
          <View style={styles.statusIconWrap}>
            {isVerified && (
              <Ionicons name="shield-checkmark" size={44} color="#10B981" />
            )}
            {isPending && (
              <Ionicons name="time" size={44} color="#F59E0B" />
            )}
            {isUnderage && (
              <Ionicons name="alert-circle" size={44} color="#EF4444" />
            )}
            {status === 'Rejected' && (
              <Ionicons name="close-circle" size={44} color="#EF4444" />
            )}
            {status === 'Not Submitted' && (
              <Ionicons name="finger-print" size={44} color={colors.primary} />
            )}
          </View>

          <Text style={[styles.statusTitle, { color: colors.text }]}>
            Status: {status}
          </Text>

          <Text style={[styles.statusDescription, { color: colors.textSecondary }]}>
            {isVerified &&
              'Your government ID and age (18+) have been verified. You have full access to all clubbing, nightlife, and matchmaking features.'}
            {isPending &&
              'Your document has been submitted and is currently undergoing fraud detection and age audit. This page will update automatically once complete.'}
            {isUnderage &&
              'Access permanently denied. VibeCircle enforces a strict zero-tolerance 18+ policy for member safety and compliance.'}
            {status === 'Rejected' &&
              'Your previous document submission was rejected. Please review the requirements below and re-upload a clear, government-issued photo ID.'}
            {status === 'Not Submitted' &&
              'Government ID verification is mandatory. Please provide a government-issued ID to unlock your account.'}
          </Text>
        </View>

        {/* Interactive Verification Form */}
        {!isUnderage && (
          <KycVerificationSection
            onSuccess={() => {
              if (Platform.OS === 'web') {
                window.alert('Congratulations! Your identity and 18+ age have been verified.');
              } else {
                Alert.alert(
                  'Verified!',
                  'Congratulations! Your identity and 18+ age have been verified.'
                );
              }
              router.replace('/(tabs)');
            }}
            onUnderageBlocked={() => {
              router.replace('/kyc-verification' as any);
            }}
          />
        )}

        {/* Action Controls */}
        <View style={styles.actionsBox}>
          {isVerified ? (
            <CustomButton
              title="Enter VibeCircle (Home)"
              onPress={() => router.replace('/(tabs)')}
              variant="primary"
              size="lg"
              icon="arrow-forward"
              iconPosition="right"
            />
          ) : (
            <CustomButton
              title="Need Help? Contact KYC Support"
              onPress={handleContactSupport}
              variant="outline"
              size="md"
              icon="help-circle-outline"
            />
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              logout();
              router.replace('/');
            }}
            style={styles.logoutBtn}>
            <Text style={[styles.logoutText, { color: colors.textMuted }]}>
              Log out and return to Welcome screen
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  statusCard: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginVertical: 12,
    backgroundColor: 'rgba(150,150,150,0.06)',
  },
  statusIconWrap: {
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  statusDescription: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 340,
  },
  actionsBox: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  logoutBtn: {
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});
