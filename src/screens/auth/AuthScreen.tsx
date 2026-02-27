import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Theme } from '../../theme/colors';
import { supabase } from '../../lib/supabase';

export default function AuthScreen() {
    const [fullName, setfullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);


    async function handleAuth() {
        if (isSignUp) {
            if (!fullName || !phone || !email || !password || !confirmPassword) {
                Alert.alert('Error', 'Please fill in all fields');
                return;
            }
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Passwords do not match');
                return;
            }
        } else {
            if (!email || !password) {
                Alert.alert('Error', 'Please enter email and password');
                return;
            }
        }

        setLoading(true);

        if (isSignUp) {
            // SIGN UP with Metadata
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        phone_number: phone,
                    },
                },
            });

            if (error) Alert.alert('Error', error.message);
            else Alert.alert('Success', 'Check your email for verification!');
        } else {
            // LOGIN
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) Alert.alert('Error', error.message);
        }

        setLoading(false);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.authBox}>
                <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>
                {isSignUp && (
                    <>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor="#71717A"
                            value={fullName}
                            onChangeText={setfullName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#71717A"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#71717A"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#71717A"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {isSignUp && (
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#71717A"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                )}

                <TouchableOpacity
                    style={styles.button}
                    disabled={loading}
                    onPress={() => console.log('Auth triggered')}
                >
                    <Text style={styles.buttonText}>
                        {isSignUp ? 'Sign Up' : 'Login'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                    <Text style={styles.toggleText}>
                        {isSignUp ? 'Already have an account? Login' : 'New here? Create an account'}
                    </Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center' },
    authBox: { padding: 30, width: '100%' },
    title: { color: 'white', fontSize: 32, fontFamily: 'SpaceGrotesk-Bold', marginBottom: 40 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 18,
        borderRadius: 12,
        color: 'white',
        marginBottom: 16,
        fontFamily: 'SpaceGrotesk-Regular',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
    },
    button: {
        backgroundColor: Theme.colors.primary,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 16 },
    toggleText: { color: Theme.colors.textSecondary, textAlign: 'center', marginTop: 20, fontFamily: 'SpaceGrotesk-Regular' }
});