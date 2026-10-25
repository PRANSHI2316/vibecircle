import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FeatureCard, FeatureCardData } from '@/components/common/FeatureCard';
import { BRAND, AVATAR_PRESETS } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user } = useAuth();

  const [activeFilter, setActiveFilter] = useState('All');

  // Find user's preset avatar
  const userAvatarPreset =
    AVATAR_PRESETS.find((p) => p.id === user?.avatar) || AVATAR_PRESETS[0];

  // The 4 Signature Discovery Feature Cards
  const FEATURE_CARDS: FeatureCardData[] = [
    {
      id: 'clubbing',
      title: 'Clubbing & Nightlife',
      subtitle:
        'Connect with verified party-goers, split VIP tables, and join exclusive guestlists.',
      badge: 'Nightlife',
      tags: ['🔥 Trending Tonight', '🎧 Techno & Commercial', '🍾 VIP Tables'],
      icon: 'wine',
      accentColor: '#EC4899',
      bgColor: scheme === 'dark' ? '#1E1226' : '#FDF2F8',
      borderColor: scheme === 'dark' ? '#4A1D5A' : '#FBCFE8',
    },
    {
      id: 'hangouts',
      title: 'Social Hangouts',
      subtitle:
        'Find friendly company for weekend cafes, rooftop games, food walks, and road trips.',
      badge: 'Hangouts',
      tags: ['☕ Weekend Chill', '🎯 4.8k Active', '🍕 Food & Board Games'],
      icon: 'cafe',
      accentColor: '#10B981',
      bgColor: scheme === 'dark' ? '#0D221D' : '#F0FDF4',
      borderColor: scheme === 'dark' ? '#164E41' : '#BBF7D0',
    },
    {
      id: 'companion',
      title: 'Book a Companion',
      subtitle:
        'Verified plus-ones for social dinners, weddings, concerts, and party events.',
      badge: '₹299 Club Tier',
      tags: ['✨ 100% ID Verified', '💎 Premium Plus-One', '🛡️ Safety Guard'],
      icon: 'people',
      accentColor: '#8B5CF6',
      bgColor: scheme === 'dark' ? '#17152B' : '#F5F3FF',
      borderColor: scheme === 'dark' ? '#372B68' : '#DDD6FE',
    },
    {
      id: 'marriage',
      title: 'Marriage / Rishta',
      subtitle:
        'High-intent, verified matchmaking for individuals and families seeking lifelong compatibility.',
      badge: 'Matchmaking',
      tags: ['💍 Verified Rishta', '🏡 Serious Match', '🔒 Private Details'],
      icon: 'heart',
      accentColor: '#D97706',
      bgColor: scheme === 'dark' ? '#241A0E' : '#FFFBEB',
      borderColor: scheme === 'dark' ? '#523A16' : '#FDE68A',
    },
  ];

  // Mock verified people nearby
  const VERIFIED_PROFILES = [
    {
      id: 'v1',
      name: 'Aanya Verma',
      age: 23,
      city: 'Mumbai',
      tag: 'Techno & Clubbing',
      emoji: '🎧',
      bg: '#831843',
    },
    {
      id: 'v2',
      name: 'Rohan Mehra',
      age: 26,
      city: 'Mumbai',
      tag: 'Coffee & Board Games',
      emoji: '☕',
      bg: '#064E3B',
    },
    {
      id: 'v3',
      name: 'Simran Kaur',
      age: 25,
      city: 'Delhi NCR',
      tag: 'Concerts & Events',
      emoji: '✨',
      bg: '#4C1D95',
    },
  ];

  const handleCardPress = (cardId: string) => {
    router.push({
      pathname: '/category/[id]',
      params: { id: cardId },
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.greetingCol}>
            <Text style={[styles.greetingSub, { color: colors.textSecondary }]}>
              Welcome to {BRAND.name}
            </Text>
            <Text style={[styles.greetingName, { color: colors.text }]}>
              Hey, {user?.displayName || 'Pranav'} 👋
            </Text>
          </View>

          <View style={styles.headerRightRow}>
            {/* City Badge */}
            <View
              style={[
                styles.cityBadge,
                { backgroundColor: colors.card, borderColor: colors.cardBorder },
              ]}>
              <Text style={styles.cityBadgeText}>📍 {user?.city || 'Mumbai'}</Text>
            </View>

            {/* Profile Avatar Quick Link */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile')}
              style={[
                styles.avatarBtn,
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
            </TouchableOpacity>
          </View>
        </View>

        {/* Verification Status Pill */}
        <View style={styles.verificationBanner}>
          <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
          <Text style={[styles.verificationText, { color: colors.emerald }]}>
            Phase 1 Verified Discovery Community • Safe & Regulated
          </Text>
        </View>

        {/* Filter Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {['All', 'Clubbing', 'Social Hangouts', 'Companions', 'Rishta'].map(
            (tab) => {
              const isActive = activeFilter === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  activeOpacity={0.7}
                  onPress={() => setActiveFilter(tab)}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isActive
                        ? colors.primary
                        : colors.card,
                      borderColor: isActive
                        ? colors.primary
                        : colors.cardBorder,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.filterChipText,
                      {
                        color: isActive ? '#FFFFFF' : colors.textSecondary,
                        fontWeight: isActive ? '700' : '500',
                      },
                    ]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Explore Discovery Categories
          </Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
            Select a realm to find verified companions & groups
          </Text>
        </View>

        {/* The 4 Feature Cards */}
        <View style={styles.cardsContainer}>
          {FEATURE_CARDS.filter((card) => {
            if (activeFilter === 'All') return true;
            if (activeFilter === 'Clubbing') return card.id === 'clubbing';
            if (activeFilter === 'Social Hangouts') return card.id === 'hangouts';
            if (activeFilter === 'Companions') return card.id === 'companion';
            if (activeFilter === 'Rishta') return card.id === 'marriage';
            return true;
          }).map((card) => (
            <FeatureCard
              key={card.id}
              data={card}
              onPress={() => handleCardPress(card.id)}
            />
          ))}
        </View>

        {/* Verified Members Tonight */}
        <View style={styles.verifiedSection}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Verified People Tonight
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                Looking for clubbing squads & hangout plans
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(tabs)/discover')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.peopleScroll}>
            {VERIFIED_PROFILES.map((p) => (
              <View
                key={p.id}
                style={[
                  styles.personCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <View style={[styles.personAvatar, { backgroundColor: p.bg }]}>
                  <Text style={styles.personEmoji}>{p.emoji}</Text>
                  <View style={styles.verifiedDot}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  </View>
                </View>

                <Text style={[styles.personName, { color: colors.text }]}>
                  {p.name}, {p.age}
                </Text>
                <Text style={[styles.personCity, { color: colors.textMuted }]}>
                  📍 {p.city}
                </Text>
                <Text
                  style={[styles.personTag, { color: colors.primary }]}
                  numberOfLines={1}>
                  {p.tag}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push('/(tabs)/discover')}
                  style={[
                    styles.connectBtn,
                    { backgroundColor: colors.backgroundElement },
                  ]}>
                  <Text style={[styles.connectBtnText, { color: colors.text }]}>
                    Connect
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Phase 2 Premium Teaser Banner */}
        <View
          style={[
            styles.teaserCard,
            { backgroundColor: '#1C152B', borderColor: '#4C1D95' },
          ]}>
          <View style={styles.teaserIconBox}>
            <Ionicons name="diamond" size={24} color="#A78BFA" />
          </View>
          <View style={styles.teaserTextBox}>
            <Text style={styles.teaserTitle}>
              ₹299 Club Premium Membership
            </Text>
            <Text style={styles.teaserDesc}>
              Unlock verified companion bookings, VIP table priority, and unlimited chats.
            </Text>
          </View>
        </View>
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
    paddingBottom: 24,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greetingCol: {
    gap: 2,
  },
  greetingSub: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  cityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarPhoto: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarEmoji: {
    fontSize: 18,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05966915',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 6,
  },
  verificationText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  filterScroll: {
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  cardsContainer: {
    marginBottom: 14,
  },
  verifiedSection: {
    marginVertical: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  peopleScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  personCard: {
    width: 140,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
  },
  personAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  personEmoji: {
    fontSize: 26,
  },
  verifiedDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  personName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  personCity: {
    fontSize: 11,
    marginTop: 2,
  },
  personTag: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  connectBtn: {
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  connectBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  teaserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginTop: 14,
  },
  teaserIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#3B1C5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teaserTextBox: {
    flex: 1,
  },
  teaserTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F3E8FF',
  },
  teaserDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: '#C4B5FD',
    marginTop: 2,
  },
});
