import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../../theme/colors';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Track Spending',
        desc: 'See where your money goes with glass-morphism clarity.',
        image: require('../../../assets/images/onboard1.png')
    },
    {
        id: '2',
        title: 'Smart Budgets',
        desc: 'Set goals and let our AI keep you on track.',
        image: require('../../../assets/images/onboard.png')
    },
    {
        id: '3',
        title: 'Secure Future',
        desc: 'Your data is encrypted and synced with Supabase.',
        image: require('../../../assets/images/icon.png')
    },
];

export default function OnboardingScreen({ onFinish }: any) {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = async () => {
        if (currentSlideIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentSlideIndex + 1 });
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else {
            await AsyncStorage.setItem('@onboarding_complete', 'true');
            if (onFinish) onFinish();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <Animated.Image
                            source={item.image}
                            entering={FadeInUp.duration(800).delay(200)}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                        <Animated.Text entering={FadeInDown.duration(600).delay(400)} style={styles.title}>
                            {item.title}
                        </Animated.Text>
                        <Animated.Text entering={FadeInDown.duration(600).delay(600)} style={styles.description}>
                            {item.desc}
                        </Animated.Text>
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
    illustration: { width: width * 0.7, height: width * 0.7, marginBottom: 40 },
    title: { color: 'white', fontSize: 28, fontFamily: 'SpaceGrotesk-Bold', textAlign: 'center' },
    description: { color: '#94A3B8', textAlign: 'center', marginTop: 20, fontSize: 16, fontFamily: 'SpaceGrotesk-Regular', lineHeight: 24 },
    footer: { paddingHorizontal: 40, height: 150, justifyContent: 'space-between', paddingBottom: 50 },
    indicatorContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
    indicator: { height: 4, width: 10, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)' },
    activeIndicator: { backgroundColor: Theme.colors.primary, width: 25 },
    button: { backgroundColor: Theme.colors.primary, padding: 18, borderRadius: 16, alignItems: 'center' },
    buttonText: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
});