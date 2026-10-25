import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CustomButton } from '@/components/common/CustomButton';
import { Colors } from '@/constants/theme';
import { BRAND } from '@/constants/brand';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, isAuthenticated, loginDemo } = useAuth();

  // If already authenticated and profile completed, user can jump right back in
  const handleContinue = () => {
    if (user?.hasCompletedProfile) {
      router.replace('/(tabs)');
    } else {
      router.replace('/profile-creation');
    }
  };

  const handleInstantDemo = () => {
    loginDemo();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Top Spacer & Logo */}
        <View style={styles.topSection}>
          <BrandLogo size="large" showTagline={false} />

          <View style={styles.taglineBadge}>
            <Ionicons name="shield-checkmark" size={14} color={colors.emerald} />
            <Text style={[styles.taglineBadgeText, { color: colors.emerald }]}>
              {BRAND.motto}
            </Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroHeadline, { color: colors.text }]}>
            Find Your Circle.{'\n'}
            <Text style={{ color: colors.primary }}>Any Night. Any Vibe.</Text>
          </Text>

          <Text style={[styles.heroSubtext, { color: colors.textSecondary }]}>
            Connect with verified people for clubbing, weekend hangouts, verified
            companions, and matrimonial matchmaking.
          </Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.highlightsContainer}>
          <View
            style={[
              styles.highlightCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="wine" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={[styles.highlightTitle, { color: colors.text }]}>
                Clubbing & Nightlife
              </Text>
              <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                VIP tables, guestlists & club hoppers
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.highlightCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#EC489920' }]}>
              <Ionicons name="cafe" size={20} color="#EC4899" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={[styles.highlightTitle, { color: colors.text }]}>
                Social Hangouts
              </Text>
              <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                Cafes, board games & road trips
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.highlightCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <View style={[styles.highlightIconBox, { backgroundColor: '#D9770620' }]}>
              <Ionicons name="heart" size={20} color="#D97706" />
            </View>
            <View style={styles.highlightTextBox}>
              <Text style={[styles.highlightTitle, { color: colors.text }]}>
                Rishta Matchmaking & Companions
              </Text>
              <Text style={[styles.highlightDesc, { color: colors.textSecondary }]}>
                Serious life partners & event plus-ones
              </Text>
            </View>
          </View>
        </View>

        {/* Actions / CTA Section */}
        <View style={styles.actionsSection}>
          {isAuthenticated && user ? (
            <View style={{ marginBottom: 16 }}>
              <CustomButton
                title={`Continue as ${user.displayName || user.fullName}`}
                onPress={handleContinue}
                variant="primary"
                size="lg"
                icon="arrow-forward"
                iconPosition="right"
              />
            </View>
          ) : (
            <>
              <CustomButton
                title="Get Started (Create Account)"
                onPress={() => router.push('/signup')}
                variant="primary"
                size="lg"
                icon="sparkles"
                style={{ marginBottom: 12 }}
              />

              <CustomButton
                title="Log In to Existing Account"
                onPress={() => router.push('/login')}
                variant="outline"
                size="md"
                style={{ marginBottom: 12 }}
              />
            </>
          )}

          {/* Quick Demo Exploration */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleInstantDemo}
            style={styles.demoButton}>
            <Ionicons name="flash" size={15} color={colors.gold} />
            <Text style={[styles.demoButtonText, { color: colors.gold }]}>
              Explore Demo Mode (1-Click Preview)
            </Text>
          </TouchableOpacity>

          {/* Terms Footer */}
          <Text style={[styles.footerDisclaimer, { color: colors.textMuted }]}>
            Phase 1 Preview • 18+ Verified Members Only
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginVertical: 12,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05966915',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#05966930',
  },
  taglineBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  heroSection: {
    alignItems: 'center',
    marginVertical: 14,
  },
  heroHeadline: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  heroSubtext: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 340,
    fontWeight: '400',
  },
  highlightsContainer: {
    marginVertical: 14,
    gap: 10,
  },
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  highlightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  highlightTextBox: {
    flex: 1,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  highlightDesc: {
    fontSize: 12,
    fontWeight: '400',
  },
  actionsSection: {
    marginTop: 18,
    alignItems: 'center',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  demoButtonText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  footerDisclaimer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
});
