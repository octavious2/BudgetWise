import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, InteractionManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { Theme } from '../theme/colors';
import { Plus, PieChart } from 'lucide-react-native';
import { formatUGX } from '../utils/currency';
import { BudgetModal } from '../components/BudgetModal';

// 1. ADD THIS INTERFACE: Fixes the 'Budget[]' and 'item' errors
interface Budget {
  id: string;
  category_id: number;
  allocated_amount: number;
  spent_amount: number;
  profile_id: string;
}

const getCategoryName = (id: number) => {
  const names: Record<number, string> = { 1: 'Tuition', 2: 'Rent', 3: 'Food', 4: 'Transport', 5: 'Personal' };
  return names[id] || 'Other';
};

export default function BudgetScreen() {
  // Use the interface here
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      // 2. USER CHECK: Stops 'user is possibly null' errors
      if (!user) return;

      const [budgetRes, transRes] = await Promise.all([
        supabase.from('budgets').select('*').eq('profile_id', user.id),
        supabase.from('transactions').select('amount, type').eq('profile_id', user.id).eq('status', 'completed')
      ]);

      const budgetData = budgetRes.data as Budget[] || [];
      const trans = transRes.data || [];

      // Calculate your current cash on hand
      const totalIn = trans.filter(t => t.type === 'deposit').reduce((sum, t) => sum + Number(t.amount), 0);
      const totalOut = trans.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + Number(t.amount), 0);
      const currentTotalCash = totalIn - totalOut;

      // Calculate only what is LEFT to be spent in the budgets
      const totalRemainingBudget = budgetData.reduce((sum, b) => {
        const remaining = Number(b.allocated_amount) - Number(b.spent_amount);
        return sum + (remaining > 0 ? remaining : 0);
      }, 0);

      setBudgets(budgetData);
      setAvailableBalance(currentTotalCash - totalRemainingBudget);
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const renderBudgetItem = ({ item }: { item: Budget }) => {
    const allocated = Number(item.allocated_amount) || 1;
    const spent = Number(item.spent_amount) || 0;
    const progress = spent / allocated;

    return (
      <View style={styles.budgetCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.categoryName}>{getCategoryName(item.category_id)}</Text>
          <Text style={styles.amountText}>
            {formatUGX(spent)} / {formatUGX(allocated)}
          </Text>
        </View>

        <View style={styles.progressBg}>
          <View style={[
            styles.progressFill,
            {
              width: `${Math.min(progress * 100, 100)}%`,
              backgroundColor: progress >= 0.9 ? '#EF4444' : Theme.colors.primary
            }
          ]} />
        </View>
        <Text style={styles.remainingText}>
          {formatUGX(allocated - spent)} remaining
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Budgets</Text>
          <Text style={styles.subtitle}>Unallocated: {formatUGX(availableBalance)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenModal}>
          <Plus color="white" size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id} // 3. UUID is a string, no need for .toString()
        renderItem={renderBudgetItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor={Theme.colors.primary} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <PieChart size={64} color="#27272A" />
            <Text style={styles.emptyText}>No budgets set yet.</Text>
            <TouchableOpacity onPress={handleOpenModal}>
              <Text style={{ color: Theme.colors.primary, marginTop: 10 }}>Create your first budget</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <BudgetModal
        isVisible={showModal}
        onClose={() => setShowModal(false)}
        availableBalance={availableBalance}
        refreshData={fetchData}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginVertical: 20 },
  title: { color: 'white', fontSize: 24, fontFamily: 'SpaceGrotesk-Bold' },
  subtitle: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  addButton: { backgroundColor: Theme.colors.primary, padding: 12, borderRadius: 12 },
  budgetCard: { backgroundColor: '#18181B', padding: 20, borderRadius: 16, marginBottom: 15, borderWidth: 1, borderColor: '#27272A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  categoryName: { color: 'white', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
  amountText: { color: '#94A3B8', fontSize: 12, fontFamily: 'SpaceGrotesk-Medium' },
  progressBg: { height: 8, backgroundColor: '#27272A', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  remainingText: { color: '#4B5563', fontSize: 11, marginTop: 8, textAlign: 'right' },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#4B5563', marginTop: 15, fontFamily: 'SpaceGrotesk-Medium' }
});