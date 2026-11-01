import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Checkbox } from '@/components/common/Checkbox';
import {
  useAuth,
  KycDocumentType,
  VerificationStatus,
} from '@/context/AuthContext';

interface KycVerificationSectionProps {
  onSuccess?: () => void;
  onUnderageBlocked?: () => void;
}

const DOCUMENT_TYPES: { id: KycDocumentType; label: string; icon: string }[] = [
  { id: 'Aadhaar Card', label: 'Aadhaar Card', icon: 'card-outline' },
  { id: 'Passport', label: 'Passport', icon: 'airplane-outline' },
  { id: 'Driving License', label: 'Driving License', icon: 'car-outline' },
  { id: 'Voter ID', label: 'Voter ID', icon: 'finger-print-outline' },
  { id: 'Government ID', label: 'Other Gov ID', icon: 'shield-outline' },
];

export function KycVerificationSection({
  onSuccess,
  onUnderageBlocked,
}: KycVerificationSectionProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { user, submitKyc, resetKyc } = useAuth();

  const [documentType, setDocumentType] = useState<KycDocumentType>('Aadhaar Card');
  const [documentUri, setDocumentUri] = useState<string | null>(
    user?.kycDocument?.documentUri || null
  );
  const [documentName, setDocumentName] = useState<string>('id_document.jpg');
  const [confirmedOwnership, setConfirmedOwnership] = useState<boolean>(
    user?.kycDocument?.confirmedOwnership || false
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const status: VerificationStatus = user?.verificationStatus || 'Not Submitted';
  const isVerified = status === 'Verified';
  const isUnderage = status === 'Underage – Access Denied';
  const isPending = status === 'Pending Verification';
  const isRejected = status === 'Rejected';

  /**
   * Pick document from phone gallery or files
   */
  const handlePickDocument = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        const msg =
          'Media gallery permission is needed to select your government ID. Please grant permission in device settings.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Permission Required', msg);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentUri(asset.uri);
        setDocumentName(asset.fileName || 'government_id.jpg');
        setErrorMsg(null);
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Could not pick document from files.');
    }
  };

  /**
   * Capture photo of government ID using camera
   */
  const handleCaptureDocument = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        const msg =
          'Camera permission is required to capture your government ID. Please grant camera permission.';
        if (Platform.OS === 'web') window.alert(msg);
        else Alert.alert('Permission Required', msg);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setDocumentUri(asset.uri);
        setDocumentName('camera_captured_id.jpg');
        setErrorMsg(null);
      }
    } catch (e: any) {
      setErrorMsg(e?.message || 'Could not access device camera.');
    }
  };

  /**
   * Submit to KYC engine
   */
  const handleSubmit = async () => {
    if (!documentUri) {
      setErrorMsg('Please select or capture your government identity document.');
      return;
    }

    if (!confirmedOwnership) {
      setErrorMsg(
        'Please confirm that this document is genuine and belongs to you.'
      );
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await submitKyc({
        documentType,
        documentUri,
        documentName,
        confirmedOwnership,
      });

      if (res.status === 'Verified') {
        if (onSuccess) onSuccess();
      } else if (res.status === 'Underage – Access Denied') {
        if (onUnderageBlocked) onUnderageBlocked();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to submit document for verification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
      {/* Header Badge */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Identity Verification (Mandatory)
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            100% verified community • Strict 18+ legal age restriction
          </Text>
        </View>

        {isVerified && (
          <View style={[styles.statusBadge, { backgroundColor: '#10B98120', borderColor: '#10B981' }]}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>
              Verified 18+
            </Text>
          </View>
        )}
      </View>

      {/* Underage Access Denied State */}
      {isUnderage && (
        <View style={styles.underageAlertBox}>
          <Ionicons name="alert-circle" size={32} color="#EF4444" />
          <Text style={styles.underageAlertTitle}>Underage – Access Denied</Text>
          <Text style={styles.underageAlertDesc}>
            VibeCircle is strictly 18+. The submitted identification indicates an age below 18 years. Access to all features is permanently restricted.
          </Text>
        </View>
      )}

      {/* Pending State */}
      {isPending && (
        <View style={styles.pendingAlertBox}>
          <Ionicons name="time" size={28} color="#F59E0B" />
          <Text style={styles.pendingAlertTitle}>Verification Pending</Text>
          <Text style={styles.pendingAlertDesc}>
            Your government ID has been submitted and is currently being audited by our verification system. This usually takes under 15 minutes.
          </Text>
        </View>
      )}

      {/* Rejection State */}
      {isRejected && (
        <View style={styles.rejectedAlertBox}>
          <Ionicons name="close-circle" size={28} color="#EF4444" />
          <Text style={styles.rejectedAlertTitle}>Verification Failed</Text>
          <Text style={styles.rejectedAlertDesc}>
            {user?.kycDocument?.rejectionReason ||
              'The document image was blurry or could not be matched. Please upload a clear photo.'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setDocumentUri(null);
              resetKyc();
            }}
            style={styles.retryBtn}>
            <Ionicons name="refresh" size={15} color="#FFFFFF" />
            <Text style={styles.retryBtnText}>Re-upload Document</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active Submission Form (if not verified or underage) */}
      {!isVerified && !isUnderage && !isPending && (
        <View style={styles.formContent}>
          {/* Document Type Selector */}
          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            1. Select Document Type:
          </Text>
          <View style={styles.docTypeRow}>
            {DOCUMENT_TYPES.map((doc) => {
              const isSelected = documentType === doc.id;
              return (
                <TouchableOpacity
                  key={doc.id}
                  activeOpacity={0.7}
                  onPress={() => setDocumentType(doc.id)}
                  style={[
                    styles.docTypeBtn,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.background,
                      borderColor: isSelected ? colors.primary : colors.cardBorder,
                    },
                  ]}>
                  <Ionicons
                    name={doc.icon as any}
                    size={14}
                    color={isSelected ? '#FFFFFF' : colors.textSecondary}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[
                      styles.docTypeBtnText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.text,
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}>
                    {doc.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Document Upload Buttons */}
          <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 14 }]}>
            2. Upload or Capture Clear Document Photo:
          </Text>

          {!documentUri ? (
            <View style={styles.uploadButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickDocument}
                style={[styles.actionBtn, { borderColor: colors.primary, backgroundColor: '#3B82F610' }]}>
                <Ionicons name="folder-open-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>
                  Choose from Files / Gallery
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleCaptureDocument}
                style={[styles.actionBtn, { borderColor: '#10B981', backgroundColor: '#10B98110' }]}>
                <Ionicons name="camera-outline" size={20} color="#10B981" />
                <Text style={[styles.actionBtnText, { color: '#10B981' }]}>
                  Take Photo (Camera)
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.previewBox}>
              <View style={styles.previewImageContainer}>
                <Image
                  source={{ uri: documentUri }}
                  style={styles.previewImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.previewMeta}>
                <View style={styles.docTypeBadge}>
                  <Ionicons name="shield-checkmark" size={13} color="#10B981" />
                  <Text style={styles.docTypeBadgeText}>{documentType}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setDocumentUri(null)}
                  style={styles.changeDocBtn}>
                  <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  <Text style={styles.changeDocBtnText}>Remove / Re-take</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Privacy & Security Safe Note */}
          <View style={styles.safeNoticeBox}>
            <Ionicons name="lock-closed" size={14} color="#059669" />
            <Text style={styles.safeNoticeText}>
              Your ID document is securely encrypted and never stored publicly or shared with other members.
            </Text>
          </View>

          {/* Mandatory Ownership & Consent Checkbox */}
          <View style={styles.checkboxRow}>
            <Checkbox
              checked={confirmedOwnership}
              onToggle={() => setConfirmedOwnership((prev) => !prev)}
              label="I confirm this government document is genuine, valid, belongs to me, and I am at least 18 years of age."
            />
          </View>

          {/* Error Message */}
          {errorMsg && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={15} color="#EF4444" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={submitting}
            style={[
              styles.submitBtn,
              { backgroundColor: submitting ? '#6B7280' : colors.primary },
            ]}>
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-done-circle" size={18} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>
                  Submit for 18+ Verification
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Verified Banner */}
      {isVerified && (
        <View style={styles.verifiedBanner}>
          <Ionicons name="shield-checkmark" size={24} color="#10B981" />
          <View style={styles.verifiedTextWrap}>
            <Text style={styles.verifiedTitle}>100% ID Verified & Safe</Text>
            <Text style={styles.verifiedSubtitle}>
              Your account has full access to Home, Discover, Messages, Clubbing, Hangouts & Rishta services.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleWrap: {
    flex: 1,
    marginRight: 8,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  formContent: {
    marginTop: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  docTypeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  docTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
  },
  docTypeBtnText: {
    fontSize: 12,
  },
  uploadButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.2,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  previewBox: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    backgroundColor: '#00000008',
  },
  previewImageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  docTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  docTypeBadgeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  changeDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeDocBtnText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  safeNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05966910',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  safeNoticeText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 15,
  },
  checkboxRow: {
    marginTop: 12,
    marginBottom: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 24,
    marginTop: 14,
    gap: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  underageAlertBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 6,
  },
  underageAlertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
  },
  underageAlertDesc: {
    fontSize: 12.5,
    color: '#B91C1C',
    textAlign: 'center',
    lineHeight: 18,
  },
  pendingAlertBox: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 6,
  },
  pendingAlertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#92400E',
  },
  pendingAlertDesc: {
    fontSize: 12.5,
    color: '#B45309',
    textAlign: 'center',
    lineHeight: 18,
  },
  rejectedAlertBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    gap: 8,
  },
  rejectedAlertTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectedAlertDesc: {
    fontSize: 12.5,
    color: '#B91C1C',
    textAlign: 'center',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginTop: 4,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#10B981',
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  verifiedTextWrap: {
    flex: 1,
  },
  verifiedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 2,
  },
  verifiedSubtitle: {
    fontSize: 12,
    color: '#047857',
    lineHeight: 16,
  },
});
