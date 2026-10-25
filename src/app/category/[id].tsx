import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CustomButton } from '@/components/common/CustomButton';

interface CategoryConfig {
  id: string;
  title: string;
  badge: string;
  subtitle: string;
  heroEmoji: string;
  accentColor: string;
  bgColor: string;
  bannerImage: string;
  description: string;
  howItWorks: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[];
  featuredItems: { title: string; subtitle: string; tag: string; emoji: string }[];
  rules: string[];
  ctaText: string;
  filterCategory: string;
}

const CATEGORY_DATA: Record<string, CategoryConfig> = {
  clubbing: {
    id: 'clubbing',
    title: 'Clubbing & Nightlife',
    badge: 'Nightlife & VIP Tables',
    subtitle: 'Split tables, join exclusive guestlists, and party safely with verified members.',
    heroEmoji: '🪩',
    accentColor: '#EC4899',
    bgColor: '#831843',
    bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description:
      'Tired of going solo or looking for a squad to split hefty table minimums? VibeCircle connects verified party-goers for techno gigs, commercial nights, and rooftop lounges across major Indian cities.',
    howItWorks: [
      {
        icon: 'people',
        title: 'Squad Table Split',
        desc: 'Pool budgets together to get premium tables at top nightclubs without overpaying.',
      },
      {
        icon: 'ticket',
        title: 'Verified Guestlist Passes',
        desc: 'Access curated guestlist slots for couples and groups at partner clubs.',
      },
      {
        icon: 'shield-checkmark',
        title: 'Zero Creep Community',
        desc: 'All members are ID-verified. Strict safety protocols protect everyone at nightouts.',
      },
    ],
    featuredItems: [
      {
        title: 'Bastian at the Top (Bandra)',
        subtitle: 'Techno & High Energy Commercial • Tables from ₹2,500/head',
        tag: '🔥 Trending Tonight',
        emoji: '🍸',
      },
      {
        title: 'Toy Room Mumbai',
        subtitle: 'Commercial & Hip-Hop • Verified Guestlists',
        tag: '✨ VIP Entry',
        emoji: '🧸',
      },
      {
        title: 'Aer Rooftop Lounge (Worli)',
        subtitle: 'Sunset Cocktails & Deep House • Sea View',
        tag: '🌅 Rooftop Vibe',
        emoji: '🍹',
      },
    ],
    rules: [
      'Dress code applies (smart casuals / nightlife attire).',
      'Table bill split must be honored by all squad members.',
      'Respect everyone’s boundaries; zero tolerance for harassment.',
    ],
    ctaText: 'Find Clubbing Buddies on Discover',
    filterCategory: 'clubbing',
  },
  hangouts: {
    id: 'hangouts',
    title: 'Social Hangouts',
    badge: 'Cafes, Board Games & Hobbies',
    subtitle: 'Discover fun, relaxed weekend plans with friendly people who share your vibe.',
    heroEmoji: '☕',
    accentColor: '#10B981',
    bgColor: '#064E3B',
    bannerImage: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80',
    description:
      'Not in the mood for loud clubs? Connect with verified people for weekend artisanal coffee, board games, rooftop live music, food walks, and road trips.',
    howItWorks: [
      {
        icon: 'cafe',
        title: 'Casual Meetups',
        desc: 'Low-pressure hangouts at aesthetic cafes, parks, and cultural spaces.',
      },
      {
        icon: 'game-controller',
        title: 'Shared Interests',
        desc: 'From Catan and poker to book clubs and hiking, find people who love what you love.',
      },
      {
        icon: 'happy',
        title: 'Warm & Welcoming',
        desc: 'Open to newcomers and locals alike, with zero awkward small talk.',
      },
    ],
    featuredItems: [
      {
        title: 'Sunday Artisanal Coffee & Catan Games',
        subtitle: 'Subko Coffee Roasters, Bandra • Every Sunday 11 AM',
        tag: '☕ Chill Sunday',
        emoji: '🎲',
      },
      {
        title: 'Sunset Acoustic Jam & Mocktails',
        subtitle: 'Versova Beach Cafe • Saturday 5 PM',
        tag: '🎸 Live Music',
        emoji: '🌅',
      },
      {
        title: 'Weekend Foodie Trail in Colaba',
        subtitle: 'Irani Cafes & Street Bites • Sunday 9 AM',
        tag: '🍕 Food Lovers',
        emoji: '🥐',
      },
    ],
    rules: [
      'Everyone pays for their own food and beverage.',
      'Be punctual and inform the group in advance if plans change.',
      'Keep interactions warm, polite, and inclusive.',
    ],
    ctaText: 'Find Hangout Buddies on Discover',
    filterCategory: 'hangouts',
  },
  companion: {
    id: 'companion',
    title: 'Book a Companion',
    badge: '₹299 Club Tier • Verified Plus-Ones',
    subtitle: 'Verified plus-ones for social dinners, weddings, concerts, and corporate galas.',
    heroEmoji: '💎',
    accentColor: '#8B5CF6',
    bgColor: '#3B1C5A',
    bannerImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    description:
      'Have an important wedding, corporate gala, or festival and need an elegant, verified plus-one? Our premium companion service connects you with vetted individuals for professional, polite social appearances.',
    howItWorks: [
      {
        icon: 'shield-checkmark',
        title: '100% ID Verified & Screened',
        desc: 'Every companion has verified government ID and passed background checks.',
      },
      {
        icon: 'diamond',
        title: '₹299 Club Premium Tier',
        desc: 'Transparent booking guidelines with zero surprise fees or awkwardness.',
      },
      {
        icon: 'call',
        title: 'In-App Safety Guard',
        desc: 'Real-time check-ins and emergency SOS guard available for every engagement.',
      },
    ],
    featuredItems: [
      {
        title: 'Wedding & Sangeet Plus-One',
        subtitle: 'Polite, well-dressed companions for family ceremonies & functions',
        tag: '💍 Wedding Plus-One',
        emoji: '✨',
      },
      {
        title: 'Fine Dining & Gala Evenings',
        subtitle: 'Articulate company for corporate dinners and high-end galas',
        tag: '🥂 Fine Dining',
        emoji: '🍾',
      },
      {
        title: 'Music Festivals & Concerts',
        subtitle: 'Safe, enthusiastic companions for Sunburn, Lollapalooza & gigs',
        tag: '🎶 Gig Companion',
        emoji: '🎧',
      },
    ],
    rules: [
      'Strictly platonic social companionship; romantic solicitation is prohibited.',
      'All bookings must take place in public, regulated venues.',
      'Mutual safety protocol and emergency contact required for both parties.',
    ],
    ctaText: 'Explore Verified Companions on Discover',
    filterCategory: 'companion',
  },
  marriage: {
    id: 'marriage',
    title: 'Marriage / Rishta',
    badge: 'High-Intent Matrimonial Matchmaking',
    subtitle: 'High-intent, verified matchmaking for individuals and families seeking lifelong compatibility.',
    heroEmoji: '💍',
    accentColor: '#D97706',
    bgColor: '#78350F',
    bannerImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    description:
      'Looking for serious marriage prospects without the noise of superficial dating apps? VibeCircle Rishta provides curated, family-verified matchmaking focusing on core values, career compatibility, and long-term goals.',
    howItWorks: [
      {
        icon: 'heart',
        title: 'High Intent Only',
        desc: 'Designed exclusively for individuals and families seeking marriage.',
      },
      {
        icon: 'lock-closed',
        title: 'Private & Secure Details',
        desc: 'Contact details and private photos remain protected until both parties mutually consent.',
      },
      {
        icon: 'ribbon',
        title: 'Family & Background Verification',
        desc: 'Identity, education, and professional credentials verified for total peace of mind.',
      },
    ],
    featuredItems: [
      {
        title: 'Verified Professionals & Entrepreneurs',
        subtitle: 'Doctors, engineers, founders & creative professionals across India & NRI',
        tag: '💼 Professional Focus',
        emoji: '🌟',
      },
      {
        title: 'Lifestyle & Values Matching',
        subtitle: 'Filter by lifestyle, diet, astrological match, and family philosophy',
        tag: '🏡 Shared Values',
        emoji: '🤝',
      },
      {
        title: 'Direct Family Introductions',
        subtitle: 'Facilitated safe introductory calls between families when interest aligns',
        tag: '🕊️ Family Approved',
        emoji: '💍',
      },
    ],
    rules: [
      'Honest disclosure of marital status, family background, and intent required.',
      'Respectful communication and privacy protection at all times.',
      'No unsolicited calls or non-consensual contact sharing.',
    ],
    ctaText: 'Browse Rishta Matches on Discover',
    filterCategory: 'rishta',
  },
};

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const category = CATEGORY_DATA[id as string] || CATEGORY_DATA.clubbing;

  const handleExploreDiscover = () => {
    // Navigate to Discover tab
    router.push('/(tabs)/discover');
  };

  const handlePreviewAlert = () => {
    Alert.alert(
      `${category.title} Preview`,
      'This feature is currently in Phase 1 UI preview. Real-time bookings and scheduling will be unlocked in Phase 2.'
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Top Header Row with Back Button */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={[styles.backBtn, { borderColor: colors.cardBorder }]}>
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>

          <View
            style={[
              styles.badgePill,
              {
                backgroundColor: category.accentColor + '20',
                borderColor: category.accentColor + '40',
              },
            ]}>
            <Text style={[styles.badgeText, { color: category.accentColor }]}>
              {category.badge}
            </Text>
          </View>
        </View>

        {/* Hero Card Banner */}
        <View
          style={[
            styles.heroCard,
            { backgroundColor: colors.card, borderColor: colors.cardBorder },
          ]}>
          <Image
            source={{ uri: category.bannerImage }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          <View style={styles.heroOverlay}>
            <View
              style={[
                styles.emojiCircle,
                { backgroundColor: category.accentColor },
              ]}>
              <Text style={styles.emojiText}>{category.heroEmoji}</Text>
            </View>

            <Text style={[styles.title, { color: '#FFFFFF' }]}>
              {category.title}
            </Text>

            <Text style={styles.subtitle}>{category.subtitle}</Text>
          </View>
        </View>

        {/* Short Description */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            About {category.title}
          </Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {category.description}
          </Text>
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How It Works in VibeCircle
          </Text>

          <View style={styles.howItWorksList}>
            {category.howItWorks.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.howItWorksCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <View
                  style={[
                    styles.stepIconBox,
                    { backgroundColor: category.accentColor + '20' },
                  ]}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={category.accentColor}
                  />
                </View>
                <View style={styles.stepTextBox}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.stepDesc, { color: colors.textSecondary }]}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Featured Hotspots / Offerings */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Featured Plans & Venues
            </Text>
            <TouchableOpacity onPress={handlePreviewAlert}>
              <Text style={[styles.seeAllText, { color: category.accentColor }]}>
                Preview
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredList}>
            {category.featuredItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.8}
                onPress={handlePreviewAlert}
                style={[
                  styles.featuredCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <View
                  style={[
                    styles.featuredEmojiBox,
                    { backgroundColor: category.accentColor + '20' },
                  ]}>
                  <Text style={styles.featuredEmoji}>{item.emoji}</Text>
                </View>

                <View style={styles.featuredTextCol}>
                  <View style={styles.featuredTagRow}>
                    <Text
                      style={[
                        styles.featuredTag,
                        { color: category.accentColor },
                      ]}>
                      {item.tag}
                    </Text>
                  </View>
                  <Text
                    style={[styles.featuredTitle, { color: colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.featuredSubtitle,
                      { color: colors.textSecondary },
                    ]}>
                    {item.subtitle}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Safety & Guidelines Rules */}
        <View
          style={[
            styles.rulesCard,
            {
              backgroundColor: colors.backgroundElement,
              borderColor: colors.cardBorder,
            },
          ]}>
          <View style={styles.rulesHeader}>
            <Ionicons name="shield-checkmark" size={18} color={colors.emerald} />
            <Text style={[styles.rulesTitle, { color: colors.text }]}>
              Community Standards & Safety Rules
            </Text>
          </View>

          {category.rules.map((rule, idx) => (
            <View key={idx} style={styles.ruleRow}>
              <Text style={[styles.ruleBullet, { color: colors.emerald }]}>
                •
              </Text>
              <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
                {rule}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.ctaSection}>
          <CustomButton
            title={category.ctaText}
            onPress={handleExploreDiscover}
            variant="primary"
            size="lg"
            icon="compass-outline"
            iconPosition="right"
          />

          <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
            Phase 1 UI Preview • Bookings & matchmaking are in demo mode.
          </Text>
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
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    height: 220,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  emojiCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emojiText: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#E5E7EB',
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  howItWorksList: {
    gap: 10,
  },
  howItWorksCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  stepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepTextBox: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  featuredList: {
    gap: 10,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  featuredEmojiBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featuredEmoji: {
    fontSize: 22,
  },
  featuredTextCol: {
    flex: 1,
  },
  featuredTagRow: {
    marginBottom: 2,
  },
  featuredTag: {
    fontSize: 11,
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  featuredSubtitle: {
    fontSize: 12,
  },
  rulesCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  rulesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ruleBullet: {
    fontSize: 14,
    marginRight: 6,
    lineHeight: 18,
  },
  ruleText: {
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  ctaSection: {
    alignItems: 'center',
    gap: 8,
  },
  disclaimerText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
