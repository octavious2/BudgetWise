import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, SpaceGrotesk_400Regular, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { Session } from '@supabase/supabase-js';
import { supabase } from './src/lib/supabase';
import { Theme } from './src/theme/colors';
import { GlassCard } from './src/components/GlassCard';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './src/navigation/TabNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  // load the fonts hook
  const [fontsLoaded] = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // show a spinner if the fonts arent ready(loading state)
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background }}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
        /</View>
    );
  }

  return (
    <SafeAreaProvider>
      {session && session.user ? (
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      ) : (
        <AuthScreen />
      )}
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}