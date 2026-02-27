import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
    { id: '1', title: 'Track Spending', desc: 'See where your money goes with glass-morphism clarity.' },
    { id: '2', title: 'Smart Budgets', desc: 'Set goals and let our AI keep you on track.' },
    { id: '3', title: 'Secure Future', desc: 'Your data is encrypted and synced with Supabase.' },
];

export default function OnboardingScreen({ navigation }: any) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentSlideIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.imagePlaceholder} />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.desc}</Text>
                    </View>
                )}
            />

            {/* Footer: Indicators and Button */}
            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.indicator, currentSlideIndex === index && styles.activeIndicator]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => currentSlideIndex === 2 ? console.log('Go to Auth') : null}
                >
                    <Text style={styles.buttonText}>
                        {currentSlideIndex === 2 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    slide: { width, alignItems: 'center', padding: 40, justifyContent: 'center' },
    imagePlaceholder: { width: 200, height: 200, backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: 100, marginBottom: 40 },
    title: { color: 'white', fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center' },
    description: { color: Theme.colors.textSecondary, textAlign: 'center', marginTop: 20, fontSize: 16, fontFamily: 'SpaceGrotesk-Regular' },
    footer: { paddingHorizontal: 40, height: 150, justifyContent: 'space-between', paddingBottom: 50 },
    indicatorContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
    indicator: { height: 4, width: 10, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
    activeIndicator: { backgroundColor: Theme.colors.primary, width: 25 },
    button: { backgroundColor: Theme.colors.primary, padding: 18, borderRadius: 16, alignItems: 'center' },
    buttonText: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
});