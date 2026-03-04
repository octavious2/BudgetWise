import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Hash, Send, Download, Upload, ShieldCheck } from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>My Digital Wallet</Text>

        {/* QR CODE SECTION - The "Innovation" from your proposal */}
        <GlassCard style={styles.qrCard}>
          <QrCode size={180} color="white" strokeWidth={1.5} />
          <Text style={styles.qrHint}>Scan to receive or pay</Text>
          <View style={styles.codeBadge}>
            <Hash size={14} color={Theme.colors.primary} />
            <Text style={styles.walletCode}>STU-8829-UX</Text>
          </View>
        </GlassCard>

        {/* PRIMARY ACTIONS */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.mainAction}>
            <View style={[styles.iconCircle, { backgroundColor: Theme.colors.primary }]}>
              <Send color="white" size={24} />
            </View>
            <Text style={styles.actionLabel}>Send Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainAction}>
            <View style={[styles.iconCircle, { backgroundColor: '#22C55E' }]}>
              <Download color="white" size={24} />
            </View>
            <Text style={styles.actionLabel}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.mainAction}>
            <View style={[styles.iconCircle, { backgroundColor: '#EF4444' }]}>
              <Upload color="white" size={24} />
            </View>
            <Text style={styles.actionLabel}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* SECURITY INFO */}
        <View style={styles.securityNote}>
          <ShieldCheck size={20} color="#94A3B8" />
          <Text style={styles.securityText}>
            All transactions are encrypted and follow your budget enforcement rules.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: 20, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 24, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 25, alignSelf: 'flex-start' },
  qrCard: { padding: 30, alignItems: 'center', width: '100%', marginBottom: 30 },
  qrHint: { color: '#94A3B8', marginTop: 15, fontFamily: 'SpaceGrotesk-Medium' },
  codeBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1E', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 10 },
  walletCode: { color: 'white', marginLeft: 6, fontFamily: 'SpaceGrotesk-Bold', fontSize: 13 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  mainAction: { alignItems: 'center', flex: 1 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionLabel: { color: 'white', fontSize: 13, fontFamily: 'SpaceGrotesk-Medium' },
  securityNote: { flexDirection: 'row', alignItems: 'center', marginTop: 40, paddingHorizontal: 20 },
  securityText: { color: '#94A3B8', fontSize: 12, marginLeft: 10, lineHeight: 18 }
});