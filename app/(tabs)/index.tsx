import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthData } from '../../contexts/HealthDataContext';
import { MetricCard } from '../../components/MetricCard';

export default function HomeScreen() {
  const { snapshot, isLoading, error, refresh } = useHealthData();

  const todaySleep = snapshot?.sleep[0];
  const todayActivity = snapshot?.activity[0];
  const todayHeart = snapshot?.heart[0];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Today’s summary</Text>
        </View>

        {error ? <View style={styles.banner}><Text style={styles.bannerText}>{error}</Text></View> : null}

        {isLoading && !snapshot ? (
          <View style={styles.loader}><ActivityIndicator size="large" color="#2563eb" /></View>
        ) : null}

        <View style={styles.grid}>
          <MetricCard title="Sleep" value={`${todaySleep?.durationHours?.toFixed(1) ?? '—'}h`} subtitle="Last night" />
          <MetricCard title="HRV" value={todayHeart?.hrvRmssdMs ? `${todayHeart.hrvRmssdMs.toFixed(0)} ms` : '—'} subtitle="RMSSD" />
          <MetricCard title="RHR" value={todayHeart?.restingHeartRateBpm ? `${todayHeart.restingHeartRateBpm.toFixed(0)} bpm` : '—'} subtitle="Resting" />
          <MetricCard title="Steps" value={todayActivity?.steps ? todayActivity.steps.toLocaleString() : '—'} subtitle="Today" />
          <MetricCard title="Calories" value={todayActivity?.calories ? `${Math.round(todayActivity.calories)}` : '—'} subtitle="Burned" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Claude’s analysis</Text>
          <Text style={styles.cardText}>A lightweight analysis placeholder will appear here once the AI layer is connected.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 16 },
  greeting: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  grid: { gap: 12, marginBottom: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, color: '#111827' },
  cardText: { color: '#4b5563', lineHeight: 20 },
  banner: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 12 },
  bannerText: { color: '#b91c1c' },
  loader: { marginVertical: 16, alignItems: 'center' },
});
