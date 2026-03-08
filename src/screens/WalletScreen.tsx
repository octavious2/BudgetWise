import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Wallet, LayoutGrid, Lock, Info, Send, Download, Upload } from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { formatUGX } from '../utils/currency';
import { useWallet } from '../hooks/useWallet'; // Importing your new logic hub
import { ActionButton } from '../components/ActionButton';

export default function WalletScreen() {
  const [showQR, setShowQR] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

  // 1. Hook into the centralized wallet logic
  const { total, available, budgeted, savings, loading, refreshWallet } = useWallet();

  // 2. Helper to calculate percentage for the legend
  const getPercentage = (value: number) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        // 3. Add pull-to-refresh to update all screens at once
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refreshWallet} tintColor={Theme.colors.primary} />
        }
      >

        {/* --- 1. IDENTITY SECTION --- */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>My Wallet</Text>
          <TouchableOpacity style={styles.infoCircle}>
            <Info size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        <View style={styles.idSection}>
          <View style={styles.idBadge}>
            <Text style={styles.idLabel}>WALLET ID:</Text>
            {/* Hardcoded ID for now, can be linked to profile.username later */}
            <Text style={styles.idValue}>UG-STU-8829</Text>
            <TouchableOpacity onPress={() => setShowQR(!showQR)} style={styles.idIcon}>
              <QrCode size={18} color={Theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {showQR && (
            <GlassCard style={styles.qrContainer}>
              <QrCode size={150} color="white" strokeWidth={1} />
              <Text style={styles.qrText}>Scan to receive funds</Text>
            </GlassCard>
          )}
        </View>

        <View style={styles.actionRow}>
          <ActionButton icon={<Download size={24} color="white" />} label="Deposit" onPress={() => setShowDeposit(true)} />
          <ActionButton icon={<Send size={24} color="white" />} label="Send" />
          <ActionButton icon={<Upload color="white" size={24} />} label="Withdraw" onPress={() => setShowWithdraw(true)} />
        </View>


        {/* --- 2. FUND DISTRIBUTION (Dynamic) --- */}
        <GlassCard style={styles.chartCard}>
          <Text style={styles.sectionTitle}>FUND DISTRIBUTION</Text>
          <View style={styles.chartRow}>
            <View style={styles.donutPlaceholder}>
              <View style={styles.donutInner}>
                <Text style={styles.donutTotalLabel}>Total</Text>
                <Text style={styles.donutTotalValue}>{formatUGX(total)}</Text>
              </View>
            </View>

            <View style={styles.legend}>
              <LegendItem color="#10B981" label="Available" value={available} percent={getPercentage(available)} />
              <LegendItem color="#F97316" label="Budgeted" value={budgeted} percent={getPercentage(budgeted)} />
              <LegendItem color="#F59E0B" label="Savings" value={savings} percent={getPercentage(savings)} />
            </View>
          </View>
        </GlassCard>

        {/* --- 3. MONEY POOLS (Dynamic) --- */}
        <Text style={[styles.sectionTitle, { marginTop: 25, marginLeft: 5 }]}>MONEY POOLS</Text>

        {/* Available Pool */}
        <View style={styles.secondaryPool}>
          <View style={[styles.iconBox, { backgroundColor: '#10B98122' }]}>
            <Wallet size={22} color="#10B981" />
          </View>
          <View style={styles.poolInfo}>
            <Text style={styles.poolLabel}>Available Balance</Text>
            <Text style={styles.poolAmount}>{formatUGX(available)}</Text>
            <Text style={styles.poolSubtext}>Unallocated funds to spend or budget</Text>
          </View>
          <TouchableOpacity style={styles.viewBudgetsBtn}>
            <Text style={styles.poolActionText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Budgeted Pool */}
        <View style={styles.secondaryPool}>
          <View style={[styles.iconBox, { backgroundColor: '#F9731622' }]}>
            <LayoutGrid size={22} color="#F97316" />
          </View>
          <View style={styles.poolInfo}>
            <Text style={styles.poolLabel}>Budgeted Funds</Text>
            <Text style={styles.poolAmount}>{formatUGX(budgeted)}</Text>
            <Text style={styles.poolSubtext}>Allocated across categories</Text>
          </View>
          <TouchableOpacity style={styles.viewBudgetsBtn}>
            <Text style={styles.viewBudgetsText}>View Budgets</Text>
          </TouchableOpacity>
        </View>

        {/* Savings Pool */}
        <View style={styles.secondaryPool}>
          <View style={[styles.iconBox, { backgroundColor: '#F59E0B22' }]}>
            <Lock size={22} color="#F59E0B" />
          </View>
          <View style={styles.poolInfo}>
            <Text style={styles.poolLabel}>Savings (Locked)</Text>
            <Text style={styles.poolAmount}>{formatUGX(savings)}</Text>
            <Text style={styles.poolSubtext}>Locked for your goals</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ... (LegendItem and Styles remain exactly as you had them)

// Helper Component for Legend
const LegendItem = ({ color, label, value, percent }: any) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={styles.legendValue}>{formatUGX(value)}</Text>
    </View>
    <Text style={styles.legendPercent}>{percent}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { color: 'white', fontSize: 22, fontFamily: 'SpaceGrotesk-Bold' },
  infoCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#111111', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },

  idSection: { marginBottom: 25 },
  idBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#27272A' },
  idLabel: { color: '#71717A', fontSize: 10, fontFamily: 'SpaceGrotesk-Bold' },
  idValue: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginLeft: 8, flex: 1 },
  idIcon: { marginLeft: 10 },
  qrContainer: { marginTop: 15, padding: 25, alignItems: 'center' },
  qrText: { color: '#94A3B8', fontSize: 12, marginTop: 12, fontFamily: 'SpaceGrotesk-Medium' },

  chartCard: { padding: 0, marginTop:20 },
  sectionTitle: { color: '#71717A', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1, marginBottom: 15 },
  chartRow: { flexDirection: 'row', alignItems: 'center' },
  donutPlaceholder: { width: 120, height: 120, borderRadius: 60, borderWidth: 10, borderColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
  donutInner: { alignItems: 'center' },
  donutTotalLabel: { color: '#94A3B8', fontSize: 10 },
  donutTotalValue: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' },

  legend: { flex: 1, marginLeft: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { color: '#94A3B8', fontSize: 11 },
  legendValue: { color: 'white', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' },
  legendPercent: { color: '#71717A', fontSize: 11 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 5,},
  poolCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#10B981' },
  secondaryPool: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#111111', borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#27272A' },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  poolInfo: { flex: 1, marginLeft: 15 },
  poolLabel: { color: '#94A3B8', fontSize: 12 },
  poolAmount: { color: 'white', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' },
  poolSubtext: { color: '#4B5563', fontSize: 10, marginTop: 2 },
  poolActionBtn: { backgroundColor: '#10B98122', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  poolActionText: { color: '#10B981', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' },
  viewBudgetsBtn: { backgroundColor: '#F9731622', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  viewBudgetsText: { color: '#F97316', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' }
});