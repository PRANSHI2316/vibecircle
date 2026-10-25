import React, { useEffect } from 'react';
import { Stack, DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

// Prevent splash screen from auto-hiding before initialization
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    // Hide splash screen smoothly on mount
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="index" options={{ title: 'Welcome' }} />
          <Stack.Screen name="login" options={{ title: 'Log In' }} />
          <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
          <Stack.Screen
            name="profile-creation"
            options={{ title: 'Complete Profile', gestureEnabled: false }}
          />
          <Stack.Screen
            name="category/[id]"
            options={{ title: 'Category Details' }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ title: 'App', gestureEnabled: false }}
          />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
