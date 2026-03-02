import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';
import { ActionModal } from './ActionModal';
import { Theme } from '../theme/colors';
import { Wallet } from 'lucide-react-native';

interface BudgetModalProps {
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

export const BudgetModal = ({ isVisible, onClose, availableBalance, refreshData }: BudgetModalProps) => {
    const [amount, setAmount] = useState('');
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSetBudget = async () => {
        const numAmount = parseFloat(amount);

        if (!selectedCatId) return Alert.alert("Select Category", "Which budget are you adding to?");
        if (isNaN(numAmount) || numAmount <= 0) return Alert.alert("Invalid Amount", "Enter a valid budget amount.");
        if (numAmount > availableBalance) return Alert.alert("Limit Reached", "You don't have enough unallocated funds for this budget.");

        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user found");

            // UPSERT: If budget for category exists, update it. If not, create it.
            const { error } = await supabase
                .from('budgets')
                .upsert({
                    profile_id: user.id,
                    category_id: selectedCatId,
                    allocated_amount: numAmount, 
                    updated_at: new Date()
                }, { onConflict: 'profile_id,category_id' });

            if (error) throw error;

            Alert.alert("Success", "Budget allocated successfully!");
            setAmount('');
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
            <View style={styles.header}>
                <Wallet color={Theme.colors.primary} size={28} />
                <Text style={styles.title}>Allocate Budget</Text>
            </View>

            <Text style={styles.subtitle}>Move money from 'Available' to a specific category.</Text>

            <Text style={styles.label}>Amount to Allocate</Text>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="UGX 50,000"
                    placeholderTextColor="#4B5563"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <Text style={styles.label}>Target Category</Text>
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

            <TouchableOpacity
                style={styles.mainBtn}
                onPress={handleSetBudget}
                disabled={loading}
            >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.mainBtnText}>Confirm Allocation</Text>}
            </TouchableOpacity>
        </ActionModal>
    );
};

const styles = StyleSheet.create({
    header: { alignItems: 'center', marginBottom: 10 },
    title: { color: 'white', fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', marginTop: 10 },
    subtitle: { color: '#94A3B8', fontSize: 13, textAlign: 'center', marginBottom: 25 },
    label: { color: 'white', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 10 },
    inputBox: {
        backgroundColor: '#000', borderWidth: 1, borderColor: '#27272A',
        borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 20, justifyContent: 'center'
    },
    input: { color: 'white', fontSize: 16, fontFamily: 'SpaceGrotesk-Medium' },
    catRow: { flexDirection: 'row', marginBottom: 30 },
    catChip: {
        paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25,
        borderWidth: 1, borderColor: '#27272A', marginRight: 10, backgroundColor: '#09090B'
    },
    catChipText: { color: '#94A3B8', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' },
    mainBtn: { backgroundColor: Theme.colors.primary, height: 55, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    mainBtnText: { color: 'white', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold' },
});