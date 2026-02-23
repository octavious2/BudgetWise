import { StatusBar } from 'expo-status-bar';
import{StyleSheet, Text, View} from 'react-native';
import { Theme } from './src/theme/colors';


export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brandText}>BudgetWise</Text>
      {/* cards placeholder */}
      <View style={styles.statusIndicator}>
        <Text style={styles.subText}>Track spending set budgets and manage your finances all from one app</Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: Theme.colors.primary, 
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
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 25,
    marginHorizontal: 40,
  },
});