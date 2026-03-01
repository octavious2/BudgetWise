import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import {
  Send, Download, Upload, CreditCard, Eye, EyeOff, PhoneCall, 
  Wifi, Zap, Droplets, ChevronRight, Tv, LayoutGrid
} from 'lucide-react-native';
import { HomeHeader } from '../components/HomeHeader';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { DepositModal } from '../components/DepositModal';
import {ServiceIcon} from '../components/ServiceIcon';
import { formatUGX } from '../utils/currency';
import { Theme } from '../theme/colors';

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('User');
  const [loading, setLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [balances, setBalances] = useState({
    total: 0,
    budgeted: 0,
    available: 0, // Total - Budgeted
    locked: 0
  });
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);

  useEffect(() => {
    getProfile();
    fetchBalance();
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
  async function fetchBalance() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    //Total Transactions
    const { data: transData } = await supabase
      .from('transactions')
      .select('amount, type, status')
      .eq('profile_id', user.id)
      .eq('status', 'completed');

    // Active Budgets 
    const { data: budgetData } = await supabase
      .from('budgets')
      .select('allocated_amount')
      .eq('profile_id', user.id);

    // "Management" View
    const totalIn = transData?.filter(t => t.type === 'deposit').reduce((s, t) => s + t.amount, 0) || 0;
    const totalOut = transData?.filter(t => t.type === 'withdrawal').reduce((s, t) => s + t.amount, 0) || 0;
    const totalBudgeted = budgetData?.reduce((s, b) => s + b.allocated_amount, 0) || 0;

    const actualTotal = totalIn - totalOut;

    setBalances({
      total: actualTotal,
      budgeted: totalBudgeted,
      available: actualTotal - totalBudgeted, 
      locked: 0 
    });
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
          <View style={styles.balanceContainer}>
            {/* The "Safe-to-Spend" Hero Amount */}
            <Text style={styles.balanceLabel}>Available to Spend</Text>
            <Text style={styles.cardAmount}>
              {isBalanceVisible
                ? (isFetchingBalance ? '...' : formatUGX(balances.available))
                : 'UGX ••••••'
              }
            </Text>

            {/* The "Allocated" and "Locked" Breakdown */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Budgeted</Text>
                <Text style={styles.statValue}>
                  {isBalanceVisible ? formatUGX(balances.budgeted) : '••••'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Balance</Text>
                <Text style={styles.statValue}>
                  {isBalanceVisible ? formatUGX(balances.total) : '••••'}
                </Text>
              </View>
            </View>
          </View>
        </GlassCard>

        <View style={styles.actionRow}>
          <ActionButton
            icon={<Download size={24} color="white" />}
            label="Deposit"
            onPress={() => {
              setShowDeposit(true);
            }}
          />
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Upload size={24} color="white" />} label="Withdraw" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          <ServiceIcon icon={<PhoneCall size={22} color={Theme.colors.primary} />} label="Airtime" />
          <ServiceIcon icon={<Wifi size={22} color="#3b82f6" />} label="Data" />
          <ServiceIcon icon={<Zap size={22} color="#eab308" />} label="Electricity" />
          <ServiceIcon icon={<Droplets size={22} color="#06b6d4" />} label="Water" />
          <ServiceIcon icon={<Tv size={22} color="#a855f7" />} label="TV" />
          <ServiceIcon icon={<LayoutGrid size={22} color="#94a3b8" />} label="More" />
        </View>
      </ScrollView>
      <DepositModal
        isVisible={showDeposit}
        onClose={() => {
          setShowDeposit(false);
          fetchBalance();
        }}
      />
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
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardAmount: {
    color: Theme.colors.text,
    fontSize: 32, 
    fontFamily: 'SpaceGrotesk-Bold',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 4,
  },
  statValue: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Bold',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 35,
    marginBottom: 20,
  },
  sectionTitle: {
    color: Theme.colors.text,
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 18,
  },
  seeAllText: {
    color: Theme.colors.primary,
    fontFamily: 'SpaceGrotesk-Regular',
    fontSize: 14,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'flex-start',
  },
});