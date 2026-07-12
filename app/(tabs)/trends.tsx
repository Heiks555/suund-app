import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthData } from '../../contexts/HealthDataContext';
import { SimpleLineChart } from '../../components/SimpleLineChart';

export default function TrendsScreen() {
  const { snapshot } = useHealthData();

  const sleep = (snapshot?.sleep ?? []).slice(0, 7).map((entry) => entry.durationHours);
  const steps = (snapshot?.activity ?? []).slice(0, 7).map((entry) => entry.steps);
  const hrv = (snapshot?.heart ?? []).slice(0, 7).map((entry) => entry.hrvRmssdMs ?? 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Trends</Text>
        <Text style={styles.subtitle}>Last 7 days</Text>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Sleep (hours)</Text>
          <SimpleLineChart width={320} height={220} data={sleep.length ? sleep : [0, 0, 0, 0, 0, 0, 0]} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>HRV (ms)</Text>
          <SimpleLineChart width={320} height={220} data={hrv.length ? hrv : [0, 0, 0, 0, 0, 0, 0]} />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Steps</Text>
          <SimpleLineChart width={320} height={220} data={steps.length ? steps : [0, 0, 0, 0, 0, 0, 0]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6b7280', marginBottom: 14 },
  chartCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  chartTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111827' },
  chart: { borderRadius: 16 },
});
