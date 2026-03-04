import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Theme } from '../theme/colors';

interface HomeHeaderProps {
    name: string;
}

export const HomeHeader = ({ name }: HomeHeaderProps) => {
    return (
        <View style={styles.headerContainer}>
            <View>
                <Text style={styles.greeting}>Hello,</Text>
                <Text style={styles.name}>{name || 'User'}</Text>
            </View>

            <View style={styles.rightSection}>
                <TouchableOpacity style={styles.iconButton}>
                    <Bell size={22} color="white" />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingVertical: 10,
        marginBottom: 20,
    },
    greeting: {
        color: Theme.colors.textSecondary,
        fontSize: 14,
        fontFamily: 'SpaceGrotesk-Regular',
    },
    name: {
        color: Theme.colors.text,
        fontSize: 20,
        fontFamily: 'SpaceGrotesk-Bold',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 10,
        borderRadius: 12,
        marginRight: 15,
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        backgroundColor: Theme.colors.primary,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Theme.colors.background,
    },
});