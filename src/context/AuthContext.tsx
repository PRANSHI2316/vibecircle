import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  VerificationStatus,
  KycDocumentType,
  verifyIdentityDocument,
  calculateAgeFromDob,
} from '@/services/kycService';

export type { VerificationStatus, KycDocumentType };

export interface KycDocumentRecord {
  documentType: KycDocumentType;
  documentUri: string; // Ephemeral local preview only, never exposed publicly
  documentName?: string;
  submittedAt: string;
  confirmedOwnership: boolean;
  verifiedAge?: number;
  rejectionReason?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  age: number; // Auto-calculated from DOB
  avatar: string; // Preset ID or custom uri marker
  customAvatarUri?: string | null; // User's gallery uploaded photo
  bio: string;
  city: string;
  detectedLocation?: {
    city?: string;
    region?: string;
    country?: string;
    coords?: { latitude: number; longitude: number };
  } | null;
  interests: string[];
  isVerified: boolean; // True only when verificationStatus === 'Verified'
  verificationStatus: VerificationStatus;
  kycDocument?: KycDocumentRecord | null;
  tier: 'Free Member' | '₹299 Club Premium';
  hasCompletedProfile: boolean;
}

export interface SignupInput {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  customAvatarUri?: string | null;
  city?: string;
  // NOTE: Password is intentionally NOT stored in plain text or state.
}

