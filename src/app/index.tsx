import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, isAuthenticated, loginDemo } = useAuth();

  const handleContinue = () => {
    if (user?.hasCompletedProfile) {
      router.replace('/(tabs)');
    } else {
      router.replace('/profile-creation' as any);
    }
  };

  const handleInstantDemo = () => {
    loginDemo();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Background Vintage Botanical and Corner Art */}
      <View style={styles.bgDecorations} pointerEvents="none">
        {/* Top-Right Flowering Botanical Branch */}
        <Image
          source={require('@/../assets/images/vintage/botanical_branch.jpg')}
          style={styles.topRightBranch}
          resizeMode="contain"
        />

        {/* Bottom-Left Wildflowers & Vintage Key */}
        <Image
          source={require('@/../assets/images/vintage/key_and_flowers.jpg')}
          style={styles.bottomLeftKey}
          resizeMode="contain"
        />

        {/* Bottom-Right Friends Around Campfire */}
        <Image
          source={require('@/../assets/images/vintage/campfire_scene.jpg')}
          style={styles.bottomRightCampfire}
          resizeMode="contain"
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Centered Max-Width Container for Desktop and Mobile */}
        <View style={styles.container}>
          {/* Header Brand Section */}
          <View style={styles.headerSection}>
            {/* Interlocking Golden Rings Logo */}
            <View style={styles.logoWrapper}>
              <Image
                source={require('@/../assets/images/vintage/gold_rings_logo.jpg')}
                style={styles.goldRingsImg}
                resizeMode="contain"
              />
            </View>

            {/* Brand Title in Elegant Plum Serif */}
            <Text style={styles.brandTitle}>VibeCircle</Text>

            {/* Vintage Patina Plaque: 100% ID Verified & Safe Community */}
            <View style={styles.plaqueBadge}>
              <View style={styles.screwRivetLeft} />
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#5EEAD4"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.plaqueText}>
                100% ID Verified & Safe Community
              </Text>
              <View style={styles.screwRivetRight} />
            </View>
          </View>

          {/* Hero Headline Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroHeadline}>
              Find Your Circle.{'\n'}Any Night. Any Vibe.
            </Text>
            <Text style={styles.heroSubtitle}>
              Connect with verified people for clubbing, weekend hangouts,
              verified companions, and matrimonial matchmaking.
            </Text>
          </View>

          {/* Torn-Paper Category Cards */}
          <View style={styles.cardsSection}>
            {/* Card 1: Clubbing & Nightlife (Dusty Rose Banner) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/category/clubbing' as any)}
              style={[styles.tornCard, styles.cardPink]}>
              <View style={styles.cardIllustrationLeft}>
                <Image
                  source={require('@/../assets/images/vintage/shaker_and_sunglasses.jpg')}
                  style={styles.cardArtImg}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Clubbing & Nightlife</Text>
                <Text style={styles.cardSubtitle}>
                  VIP tables, guestlists & club hoppers
                </Text>
              </View>

              <View style={styles.cardIllustrationRight}>
                <Ionicons name="glasses-outline" size={26} color="#4A2F25" />
              </View>
            </TouchableOpacity>

            {/* Card 2: Social Hangouts (Sage Green Banner) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/category/hangouts' as any)}
              style={[styles.tornCard, styles.cardGreen]}>
              <View style={styles.cardIllustrationLeft}>
                <Image
                  source={require('@/../assets/images/vintage/coffee_and_books.jpg')}
                  style={styles.cardArtImg}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: '#1B2618' }]}>
                  Social Hangouts
                </Text>
                <Text style={[styles.cardSubtitle, { color: '#3E4E3B' }]}>
                  Cafes, board games & road trips
                </Text>
              </View>

              <View style={styles.cardIllustrationRight}>
                <Ionicons name="dice-outline" size={26} color="#2A3826" />
              </View>
            </TouchableOpacity>

            {/* Card 3: Rishta Matchmaking & Companions (Ochre Gold Banner) */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/category/matchmaking' as any)}
              style={[styles.tornCard, styles.cardGold]}>
              <View style={styles.cardIllustrationLeft}>
                <Ionicons name="flame-outline" size={28} color="#5C3B1A" />
              </View>

              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: '#2C1B0B' }]}>
                  Rishta Matchmaking & Companions
                </Text>
                <Text style={[styles.cardSubtitle, { color: '#5A4228' }]}>
                  Serious life partners & event plus-ones
                </Text>
              </View>

              <View style={styles.cardIllustrationRight}>
                <Ionicons name="document-text-outline" size={26} color="#5C3B1A" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Primary CTA Button: Stitched Plum Leather */}
          <View style={styles.ctaWrapper}>
            {isAuthenticated && user ? (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleContinue}
                style={styles.leatherCtaButton}>
                <Ionicons
                  name="sparkles"
                  size={20}
                  color="#FBE6BC"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.leatherCtaText}>
                  Continue as {user.displayName || user.fullName}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/signup' as any)}
                style={styles.leatherCtaButton}>
                <View style={styles.ctaMiniRings}>
                  <Ionicons name="infinite" size={22} color="#FBE6BC" />
                </View>
                <Text style={styles.leatherCtaText}>
                  Get Started - Create Account
                </Text>
              </TouchableOpacity>
            )}

            {/* Secondary Login / Quick Links */}
            <View style={styles.secondaryActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push('/login' as any)}>
                <Text style={styles.secondaryLinkText}>
                  Already have an account?{' '}
                  <Text style={{ fontWeight: '700', textDecorationLine: 'underline' }}>
                    Log In
                  </Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleInstantDemo}
                style={styles.demoLink}>
                <Ionicons name="flash-outline" size={13} color="#8A5A2B" />
                <Text style={styles.demoLinkText}>Explore 1-Click Demo</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section with Vintage Links & Campfire Space */}
          <View style={styles.footerSection}>
            <View style={styles.footerLinksGrid}>
              <View style={styles.footerCol}>
                <TouchableOpacity activeOpacity={0.7} style={styles.footerItem}>
                  <Text style={styles.footerText}>About Us</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.footerItem}>
                  <Text style={styles.footerText}>Safety</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerCol}>
                <TouchableOpacity activeOpacity={0.7} style={styles.footerItem}>
                  <Text style={styles.footerText}>Stories</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} style={styles.footerItem}>
                  <Text style={styles.footerText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Spacer for bottom-right campfire artwork */}
            <View style={styles.footerCampfireSpacer} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EA', // Warm vintage parchment
  },
  bgDecorations: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  topRightBranch: {
    position: 'absolute',
    top: -15,
    right: -15,
    width: 210,
    height: 210,
    opacity: 0.95,
  },
  bottomLeftKey: {
    position: 'absolute',
    bottom: -15,
    left: -15,
    width: 180,
    height: 180,
    opacity: 0.92,
  },
  bottomRightCampfire: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 220,
    height: 200,
    opacity: 0.96,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 440, // Keeps luxury mobile app proportions on wide screens
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  goldRingsImg: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#3F2231', // Deep plum wine
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'serif',
    }),
    marginBottom: 8,
  },
  plaqueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D6C60', // Patina teal
    borderWidth: 1.5,
    borderColor: '#C7A263', // Brass bronze trim
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 5,
    shadowColor: '#203A34',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  screwRivetLeft: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5C98F',
    marginRight: 8,
  },
  screwRivetRight: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#E5C98F',
    marginLeft: 8,
  },
  plaqueText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#F4EEDB',
    letterSpacing: 0.3,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  heroHeadline: {
    fontSize: 29,
    fontWeight: '800',
    color: '#281912',
    textAlign: 'center',
    lineHeight: 37,
    letterSpacing: -0.3,
    fontFamily: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'serif',
    }),
  },
  heroSubtitle: {
    fontSize: 13.5,
    lineHeight: 21,
    color: '#55433A',
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 350,
  },
  cardsSection: {
    width: '100%',
    marginVertical: 14,
    gap: 13,
  },
  tornCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    shadowColor: '#2B160C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  cardPink: {
    backgroundColor: '#E0ACB1', // Dusty pink rose torn paper
    borderColor: '#CB9499',
  },
  cardGreen: {
    backgroundColor: '#BDD2B7', // Soft sage green torn paper
    borderColor: '#A8BF9F',
  },
  cardGold: {
    backgroundColor: '#EDCD8A', // Warm golden ochre torn paper
    borderColor: '#D8B56C',
  },
  cardIllustrationLeft: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  cardArtImg: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#26150F',
    marginBottom: 2,
    fontFamily: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'serif',
    }),
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#523830',
    fontWeight: '500',
  },
  cardIllustrationRight: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  ctaWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  leatherCtaButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#521F45', // Deep rich wine plum leather
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#C89B7299',
    borderStyle: 'dashed', // Fine stitched look
    shadowColor: '#36102C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaMiniRings: {
    marginRight: 9,
  },
  leatherCtaText: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#FBE6BE', // Soft golden sand text
    letterSpacing: 0.4,
  },
  secondaryActions: {
    alignItems: 'center',
    marginTop: 12,
    gap: 7,
  },
  secondaryLinkText: {
    fontSize: 13,
    color: '#553E32',
  },
  demoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  demoLinkText: {
    fontSize: 12.5,
    color: '#7C4F22',
    fontWeight: '700',
    marginLeft: 4,
  },
  footerSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 18,
    paddingTop: 10,
    minHeight: 120,
  },
  footerLinksGrid: {
    flexDirection: 'row',
    gap: 32,
    paddingLeft: 8,
    paddingBottom: 8,
    zIndex: 10,
  },
  footerCol: {
    gap: 12,
  },
  footerItem: {
    paddingVertical: 2,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3C261B',
    fontFamily: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'serif',
    }),
  },
  footerCampfireSpacer: {
    width: 140,
    height: 100,
  },
});
