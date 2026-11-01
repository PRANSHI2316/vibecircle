/**
 * VibeCircle Secure KYC & Age Verification Service.
 *
 * Architecture Specification:
 * - In production, this module coordinates with a secure backend API (e.g. /api/v1/kyc/verify-document)
 *   connected to licensed identity verification providers:
 *   - India: DigiLocker API / HyperVerge KYC / IDfy Gov ID Verification
 *   - Global: Stripe Identity / Onfido
 *
 * Security & Privacy Rules:
 * - Front-end code NEVER holds secret API keys or provider tokens.
 * - Government ID images are uploaded via signed, encrypted HTTPS presigned URLs directly
 *   to access-controlled S3 storage with a 7-day retention/deletion policy.
 * - Raw document numbers are NEVER stored in public state, local storage, or exposed to other users.
 * - Verified age and identity status are cryptographically verified by the server.
 */

export type VerificationStatus =
  | 'Not Submitted'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected'
  | 'Underage – Access Denied';

export type KycDocumentType =
  | 'Aadhaar Card'
  | 'Passport'
  | 'Voter ID'
  | 'Driving License'
  | 'Government ID';

export interface KycSubmissionPayload {
  documentType: KycDocumentType;
  documentUri: string;
  documentName?: string;
  confirmedOwnership: boolean;
  userDob: string; // YYYY-MM-DD
  fullName: string;
}

export interface KycVerificationResult {
  status: VerificationStatus;
  verified: boolean;
  calculatedAge: number;
  message: string;
  documentRef?: string;
  rejectionReason?: string;
  verifiedAt?: string;
}

/**
 * Calculates accurate age from YYYY-MM-DD.
 */
export function calculateAgeFromDob(dob: string): number {
  if (!dob) return 0;
  const parts = dob.split('-').map((p) => parseInt(p, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [birthYear, birthMonth, birthDay] = parts;

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  let age = currentYear - birthYear;
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDay < birthDay)
  ) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Submits document to the verification engine.
 * Enforces strict 18+ age checks and simulates the backend provider handshake.
 */
export async function verifyIdentityDocument(
  payload: KycSubmissionPayload
): Promise<KycVerificationResult> {
  // Simulate network latency for document OCR & fraud detection handshake
  await new Promise((resolve) => setTimeout(resolve, 1400));

  if (!payload.confirmedOwnership) {
    return {
      status: 'Rejected',
      verified: false,
      calculatedAge: 0,
      message: 'You must confirm that this document belongs to you.',
      rejectionReason: 'Consent and ownership confirmation missing.',
    };
  }

  if (!payload.documentUri) {
    return {
      status: 'Rejected',
      verified: false,
      calculatedAge: 0,
      message: 'Please provide a clear image of your government identity document.',
      rejectionReason: 'No document image provided.',
    };
  }

  const age = calculateAgeFromDob(payload.userDob);

  // STRICT 18+ ENFORCEMENT:
  // If the verified date of birth yields age < 18, immediately block registration.
  if (age < 18) {
    return {
      status: 'Underage – Access Denied',
      verified: false,
      calculatedAge: age,
      message: `Access Denied: VibeCircle is strictly restricted to adults aged 18 and older. Verified age: ${age} years.`,
      rejectionReason: 'User is under the mandatory 18-year age requirement.',
    };
  }

  // Check document quality simulation:
  // If document name indicates test rejection, simulate manual officer review or rejection.
  const lowerName = (payload.documentName || '').toLowerCase();
  if (lowerName.includes('blurry') || lowerName.includes('invalid')) {
    return {
      status: 'Rejected',
      verified: false,
      calculatedAge: age,
      message: 'The submitted document was unreadable or cropped. Please upload a high-clarity photo.',
      rejectionReason: 'Document image quality is too low for automated security check.',
    };
  }

  if (lowerName.includes('pending') || lowerName.includes('manual')) {
    return {
      status: 'Pending Verification',
      verified: false,
      calculatedAge: age,
      message: 'Your document is under security review by our verification team (typical response: 10–30 mins).',
      verifiedAt: new Date().toISOString(),
    };
  }

  // Successful verification
  return {
    status: 'Verified',
    verified: true,
    calculatedAge: age,
    message: 'Identity and 18+ age verified successfully.',
    documentRef: `KYC_${Date.now().toString(36).toUpperCase()}`,
    verifiedAt: new Date().toISOString(),
  };
}
