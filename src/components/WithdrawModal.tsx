import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { ActionModal } from './ActionModal';
import { Smartphone } from 'lucide-react-native';
import { formatUGX } from '../utils/currency';
import { Theme } from '../theme/colors';

interface WithdrawModalProps {
    isVisible: boolean;
    onClose: () => void;
    availableBalance: number; // This is the "Savings/Unallocated" money from HomeScreen
    refreshData: () => void;
}

const CATEGORIES = [
    { id: 1, name: 'Tuition', color: '#8B5CF6' },
    { id: 2, name: 'Rent', color: '#10B981' },
    { id: 3, name: 'Food', color: '#F59E0B' },
    { id: 4, name: 'Transport', color: '#3B82F6' },
    { id: 5, name: 'Personal', color: '#EC4899' },
];

export const WithdrawModal = ({ isVisible, onClose, availableBalance, refreshData }: WithdrawModalProps) => {
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
    const [userBudgets, setUserBudgets] = useState<any[]>([]);

    const currentCatBudget = userBudgets.find(b => b.category_id === selectedCatId);
    const budgetAllocated = Number(currentCatBudget?.allocated_amount) || 0;
    const budgetSpent = Number(currentCatBudget?.spent_amount) || 0;
    const budgetRemaining = Math.max(0, budgetAllocated - budgetSpent);

    // This defines what the user is ALLOWED to withdraw
    // If they have a budget, they can only spend what's left in it.
    // If they haven't budgeted for this category, they use their "Unallocated Savings".
    const displayLimit = (selectedCatId && budgetAllocated > 0)
        ? budgetRemaining
        : availableBalance;

    useEffect(() => {
        if (isVisible) fetchCategoryLimits();
    }, [isVisible]);

    const fetchCategoryLimits = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
            .from('budgets')
            .select('*')
            .eq('profile_id', user.id);
        setUserBudgets(data || []);
    };

    const handleWithdraw = async () => {
        const withdrawAmount = parseFloat(amount);

        if (!selectedCatId) return Alert.alert("Selection Required", "Please select a category.");
        if (isNaN(withdrawAmount) || withdrawAmount <= 0) return Alert.alert("Invalid Amount", "Enter a valid amount.");

        if (withdrawAmount > displayLimit) {
            return Alert.alert(
                "Limit Exceeded",
                `You only have ${formatUGX(displayLimit)} available for this selection. If you need more, please adjust your budget first.`
            );
        }

        setLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;
            if (!user) throw new Error("User session not found.");

            const { error: txError } = await supabase.from('transactions').insert({
                profile_id: user.id,
                amount: withdrawAmount,
                type: 'withdrawal',
                category_id: selectedCatId,
                status: 'completed'
            });
            if (txError) throw txError;

            // 4. Update the specific Budget's spent_amount
            if (currentCatBudget) {
                const { error: budgetUpdateError } = await supabase
                    .from('budgets')
                    .update({
                        spent_amount: budgetSpent + withdrawAmount,
                        updated_at: new Date()
                    })
                    .eq('profile_id', user.id)
                    .eq('category_id', selectedCatId);

                if (budgetUpdateError) throw budgetUpdateError;
            }

            Alert.alert("Success", `UGX ${withdrawAmount.toLocaleString()} withdrawn from ${CATEGORIES.find(c => c.id === selectedCatId)?.name}.`);

            // Cleanup
            setAmount('');
            setPhone('');
            setSelectedCatId(null);
            refreshData(); // Updates the Home Screen balances
            onClose();
        } catch (error: any) {
            console.error(error);
            Alert.alert("Withdrawal Failed", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ActionModal isVisible={isVisible} onClose={onClose}>
            <Text style={styles.title}>Withdraw / Pay</Text>
            <Text style={styles.subtitle}>
                {selectedCatId
                    ? `${CATEGORIES.find(c => c.id === selectedCatId)?.name} Limit: ${formatUGX(displayLimit)}`
                    : `Unallocated Savings: ${formatUGX(availableBalance)}`
                }
            </Text>

            <Text style={styles.label}>Amount (UGX)</Text>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. 5000"
                    placeholderTextColor="#4B5563"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <Text style={styles.label}>Category (Budget Source)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.catChip,
                            selectedCatId === cat.id && { borderColor: cat.color, backgroundColor: cat.color + '22' }
                        ]}
                        onPress={() => setSelectedCatId(cat.id)}
                    >
                        <Text style={[styles.catChipText, selectedCatId === cat.id && { color: cat.color }]}>
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <Text style={styles.label}>Recipient Number</Text>
            <View style={styles.inputBox}>
                <Smartphone size={18} color="#4B5563" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="07XX XXX XXX"
                    placeholderTextColor="#4B5563"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                />
            </View>

            <View style={styles.providerRow}>
                <TouchableOpacity
                    style={[styles.pCard, provider === 'mtn' && styles.activePCard]}
                    onPress={() => setProvider('mtn')}
                >
                    <View style={[styles.dot, { backgroundColor: '#FACC15' }]} />
                    <Text style={styles.pText}>MTN</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.pCard, provider === 'airtel' && styles.activePCard]}
                    onPress={() => setProvider('airtel')}
                >
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.pText}>Airtel</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.mainBtn, loading && { opacity: 0.7 }]}
                onPress={handleWithdraw}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.mainBtnText}>Confirm Withdrawal</Text>}
            </TouchableOpacity>
        </ActionModal>
    );
};

const styles = StyleSheet.create({
    title: { color: 'white', fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center' },
    subtitle: { color: '#F97316', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4, fontWeight: 'bold' },
    label: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 8 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
        borderWidth: 1, borderColor: '#27272A', borderRadius: 12, paddingHorizontal: 10, height: 48, marginBottom: 15
    },
    input: { flex: 1, color: 'white', fontSize: 15, fontFamily: 'SpaceGrotesk-Medium' },
    catRow: { flexDirection: 'row', marginBottom: 20 },
    catChip: {
        paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
        borderWidth: 1, borderColor: '#27272A', marginRight: 8, backgroundColor: '#09090B'
    },
    catChipText: { color: '#94A3B8', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' },
    providerRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    pCard: { flex: 1, height: 50, backgroundColor: '#09090B', borderRadius: 12, borderWidth: 1, borderColor: '#27272A', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    activePCard: { borderColor: '#F97316', backgroundColor: '#111111' },
    dot: { width: 8, height: 8, borderRadius: 4 },
    pText: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' },
    mainBtn: { backgroundColor: '#F97316', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    mainBtnText: { color: 'white', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
});