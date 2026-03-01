import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ActionModal } from './ActionModal';
import { Smartphone } from 'lucide-react-native';
import { Theme } from '../theme/colors';

const QUICK_AMOUNTS = [10000, 50000, 100000,];

export const DepositModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');
    const [phone, setPhone] = useState('');

    const handleDeposit = async () => {
        // 1. Basic Validation
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 5000) {
            alert("Please enter a valid amount (Min: 5000 UGX)");
            return;
        }
        if (phone.length < 10) {
            alert("Please enter a valid Mobile Money number (e.g., 0770123456)");
            return;
        }

        setLoading(true);

        try {
            // 2. Get the current user
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("User not found");

            // 3. Insert into our new 'transactions' table
            const { error } = await supabase
                .from('transactions')
                .insert([
                    {
                        profile_id: user.id,
                        amount: numAmount,
                        type: 'deposit',
                        provider: provider,
                        phone_number: phone,
                        category: 'Income',
                        description: `Mobile Money Deposit via ${provider.toUpperCase()}`,
                        status: 'completed'
                    }
                ]);

            if (error) throw error;

            // 4. Success!
            console.log("Deposit Successful!");
            setAmount('');
            setPhone('');
            onClose();    

        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ActionModal isVisible={isVisible} onClose={onClose}>
            <Text style={styles.title}>Deposit Funds</Text>
            <Text style={styles.subtitle}>Add money to your wallet via mobile money</Text>

            <Text style={styles.label}>Amount (UGX)</Text>
            <View style={styles.inputBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter amount"
                    placeholderTextColor="#4B5563"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            <View style={styles.chipRow}>
                {QUICK_AMOUNTS.map((val) => (
                    <TouchableOpacity
                        key={val}
                        style={styles.chip}
                        onPress={() => setAmount(val.toString())}
                    >
                        <Text style={styles.chipText}>USh {val.toLocaleString()}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Payment Method</Text>
            <View style={styles.providerRow}>
                <TouchableOpacity
                    style={[styles.pCard, provider === 'mtn' && styles.activePCard]}
                    onPress={() => setProvider('mtn')}
                >
                    <View style={[styles.dot, { backgroundColor: '#FACC15' }]} />
                    <Text style={styles.pText}>MTN Mobile Money</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.pCard, provider === 'airtel' && styles.activePCard]}
                    onPress={() => setProvider('airtel')}
                >
                    <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.pText}>Airtel Money</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputBox}>
                <Smartphone size={20} color="#4B5563" style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.input}
                    placeholder="0770 123 456"
                    placeholderTextColor="#4B5563"
                    keyboardType="phone-pad"
                    value={phone}                
                    onChangeText={setPhone}     
                    maxLength={10}
                />
            </View>

            <TouchableOpacity
                style={[styles.mainBtn, loading && { opacity: 0.7 }]}
                onPress={handleDeposit} // Connected the function
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" /> // Show spinner when loading
                ) : (
                    <Text style={styles.mainBtnText}>
                        Deposit {amount ? `UGX ${Number(amount).toLocaleString()}` : ''}
                    </Text>
                )}
            </TouchableOpacity>
        </ActionModal>
    );
};

const styles = StyleSheet.create({
    title: { color: 'white', fontSize: 20, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center' },
    subtitle: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginBottom: 15, marginTop: 8 },
    label: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 12 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
        borderWidth: 1, borderColor: '#F97316', borderRadius: 12, paddingHorizontal: 15, height: 48, marginBottom: 15
    },
    input: { flex: 1, color: 'white', fontSize: 16 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, gap:8},
    chip: { backgroundColor: 'rgba(249, 115, 22, 0.1)', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8 },
    chipText: { color: '#F97316', fontSize: 13, fontFamily: 'SpaceGrotesk-Bold' },
    providerRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    pCard: { flex: 1, height: 70, backgroundColor: '#09090B', borderRadius: 12, borderWidth: 1, borderColor: '#27272A', justifyContent: 'center', alignItems: 'center' },
    activePCard: { borderColor: '#F97316', backgroundColor: '#111111' },
    dot: { width: 20, height: 20, borderRadius: 10, marginBottom: 10 },
    pText: { color: 'white', fontSize: 13, textAlign: 'center', fontFamily: 'SpaceGrotesk-Bold' },
    mainBtn: { backgroundColor: '#F97316', height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
    mainBtnText: { color: 'white', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' },
});