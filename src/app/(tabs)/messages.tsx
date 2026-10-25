import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CustomButton } from '@/components/common/CustomButton';

export default function MessagesScreen() {
  const router = useRouter();
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Direct chats with your verified squad connections
          </Text>
        </View>

        {/* Clean Empty State as requested */}
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons
              name="chatbubbles-outline"
              size={56}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Conversations Yet
          </Text>

          <Text style={[styles.emptyDescription, { color: colors.textSecondary }]}>
            Your chats with verified connections, clubbing squads, and hangout invites will appear here once you like people on Discover.
          </Text>

          {/* Action button to jump to Discover */}
          <View style={styles.ctaWrapper}>
            <CustomButton
              title="Find People on Discover"
              onPress={() => router.push('/(tabs)/discover')}
              variant="primary"
              size="md"
              icon="compass-outline"
            />
          </View>

          {/* Privacy & Safety Note */}
          <View
            style={[
              styles.safetyNotice,
              {
                backgroundColor: colors.backgroundElement,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons name="shield-checkmark" size={16} color={colors.emerald} />
            <Text style={[styles.safetyText, { color: colors.textSecondary }]}>
              Safe & Verified • Only mutually connected members can initiate direct messages.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -40,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
  },
  ctaWrapper: {
    width: '100%',
    maxWidth: 260,
    marginBottom: 32,
  },
  safetyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    maxWidth: 340,
  },
  safetyText: {
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
});
