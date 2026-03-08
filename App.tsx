import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import { Theme } from './src/theme/colors';

// Navigation
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './src/navigation/TabNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen'; // Import your screen

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    // 1. Check if it's the first launch
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem('@onboarding_complete');
      setIsFirstLaunch(value === null); // If null, they haven't seen it
    };

    // 2. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 3. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    checkFirstLaunch();
    return () => subscription.unsubscribe();
  }, []);

  // Show spinner while fonts or launch state are loading
  if (!fontsLoaded || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {/* LOGIC: Onboarding > Auth > App */}
        {isFirstLaunch ? (
          <OnboardingScreen onFinish={() => setIsFirstLaunch(false)} />
        ) : session && session.user ? (
          <TabNavigator />
        ) : (
          <AuthScreen />
        )}
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}