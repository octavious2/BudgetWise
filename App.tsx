import { StatusBar } from 'expo-status-bar';
import{StyleSheet, Text, View} from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brandText}>BudgetWise</Text>
      {/* cards placeholder */}
      <View style={styles.statusIndicator}>
        <Text style={styles.subText}>System Ready: Day 1</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#F97316', 
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
  },
  statusIndicator: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(249, 115, 22, 0.1)', 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  subText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
  },
});