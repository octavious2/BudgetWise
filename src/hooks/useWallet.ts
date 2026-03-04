import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useWallet = () => {
    const [loading, setLoading] = useState(true);
    const [balances, setBalances] = useState({
        total: 0,
        budgeted: 0,
        available: 0,
        savings: 0, // Placeholder for your Locked Savings logic
    });

    const refreshWallet = useCallback(async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const [transRes, budgetRes] = await Promise.all([
                supabase.from('transactions').select('amount, type').eq('profile_id', user.id).eq('status', 'completed'),
                supabase.from('budgets').select('allocated_amount, spent_amount').eq('profile_id', user.id)
            ]);

            // Calculate Total (Net Inflow)
            const totalIn = transRes.data?.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0) || 0;
            const totalOut = transRes.data?.filter(t => t.type === 'withdrawal').reduce((s, t) => s + Number(t.amount), 0) || 0;
            const total = totalIn - totalOut;

            // Calculate Budgeted (Money currently tied up in active budgets)
            const budgeted = budgetRes.data?.reduce((s, b) => {
                const left = Number(b.allocated_amount) - Number(b.spent_amount);
                return s + (left > 0 ? left : 0);
            }, 0) || 0;

            setBalances({
                total,
                budgeted,
                available: total - budgeted,
                savings: 0, // You can add logic here for your "Savings Vault" later
            });
        } catch (error) {
            console.error("Wallet Logic Error:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshWallet();
    }, [refreshWallet]);

    return { ...balances, loading, refreshWallet };
};