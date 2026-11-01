import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface LocationInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onLocationDetected?: (info: {
    city: string;
    coords: { latitude: number; longitude: number };
  }) => void;
  error?: string;
  label?: string;
}

export function LocationInput({
  value,
  onChangeText,
  onLocationDetected,
  error,
  label = 'City / Location',
}: LocationInputProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [loading, setLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  /**
   * Request device location permission and detect city.
   */
  const handleDetectLocation = async () => {
    setStatusNotice(null);
    setLoading(true);

    try {
      // 1. Explicitly request permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const deniedMsg =
          'Location permission was denied. You can easily type your city manually below.';
        setStatusNotice(deniedMsg);
        if (Platform.OS === 'web') {
          window.alert(deniedMsg);
        } else {
          Alert.alert('Location Permission', deniedMsg);
        }
        return;
      }

      // 2. Fetch current GPS position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 3. Reverse geocode to find city and region
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode && geocode.length > 0) {
        const place = geocode[0];
        const detectedCity =
          place.city ||
          place.subregion ||
          place.district ||
          place.region ||
          'Mumbai';

        const neighborhood = place.name || place.street;
        const displayLocation =
          neighborhood && neighborhood !== detectedCity
            ? `${detectedCity} (${neighborhood})`
            : detectedCity;

        onChangeText(displayLocation);

        if (onLocationDetected) {
          onLocationDetected({
            city: displayLocation,
            coords: { latitude, longitude },
          });
        }

        setStatusNotice(`📍 Detected: ${displayLocation}`);
      } else {
        setStatusNotice('Could not pinpoint city. Please enter manually.');
      }
    } catch (err: any) {
      const errMsg =
        err?.message ||
        'Unable to detect location. Please enter your city manually.';
      setStatusNotice(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>

        {/* Use Current Location Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDetectLocation}
          disabled={loading}
          style={[styles.detectBtn, { borderColor: colors.primary }]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Ionicons name="navigate-outline" size={13} color={colors.primary} />
              <Text style={[styles.detectBtnText, { color: colors.primary }]}>
                Use Current Location
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Manual Input Field */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? '#EF4444' : colors.inputBorder,
          },
        ]}>
        <Ionicons
          name="location-outline"
          size={18}
          color={colors.textSecondary}
          style={styles.icon}
        />
        <TextInput
          value={value}
          onChangeText={(txt) => {
            onChangeText(txt);
            if (statusNotice) setStatusNotice(null);
          }}
          placeholder="e.g. Mumbai, Bengaluru, Delhi NCR"
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { color: colors.text }]}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Friendly notice if granted or denied */}
      {statusNotice && (
        <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
          {statusNotice}
        </Text>
      )}

      {/* Validation error if any */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  detectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  detectBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  clearBtn: {
    padding: 4,
  },
  noticeText: {
    fontSize: 11.5,
    marginTop: 4,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 11.5,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
});
