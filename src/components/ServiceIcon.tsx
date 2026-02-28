import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Theme } from '../theme/colors';

interface ServiceIconProps {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
}

export const ServiceIcon = ({ icon, label, onPress }: ServiceIconProps) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.iconWrapper}>
                {icon}
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '25%', // 4 items per row
        marginBottom: 20,
    },
    iconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.03)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 8,
    },
    label: {
        color: Theme.colors.textSecondary,
        fontSize: 12,
        fontFamily: 'SpaceGrotesk-Regular',
        textAlign: 'center',
    },
});