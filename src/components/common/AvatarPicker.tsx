import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AVATAR_PRESETS, AvatarPreset } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AvatarPickerProps {
  selectedId: string;
  customPhotoUri?: string | null;
  onSelect: (presetId: string) => void;
  onPhotoSelected?: (photoUri: string | null) => void;
}

export function AvatarPicker({
  selectedId,
  customPhotoUri,
  onSelect,
  onPhotoSelected,
}: AvatarPickerProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'persona'>('all');
  const [uploading, setUploading] = useState(false);

  // If user selected a custom uploaded photo
  const hasCustomPhoto = Boolean(customPhotoUri);

  const currentPreset =
    AVATAR_PRESETS.find((p) => p.id === selectedId) || AVATAR_PRESETS[0];

  const displayUri = hasCustomPhoto
    ? customPhotoUri!
    : currentPreset.imageUrl || null;

  /**
   * Launch Gallery picker with permissions requested on demand.
   */
  const handleChooseFromGallery = async () => {
    try {
      setUploading(true);
      const permResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permResult.granted) {
        const msg =
          'Gallery access is required to upload your profile photo. Please grant media permissions in settings.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Permission Required', msg);
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedUri = result.assets[0].uri;
        if (onPhotoSelected) {
          onPhotoSelected(pickedUri);
        }
        onSelect('custom');
        setModalVisible(false);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Could not pick image from gallery.';
      if (Platform.OS === 'web') {
        window.alert(errMsg);
      } else {
        Alert.alert('Error', errMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  /**
   * Launch Camera with on-demand permission request.
   */
  const handleTakePhoto = async () => {
    try {
      setUploading(true);
      const permResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permResult.granted) {
        const msg =
          'Camera access is required to take a live profile photo. Please grant camera permission.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Permission Required', msg);
        }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        if (onPhotoSelected) {
          onPhotoSelected(photoUri);
        }
        onSelect('custom');
        setModalVisible(false);
      }
    } catch (err: any) {
      const errMsg = err?.message || 'Could not access camera.';
      if (Platform.OS === 'web') {
        window.alert(errMsg);
      } else {
        Alert.alert('Error', errMsg);
      }
    } finally {
      setUploading(false);
    }
  };

  /**
   * Remove custom photo and revert to curated preset.
   */
  const handleRemovePhoto = () => {
    if (onPhotoSelected) {
      onPhotoSelected(null);
    }
    onSelect('photo_1');
    setModalVisible(false);
  };

  const handleSelectPreset = (id: string) => {
    if (onPhotoSelected) {
      onPhotoSelected(null);
    }
    onSelect(id);
    setModalVisible(false);
  };

  const filteredPresets =
    activeTab === 'all'
      ? AVATAR_PRESETS
      : AVATAR_PRESETS.filter((p) => p.type === activeTab);

  return (
    <View style={styles.container}>
      {/* Main Avatar / Photo Preview Circle */}
      <View style={styles.previewContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalVisible(true)}
          style={[
            styles.avatarCircle,
            {
              backgroundColor: currentPreset.bgColor || '#1E1B4B',
              borderColor: colors.primary,
            },
          ]}>
          {displayUri ? (
            <Image
              source={{ uri: displayUri }}
              style={styles.avatarPhoto}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarEmoji}>{currentPreset.emoji}</Text>
          )}

          {uploading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#FFFFFF" size="small" />
            </View>
          )}
        </TouchableOpacity>

        {/* Camera Badge to open Photo Picker modal */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Change / Upload Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleChooseFromGallery}
          style={[styles.quickGalleryBtn, { borderColor: colors.primary }]}>
          <Ionicons name="images-outline" size={15} color={colors.primary} />
          <Text style={[styles.quickGalleryBtnText, { color: colors.primary }]}>
            Choose from Gallery
          </Text>
        </TouchableOpacity>

        {hasCustomPhoto && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRemovePhoto}
            style={styles.removeBtn}>
            <Ionicons name="trash-outline" size={14} color="#EF4444" />
            <Text style={styles.removeBtnText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={styles.changeBtn}>
        <Ionicons name="sparkles" size={13} color={colors.primary} />
        <Text style={[styles.changeBtnText, { color: colors.primary }]}>
          Browse All Avatars & Camera Options
        </Text>
      </TouchableOpacity>

      {/* Quick Presets Horizontal Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}>
        {AVATAR_PRESETS.map((preset: AvatarPreset) => {
          const isSelected = preset.id === selectedId && !hasCustomPhoto;
          return (
            <TouchableOpacity
              key={preset.id}
              activeOpacity={0.7}
              onPress={() => handleSelectPreset(preset.id)}
              style={[
                styles.miniChip,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                },
              ]}>
              <Text style={styles.miniChipEmoji}>{preset.emoji}</Text>
              <Text
                style={[
                  styles.miniChipLabel,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Full Modal for Gallery, Camera & Curated Personas */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Profile Photo & Avatars
                </Text>
                <Text
                  style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Upload your real photo or select a verified club persona
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Direct Media Upload Buttons */}
            <View style={styles.uploadOptionsBox}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleChooseFromGallery}
                style={[styles.uploadOptionBtn, { backgroundColor: '#3B82F618', borderColor: '#3B82F6' }]}>
                <Ionicons name="images" size={22} color="#3B82F6" />
                <View style={styles.uploadOptionTextWrap}>
                  <Text style={[styles.uploadOptionTitle, { color: colors.text }]}>
                    Choose from Gallery
                  </Text>
                  <Text style={[styles.uploadOptionDesc, { color: colors.textSecondary }]}>
                    Select your favorite high-res portrait from your device
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleTakePhoto}
                style={[styles.uploadOptionBtn, { backgroundColor: '#10B98118', borderColor: '#10B981' }]}>
                <Ionicons name="camera" size={22} color="#10B981" />
                <View style={styles.uploadOptionTextWrap}>
                  <Text style={[styles.uploadOptionTitle, { color: colors.text }]}>
                    Take Photo with Camera
                  </Text>
                  <Text style={[styles.uploadOptionDesc, { color: colors.textSecondary }]}>
                    Snap an instant verified selfie right now
                  </Text>
                </View>
              </TouchableOpacity>

              {hasCustomPhoto && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleRemovePhoto}
                  style={[styles.uploadOptionBtn, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]}>
                  <Ionicons name="trash" size={20} color="#EF4444" />
                  <View style={styles.uploadOptionTextWrap}>
                    <Text style={[styles.uploadOptionTitle, { color: '#EF4444' }]}>
                      Remove Uploaded Photo
                    </Text>
                    <Text style={[styles.uploadOptionDesc, { color: colors.textSecondary }]}>
                      Switch back to a private curated avatar
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Tabs for Curated Avatars */}
            <View style={styles.tabsRow}>
              {(['all', 'photo', 'persona'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const tabNames = {
                  all: 'All Presets',
                  photo: 'Real Portraits',
                  persona: 'Illustrated',
                };
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabBtn,
                      isActive && [
                        styles.tabBtnActive,
                        { borderBottomColor: colors.primary },
                      ],
                    ]}>
                    <Text
                      style={[
                        styles.tabBtnText,
                        {
                          color: isActive ? colors.primary : colors.textSecondary,
                          fontWeight: isActive ? '700' : '500',
                        },
                      ]}>
                      {tabNames[tab]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Presets Grid */}
            <ScrollView
              contentContainerStyle={styles.gridContainer}
              showsVerticalScrollIndicator={false}>
              {filteredPresets.map((preset: AvatarPreset) => {
                const isSelected = preset.id === selectedId && !hasCustomPhoto;
                return (
                  <TouchableOpacity
                    key={preset.id}
                    activeOpacity={0.8}
                    onPress={() => handleSelectPreset(preset.id)}
                    style={[
                      styles.gridItem,
                      {
                        backgroundColor: colors.card,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                        borderWidth: isSelected ? 2 : 1,
                      },
                    ]}>
                    <View
                      style={[
                        styles.gridAvatarCircle,
                        { backgroundColor: preset.bgColor },
                      ]}>
                      {preset.imageUrl ? (
                        <Image
                          source={{ uri: preset.imageUrl }}
                          style={styles.gridPhoto}
                          resizeMode="cover"
                        />
                      ) : (
                        <Text style={styles.gridEmoji}>{preset.emoji}</Text>
                      )}
                    </View>
                    <Text
                      style={[styles.gridLabel, { color: colors.text }]}
                      numberOfLines={1}>
                      {preset.label}
                    </Text>
                    {isSelected && (
                      <View
                        style={[
                          styles.checkBadge,
                          { backgroundColor: colors.primary },
                        ]}>
                        <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 14,
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarPhoto: {
    width: '100%',
    height: '100%',
  },
  avatarEmoji: {
    fontSize: 44,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  quickGalleryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.2,
    backgroundColor: 'transparent',
    gap: 6,
  },
  quickGalleryBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  removeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EF444460',
    backgroundColor: '#EF444410',
    gap: 4,
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginBottom: 10,
  },
  changeBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    marginLeft: 5,
  },
  scrollList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  miniChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 6,
  },
  miniChipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  miniChipLabel: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 18,
    maxHeight: '86%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12.5,
  },
  closeBtn: {
    padding: 6,
  },
  uploadOptionsBox: {
    gap: 9,
    marginBottom: 16,
  },
  uploadOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.2,
    gap: 12,
  },
  uploadOptionTextWrap: {
    flex: 1,
  },
  uploadOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  uploadOptionDesc: {
    fontSize: 11.5,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150,150,150,0.2)',
    marginBottom: 14,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
  },
  tabBtnText: {
    fontSize: 13,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  gridItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 12,
    position: 'relative',
  },
  gridAvatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 6,
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
  },
  gridEmoji: {
    fontSize: 26,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