export interface SaveProfileInput {
  displayName: string;
  bio: string;
  city: string;
  interests: string[];
  avatar: string;
  customAvatarUri?: string | null;
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
  isVerifiedUser: boolean;
  signup: (input: SignupInput) => Promise<boolean>;
  login: (email: string) => Promise<{ success: boolean; hasCompletedProfile: boolean }>;
  loginDemo: () => void;
  saveProfile: (input: SaveProfileInput) => Promise<boolean>;
  updateProfilePhoto: (photoUri: string | null) => Promise<void>;
  updateLocation: (
    city: string,
    detectedCoords?: { latitude: number; longitude: number }
  ) => Promise<void>;
  submitKyc: (payload: {
    documentType: KycDocumentType;
    documentUri: string;
    documentName?: string;
    confirmedOwnership: boolean;
  }) => Promise<{ status: VerificationStatus; message: string; verifiedAge?: number }>;
  resetKyc: () => void;
  logout: () => void;
  calculateAge: (dob: string) => number;
  validateDob: (day: string, month: string, year: string) => DobValidationResult;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const calculateAge = calculateAgeFromDob;

export function validateDob(
  day: string,
  month: string,
  year: string
): DobValidationResult {
  const dStr = day.trim();
  const mStr = month.trim();
  const yStr = year.trim();

  if (!dStr || !mStr || !yStr) {
    return {
      valid: false,
      error: 'Please enter your complete date of birth (DD / MM / YYYY)',
    };
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

// Default initial demo user profile (Pre-verified for testing features)
const DEMO_USER: UserProfile = {
  id: 'usr_demo_101',
  fullName: 'Pranav Sharma',
  displayName: 'Pranav',
  email: 'pranav@example.com',
  phone: '+91 98200 12345',
  dob: '1999-06-15',
  age: calculateAge('1999-06-15') || 25,
  avatar: 'photo_1',
  customAvatarUri: null,
  bio: 'Tech enthusiast, techno weekend regular, and coffee explorer in Bandra. Looking for clubbing squads and social hangouts!',
  city: 'Mumbai',
  interests: ['clubbing', 'nightlife', 'food', 'social hangouts'],
  isVerified: true,
  verificationStatus: 'Verified',
  kycDocument: {
    documentType: 'Aadhaar Card',
    documentUri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
    submittedAt: '2026-01-15T10:00:00Z',
    confirmedOwnership: true,
    verifiedAge: 25,
  },
  tier: 'Free Member',
  hasCompletedProfile: true,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const isVerifiedUser = Boolean(user && user.verificationStatus === 'Verified');

  /**
   * Phase 1 Sign-up.
   * Calculates age from date of birth and initializes KYC status to 'Not Submitted'.
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
      avatar: input.customAvatarUri ? 'custom' : 'photo_1',
      customAvatarUri: input.customAvatarUri || null,
      bio: '',
      city: input.city || 'Mumbai',
      interests: ['clubbing', 'nightlife', 'social hangouts'],
      isVerified: false,
      verificationStatus: 'Not Submitted',
      kycDocument: null,
      tier: 'Free Member',
      hasCompletedProfile: false,
    };

    setUser(newUser);
    setIsAuthenticated(true);
    return true;
  };

  /**
   * Login handler
   */
  const login = async (
    email: string
  ): Promise<{ success: boolean; hasCompletedProfile: boolean }> => {
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
      customAvatarUri: null,
      bio: 'Ready to discover exciting nightspots and social events!',
      city: 'Mumbai',
      interests: ['clubbing', 'nightlife', 'social hangouts'],
      isVerified: false,
      verificationStatus: 'Not Submitted',
      kycDocument: null,
      tier: 'Free Member',
      hasCompletedProfile: true,
    };
    setUser(loggedInUser);
    setIsAuthenticated(true);
    return { success: true, hasCompletedProfile: true };
  };

  /**
   * 1-Tap Quick Demo Login (Pre-verified for test exploration)
   */
  const loginDemo = () => {
    setUser({ ...DEMO_USER });
    setIsAuthenticated(true);
  };

  /**
   * Saves Profile details.
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
        customAvatarUri:
          input.customAvatarUri !== undefined
            ? input.customAvatarUri
            : prev.customAvatarUri,
        hasCompletedProfile: true,
      };
    });

    return true;
  };

  /**
   * Updates or removes user profile photo.
   */
  const updateProfilePhoto = async (photoUri: string | null): Promise<void> => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        customAvatarUri: photoUri,
        avatar: photoUri ? 'custom' : prev.avatar === 'custom' ? 'photo_1' : prev.avatar,
      };
    });
  };

  /**
   * Updates location with manual or detected coordinates.
   */
  const updateLocation = async (
    city: string,
    detectedCoords?: { latitude: number; longitude: number }
  ): Promise<void> => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        city: city.trim(),
        detectedLocation: detectedCoords
          ? { city: city.trim(), coords: detectedCoords }
          : prev.detectedLocation,
      };
    });
  };

  /**
   * Submits Government ID document for KYC and 18+ Age verification.
   */
  const submitKyc = async (payload: {
    documentType: KycDocumentType;
    documentUri: string;
    documentName?: string;
    confirmedOwnership: boolean;
  }): Promise<{ status: VerificationStatus; message: string; verifiedAge?: number }> => {
    if (!user) {
      throw new Error('User session not found.');
    }

    const result = await verifyIdentityDocument({
      ...payload,
      userDob: user.dob,
      fullName: user.fullName,
    });

    const isSuccess = result.status === 'Verified';

    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        verificationStatus: result.status,
        isVerified: isSuccess,
        age: result.calculatedAge || prev.age,
        kycDocument: {
          documentType: payload.documentType,
          documentUri: payload.documentUri,
          documentName: payload.documentName,
          submittedAt: new Date().toISOString(),
          confirmedOwnership: payload.confirmedOwnership,
          verifiedAge: result.calculatedAge,
          rejectionReason: result.rejectionReason,
        },
      };
    });

    return {
      status: result.status,
      message: result.message,
      verifiedAge: result.calculatedAge,
    };
  };

  /**
   * Resets KYC state to allow document re-upload after rejection.
   */
  const resetKyc = () => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        verificationStatus: 'Not Submitted',
        isVerified: false,
        kycDocument: null,
      };
    });
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
        isVerifiedUser,
        signup,
        login,
        loginDemo,
        saveProfile,
        updateProfilePhoto,
        updateLocation,
        submitKyc,
        resetKyc,
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
