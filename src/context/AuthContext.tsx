import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  age: number; // Auto-calculated from DOB
  avatar: string;
  bio: string;
  city: string;
  interests: string[];
  isVerified: boolean;
  tier: 'Free Member' | '₹299 Club Premium';
  hasCompletedProfile: boolean;
}

export interface SignupInput {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  // NOTE: Password is intentionally NOT stored in plain text or state, in compliance with security guidelines.
}

export interface SaveProfileInput {
  displayName: string;
  bio: string;
  city: string;
  interests: string[];
  avatar: string;
}

export interface DobValidationResult {
  valid: boolean;
  error?: string;
  age?: number;
  formattedDob?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  signup: (input: SignupInput) => Promise<boolean>;
  login: (email: string) => Promise<{ success: boolean; hasCompletedProfile: boolean }>;
  loginDemo: () => void;
  saveProfile: (input: SaveProfileInput) => Promise<boolean>;
  logout: () => void;
  calculateAge: (dob: string) => number;
  validateDob: (day: string, month: string, year: string) => DobValidationResult;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Timezone-safe age calculation from YYYY-MM-DD string.
 */
export function calculateAge(dob: string): number {
  if (!dob) return 0;
  const parts = dob.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [birthYear, birthMonth, birthDay] = parts;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // 1-indexed (1-12)
  const currentDay = today.getDate();

  let age = currentYear - birthYear;
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Validates birth day, month, and year inputs with calendar checks and 18+ requirement.
 */
export function validateDob(day: string, month: string, year: string): DobValidationResult {
  const dStr = day.trim();
  const mStr = month.trim();
  const yStr = year.trim();

  if (!dStr || !mStr || !yStr) {
    return { valid: false, error: 'Please enter your complete date of birth (DD / MM / YYYY)' };
  }

  const d = parseInt(dStr, 10);
  const m = parseInt(mStr, 10);
  const y = parseInt(yStr, 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) {
    return { valid: false, error: 'Please enter valid numbers for your date of birth' };
  }

  if (m < 1 || m > 12) {
    return { valid: false, error: 'Month must be between 01 and 12' };
  }

  if (d < 1 || d > 31) {
    return { valid: false, error: 'Day must be between 01 and 31' };
  }

  const currentYear = new Date().getFullYear();
  if (y < 1920 || y > currentYear) {
    return { valid: false, error: `Year must be between 1920 and ${currentYear}` };
  }

  // Calendar validation for month boundaries & leap years
  const testDate = new Date(y, m - 1, d);
  if (
    testDate.getFullYear() !== y ||
    testDate.getMonth() !== m - 1 ||
    testDate.getDate() !== d
  ) {
    return { valid: false, error: 'Invalid calendar date for the selected month' };
  }

  const formattedDob = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const age = calculateAge(formattedDob);

  if (age < 18) {
    return {
      valid: false,
      error: `You must be at least 18 years old to join (Current age: ${age} yrs)`,
      age,
      formattedDob,
    };
  }

  return { valid: true, age, formattedDob };
}

// Default initial demo user profile
const DEMO_USER: UserProfile = {
  id: 'usr_demo_101',
  fullName: 'Pranav Sharma',
  displayName: 'Pranav',
  email: 'pranav@example.com',
  phone: '+91 98200 12345',
  dob: '1999-06-15',
  age: calculateAge('1999-06-15') || 25,
  avatar: 'photo_1',
  bio: 'Tech enthusiast, techno weekend regular, and coffee explorer in Bandra. Looking for clubbing squads and social hangouts!',
  city: 'Mumbai',
  interests: ['clubbing', 'nightlife', 'food', 'social hangouts'],
  isVerified: true,
  tier: 'Free Member',
  hasCompletedProfile: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  /**
   * Phase 1 Mock Sign-up.
   * Calculates age from date of birth and strictly ensures user is at least 18.
   * Passwords are validated in the UI and never stored in memory or state.
   */
  const signup = async (input: SignupInput): Promise<boolean> => {
    const age = calculateAge(input.dob);
    if (age < 18) {
      throw new Error('You must be at least 18 years old to register.');
    }

    const firstName = input.fullName.trim().split(' ')[0] || input.fullName.trim();

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: input.fullName.trim(),
      displayName: firstName,
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      dob: input.dob,
      age,
      avatar: 'photo_1',
      bio: '',
      city: 'Mumbai',
      interests: ['clubbing', 'nightlife', 'social hangouts'],
      isVerified: false,
      tier: 'Free Member',
      hasCompletedProfile: false,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  /**
   * Phase 1 Mock Login.
   * Logs in user session in temporary local state.
   */
  const login = async (
    email: string
  ): Promise<{ success: boolean; hasCompletedProfile: boolean }> => {
    // If existing in-memory user matches, retain their details & state
    if (user && user.email === email.trim().toLowerCase()) {
      setIsAuthenticated(true);
      return { success: true, hasCompletedProfile: !!user.hasCompletedProfile };
    }

    const name = email.split('@')[0] || 'User';
    const capitalName = name.charAt(0).toUpperCase() + name.slice(1);
    const loggedInUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: capitalName,
      displayName: capitalName,
      email: email.trim().toLowerCase(),
      phone: '+91 98000 00000',
      dob: '2000-01-01',
      age: 24,
      avatar: 'photo_1',
      bio: 'Ready to discover exciting nightspots and social events!',
      city: 'Mumbai',
      interests: ['clubbing', 'nightlife', 'social hangouts'],
      isVerified: false,
      tier: 'Free Member',
      hasCompletedProfile: true,
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return { success: true, hasCompletedProfile: true };
  };

  /**
   * 1-Tap Quick Demo Login for instant testing without typing.
   */
  const loginDemo = () => {
    setUser({ ...DEMO_USER });
    setIsAuthenticated(true);
  };

  /**
   * Step 2 Profile Creation completion.
   * Saves display name, bio, city, interests, and avatar.
   * Age remains strictly derived from the validated DOB and cannot be overwritten.
   */
  const saveProfile = async (input: SaveProfileInput): Promise<boolean> => {
    if (!user) return false;

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        displayName: input.displayName.trim() || prev.displayName,
        bio: input.bio.trim(),
        city: input.city,
        interests: input.interests,
        avatar: input.avatar,
        hasCompletedProfile: true,
      };
    });

    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signup,
        login,
        loginDemo,
        saveProfile,
        logout,
        calculateAge,
        validateDob,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
