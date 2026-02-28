import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Send, Plus, CreditCard, Eye, EyeOff } from 'lucide-react-native';
import { HomeHeader } from '../components/HomeHeader';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { Theme } from '../theme/colors';

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current User ID:', user?.id);

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();

        console.log('Database Result:', data);

        if (data) setDisplayName(data.full_name);
      }
    } catch (error: any) {
      console.log('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <HomeHeader name={displayName} />

        <GlassCard style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Total Balance</Text>

            {/* 2. Toggle Button */}
            <TouchableOpacity
              onPress={() => setIsBalanceVisible(!isBalanceVisible)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              {isBalanceVisible ? (
                <Eye size={20} color={Theme.colors.textSecondary} />
              ) : (
                <EyeOff size={20} color={Theme.colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.cardAmount}>
            {isBalanceVisible ? 'UGX 12,450' : 'UGX ••••••'}
          </Text>
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
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  mainCard: {
    width: '100%',
    marginTop: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    minWidth: 200,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
});