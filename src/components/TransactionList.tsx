import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { formatUGX } from '../utils/currency'; // Your existing currency helper

// Define what props this component needs
interface TransactionItemProps {
    type: 'deposit' | 'withdrawal';
    categoryName: string;
    amount: number;
    date: string;
}

export const TransactionItem = ({ type, categoryName, amount, date }: TransactionItemProps) => {
    const isDeposit = type === 'deposit';

    return (
        <View style={styles.container}>
            {/* Icon: Green for Deposit, Red for Withdrawal */}
            <View style={[styles.iconContainer, { backgroundColor: isDeposit ? '#10B98122' : '#EF444422' }]}>
                {isDeposit ? (
                    <ArrowDownLeft size={18} color="#10B981" />
                ) : (
                    <ArrowUpRight size={18} color="#EF4444" />
                )}
            </View>

            {/* Details: Category and Time */}
            <View style={styles.details}>
                <Text style={styles.category}>{categoryName}</Text>
                <Text style={styles.date}>{new Date(date).toLocaleDateString()}</Text>
            </View>

            {/* Amount: Signed with + or - */}
            <Text style={[styles.amount, { color: isDeposit ? '#10B981' : '#FFFFFF' }]}>
                {isDeposit ? '+' : '-'}{formatUGX(amount)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#27272A',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    details: { flex: 1 },
    category: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' },
    date: { color: '#71717A', fontSize: 11, marginTop: 2 },
    amount: { fontSize: 14, fontFamily: 'SpaceGrotesk-Bold' },
});