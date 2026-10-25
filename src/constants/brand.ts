/**
 * Brand constants and placeholder configurations for VibeCircle.
 * You can easily customize the brand name, taglines, and supported categories here.
 */

export const BRAND = {
  name: 'VibeCircle',
  tagline: 'Discover Verified People & Experiences',
  subtitle: 'Clubbing • Social Hangouts • Companions • Matchmaking',
  motto: '100% ID Verified & Safe Community',
  currencySymbol: '₹',
  premiumSubscriptionPrice: 299,
  supportEmail: 'support@vibecircle.app',
} as const;

export interface InterestOption {
  id: string;
  name: string;
  icon: string; // Ionicons icon name
  color: string;
  emoji: string;
}

export const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'clubbing', name: 'Clubbing', icon: 'wine', color: '#EC4899', emoji: '🍸' },
  { id: 'nightlife', name: 'Nightlife', icon: 'musical-notes', color: '#8B5CF6', emoji: '🪩' },
  { id: 'events', name: 'Events', icon: 'ticket', color: '#3B82F6', emoji: '🎟️' },
  { id: 'travel', name: 'Travel', icon: 'airplane', color: '#06B6D4', emoji: '✈️' },
  { id: 'food', name: 'Food', icon: 'restaurant', color: '#F59E0B', emoji: '🍕' },
  { id: 'social hangouts', name: 'Social Hangouts', icon: 'cafe', color: '#10B981', emoji: '☕' },
];

export const POPULAR_CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bengaluru',
  'Pune',
  'Hyderabad',
  'Goa',
  'Kolkata',
  'Chandigarh',
  'Jaipur',
] as const;

export interface AvatarPreset {
  id: string;
  label: string;
  emoji: string;
  bgColor: string;
  accentColor: string;
  imageUrl?: string;
  type?: 'persona' | 'photo';
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  // Curated photo portraits
  {
    id: 'photo_1',
    label: 'Club Classic',
    emoji: '🕶️',
    bgColor: '#1E1B4B',
    accentColor: '#818CF8',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
  },
  {
    id: 'photo_2',
    label: 'Party Neon',
    emoji: '🪩',
    bgColor: '#831843',
    accentColor: '#F472B6',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
  },
  {
    id: 'photo_3',
    label: 'Urban Social',
    emoji: '🎧',
    bgColor: '#064E3B',
    accentColor: '#34D399',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
  },
  {
    id: 'photo_4',
    label: 'Sunset Chic',
    emoji: '✨',
    bgColor: '#78350F',
    accentColor: '#FBBF24',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
  },
  // Persona & Vibe Avatars
  { id: 'avatar_1', label: 'Vibe Star', emoji: '🕶️', bgColor: '#4C1D95', accentColor: '#A78BFA', type: 'persona' },
  { id: 'avatar_2', label: 'Clubber', emoji: '🎧', bgColor: '#831843', accentColor: '#F472B6', type: 'persona' },
  { id: 'avatar_3', label: 'Socialite', emoji: '✨', bgColor: '#1E3A8A', accentColor: '#60A5FA', type: 'persona' },
  { id: 'avatar_4', label: 'Explorer', emoji: '🧭', bgColor: '#064E3B', accentColor: '#34D399', type: 'persona' },
  { id: 'avatar_5', label: 'Chic', emoji: '💫', bgColor: '#701A75', accentColor: '#E879F9', type: 'persona' },
  { id: 'avatar_6', label: 'Gourmet', emoji: '🥂', bgColor: '#78350F', accentColor: '#FBBF24', type: 'persona' },
];
