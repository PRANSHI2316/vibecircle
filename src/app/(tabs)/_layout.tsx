import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Platform,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { CustomButton } from '@/components/common/CustomButton';

export default function TabsLayout() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, logout } = useAuth();

  const status = user?.verificationStatus || 'Not Submitted';
  const isVerified = status === 'Verified';
  const isUnderage = status === 'Underage – Access Denied';
  const isPending = status === 'Pending Verification';
  const isRejected = status === 'Rejected';

  // If user is not verified, strictly block access to the main tab features
  if (!isVerified) {
    return (
      <View style={[styles.gateContainer, { backgroundColor: colors.background }]}>
        <View style={[styles.gateCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {isUnderage && (
            <>
              <View style={[styles.gateIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="hand-left" size={44} color="#EF4444" />
              </View>
              <Text style={[styles.gateTitle, { color: '#991B1B' }]}>
                Underage – Access Denied
              </Text>
              <Text style={[styles.gateDesc, { color: colors.textSecondary }]}>
                VibeCircle enforces a strict zero-tolerance 18+ policy for safety, verified companionship, and legal compliance. Users under 18 cannot access any features.
              </Text>
              <CustomButton
                title="Log Out & Exit"
                onPress={() => {
                  logout();
                  router.replace('/');
                }}
                variant="danger"
                size="md"
                style={{ marginTop: 16, width: '100%' }}
              />
            </>
          )}

          {isPending && (
            <>
              <View style={[styles.gateIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="time" size={44} color="#D97706" />
              </View>
              <Text style={[styles.gateTitle, { color: colors.text }]}>
                Pending Verification
              </Text>
              <Text style={[styles.gateDesc, { color: colors.textSecondary }]}>
                Your government identity document has been securely submitted and is undergoing fraud and age verification. Access will unlock once approved.
              </Text>
              <View style={styles.gateButtonCol}>
                <CustomButton
                  title="View / Refresh Status"
                  onPress={() => router.push('/kyc-verification' as any)}
                  variant="primary"
                  size="md"
                  icon="refresh"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    logout();
                    router.replace('/');
                  }}
                  style={styles.exitLink}>
                  <Text style={[styles.exitLinkText, { color: colors.textMuted }]}>
                    Log Out of Session
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {isRejected && (
            <>
              <View style={[styles.gateIconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="close-circle" size={44} color="#EF4444" />
              </View>
              <Text style={[styles.gateTitle, { color: '#991B1B' }]}>
                Verification Unsuccessful
              </Text>
              <Text style={[styles.gateDesc, { color: colors.textSecondary }]}>
                {user?.kycDocument?.rejectionReason ||
                  'The uploaded government ID was unreadable, blurry, or expired.'}
              </Text>
              <View style={styles.gateButtonCol}>
                <CustomButton
                  title="Re-upload Government ID"
                  onPress={() => router.push('/kyc-verification' as any)}
                  variant="primary"
                  size="md"
                  icon="cloud-upload"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    const msg =
                      'Please contact support@vibecircle.app with your clear ID photo for assistance.';
                    if (Platform.OS === 'web') window.alert(msg);
                    else Alert.alert('KYC Support', msg);
                  }}
                  style={styles.exitLink}>
                  <Text style={[styles.exitLinkText, { color: colors.primary }]}>
                    Contact Support
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {status === 'Not Submitted' && (
            <>
              <View style={[styles.gateIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="shield-checkmark" size={44} color={colors.primary} />
              </View>
              <Text style={[styles.gateTitle, { color: colors.text }]}>
                18+ Identity Verification Required
              </Text>
              <Text style={[styles.gateDesc, { color: colors.textSecondary }]}>
                To maintain a 100% verified and secure nightlife community, all members must complete mandatory government ID verification before accessing Home, Discover, and Messages.
              </Text>
              <View style={styles.gateButtonCol}>
                <CustomButton
                  title="Complete ID Verification"
                  onPress={() => router.push('/kyc-verification' as any)}
                  variant="primary"
                  size="md"
                  icon="shield-checkmark"
                />
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    logout();
                    router.replace('/');
                  }}
                  style={styles.exitLink}>
                  <Text style={[styles.exitLinkText, { color: colors.textMuted }]}>
                    Return to Welcome Screen
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'android' ? 64 : 84,
          paddingBottom: Platform.OS === 'android' ? 8 : 24,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={23}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="activities"
        options={{
          title: 'Activities',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'flash' : 'flash-outline'}
              size={22}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'chatbubbles' : 'chatbubbles-outline'}
              size={22}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={focused ? colors.primary : colors.textSecondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  gateCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  gateIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  gateDesc: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  gateButtonCol: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
  },
  exitLink: {
    paddingVertical: 6,
  },
  exitLinkText: {
    fontSize: 12.5,
    textDecorationLine: 'underline',
  },
});
