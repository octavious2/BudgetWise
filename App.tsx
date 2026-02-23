import React from 'react';
import { StatusBar } from 'expo-status-bar';
import{StyleSheet, Text, View, ActivityIndicator,} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_700Bold
} from '@expo-google-fonts/space-grotesk';
import { Theme } from './src/theme/colors';


export default function App() {

  // load the fonts hook
  let fontsLoaded = useFonts({
    'SpaceGrotesk-Regular': SpaceGrotesk_400Regular,
    'SpaceGrotesk-Bold': SpaceGrotesk_700Bold,
  });

  // show a spinner if the fonts arent ready(loading state)
if(!fontsLoaded){
  return (
    <View style={[styles.container, {justifyContent: 'center'}]}>
      <ActivityIndicator size="large" color={Theme.colors.primary} />
      /</View>
  );
}
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}> 
            <Text style={styles.brandText}>BudgetWise</Text>

            <View style={styles.statusIndicator}>
              <Text style={styles.subText}>
                Track spending, set budgets and{"\n"}manage your finances all from one app
              </Text>
            </View>
          </View>
        </SafeAreaView>
        <StatusBar style="light" />
      </SafeAreaProvider> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandText: {
    color: Theme.colors.primary, 
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
    fontFamily: 'SpaceGrotesk-Bold',
  },

  statusIndicator: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.1)', 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },

  subText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 25,
    marginHorizontal: 40,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});