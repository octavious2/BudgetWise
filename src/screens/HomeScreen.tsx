import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import {
  Send, Download, Upload, Eye, EyeOff, PhoneCall,
  Wifi, Zap, Droplets, Tv, LayoutGrid
} from 'lucide-react-native';
import { HomeHeader } from '../components/HomeHeader';
import { GlassCard } from '../components/GlassCard';
import { ActionButton } from '../components/ActionButton';
import { DepositModal } from '../components/DepositModal';
import { ServiceIcon } from '../components/ServiceIcon';
import { WithdrawModal } from '../components/WithdrawModal';
import { TransactionItem } from '../components/TransactionList';
import { CATEGORIES } from '../constants/categories';
import { formatUGX } from '../utils/currency';
import { Theme } from '../theme/colors';

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('User');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [isFetchingBalance, setIsFetchingBalance] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [balances, setBalances] = useState({
    total: 0,
    budgeted: 0,
    savings: 0, // This is our 'Available to Spend'
  });

  const fetchBalance = async () => {
    setIsFetchingBalance(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, transRes, budgetRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        // We fetch the full transaction row now, ordered by newest first
        supabase.from('transactions')
          .select('*')
          .eq('profile_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10), // Limit to 10 for the home screen feed
        supabase.from('budgets').select('allocated_amount, spent_amount, category_id').eq('profile_id', user.id)
      ]);

      if (profileRes.data) setDisplayName(profileRes.data.full_name);

      // 3. Store the raw transactions for the list
      setTransactions(transRes.data || []);

      const totalIn = transRes.data?.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0) || 0;
      const totalOut = transRes.data?.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0) || 0;
      const currentTotal = totalIn - totalOut;

      const remainingBudgeted = budgetRes.data?.reduce((s, b) => {
        const left = Number(b.allocated_amount) - Number(b.spent_amount);
        return s + (left > 0 ? left : 0);
      }, 0) || 0;

      setBalances({
        total: currentTotal,
        budgeted: remainingBudgeted,
        savings: currentTotal - remainingBudgeted
      });

    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsFetchingBalance(false);
    }
  };

  useEffect(() => { fetchBalance(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <HomeHeader name={displayName} />

        <GlassCard style={styles.mainCard}>
          <View style={styles.topSection}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Total Balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? <Eye size={20} color="#94A3B8" /> : <EyeOff size={20} color="#94A3B8" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.cardAmount}>
              {isBalanceVisible ? (isFetchingBalance ? '...' : formatUGX(balances.total)) : 'UGX ••••••'}
            </Text>
          </View>

          {/* DIVIDER */}
          <View style={styles.cardDivider} />

          {/* BOTTOM SECTION: Budgeted vs Savings */}
          <View style={styles.bottomSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budgeted</Text>
              <Text style={styles.statValue}>
                {isBalanceVisible ? formatUGX(balances.budgeted) : '••••'}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Savings</Text>
              <Text style={styles.statValue}>
                {isBalanceVisible ? formatUGX(balances.savings) : '••••'}
              </Text>
            </View>
          </View>
        </GlassCard>

        <View style={styles.actionRow}>
          <ActionButton icon={<Download size={24} color="white" />} label="Deposit" onPress={() => setShowDeposit(true)} />
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Upload color="white" />} label="Withdraw" onPress={() => setShowWithdraw(true)} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Services</Text>
          <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
        </View>

        <View style={styles.servicesGrid}>
          <ServiceIcon icon={<PhoneCall size={22} color={Theme.colors.primary} />} label="Airtime" />
          <ServiceIcon icon={<Wifi size={22} color="#3b82f6" />} label="Data" />
          <ServiceIcon icon={<Zap size={22} color="#eab308" />} label="Electricity" />
          <ServiceIcon icon={<Droplets size={22} color="#06b6d4" />} label="Water" />
          <ServiceIcon icon={<Tv size={22} color="#a855f7" />} label="TV" />
          <ServiceIcon icon={<LayoutGrid size={22} color="#94a3b8" />} label="More" />
        </View>

        {/* --- TRANSACTION HISTORY SECTION --- */}
        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>See All</Text></TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions yet.</Text>
            </View>
          ) : (
            transactions.map((item) => (
              <TransactionItem
                key={item.id}
                type={item.type}
                // Helper to find the name from your CATEGORIES constant
                categoryName={CATEGORIES.find(c => c.id === item.category_id)?.name || 'Deposit'}
                amount={item.amount}
                date={item.created_at}
              />
            ))
          )}
        </View>
      </ScrollView>

      <DepositModal isVisible={showDeposit} onClose={() => { setShowDeposit(false); fetchBalance(); }} />
      <WithdrawModal
        isVisible={showWithdraw}
        onClose={() => { setShowWithdraw(false); fetchBalance(); }}
        availableBalance={balances.savings}
        refreshData={fetchBalance}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  mainCard: { width: '100%', marginTop: 20, padding: 2 },
  topSection: { marginBottom: 15 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#94A3B8', fontFamily: 'SpaceGrotesk-Medium', fontSize: 14 },
  cardAmount: { color: 'white', fontSize: 32, fontFamily: 'SpaceGrotesk-Bold', marginTop: 8 },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'SpaceGrotesk-Medium', marginBottom: 4 },
  statValue: { color: 'white', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' },
  verticalDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)'},
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 35, marginBottom: 20 },
  sectionTitle: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  seeAllText: { color: Theme.colors.primary, fontSize: 14 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  historySection: { marginTop: 10 },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  emptyText: { color: '#94A3B8', fontFamily: 'SpaceGrotesk-Medium' },
});