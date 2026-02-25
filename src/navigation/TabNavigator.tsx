import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Wallet, PieChart, LayoutGrid, User } from 'lucide-react-native';
import { Theme } from '../theme/colors';


import HomeScreen from '../screens/HomeScreen';
import WalletScreen from '../screens/WalletScreen';
import BudgetScreen from '../screens/BudgetScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Hide the default top header
        tabBarStyle: {
          backgroundColor: Theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: Theme.colors.border,
          height: 90,
          paddingBottom: 30,
        },
        tabBarActiveTintColor: Theme.colors.primary,
        tabBarInactiveTintColor: Theme.colors.textSecondary,

        tabBarIcon: ({color, size}) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Wallet') return <Wallet color={color} size={size} />;
          if (route.name === 'Budget') return <PieChart color={color} size={size} />;
          if (route.name === 'Services') return <LayoutGrid color={color} size={size} />;
          if (route.name === 'Profile') return <User color={color} size={size} />;
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Budget" component={BudgetScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};