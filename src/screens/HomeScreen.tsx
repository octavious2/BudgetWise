import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import {
  Send, Download, Upload, Eye, EyeOff, PhoneCall,
  Wifi, Zap, Droplets, Tv, LayoutGrid
} from 'lucide-react-native';

// Components & Theme
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

// Logic Hook
import { useWallet } from '../hooks/useWallet';

export default function HomeScreen() {
  const [displayName, setDisplayName] = useState('User');
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Centralized Balance Logic
  const { total, budgeted, available, loading, refreshWallet } = useWallet();

  // 2. Fetch Home-specific data (Profile & Recent Activity)
  const fetchHomeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, transRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('transactions')
          .select('*')
          .eq('profile_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (profileRes.data) setDisplayName(profileRes.data.full_name);
      setTransactions(transRes.data || []);
    } catch (error) {
      console.error('Home Data Fetch Error:', error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  // 3. Sync Refresh Logic
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshWallet(), fetchHomeData()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Theme.colors.primary} />
        }
      >
        <HomeHeader name={displayName} />

        {/* --- MAIN BALANCE CARD --- */}
        <GlassCard style={styles.mainCard}>
          <View style={styles.topSection}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Total Balance</Text>
              <TouchableOpacity onPress={() => setIsBalanceVisible(!isBalanceVisible)}>
                {isBalanceVisible ? <Eye size={20} color="#94A3B8" /> : <EyeOff size={20} color="#94A3B8" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.cardAmount}>
              {isBalanceVisible ? (loading ? '...' : formatUGX(total)) : 'UGX ••••••'}
            </Text>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.bottomSection}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Budgeted</Text>
              <Text style={styles.statValue}>
                {isBalanceVisible ? formatUGX(budgeted) : '••••'}
              </Text>
            </View>

            <View style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Savings (Available)</Text>
              <Text style={styles.statValue}>
                {isBalanceVisible ? formatUGX(available) : '••••'}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* --- QUICK ACTIONS --- */}
        <View style={styles.actionRow}>
          <ActionButton icon={<Download size={24} color="white" />} label="Deposit" onPress={() => setShowDeposit(true)} />
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Upload color="white" size={24} />} label="Withdraw" onPress={() => setShowWithdraw(true)} />
        </View>

        {/* --- SERVICES GRID --- */}
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

        {/* --- RECENT ACTIVITY --- */}
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
                categoryName={CATEGORIES.find(c => c.id === item.category_id)?.name || 'Deposit'}
                amount={item.amount}
                date={item.created_at}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* --- MODALS --- */}
      <DepositModal
        isVisible={showDeposit}
        onClose={() => { setShowDeposit(false); handleRefresh(); }}
      />
      <WithdrawModal
        isVisible={showWithdraw}
        onClose={() => { setShowWithdraw(false); handleRefresh(); }}
        availableBalance={available}
        refreshData={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  mainCard: { width: '100%', marginTop: 20, padding: 2 },
  topSection: { marginBottom: 5 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { color: '#94A3B8', fontFamily: 'SpaceGrotesk-Medium', fontSize: 14 },
  cardAmount: { color: 'white', fontSize: 32, fontFamily: 'SpaceGrotesk-Bold', marginTop: 8 },
  cardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  bottomSection: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { flex: 1 },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'SpaceGrotesk-Medium', marginBottom: 4 },
  statValue: { color: 'white', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold' },
  verticalDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginTop: 35, marginBottom: 20 },
  sectionTitle: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 18 },
  seeAllText: { color: Theme.colors.primary, fontSize: 14 },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%' },
  historySection: { marginTop: 10 },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#09090B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#27272A'
  },
  emptyText: { color: '#94A3B8', fontFamily: 'SpaceGrotesk-Medium' },
});