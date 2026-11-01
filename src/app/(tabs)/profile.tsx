import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from '@/components/common/CustomButton';
import { BRAND, AVATAR_PRESETS, INTEREST_OPTIONS } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, logout, updateProfilePhoto } = useAuth();

  const [pickingPhoto, setPickingPhoto] = useState(false);

  const userAvatarPreset =
    AVATAR_PRESETS.find((p) => p.id === user?.avatar) || AVATAR_PRESETS[0];

  const displayAvatarUri =
    user?.customAvatarUri ||
    (user?.avatar && user.avatar.startsWith('http') ? user.avatar : null) ||
    userAvatarPreset?.imageUrl ||
    null;

  const status = user?.verificationStatus || 'Not Submitted';
  const isVerified = status === 'Verified';
  const isUnderage = status === 'Underage – Access Denied';
  const isPending = status === 'Pending Verification';
  const isRejected = status === 'Rejected';

  const handlePickNewPhoto = async () => {
    try {
      setPickingPhoto(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        const msg =
          'Gallery access is required to update your profile photo.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Permission Required', msg);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await updateProfilePhoto(result.assets[0].uri);
      }
    } catch (e: any) {
      if (Platform.OS === 'web') window.alert(e?.message || 'Failed to pick photo');
      else Alert.alert('Error', e?.message || 'Failed to pick photo');
    } finally {
      setPickingPhoto(false);
    }
  };

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

    Alert.alert('Log Out', 'Are you sure you want to log out of your account?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: performLogout },
    ]);
  };

  const handleEditProfile = () => {
    router.push('/profile-creation' as any);
  };

  const handleKycScreen = () => {
    router.push('/kyc-verification' as any);
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
      'VibeCircle is dedicated to safe discovery. Strict 18+ policy and zero tolerance for harassment. Mandatory government ID verification protects all members.';
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
              Edit Profile
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
          <View style={styles.avatarWrap}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePickNewPhoto}
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: userAvatarPreset.bgColor || '#1E1B4B',
                  borderColor: colors.primary,
                },
              ]}>
              {displayAvatarUri ? (
                <Image
                  source={{ uri: displayAvatarUri }}
                  style={styles.avatarPhoto}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarEmoji}>{userAvatarPreset.emoji}</Text>
              )}
            </TouchableOpacity>

            {/* Quick Photo Upload Camera Badge */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickNewPhoto}
              disabled={pickingPhoto}
              style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              {pickingPhoto ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="camera" size={14} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={[styles.fullName, { color: colors.text }]}>
            {user?.fullName || 'Member'}
          </Text>

          <View style={styles.metaRow}>
            <Text style={[styles.displayName, { color: colors.primary }]}>
              @{user?.displayName || 'member'}
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.ageText, { color: colors.textSecondary }]}>
              {user?.age ? `${user.age} yrs` : '18+ yrs'}
            </Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.cityText, { color: colors.textSecondary }]}>
              📍 {user?.city || 'Mumbai'}
            </Text>
          </View>

          {/* Verification Badge */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleKycScreen}
            style={[
              styles.verifiedRow,
              {
                backgroundColor: isVerified
                  ? '#10B98115'
                  : isPending
                  ? '#F59E0B15'
                  : isUnderage || isRejected
                  ? '#EF444415'
                  : '#3B82F615',
                borderColor: isVerified
                  ? '#10B981'
                  : isPending
                  ? '#F59E0B'
                  : isUnderage || isRejected
                  ? '#EF4444'
                  : '#3B82F6',
              },
            ]}>
            <Ionicons
              name={
                isVerified
                  ? 'shield-checkmark'
                  : isPending
                  ? 'time'
                  : isUnderage || isRejected
                  ? 'alert-circle'
                  : 'finger-print'
              }
              size={16}
              color={
                isVerified
                  ? '#10B981'
                  : isPending
                  ? '#F59E0B'
                  : isUnderage || isRejected
                  ? '#EF4444'
                  : '#3B82F6'
              }
            />
            <Text
              style={[
                styles.verifiedText,
                {
                  color: isVerified
                    ? '#059669'
                    : isPending
                    ? '#D97706'
                    : isUnderage || isRejected
                    ? '#DC2626'
                    : '#2563EB',
                },
              ]}>
              {isVerified
                ? 'Verified Member • 100% ID Safe'
                : `KYC Status: ${status} (Tap to view)`}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={
                isVerified
                  ? '#059669'
                  : isPending
                  ? '#D97706'
                  : isUnderage
                  ? '#DC2626'
                  : '#2563EB'
              }
            />
          </TouchableOpacity>

          {/* Bio */}
          <Text style={[styles.bioText, { color: colors.textSecondary }]}>
            {user?.bio ||
              'Techno weekend regular, coffee explorer, and looking for verified clubbing squads and social hangouts!'}
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
              <Text
                style={[
                  styles.statNum,
                  { color: isVerified ? '#10B981' : colors.primary },
                ]}>
                {isVerified ? '100%' : '90%'}
              </Text>
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
                  <Text style={[styles.interestLabel, { color: colors.text }]}>
                    {opt.name}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Premium Membership Card */}
        <View style={[styles.premiumCard, { borderColor: colors.gold }]}>
          <View style={styles.premiumHeader}>
            <View style={styles.premiumTitleWrap}>
              <Ionicons name="sparkles" size={20} color={colors.gold} />
              <Text style={[styles.premiumTitle, { color: colors.gold }]}>
                VibeClub Premium
              </Text>
            </View>
            <View style={[styles.priceBadge, { backgroundColor: colors.gold + '25' }]}>
              <Text style={[styles.priceText, { color: colors.gold }]}>
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
          {/* Identity & KYC Verification Action Row */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleKycScreen}
            style={[
              styles.actionRow,
              {
                backgroundColor: colors.card,
                borderColor: isVerified ? colors.cardBorder : '#F59E0B60',
              },
            ]}>
            <Ionicons
              name={isVerified ? 'shield-checkmark' : 'finger-print-outline'}
              size={20}
              color={isVerified ? '#10B981' : '#F59E0B'}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.actionRowText, { color: colors.text }]}>
                Identity & 18+ Age Verification
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: isVerified ? '#059669' : '#D97706',
                  marginTop: 1,
                  fontWeight: '600',
                }}>
                {isVerified
                  ? 'Government ID verified'
                  : `Current Status: ${status}`}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

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
            <Text style={[styles.actionRowText, { color: colors.text, flex: 1, marginLeft: 12 }]}>
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
            <Text style={[styles.actionRowText, { color: colors.text, flex: 1, marginLeft: 12 }]}>
              Safety, 18+ Guidelines & Privacy
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
            <Text style={[styles.actionRowText, { color: colors.danger, flex: 1, marginLeft: 12 }]}>
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
          {BRAND.name} v1.0.0 • 100% ID Verified Community
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarPhoto: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 3,
  },
  fullName: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  displayName: {
    fontSize: 14,
    fontWeight: '700',
  },
  dot: {
    fontSize: 14,
  },
  ageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  cityText: {
    fontSize: 13,
    fontWeight: '500',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  bioText: {
    fontSize: 13.5,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  statsBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    width: '100%',
    paddingVertical: 12,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
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
    height: '80%',
    alignSelf: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
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
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  interestEmoji: {
    fontSize: 16,
  },
  interestLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  premiumCard: {
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#F59E0B08',
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  priceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  subBenefits: {
    fontSize: 12.5,
    lineHeight: 20,
    color: '#92400E',
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  actionRowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    marginBottom: 12,
  },
});
