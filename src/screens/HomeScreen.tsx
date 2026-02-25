import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Plus, CreditCard } from 'lucide-react-native';
import { GlassCard } from '../components/GlassCard';
import { Theme } from '../theme/colors';

const ActionButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <View style={styles.actionItem}>
    <View style={styles.iconCircle}>
      {icon}
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </View>
);
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <GlassCard style={styles.mainCard}>
          <Text style={styles.cardTitle}>Total Balance</Text>
          <Text style={styles.cardAmount}>$12,450.00</Text>
        </GlassCard>

        <View style={styles.actionRow}>
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Plus size={24} color="white" />} label="Top Up" />
          <ActionButton icon={<CreditCard size={24} color="white" />} label="Bills" />
        </View>
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

// styles for the action buttons 
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  actionItem: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionLabel: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Regular',
  },
});