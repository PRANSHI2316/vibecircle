import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface DiscoverProfile {
  id: string;
  name: string;
  age: number;
  city: string;
  category: 'clubbing' | 'hangouts' | 'companion' | 'rishta';
  bio: string;
  interests: string[];
  photoUrl: string;
  emoji: string;
  bgColor: string;
  badge: string;
  distance: string;
}

const SAMPLE_PROFILES: DiscoverProfile[] = [
  {
    id: 'd1',
    name: 'Aanya Verma',
    age: 23,
    city: 'Mumbai (Bandra)',
    category: 'clubbing',
    bio: 'Techno regular, love commercial clubbing and splitting VIP tables at Toy Room & Bastian.',
    interests: ['clubbing', 'nightlife', 'events'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    emoji: '🎧',
    bgColor: '#831843',
    badge: 'Nightlife Regular',
    distance: '2.4 km away',
  },
  {
    id: 'd2',
    name: 'Rohan Mehra',
    age: 26,
    city: 'Mumbai (Khar)',
    category: 'hangouts',
    bio: 'Looking for folks for board games, Sunday artisanal coffee walks & casual banter.',
    interests: ['food', 'social hangouts', 'events'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    emoji: '☕',
    bgColor: '#064E3B',
    badge: 'Social Explorer',
    distance: '3.1 km away',
  },
  {
    id: 'd3',
    name: 'Kavya Sen',
    age: 25,
    city: 'Mumbai (Juhu)',
    category: 'companion',
    bio: 'Verified plus-one for cocktail parties, social dinners & corporate galas.',
    interests: ['events', 'travel', 'food'],
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    emoji: '✨',
    bgColor: '#4C1D95',
    badge: 'Verified Plus-One',
    distance: '4.8 km away',
  },
  {
    id: 'd4',
    name: 'Dr. Arjun Kapoor',
    age: 29,
    city: 'Delhi NCR',
    category: 'rishta',
    bio: 'Cardiologist, music lover. Seeking genuine match with shared family values and zest for life.',
    interests: ['travel', 'food', 'events'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    emoji: '💍',
    bgColor: '#78350F',
    badge: 'Family Verified Rishta',
    distance: 'Delhi NCR',
  },
  {
    id: 'd5',
    name: 'Tara D’Souza',
    age: 24,
    city: 'Goa / Mumbai',
    category: 'clubbing',
    bio: 'Beach clubs, sunset sessions in Anjuna & weekend hops in Mumbai. Always up for good techno.',
    interests: ['clubbing', 'nightlife', 'travel'],
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    emoji: '🍸',
    bgColor: '#701A75',
    badge: 'VIP Clubber',
    distance: 'Active Today',
  },
  {
    id: 'd6',
    name: 'Siddharth Rao',
    age: 27,
    city: 'Bengaluru (Indiranagar)',
    category: 'hangouts',
    bio: 'Craft beer enthusiast, indie gig explorer, and weekend runner. Looking for social groups.',
    interests: ['social hangouts', 'events', 'food'],
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    emoji: '🧭',
    bgColor: '#1E3A8A',
    badge: 'Community Host',
    distance: 'Bengaluru',
  },
];

export default function DiscoverScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Temporary local state for Like & Pass
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [passedIds, setPassedIds] = useState<string[]>([]);

  const handleLike = (profile: DiscoverProfile) => {
    if (likedIds.includes(profile.id)) return;
    setLikedIds((prev) => [...prev, profile.id]);
    setPassedIds((prev) => prev.filter((id) => id !== profile.id));
    Alert.alert(
      'Liked! ❤️',
      `You liked ${profile.name}. When they like you back, you'll be able to chat in Messages.`
    );
  };

  const handlePass = (profile: DiscoverProfile) => {
    if (passedIds.includes(profile.id)) return;
    setPassedIds((prev) => [...prev, profile.id]);
    setLikedIds((prev) => prev.filter((id) => id !== profile.id));
  };

  const handleReset = () => {
    setLikedIds([]);
    setPassedIds([]);
  };

  const filteredProfiles = SAMPLE_PROFILES.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.bio.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.interests.some((i) => i.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Discover People
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Verified fictional profiles for hangouts, clubbing & companionship
            </Text>
          </View>

          {/* Likes & Pass Tracker Pill */}
          {(likedIds.length > 0 || passedIds.length > 0) && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleReset}
              style={[
                styles.statsPill,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.statsPillText, { color: colors.primary }]}>
                ❤️ {likedIds.length} • ✕ {passedIds.length} (Reset)
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.inputBg,
              borderColor: colors.inputBorder,
            },
          ]}>
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Search by name, vibe, interests, or city..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {search !== '' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}>
          {[
            { id: 'all', label: 'All Vibes', icon: 'sparkles' },
            { id: 'clubbing', label: 'Clubbing', icon: 'wine' },
            { id: 'hangouts', label: 'Hangouts', icon: 'cafe' },
            { id: 'companion', label: 'Companion', icon: 'people' },
            { id: 'rishta', label: 'Rishta', icon: 'heart' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.card,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}>
                <Ionicons
                  name={cat.icon as any}
                  size={14}
                  color={isSelected ? '#FFFFFF' : colors.textSecondary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? '#FFFFFF' : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Profiles List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.profilesScroll}>
          {filteredProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No verified profiles found
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Try adjusting your search keywords or filter category
              </Text>
            </View>
          ) : (
            filteredProfiles.map((p) => {
              const isLiked = likedIds.includes(p.id);
              const isPassed = passedIds.includes(p.id);

              return (
                <View
                  key={p.id}
                  style={[
                    styles.profileCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: isLiked
                        ? colors.primary
                        : isPassed
                        ? colors.textMuted + '40'
                        : colors.cardBorder,
                      opacity: isPassed ? 0.6 : 1,
                    },
                  ]}>
                  {/* Top Profile Image & Badges */}
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: p.photoUrl }}
                      style={styles.profilePhoto}
                      resizeMode="cover"
                    />

                    {/* Gradient Overlay for Text */}
                    <View style={styles.imageOverlay}>
                      <View style={styles.badgeRow}>
                        <View
                          style={[
                            styles.badgePill,
                            { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                          ]}>
                          <Ionicons
                            name="shield-checkmark"
                            size={12}
                            color="#10B981"
                            style={{ marginRight: 4 }}
                          />
                          <Text style={styles.badgeText}>{p.badge}</Text>
                        </View>

                        {isLiked && (
                          <View
                            style={[
                              styles.statusPill,
                              { backgroundColor: colors.primary },
                            ]}>
                            <Text style={styles.statusPillText}>❤️ Liked</Text>
                          </View>
                        )}

                        {isPassed && (
                          <View
                            style={[
                              styles.statusPill,
                              { backgroundColor: '#6B7280' },
                            ]}>
                            <Text style={styles.statusPillText}>✕ Passed</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.nameAgeOverlay}>
                        <Text style={styles.profileName}>
                          {p.name}, {p.age}
                        </Text>
                        <Text style={styles.profileCity}>
                          📍 {p.city} • {p.distance}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Bio & Details */}
                  <View style={styles.cardBody}>
                    <Text
                      style={[styles.bioText, { color: colors.textSecondary }]}>
                      {`"${p.bio}"`}
                    </Text>

                    {/* Interests Tags */}
                    <View style={styles.interestsRow}>
                      {p.interests.map((interest, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.interestTag,
                            {
                              backgroundColor: colors.backgroundElement,
                              borderColor: colors.cardBorder,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.interestTagText,
                              { color: colors.primary },
                            ]}>
                            #{interest}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Action Buttons: Pass and Like */}
                    <View style={styles.actionsRow}>
                      {/* Pass Button */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handlePass(p)}
                        style={[
                          styles.actionBtn,
                          styles.passBtn,
                          {
                            borderColor: isPassed ? '#EF4444' : colors.cardBorder,
                            backgroundColor: isPassed
                              ? '#EF444415'
                              : colors.backgroundElement,
                          },
                        ]}>
                        <Ionicons
                          name="close-outline"
                          size={22}
                          color={isPassed ? colors.danger : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.actionBtnText,
                            {
                              color: isPassed ? colors.danger : colors.textSecondary,
                            },
                          ]}>
                          {isPassed ? 'Passed' : 'Pass'}
                        </Text>
                      </TouchableOpacity>

                      {/* Like Button */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => handleLike(p)}
                        style={[
                          styles.actionBtn,
                          styles.likeBtn,
                          {
                            backgroundColor: isLiked
                              ? colors.primary
                              : colors.primary + '15',
                            borderColor: colors.primary,
                          },
                        ]}>
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={22}
                          color={isLiked ? '#FFFFFF' : colors.primary}
                        />
                        <Text
                          style={[
                            styles.actionBtnText,
                            {
                              color: isLiked ? '#FFFFFF' : colors.primary,
                              fontWeight: '700',
                            },
                          ]}>
                          {isLiked ? 'Liked! ❤️' : 'Like'}
                        </Text>
                      </TouchableOpacity>
                    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 240,
  },
  statsPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  statsPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  categoryScroll: {
    paddingHorizontal: 18,
    paddingBottom: 8,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
  },
  profilesScroll: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 36,
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
  profileCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    width: '100%',
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  nameAgeOverlay: {
    gap: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileCity: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  cardBody: {
    padding: 14,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  interestTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  interestTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  passBtn: {},
  likeBtn: {},
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
