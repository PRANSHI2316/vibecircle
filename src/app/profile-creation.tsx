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
import { AvatarPicker } from '@/components/common/AvatarPicker';
import { LocationInput } from '@/components/common/LocationInput';
import { KycVerificationSection } from '@/components/common/KycVerificationSection';
import { InterestChip } from '@/components/common/InterestChip';
import { INTEREST_OPTIONS, POPULAR_CITIES } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileCreationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, saveProfile, updateProfilePhoto } = useAuth();

  const isEditing = Boolean(user?.hasCompletedProfile);

  // Form State
  const [avatar, setAvatar] = useState(user?.avatar || 'photo_1');
  const [customPhotoUri, setCustomPhotoUri] = useState<string | null>(
    user?.customAvatarUri || null
  );
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || 'Mumbai');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests && user.interests.length > 0
      ? user.interests
      : ['clubbing', 'nightlife', 'social hangouts']
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Auto-calculated age from DOB (Strictly read-only)
  const ageDisplay = user?.age ? `${user.age} years (Verified)` : '18+ years';
  const isKycVerified = user?.verificationStatus === 'Verified';
  const isKycUnderage = user?.verificationStatus === 'Underage – Access Denied';

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!displayName.trim()) {
      errs.displayName = 'Please choose a display name';
    } else if (displayName.trim().length < 2) {
      errs.displayName = 'Display name must be at least 2 characters';
    }

    if (selectedInterests.length === 0) {
      errs.interests = 'Please select at least 1 interest (e.g. clubbing, nightlife)';
    }

    if (!city.trim()) {
      errs.city = 'Please specify your city or use current location';
    }

    // Mandatory KYC Requirement:
    if (!isKycVerified) {
      if (isKycUnderage) {
        errs.form =
          'Registration blocked: You are under 18. VibeCircle is strictly 18+.';
      } else {
        errs.form =
          'Mandatory Identity Verification: Please complete the government ID verification below before proceeding.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await saveProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        city: city.trim(),
        interests: selectedInterests,
        avatar,
        customAvatarUri: customPhotoUri,
      });

      if (customPhotoUri !== undefined) {
        await updateProfilePhoto(customPhotoUri);
      }

      // After profile creation / update, open Home tab
      router.replace('/(tabs)');
    } catch (e: any) {
      setErrors({ form: e.message || 'Failed to save profile. Please try again.' });
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
          {/* Header */}
          <View style={styles.header}>
            {isEditing && (
              <TouchableOpacity
                onPress={() => router.back()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[styles.backBtn, { borderColor: colors.cardBorder }]}>
                <Ionicons name="arrow-back" size={20} color={colors.text} />
              </TouchableOpacity>
            )}

            <View style={[styles.stepBadge, { backgroundColor: colors.primary + '20' }]}>
              <Text style={[styles.stepBadgeText, { color: colors.primary }]}>
                {isEditing ? 'Profile Settings' : 'Step 2 • Profile Setup & Verification'}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {isEditing ? 'Edit Your Profile' : 'Build Your Persona'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isEditing
                ? 'Update your photo, bio, city, and party interests'
                : 'Upload your photo, set your verified city, and complete government ID verification'}
            </Text>
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

          {/* 1. Profile Photo Upload (Gallery, Camera, Remove) */}
          <AvatarPicker
            selectedId={avatar}
            customPhotoUri={customPhotoUri}
            onSelect={setAvatar}
            onPhotoSelected={(uri) => {
              setCustomPhotoUri(uri);
              if (uri) setAvatar('custom');
            }}
          />

          {/* 2. Display Name */}
          <CustomInput
            label="Display Name"
            placeholder="How should people address you?"
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              if (errors.displayName)
                setErrors((prev) => ({ ...prev, displayName: '' }));
            }}
            leftIcon="person"
            error={errors.displayName}
            helperText="Visible to other verified members in clubs and hangouts"
          />

          {/* 3. Age (Strictly read-only, verified from DOB) */}
          <CustomInput
            label="Age (Verified from Date of Birth)"
            value={ageDisplay}
            editable={false}
            leftIcon="calendar"
            helperText="Auto-calculated from your Date of Birth. For safety, age cannot be changed manually."
          />

          {/* 4. Current Location & City Field */}
          <LocationInput
            label="Current Location / City"
            value={city}
            onChangeText={(text) => {
              setCity(text);
              if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
            }}
            error={errors.city}
          />

          {/* Popular City Quick-Select Pills */}
          <View style={styles.quickCitiesBox}>
            <Text style={[styles.quickCitiesLabel, { color: colors.textSecondary }]}>
              Popular City Suggestions:
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.citiesScroll}>
              {POPULAR_CITIES.map((c) => {
                const isSelected = city === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => {
                      setCity(c);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    style={[
                      styles.cityPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.cityPillText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* 5. Bio / Social Intent */}
          <CustomInput
            label="Short Bio / Vibe"
            placeholder="e.g. Techno weekend regular, coffee explorer in Bandra, looking for clubbing squads..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            helperText="Tell others what kind of scenes and meetups you enjoy"
          />

          {/* 6. Interests Selector */}
          <View style={styles.sectionContainer}>
            <View style={styles.interestLabelRow}>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>
                What are you looking for?{' '}
                <Text style={{ color: colors.primary }}>*</Text>
              </Text>
              <Text style={[styles.countBadge, { color: colors.primary }]}>
                {selectedInterests.length} selected
              </Text>
            </View>

            {Boolean(errors.interests) && (
              <Text style={styles.fieldErrorText}>{errors.interests}</Text>
            )}

            <View style={styles.interestsGrid}>
              {INTEREST_OPTIONS.map((opt) => (
                <InterestChip
                  key={opt.id}
                  item={opt}
                  selected={selectedInterests.includes(opt.id)}
                  onToggle={() => toggleInterest(opt.id)}
                />
              ))}
            </View>
          </View>

          {/* 7. Mandatory KYC & 18+ Identity Verification Section */}
          <KycVerificationSection
            onSuccess={() => {
              if (errors.form) setErrors((prev) => ({ ...prev, form: '' }));
            }}
            onUnderageBlocked={() => {
              setErrors({
                form: 'Access Denied: You are under 18. VibeCircle registration is rejected.',
              });
            }}
          />

          {/* Submit / Save Profile Button */}
          <View style={styles.ctaWrapper}>
            <CustomButton
              title={
                isKycUnderage
                  ? 'Access Denied (Underage)'
                  : isEditing
                  ? 'Save Profile Changes'
                  : isKycVerified
                  ? 'Complete & Enter VibeCircle'
                  : 'Verify ID & Enter VibeCircle'
              }
              onPress={handleSave}
              loading={loading}
              disabled={isKycUnderage}
              variant="primary"
              size="lg"
              icon={isKycVerified ? 'arrow-forward' : 'shield-checkmark'}
              iconPosition="right"
            />
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
    paddingBottom: 48,
  },
  header: {
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
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
  sectionContainer: {
    marginVertical: 14,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  quickCitiesBox: {
    marginBottom: 16,
    marginTop: -8,
  },
  quickCitiesLabel: {
    fontSize: 11.5,
    marginBottom: 6,
    fontWeight: '500',
  },
  citiesScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  cityPillText: {
    fontSize: 12,
  },
  interestLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  fieldErrorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 8,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ctaWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
});
