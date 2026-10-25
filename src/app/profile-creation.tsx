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
import { InterestChip } from '@/components/common/InterestChip';
import { INTEREST_OPTIONS, POPULAR_CITIES } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileCreationScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, saveProfile } = useAuth();

  const isEditing = Boolean(user?.hasCompletedProfile);

  // Form State
  const [avatar, setAvatar] = useState(user?.avatar || 'photo_1');
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
  const ageDisplay = user?.age ? `${user.age} years` : '18+ years';

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
      errs.city = 'Please specify your city';
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
      });

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
                {isEditing ? 'Profile Settings' : 'Step 2 • Profile Setup'}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {isEditing ? 'Edit Your Profile' : 'Build Your Persona'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isEditing
                ? 'Update your photo, bio, city, and party interests'
                : 'Set up your public card to find clubbing squads, nightspots & social hangouts'}
            </Text>
          </View>

          {/* Form-level Error Banner */}
          {errors.form && (
            <View style={[styles.bannerError, { backgroundColor: '#EF444420' }]}>
              <Ionicons name="alert-circle" size={18} color={colors.danger} />
              <Text style={[styles.bannerErrorText, { color: colors.danger }]}>
                {errors.form}
              </Text>
            </View>
          )}

          {/* 1. Profile Photo / Avatar Picker */}
          <AvatarPicker selectedId={avatar} onSelect={setAvatar} />

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

          {/* 3. Age (Strictly read-only, calculated from DOB) */}
          <CustomInput
            label="Age (Verified from Date of Birth)"
            value={ageDisplay}
            editable={false}
            leftIcon="calendar"
            helperText="Auto-calculated from your Date of Birth. For safety, age cannot be changed manually."
          />

          {/* 4. City Selection */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Current City
            </Text>

            {/* Popular City Quick-Select Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cityPillsRow}>
              {POPULAR_CITIES.map((c) => {
                const isSelected = city === c;
                return (
                  <TouchableOpacity
                    key={c}
                    activeOpacity={0.7}
                    onPress={() => {
                      setCity(c);
                      if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                    }}
                    style={[
                      styles.cityPill,
                      {
                        backgroundColor: isSelected
                          ? colors.primary
                          : colors.card,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.cardBorder,
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
                      📍 {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Free-form text input for other cities */}
            <CustomInput
              placeholder="Or type a different city..."
              value={city}
              onChangeText={(text) => {
                setCity(text);
                if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
              }}
              leftIcon="location-outline"
              error={errors.city}
              containerStyle={{ marginTop: 8 }}
            />
          </View>

          {/* 5. Interests: clubbing, nightlife, events, travel, food, and social hangouts */}
          <View style={styles.sectionContainer}>
            <View style={styles.interestsHeaderRow}>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
                Interests & Vibes
              </Text>
              <Text style={[styles.interestsCount, { color: colors.primary }]}>
                {selectedInterests.length} selected
              </Text>
            </View>
            <Text style={[styles.sectionHint, { color: colors.textMuted }]}>
              Select the vibes you want to discover and be discovered for:
            </Text>

            <View style={styles.interestsGrid}>
              {INTEREST_OPTIONS.map((item) => (
                <InterestChip
                  key={item.id}
                  item={item}
                  selected={selectedInterests.includes(item.id)}
                  onToggle={() => toggleInterest(item.id)}
                />
              ))}
            </View>

            {errors.interests && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={14} color={colors.danger} />
                <Text style={[styles.errorText, { color: colors.danger }]}>
                  {errors.interests}
                </Text>
              </View>
            )}
          </View>

          {/* 6. Short Bio */}
          <CustomInput
            label="Short Bio"
            placeholder="Tell your circle what you're looking for (e.g., weekend clubbing squads, techno gigs, brunch partners, or wedding companions)..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            maxLength={160}
            showCharCount
            helperText="Keep it friendly, authentic, and nightlife-ready"
          />

          {/* 7. Save Profile Button */}
          <View style={styles.footerSection}>
            <CustomButton
              title="Save Profile"
              onPress={handleSave}
              loading={loading}
              variant="primary"
              size="lg"
              icon="sparkles"
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
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
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 12,
    marginBottom: 10,
  },
  cityPillsRow: {
    gap: 8,
    paddingBottom: 4,
  },
  cityPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1.5,
    marginRight: 6,
  },
  cityPillText: {
    fontSize: 13,
  },
  interestsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  interestsCount: {
    fontSize: 12,
    fontWeight: '700',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footerSection: {
    marginTop: 20,
    alignItems: 'center',
  },
});
