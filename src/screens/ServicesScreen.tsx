import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  PhoneCall, Wifi, Zap, Droplets, Tv,
  Gamepad2, GraduationCap, Bus, Utensils
} from 'lucide-react-native';
import { Theme } from '../theme/colors';
import { GlassCard } from '../components/GlassCard';
import { useWallet } from '../hooks/useWallet';
import { formatUGX } from '../utils/currency';

const SERVICE_CATEGORIES = [
  {
    title: "Utilities",
    data: [
      { id: '1', name: 'Airtime', icon: <PhoneCall size={24} color={Theme.colors.primary} />, color: '#F9731622' },
      { id: '2', name: 'Data', icon: <Wifi size={24} color="#3b82f6" />, color: '#3b82f622' },
      { id: '3', name: 'Electricity', icon: <Zap size={24} color="#eab308" />, color: '#eab30822' },
      { id: '4', name: 'Water', icon: <Droplets size={24} color="#06b6d4" />, color: '#06b6d422' },
    ]
  },
  {
    title: "Student Life",
    data: [
      { id: '5', name: 'Tuition', icon: <GraduationCap size={24} color="#10B981" />, color: '#10B98122' },
      { id: '6', name: 'Transport', icon: <Bus size={24} color="#6366f1" />, color: '#6366f122' },
      { id: '7', name: 'Dining', icon: <Utensils size={24} color="#f43f5e" />, color: '#f43f5e22' },
      { id: '8', name: 'Gaming', icon: <Gamepad2 size={24} color="#a855f7" />, color: '#a855f722' },
    ]
  }
];

export default function ServicesScreen() {
  const { available } = useWallet();

  const renderServiceItem = ({ item }: any) => (
    <TouchableOpacity style={styles.serviceItem}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        {item.icon}
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Services</Text>
          <GlassCard style={styles.balanceMiniCard}>
            <Text style={styles.balanceLabel}>Available to Spend</Text>
            <Text style={styles.balanceValue}>{formatUGX(available)}</Text>
          </GlassCard>
        </View>

        {/* --- SERVICE CATEGORIES --- */}
        {SERVICE_CATEGORIES.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.grid}>
              {section.data.map((service) => (
                <View key={service.id} style={styles.gridItemWrapper}>
                  {renderServiceItem({ item: service })}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* --- PROMO BANNER --- */}
        <GlassCard style={styles.promoCard}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>Student Discounts</Text>
              <Text style={styles.promoSub}>
                Get 5% cashback on all data bundles this semester!
              </Text>
            </View>
        </GlassCard>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  content: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 30 },
  headerTitle: { color: 'white', fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 15 },
  balanceMiniCard: { padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceLabel: { color: '#94A3B8', fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' },
  balanceValue: { color: 'white', fontSize: 18, fontFamily: 'SpaceGrotesk-Bold' },

  section: { marginBottom: 30 },
  sectionTitle: { color: '#71717A', fontSize: 12, fontFamily: 'SpaceGrotesk-Bold', letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItemWrapper: { width: '48%', marginBottom: 15 },
  serviceItem: { backgroundColor: '#111111', borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#27272A' },
  iconContainer: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  serviceName: { color: 'white', fontSize: 14, fontFamily: 'SpaceGrotesk-Medium' },

  promoCard: {
    marginTop: 20,
    padding: 1,
    borderColor: Theme.colors.primary,
    borderWidth: 1.5,
    borderRadius: 24, 
    backgroundColor: 'rgba(249, 115, 22, 0.03)', 
    minHeight: 140, 
    justifyContent: 'center', 
    overflow: 'hidden',
  },
  promoTextContainer: {
    flex: 1,
    justifyContent: 'center', 
  },
  promoTitle: {
    color: Theme.colors.primary,
    fontSize: 22, 
    fontFamily: 'SpaceGrotesk-Bold',
    marginBottom: 8, 
  },
  promoSub: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    lineHeight: 20, 
    maxWidth: '80%', 
  }
});