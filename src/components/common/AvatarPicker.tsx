import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AVATAR_PRESETS, AvatarPreset } from '@/constants/brand';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AvatarPickerProps {
  selectedId: string;
  onSelect: (presetId: string) => void;
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [modalVisible, setModalVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'photo' | 'persona'>('all');

  const currentPreset =
    AVATAR_PRESETS.find((p) => p.id === selectedId) ||
    (selectedId.startsWith('http')
      ? {
          id: selectedId,
          label: 'Custom Photo',
          emoji: '📸',
          bgColor: '#1E1B4B',
          accentColor: colors.primary,
          imageUrl: selectedId,
          type: 'photo' as const,
        }
      : AVATAR_PRESETS[0]);

  const isPhoto = Boolean(currentPreset?.imageUrl || selectedId.startsWith('http'));

  const handleSelect = (id: string) => {
    onSelect(id);
    setModalVisible(false);
  };

  const handleApplyCustomUrl = () => {
    if (customUrl.trim().startsWith('http')) {
      onSelect(customUrl.trim());
      setCustomUrl('');
      setModalVisible(false);
    }
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
              backgroundColor: currentPreset.bgColor,
              borderColor: colors.primary,
            },
          ]}>
          {isPhoto && currentPreset.imageUrl ? (
            <Image
              source={{ uri: currentPreset.imageUrl }}
              style={styles.avatarPhoto}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarEmoji}>{currentPreset.emoji}</Text>
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

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
        style={styles.changeBtn}>
        <Ionicons name="sparkles" size={13} color={colors.primary} />
        <Text style={[styles.changeBtnText, { color: colors.primary }]}>
          Change Profile Photo or Persona
        </Text>
      </TouchableOpacity>

      {/* Quick Presets Horizontal Strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}>
        {AVATAR_PRESETS.map((preset: AvatarPreset) => {
          const isSelected = preset.id === selectedId;
          return (
            <TouchableOpacity
              key={preset.id}
              activeOpacity={0.7}
              onPress={() => onSelect(preset.id)}
              style={[
                styles.presetItem,
                {
                  borderColor: isSelected ? colors.primary : colors.cardBorder,
                  backgroundColor: isSelected
                    ? colors.backgroundSelected
                    : colors.card,
                },
              ]}>
              <View
                style={[
                  styles.presetCircle,
                  { backgroundColor: preset.bgColor },
                ]}>
                {preset.imageUrl ? (
                  <Image
                    source={{ uri: preset.imageUrl }}
                    style={styles.presetPhoto}
                    resizeMode="cover"
                  />
                ) : (
                  <Text style={styles.presetEmoji}>{preset.emoji}</Text>
                )}
              </View>

              <Text
                numberOfLines={1}
                style={[
                  styles.presetLabel,
                  {
                    color: isSelected ? colors.primary : colors.textMuted,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}>
                {preset.label}
              </Text>

              {isSelected && (
                <View
                  style={[
                    styles.selectedIndicator,
                    { backgroundColor: colors.primary },
                  ]}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Full Photo Picker Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Choose Profile Photo
                </Text>
                <Text
                  style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Pick a verified portrait photo or persona avatar
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={[styles.closeBtn, { borderColor: colors.cardBorder }]}>
                <Ionicons name="close" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabRow}>
              {(['all', 'photo', 'persona'] as const).map((tab) => {
                const isActive = activeTab === tab;
                const tabLabel =
                  tab === 'all'
                    ? 'All Options'
                    : tab === 'photo'
                    ? '📸 Real Photos'
                    : '✨ Personas';
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabPill,
                      {
                        backgroundColor: isActive
                          ? colors.primary
                          : colors.backgroundElement,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.tabPillText,
                        { color: isActive ? '#FFFFFF' : colors.textSecondary },
                      ]}>
                      {tabLabel}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Grid of Avatars */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContent}>
              <View style={styles.gridContainer}>
                {filteredPresets.map((preset) => {
                  const isSelected = preset.id === selectedId;
                  return (
                    <TouchableOpacity
                      key={preset.id}
                      activeOpacity={0.7}
                      onPress={() => handleSelect(preset.id)}
                      style={[
                        styles.gridItem,
                        {
                          borderColor: isSelected
                            ? colors.primary
                            : colors.cardBorder,
                          backgroundColor: isSelected
                            ? colors.backgroundSelected
                            : colors.backgroundElement,
                        },
                      ]}>
                      <View
                        style={[
                          styles.gridCircle,
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
                        style={[
                          styles.gridLabel,
                          {
                            color: isSelected ? colors.primary : colors.text,
                            fontWeight: isSelected ? '700' : '600',
                          },
                        ]}>
                        {preset.label}
                      </Text>
                      {isSelected && (
                        <View
                          style={[
                            styles.gridCheck,
                            { backgroundColor: colors.primary },
                          ]}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Image URL Option */}
              <View
                style={[
                  styles.customUrlSection,
                  {
                    backgroundColor: colors.backgroundElement,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <View style={styles.customUrlHeader}>
                  <Ionicons name="link-outline" size={16} color={colors.primary} />
                  <Text
                    style={[styles.customUrlTitle, { color: colors.text }]}>
                    Or Use Custom Photo URL
                  </Text>
                </View>
                <View style={styles.customInputRow}>
                  <TextInput
                    placeholder="https://images.unsplash.com/..."
                    placeholderTextColor={colors.textMuted}
                    value={customUrl}
                    onChangeText={setCustomUrl}
                    autoCapitalize="none"
                    style={[
                      styles.urlTextInput,
                      {
                        color: colors.text,
                        borderColor: colors.inputBorder,
                        backgroundColor: colors.inputBg,
                      },
                    ]}
                  />
                  <TouchableOpacity
                    onPress={handleApplyCustomUrl}
                    disabled={!customUrl.trim().startsWith('http')}
                    style={[
                      styles.applyBtn,
                      {
                        backgroundColor: customUrl.trim().startsWith('http')
                          ? colors.primary
                          : colors.cardBorder,
                      },
                    ]}>
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
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
    marginVertical: 12,
    width: '100%',
  },
  previewContainer: {
    position: 'relative',
    marginBottom: 6,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  avatarPhoto: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarEmoji: {
    fontSize: 44,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollList: {
    paddingHorizontal: 8,
    gap: 10,
    paddingBottom: 4,
  },
  presetItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    marginRight: 8,
    width: 72,
    position: 'relative',
  },
  presetCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    overflow: 'hidden',
  },
  presetPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  presetEmoji: {
    fontSize: 22,
  },
  presetLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 36,
    maxHeight: '80%',
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
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gridContent: {
    paddingBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    position: 'relative',
  },
  gridCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  gridPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  gridEmoji: {
    fontSize: 20,
  },
  gridLabel: {
    fontSize: 12,
    flex: 1,
  },
  gridCheck: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customUrlSection: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  customUrlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  customUrlTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  customInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  urlTextInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 12,
  },
  applyBtn: {
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
