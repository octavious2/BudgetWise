import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '../theme/colors';

// Define what data the button needs to work
interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void; 
}

export const ActionButton = ({ icon, label, onPress }: ActionButtonProps) => {
    return (
        <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
                if (onPress) onPress();
            }}
            activeOpacity={0.7}
        >
            <View style={styles.iconCircle}>
                {icon}
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    actionItem: {
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.05)', // The "Glass" effect
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    actionLabel: {
        color: Theme.colors.textSecondary,
        fontSize: 13,
        fontFamily: 'SpaceGrotesk-Regular',
    },
});