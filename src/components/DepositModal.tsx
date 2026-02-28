import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ActionModal } from './ActionModal';
import { Smartphone } from 'lucide-react-native';
import { Theme } from '../theme/colors';

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export const DepositModal = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    const [amount, setAmount] = useState('');
    const [provider, setProvider] = useState<'mtn' | 'airtel'>('mtn');

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
                />
            </View>

            <TouchableOpacity style={styles.mainBtn}>
                <Text style={styles.mainBtnText}>Deposit</Text>
            </TouchableOpacity>
        </ActionModal>
    );
};

const styles = StyleSheet.create({
    title: { color: 'white', fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center' },
    subtitle: { color: '#94A3B8', fontSize: 14, textAlign: 'center', marginBottom: 30, marginTop: 8 },
    label: { color: 'white', fontSize: 16, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 12 },
    inputBox: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#000',
        borderWidth: 1, borderColor: '#F97316', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15
    },
    input: { flex: 1, color: 'white', fontSize: 16 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 25 },
    chip: { backgroundColor: '#18181B', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 12 },
    chipText: { color: '#94A3B8', fontSize: 13 },
    providerRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    pCard: { flex: 1, height: 90, backgroundColor: '#09090B', borderRadius: 12, borderWidth: 1, borderColor: '#27272A', justifyContent: 'center', alignItems: 'center' },
    activePCard: { borderColor: '#F97316', backgroundColor: '#111111' },
    dot: { width: 20, height: 20, borderRadius: 10, marginBottom: 10 },
    pText: { color: 'white', fontSize: 13, textAlign: 'center', fontFamily: 'SpaceGrotesk-Bold' },
    mainBtn: { backgroundColor: '#F97316', height: 55, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
    mainBtnText: { color: 'white', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' },
});