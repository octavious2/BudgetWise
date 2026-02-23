import React, {ReactNode} from 'react';
import { StyleSheet, View, ViewStyle, } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '../theme/colors';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
}

export const GlassCard = ({ children, style }: GlassCardProps) => {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={20} tint="dark" style={styles.blurWrapper}>
        <View style={styles.innerContent}>
          {children}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', 
    backgroundColor: 'rgba(255, 255, 255, 0.03)', 
  },
  blurWrapper: {
    padding: 24,
  },
  innerContent: {
  },
});