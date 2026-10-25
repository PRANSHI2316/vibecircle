import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ActivityItem {
  id: string;
  title: string;
  category: 'Nightlife' | 'Hangout' | 'Mixer';
  date: string;
  time: string;
  venue: string;
  city: string;
  attendeesCount: number;
  entry: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  description: string;
}

const ACTIVITIES_DATA: ActivityItem[] = [
  {
    id: 'a1',
    title: 'Techno Night & VIP Table Share',
    category: 'Nightlife',
    date: 'This Saturday',
    time: '10:30 PM Onwards',
    venue: 'Bastian At The Top, Bandra',
    city: 'Mumbai',
    attendeesCount: 14,
    entry: 'Table Split (₹2,500/head)',
    icon: 'wine',
    accent: '#EC4899',
    description: 'Pool budgets together for a prime VIP table with premium bottle service & guestlist.',
  },
  {
    id: 'a2',
    title: 'Sunset Rooftop Acoustic & Cocktails',
    category: 'Mixer',
    date: 'Sunday Evening',
    time: '5:30 PM - 8:30 PM',
    venue: 'Aer Rooftop Lounge, Worli',
    city: 'Mumbai',
    attendeesCount: 22,
    entry: 'Free Entry with RSVP',
    icon: 'musical-notes',
    accent: '#8B5CF6',
    description: 'Panoramic sea views, chilled sunset drinks, and live acoustic singer-songwriter sets.',
  },
  {
    id: 'a3',
    title: 'Sunday Artisanal Coffee & Catan Board Games',
    category: 'Hangout',
    date: 'Sunday Morning',
    time: '11:00 AM - 2:00 PM',
    venue: 'Subko Coffee Roasters, Bandra',
    city: 'Mumbai',
    attendeesCount: 8,
    entry: 'Pay for your order',
    icon: 'cafe',
    accent: '#10B981',
    description: 'Casual Sunday chill. Play Catan, Ticket to Ride, or just sip freshly brewed pour-overs.',
  },
  {
    id: 'a4',
    title: 'Bollywood & Punjabi Commercial Night',
    category: 'Nightlife',
    date: 'Next Friday',
    time: '10:00 PM',
    venue: 'Toy Room, Mumbai',
    city: 'Mumbai',
    attendeesCount: 31,
    entry: 'Verified Couples & Guestlist',
    icon: 'sparkles',
    accent: '#F59E0B',
    description: 'High energy commercial hits, neon lights, and verified squad table hops.',
  },
  {
    id: 'a5',
    title: 'Weekend Foodie Walk & Heritage Trail',
    category: 'Hangout',
    date: 'Saturday Morning',
    time: '8:30 AM - 11:30 AM',
    venue: 'Fort & Kala Ghoda Heritage District',
    city: 'Mumbai',
    attendeesCount: 12,
    entry: 'Pay for your food bites',
    icon: 'restaurant',
    accent: '#06B6D4',
    description: 'Colonial architecture, classic Parsi cafes, bun maska, chai, and photography.',
  },
  {
    id: 'a6',
    title: 'Standup Comedy & Social Mixer',
    category: 'Mixer',
    date: 'Thursday Evening',
    time: '8:00 PM - 10:30 PM',
    venue: 'The Habitat, Khar',
    city: 'Mumbai',
    attendeesCount: 18,
    entry: '₹499 Ticket (Includes Drink)',
    icon: 'happy',
    accent: '#6366F1',
    description: 'Laugh your heart out with top comic talent followed by informal post-show drinks.',
  },
];

