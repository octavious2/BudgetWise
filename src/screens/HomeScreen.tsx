import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Plus, CreditCard } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { Theme } from '../theme/colors';


export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <GlassCard style={styles.mainCard}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardAmount}>$12,450.00</Text>
        </GlassCard>

        <View style={styles.actionRow}>
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Plus size={24} color="white" />} label="Top Up" />
          <ActionButton icon={<CreditCard size={24} color="white" />} label="Bills" />
        </View>
      </ScrollView>
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
  statusIndicator: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  // styles for the glassmorphism card 
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

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
});