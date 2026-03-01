import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { supabase } from '../lib/supabase';
import { ActionModal } from './ActionModal';
import { Smartphone, PieChart, AlertCircle } from 'lucide-react-native';

interface WithdrawModalProps {
    isVisible: boolean;
    onClose: () => void;
    availableBalance: number; 
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

    const handleWithdraw = async () => {
        const numAmount = parseFloat(amount);

        // 1. Fundamental Checks
        if (isNaN(numAmount) || numAmount < 500) {
            Alert.alert("Invalid Amount", "Minimum withdrawal is 500 UGX");
            return;
        }
        if (!selectedCatId) {
            Alert.alert("Category Required", "Please select a category to track this expense.");
            return;
        }
        if (phone.length < 10) {
            Alert.alert("Invalid Phone", "Please enter a valid mobile money number.");
            return;
        }

        // 2. Liquidity Check (Wallet Level)
        if (numAmount > availableBalance) {
            Alert.alert(
                "Insufficient Available Funds",
                "You have the total balance, but most of it is allocated to other budgets. Unallocate funds first."
            );
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User session expired");

            // 3. SMART LOGIC: Check Budget Limit for this Category
            const { data: budget } = await supabase
                .from('budgets')
                .select('allocated_amount, spent_amount')
                .eq('profile_id', user.id)
                .eq('category_id', selectedCatId)
                .single();

            // If a budget exists, enforce the limit
            if (budget && (Number(budget.spent_amount) + numAmount > Number(budget.allocated_amount))) {
                // Record as BLOCKED for the user's history
                await supabase.from('transactions').insert([{
                    profile_id: user.id,
                    amount: numAmount,
                    type: 'withdrawal',
                    category_id: selectedCatId,
                    status: 'blocked',
                    description: 'Blocked: Budget Exceeded'
                }]);

                Alert.alert("🚫 Transaction Blocked", "This exceeds your set budget for this category. Stay disciplined!");
                setLoading(false);
                return;
            }

            // 4. Success Path: Record the Transaction
            const { error } = await supabase.from('transactions').insert([
                {
                    profile_id: user.id,
                    amount: numAmount,
                    type: 'withdrawal',
                    provider: provider,
                    phone_number: phone,
                    category_id: selectedCatId,
                    description: `Withdrawal for ${CATEGORIES.find(c => c.id === selectedCatId)?.name}`,
                    status: 'completed'
                }
            ]);

            if (error) throw error;

            // 5. Success!
            Alert.alert("Success", "Withdrawal processed and logged.");
            setAmount('');
            setPhone('');
            setSelectedCatId(null);
            refreshData();
            onClose();

        } catch (error: any) {
            Alert.alert("Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ActionModal isVisible={isVisible} onClose={onClose}>
            <Text style={styles.title}>Withdraw / Pay</Text>
            <Text style={styles.subtitle}>Safe to spend: UGX {availableBalance.toLocaleString()}</Text>

            {/* Amount Input */}
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

            {/* Category Selection */}
            <Text style={styles.label}>Category (Budget Tracking)</Text>
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

            {/* Recipient Phone */}
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

            {/* Provider Selection */}
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

            {/* Action Button */}
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
    subtitle: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: 4 },
    label: { color: 'white', fontSize: 15, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 5 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
        borderWidth: 1, borderColor: '#27272A', borderRadius: 12, paddingHorizontal: 10, height: 48, marginBottom: 10
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