export default function ActivitiesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [rsvpIds, setRsvpIds] = useState<string[]>([]);

  const handleRsvp = (act: ActivityItem) => {
    if (rsvpIds.includes(act.id)) {
      setRsvpIds((prev) => prev.filter((id) => id !== act.id));
      Alert.alert('RSVP Cancelled', `You removed your RSVP for ${act.title}.`);
    } else {
      setRsvpIds((prev) => [...prev, act.id]);
      Alert.alert(
        'RSVP Confirmed! 🎉',
        `You are on the list for ${act.title} at ${act.venue}. Details will unlock closer to the event.`
      );
    }
  };

  const filteredActivities = ACTIVITIES_DATA.filter((act) => {
    if (activeCategory === 'All') return true;
    return act.category === activeCategory;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Activities & Mixers
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Join verified squads for clubbing, parties, and weekend hangouts
          </Text>
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {['All', 'Nightlife', 'Hangout', 'Mixer'].map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                activeOpacity={0.7}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}>
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {cat === 'All' ? 'All Activities' : cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Activities List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}>
          {filteredActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No activities found
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Try switching to a different category filter above
              </Text>
            </View>
          ) : (
            filteredActivities.map((act) => {
              const isRsvped = rsvpIds.includes(act.id);
              return (
                <View
                  key={act.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: colors.card,
                      borderColor: isRsvped ? colors.emerald : colors.cardBorder,
                    },
                  ]}>
                  {/* Top Badge Row */}
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.iconCircle,
                        {
                          backgroundColor: act.accent + '25',
                          borderColor: act.accent,
                        },
                      ]}>
                      <Ionicons name={act.icon} size={20} color={act.accent} />
                    </View>

                    <View style={styles.topRightRow}>
                      <View
                        style={[
                          styles.categoryBadge,
                          {
                            backgroundColor: act.accent + '20',
                            borderColor: act.accent + '40',
                          },
                        ]}>
                        <Text
                          style={[
                            styles.categoryBadgeText,
                            { color: act.accent },
                          ]}>
                          {act.category}
                        </Text>
                      </View>

                      {isRsvped && (
                        <View style={styles.rsvpedBadge}>
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color="#10B981"
                          />
                          <Text style={styles.rsvpedText}>{"RSVP'd"}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Event Title */}
                  <Text style={[styles.eventTitle, { color: colors.text }]}>
                    {act.title}
                  </Text>

                  {/* Description */}
                  <Text
                    style={[styles.eventDesc, { color: colors.textSecondary }]}>
                    {act.description}
                  </Text>

                  {/* Details */}
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={15}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.detailText, { color: colors.textSecondary }]}>
                      {act.date} • {act.time}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="location-outline"
                      size={15}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.detailText, { color: colors.textSecondary }]}>
                      {act.venue}, {act.city}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons
                      name="pricetag-outline"
                      size={15}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.detailText, { color: colors.textSecondary }]}>
                      {act.entry}
                    </Text>
                  </View>

                  {/* Footer Action Row */}
                  <View style={styles.cardFooter}>
                    <View style={styles.attendeesCol}>
                      <View style={styles.attendeesAvatars}>
                        <View
                          style={[
                            styles.miniAvatar,
                            { backgroundColor: '#EC4899' },
                          ]}>
                          <Text style={styles.miniAvatarText}>A</Text>
                        </View>
                        <View
                          style={[
                            styles.miniAvatar,
                            {
                              backgroundColor: '#8B5CF6',
                              marginLeft: -8,
                            },
                          ]}>
                          <Text style={styles.miniAvatarText}>R</Text>
                        </View>
                        <View
                          style={[
                            styles.miniAvatar,
                            {
                              backgroundColor: '#10B981',
                              marginLeft: -8,
                            },
                          ]}>
                          <Text style={styles.miniAvatarText}>K</Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.attendeesCountText,
                          { color: colors.textMuted },
                        ]}>
                        {act.attendeesCount + (isRsvped ? 1 : 0)} attending
                      </Text>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleRsvp(act)}
                      style={[
                        styles.rsvpButton,
                        {
                          backgroundColor: isRsvped
                            ? '#05966920'
                            : colors.primary,
                          borderColor: isRsvped
                            ? colors.emerald
                            : colors.primary,
                        },
                      ]}>
                      <Ionicons
                        name={
                          isRsvped ? 'checkmark-circle' : 'flash-outline'
                        }
                        size={14}
                        color={isRsvped ? colors.emerald : '#FFFFFF'}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.rsvpButtonText,
                          { color: isRsvped ? colors.emerald : '#FFFFFF' },
                        ]}>
                        {isRsvped ? "You're In" : 'RSVP Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
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
  filterScroll: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 6,
  },
  filterPillText: {
    fontSize: 13,
  },
  scrollList: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 36,
    gap: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  rsvpedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#05966920',
  },
  rsvpedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  attendeesCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attendeesAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  miniAvatarText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  attendeesCountText: {
    fontSize: 11,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  rsvpButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
