import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/colors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To remember they've seen it

const { width } = Dimensions.get('window');

const SLIDES = [
    { id: '1', title: 'Track Spending', desc: 'See where your money goes with glass-morphism clarity.' },
    { id: '2', title: 'Smart Budgets', desc: 'Set goals and let our AI keep you on track.' },
    { id: '3', title: 'Secure Future', desc: 'Your data is encrypted and synced with Supabase.' },
];

export default function OnboardingScreen({ onFinish }: any) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = async () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            // 2. This handles the sliding animation
            flatListRef.current?.scrollToIndex({
                index: currentSlideIndex + 1,
                animated: true
            });
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            // 3. This handles the final transition
            try {
                await AsyncStorage.setItem('@onboarding_complete', 'true');
                if (onFinish) {
                    onFinish(); // This tells App.tsx to switch to Auth/Home
                }
            } catch (e) {
                console.error("Failed to save onboarding state", e);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef} // Connect the ref
                data={SLIDES}
                horizontal
                pagingEnabled
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentSlideIndex(index);
                }}
                // ... rest of your FlatList props ...
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.imagePlaceholder} />
                        <Animated.Text entering={FadeInDown.duration(600).delay(400)} style={styles.title}>{item.title}</Animated.Text>
                        <Animated.Text entering={FadeInDown.duration(600).delay(600)} style={styles.description}>{item.desc}</Animated.Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.indicatorContainer}>
                    {SLIDES.map((_, index) => (
                        <View key={index} style={[styles.indicator, currentSlideIndex === index && styles.activeIndicator]} />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>
                        {currentSlideIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
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