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

/**
 * Reverse geocode latitude and longitude into city and region.
 * Uses Nominatim OpenStreetMap (supports Web & Native with CORS).
 */
async function reverseGeocodeCoords(latitude: number, longitude: number): Promise<string> {
  // 1. If native platform, try native expo-location reverse geocoder first
  if (Platform.OS !== 'web') {
    try {
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (places && places.length > 0) {
        const p = places[0];
        const city = p.city || p.subregion || p.district || p.region;
        const state = p.region;
        if (city && state && city !== state) {
          return `${city}, ${state}`;
        }
        if (city) return city;
      }
    } catch {
      // Fall through to web reverse geocoder
    }
  }

  // 2. Web or fallback: OpenStreetMap Nominatim reverse geocode
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
        },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      const addr = data.address || {};
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        addr.state_district ||
        addr.county ||
        addr.state;
      const state = addr.state;

      if (city && state && city !== state) {
        return `${city}, ${state}`;
      }
      if (city) return city;
    }
  } catch {
    // Ignore and fallback below
  }

  return `Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
}

/**
 * IP-based location fallback (used if browser has no GPS hardware or times out).
 */
async function fetchIpLocation(): Promise<{ city: string; latitude: number; longitude: number } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.success && data.city) {
        const fullCity =
          data.region && data.region !== data.city
            ? `${data.city}, ${data.region}`
            : data.city;
        return {
          city: fullCity,
          latitude: data.latitude || 0,
          longitude: data.longitude || 0,
        };
      }
    }
  } catch {
    // Ignore
  }
  return null;
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
    setStatusNotice('Detecting location...');
    setLoading(true);

    try {
      // --- WEB PLATFORM IMPLEMENTATION ---
      if (Platform.OS === 'web') {
        if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
          const fallback = await fetchIpLocation();
          if (fallback) {
            onChangeText(fallback.city);
            onLocationDetected?.({
              city: fallback.city,
              coords: { latitude: fallback.latitude, longitude: fallback.longitude },
            });
            setStatusNotice(`📍 Detected: ${fallback.city}`);
          } else {
            setStatusNotice('Geolocation is not supported in this browser. Please type your city manually.');
          }
          return;
        }

        // Request browser geolocation (triggers browser prompt)
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const { latitude, longitude } = pos.coords;
                const detectedCity = await reverseGeocodeCoords(latitude, longitude);
                onChangeText(detectedCity);
                onLocationDetected?.({
                  city: detectedCity,
                  coords: { latitude, longitude },
                });
                setStatusNotice(`📍 Detected: ${detectedCity}`);
              } catch {
                setStatusNotice('Could not format city name. Please enter manually.');
              } finally {
                resolve();
              }
            },
            async (posError) => {
              // Code 1: PERMISSION_DENIED
              if (posError.code === 1) {
                const deniedMsg =
                  'Location permission was denied. To enable, click the 🔒 lock icon in your browser URL bar and set Location to "Allow", or type your city manually below.';
                setStatusNotice(deniedMsg);
                resolve();
                return;
              }

              // Code 2 (POSITION_UNAVAILABLE) or Code 3 (TIMEOUT)
              // Common on desktop PCs without GPS chips: use network IP location fallback
              try {
                const ipResult = await fetchIpLocation();
                if (ipResult) {
                  onChangeText(ipResult.city);
                  onLocationDetected?.({
                    city: ipResult.city,
                    coords: { latitude: ipResult.latitude, longitude: ipResult.longitude },
                  });
                  setStatusNotice(`📍 Detected: ${ipResult.city}`);
                  resolve();
                  return;
                }
              } catch {
                // Ignore
              }

              const msg =
                posError.code === 3
                  ? 'Location request timed out. Please enter your city manually.'
                  : 'Unable to pinpoint GPS location. Please enter your city manually.';
              setStatusNotice(msg);
              resolve();
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 60000,
            }
          );
        });

        return;
      }

      // --- NATIVE PLATFORM (iOS / Android) IMPLEMENTATION ---
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const deniedMsg =
          'Location permission was denied. You can easily type your city manually below.';
        setStatusNotice(deniedMsg);
        Alert.alert('Location Permission', deniedMsg);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;
      const detectedCity = await reverseGeocodeCoords(latitude, longitude);

      onChangeText(detectedCity);
      onLocationDetected?.({
        city: detectedCity,
        coords: { latitude, longitude },
      });
      setStatusNotice(`📍 Detected: ${detectedCity}`);
    } catch (err: any) {
      const errMsg =
        err?.message ||
        'Unable to detect location. Please enter your city manually.';
      setStatusNotice(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const isSuccessNotice = statusNotice?.startsWith('📍');

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

      {/* Friendly notice if granted, denied, or fallback */}
      {statusNotice && (
        <View
          style={[
            styles.noticeBox,
            {
              backgroundColor: isSuccessNotice ? '#10B98115' : '#FEF3C7',
              borderColor: isSuccessNotice ? '#10B98140' : '#F59E0B40',
            },
          ]}>
          <Ionicons
            name={isSuccessNotice ? 'checkmark-circle' : 'information-circle'}
            size={14}
            color={isSuccessNotice ? '#059669' : '#D97706'}
            style={{ marginRight: 6, marginTop: 1 }}
          />
          <Text
            style={[
              styles.noticeText,
              { color: isSuccessNotice ? '#059669' : '#92400E' },
            ]}>
            {statusNotice}
          </Text>
        </View>
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
    paddingVertical: 4,
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
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 11.5,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
});
