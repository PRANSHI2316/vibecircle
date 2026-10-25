import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '@/components/common/CustomButton';
import { BRAND, AVATAR_PRESETS, INTEREST_OPTIONS } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, logout } = useAuth();

  const userAvatarPreset =
    AVATAR_PRESETS.find((p) => p.id === user?.avatar) || AVATAR_PRESETS[0];

  const handleLogout = () => {
    const performLogout = () => {
      logout();
      router.replace('/');
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out of your account?');
      if (confirmed) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile-creation');
  };

  const handlePremiumTeaser = () => {
    const msg =
      'Premium subscription features (companion bookings, priority guestlists, and verified rishta matchmaking) will be unlocked in Phase 2.';
    if (Platform.OS === 'web') {
      window.alert(`₹299 Club Premium\n\n${msg}`);
      return;
    }
    Alert.alert('₹299 Club Premium', msg);
  };

  const handleSafetyGuidelines = () => {
    const msg =
      'VibeCircle is dedicated to safe discovery. Zero tolerance for harassment. ID verification protects all members.';
    if (Platform.OS === 'web') {
      window.alert(`Safety & Guidelines\n\n${msg}`);
      return;
    }
    Alert.alert('Safety & Guidelines', msg);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>My Profile</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditProfile}
            style={[styles.editBtn, { borderColor: colors.cardBorder }]}>
            <Ionicons name="create-outline" size={18} color={colors.primary} />
            <Text style={[styles.editBtnText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: userAvatarPreset.bgColor,
                borderColor: colors.primary,
              },
            ]}>
            {userAvatarPreset?.imageUrl || (user?.avatar && user.avatar.startsWith('http')) ? (
              <Image
                source={{ uri: userAvatarPreset?.imageUrl || user?.avatar }}
                style={styles.avatarPhoto}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.avatarEmoji}>{userAvatarPreset.emoji}</Text>
            )}
            <View style={styles.onlineBadge} />
          </View>

          <Text style={[styles.fullName, { color: colors.text }]}>
            {user?.fullName || 'Pranav Sharma'}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.displayName, { color: colors.primary }]}>
              @{user?.displayName || 'pranav'}
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.ageText, { color: colors.textSecondary }]}>
              {user?.age ? `${user.age} yrs` : '24 yrs'}
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.cityText, { color: colors.textSecondary }]}>
              📍 {user?.city || 'Mumbai'}
            </Text>
          </View>

          {/* Verification Badge */}
          <View style={styles.verifiedRow}>
            <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
            <Text style={[styles.verifiedText, { color: colors.emerald }]}>
              {user?.isVerified
                ? 'Verified Member • 100% ID Safe'
                : 'ID Verification Pending (Phase 2)'}
            </Text>
          </View>

          {/* Bio */}
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>
            {user?.bio ||
              'Tech enthusiast, techno weekend regular, and coffee explorer. Looking for clubbing squads and fun social hangouts!'}
          </Text>

          {/* Stats Bar */}
          <View
            style={[
              styles.statsBar,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.cardBorder,
              },
            ]}>
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: colors.text }]}>14</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Connections
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: colors.text }]}>5</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Hangouts
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statNum, { color: colors.emerald }]}>99%</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Trust Score
              </Text>
            </View>
          </View>
        </View>

        {/* Interests & Vibes Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            My Interests & Vibes
          </Text>

          <View style={styles.interestsWrap}>
            {(user?.interests && user.interests.length > 0
              ? user.interests
              : ['clubbing', 'nightlife', 'food', 'social hangouts']
            ).map((intId) => {
              const opt =
                INTEREST_OPTIONS.find((o) => o.id === intId) || {
                  name: intId,
                  emoji: '✨',
                };
              return (
                <View
                  key={intId}
                  style={[
                    styles.interestBadge,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                  <Text style={styles.interestEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.interestText, { color: colors.text }]}>
                    {opt.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Phase 2: ₹299 Premium Subscription Teaser Card */}
        <View
          style={[
            styles.subscriptionCard,
            {
              backgroundColor: '#1E1430',
              borderColor: '#6D28D9',
            },
          ]}>
          <View style={styles.subHeaderRow}>
            <View style={styles.subIconBadge}>
              <Ionicons name="diamond" size={20} color="#FBBF24" />
            </View>
            <View style={styles.subTitleCol}>
              <Text style={styles.subTitle}>
                {BRAND.name} Club Premium
              </Text>
              <Text style={styles.subPrice}>
                {BRAND.currencySymbol}{BRAND.premiumSubscriptionPrice} / month
              </Text>
            </View>
          </View>

          <Text style={styles.subBenefits}>
            • Unlimited Companion Bookings for events & dinners{'\n'}
            • VIP Guestlist Access & Table splits{'\n'}
            • Matrimonial / Rishta Family Verification{'\n'}
            • Zero ads and dedicated nightlife concierge
          </Text>

          <CustomButton
            title="Preview Premium Tier (Phase 2)"
            onPress={handlePremiumTeaser}
            variant="gold"
            size="md"
            icon="sparkles"
            style={{ marginTop: 12 }}
          />
        </View>

        {/* Account Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleEditProfile}
            style={[
              styles.actionRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons name="person-outline" size={20} color={colors.text} />
            <Text style={[styles.actionRowText, { color: colors.text }]}>
              Update Profile Details & Bio
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleSafetyGuidelines}
            style={[
              styles.actionRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.emerald}
            />
            <Text style={[styles.actionRowText, { color: colors.text }]}>
              Safety, Verification & Guidelines
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            style={[
              styles.actionRow,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            <Text style={[styles.actionRowText, { color: colors.danger }]}>
              Log Out of Account
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, { color: colors.textMuted }]}>
          {BRAND.name} v1.0.0 • Phase 1 Build
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    position: 'relative',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatarPhoto: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  fullName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  displayName: {
    fontSize: 13,
    fontWeight: '700',
  },
  dot: {
    fontSize: 12,
  },
  ageText: {
    fontSize: 13,
  },
  cityText: {
    fontSize: 13,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#05966915',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  interestsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  interestEmoji: {
    fontSize: 14,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subscriptionCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 18,
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  subIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B1C5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  subTitleCol: {
    flex: 1,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F5F3FF',
  },
  subPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FBBF24',
    marginTop: 2,
  },
  subBenefits: {
    fontSize: 12,
    lineHeight: 20,
    color: '#DDD6FE',
    marginBottom: 4,
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 12,
  },
  versionText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
