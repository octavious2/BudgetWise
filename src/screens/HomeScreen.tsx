import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/GlassCard';
import { Theme } from '../theme/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.brandText}>BudgetWise</Text>

        <View style={styles.statusIndicator}>
          <Text style={styles.subText}>
            Track spending, set budgets and{"\n"}manage your finances
          </Text>
        </View>

        <GlassCard style={styles.mainCard}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardAmount}>$12,450.00</Text>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 24 },
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

  mainCard: {
    width: '90%',
    marginTop: 40,
  },
  cardTitle: {
    color: Theme.colors.textSecondary,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 16,
    marginBottom: 8,
  },
  cardAmount: {
    color: Theme.colors.text,
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    marginBottom: 12,
  },
  cardFooter: {
    color: Theme.colors.success,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
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