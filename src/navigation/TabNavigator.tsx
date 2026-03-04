import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, InteractionManager } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Home, Wallet, PieChart, LayoutGrid, Settings } from 'lucide-react-native';
import { Theme } from '../theme/colors';


import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Theme.colors.background }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#09090B',
            borderTopWidth: 1,
            borderTopColor: '#27272A',
            height: 80,
            paddingBottom: 20,
          },
          tabBarActiveTintColor: Theme.colors.primary,
          tabBarInactiveTintColor: '#94A3B8',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen}
          options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }}
        />

        <Tab.Screen name="Budget" component={BudgetScreen}
          options={{ tabBarIcon: ({ color }) => <PieChart color={color} size={24} /> }}
        />

        {/* 1. THE GAP: This screen does nothing, it just holds the space */}
        <Tab.Screen
          name="ActionHub"
          component={HomeScreen} // Placeholder
          options={{
            tabBarLabel: () => null,
            tabBarIcon: () => null, // Hide the default icon
          }}
        />

        <Tab.Screen name="Services" component={ServicesScreen}
          options={{ tabBarIcon: ({ color }) => <LayoutGrid color={color} size={24} /> }}
        />

        <Tab.Screen name="Settings" component={ProfileScreen}
          options={{ tabBarIcon: ({ color }) => <Settings color={color} size={24} /> }}
        />
      </Tab.Navigator>

      {/* 2. THE PROTRUDING INNOVATION: Floating above the bar */}
      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => { /* This will open your Wallet/Payment options */ }}
      >
        <View style={styles.innerFab}>
          <Wallet color="white" size={32} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fabButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 35, // Adjust this to make it protrude perfectly
    zIndex: 10,
  },
  innerFab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#09090B', // Blends with background to look like a cutout
    shadowColor: Theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  }
});