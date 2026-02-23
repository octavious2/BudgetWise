import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme } from '../theme/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background, justifyContent: 'center', alignItems: 'center' },
  text: { color: 'white', fontFamily: 'SpaceGrotesk-Bold', fontSize: 24 }
});