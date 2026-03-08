import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User, ShieldCheck, Bell, HelpCircle,
  ChevronRight, LogOut, Moon, CreditCard
} from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/GlassCard';

export default function ProfileScreen() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setEmail(user.email || '');
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
  };

  const SettingRow = ({ icon, label, value, color = "#94A3B8" }: any) => (
    <TouchableOpacity style={styles.row}>
      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
        {icon}
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {value && <Text style={styles.rowValue}>{value}</Text>}
      </View>
      <ChevronRight size={18} color="#3F3F46" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Settings</Text>

        {/* --- USER PROFILE CARD --- */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarLarge}>
            <User size={40} color={Theme.colors.primary} />
          </View>
          <Text style={styles.userName}>Student Member</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <TouchableOpacity style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* --- ACCOUNT SETTINGS --- */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        {/* <GlassCard style={styles.menuCard}> */}
          <SettingRow icon={<CreditCard size={20} color={Theme.colors.primary} />} label="Payment Methods" color={Theme.colors.primary} />
          <View style={styles.divider} />
          <SettingRow icon={<Bell size={20} color="#3b82f6" />} label="Notifications" color="#3b82f6" />
          <View style={styles.divider} />
          <SettingRow icon={<Moon size={20} color="#a855f7" />} label="Appearance" value="Dark" color="#a855f7" />
        {/* </GlassCard> */}

        {/* --- SECURITY & SUPPORT --- */}
        <Text style={styles.sectionLabel}>SECURITY & SUPPORT</Text>
        {/* <GlassCard style={styles.menuCard}> */}
          <SettingRow icon={<ShieldCheck size={20} color="#10B981" />} label="Privacy & Security" color="#10B981" />
          <View style={styles.divider} />
          <SettingRow icon={<HelpCircle size={20} color="#F59E0B" />} label="Help Center" color="#F59E0B" />
        {/* </GlassCard> */}

        {/* --- LOGOUT --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={20} color="#ef4444" style={{ marginRight: 12 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.4 (Beta)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', color: 'white', marginBottom: 25 },

  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 15 },
  userName: { color: 'white', fontSize: 20, fontFamily: 'SpaceGrotesk-Bold' },
  userEmail: { color: '#71717A', fontSize: 14, fontFamily: 'SpaceGrotesk-Medium', marginTop: 4 },
  editBadge: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#111111', borderWidth: 1, borderColor: '#27272A' },
  editBadgeText: { color: Theme.colors.primary, fontSize: 12, fontFamily: 'SpaceGrotesk-Bold' },

  sectionLabel: { color: '#52525B', fontSize: 11, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1, marginBottom: 12, marginTop: 10, marginLeft: 5 },
  menuCard: { padding: 0, marginBottom: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  rowContent: { flex: 1 },
  rowLabel: { color: 'white', fontSize: 15, fontFamily: 'SpaceGrotesk-Medium' },
  rowValue: { color: '#71717A', fontSize: 12, marginTop: 2 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: 70 },

  logoutButton: { flexDirection: 'row', backgroundColor: 'rgba(239, 68, 68, 0.1)', marginTop: 20, paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)' },
  logoutText: { color: '#ef4444', fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
  versionText: { textAlign: 'center', color: '#27272A', fontSize: 12, marginTop: 30, fontFamily: 'SpaceGrotesk-Medium' }
});