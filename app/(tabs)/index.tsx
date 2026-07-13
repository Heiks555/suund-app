import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHealthData } from '../../contexts/HealthDataContext';
import { MetricCard } from '../../components/MetricCard';
import { ClaudeAnalysis, getMorningSummary } from '../../services/claudeService';
import { HealthDashboardSnapshot } from '../../services/healthProvider';

export default function HomeScreen() {
  const { snapshot, isLoading, error, refresh } = useHealthData();

  const todaySleep = snapshot?.sleep[0];
  const todayActivity = snapshot?.activity[0];
  const todayHeart = snapshot?.heart[0];

  const [claudeAnalysis, setClaudeAnalysis] = useState<ClaudeAnalysis | null>(null);
  const [claudeLoading, setClaudeLoading] = useState(false);
  const [claudeError, setClaudeError] = useState<string | null>(null);

  // Track which snapshot we last sent to Claude to avoid duplicate calls
  const lastSnapshotRef = useRef<HealthDashboardSnapshot | null>(null);

  useEffect(() => {
    if (!snapshot || isLoading || snapshot === lastSnapshotRef.current) return;

    lastSnapshotRef.current = snapshot;
    setClaudeLoading(true);
    setClaudeError(null);

    getMorningSummary(snapshot)
      .then((result) => {
        setClaudeAnalysis(result);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Analüüs ebaõnnestus.';
        setClaudeError(message);
      })
      .finally(() => {
        setClaudeLoading(false);
      });
  }, [snapshot, isLoading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Today's summary</Text>
        </View>

        {error ? (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{error}</Text>
          </View>
        ) : null}

        {isLoading && !snapshot ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : null}

        <View style={styles.grid}>
          <MetricCard title="Sleep" value={`${todaySleep?.durationHours?.toFixed(1) ?? '—'}h`} subtitle="Last night" />
          <MetricCard title="HRV" value={todayHeart?.hrvRmssdMs ? `${todayHeart.hrvRmssdMs.toFixed(0)} ms` : '—'} subtitle="RMSSD" />
          <MetricCard title="RHR" value={todayHeart?.restingHeartRateBpm ? `${todayHeart.restingHeartRateBpm.toFixed(0)} bpm` : '—'} subtitle="Resting" />
          <MetricCard title="Steps" value={todayActivity?.steps ? todayActivity.steps.toLocaleString() : '—'} subtitle="Today" />
          <MetricCard title="Calories" value={todayActivity?.calories ? `${Math.round(todayActivity.calories)}` : '—'} subtitle="Burned" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Claude's analysis</Text>

          {claudeLoading ? (
            <View style={styles.claudeLoader}>
              <ActivityIndicator size="small" color="#2563eb" />
              <Text style={styles.claudeLoadingText}>Analüüsin andmeid…</Text>
            </View>
          ) : claudeError ? (
            <Text style={styles.claudeError}>{claudeError}</Text>
          ) : claudeAnalysis ? (
            <>
              <Text style={styles.cardText}>{claudeAnalysis.summary}</Text>
              {claudeAnalysis.tags.length > 0 ? (
                <View style={styles.tagRow}>
                  {claudeAnalysis.tags.map((tag, i) => (
                    <View key={i} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </>
          ) : (
            <Text style={styles.cardText}>Laadimine…</Text>
          )}
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
  cardText: { color: '#4b5563', lineHeight: 22 },
  banner: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, marginBottom: 12 },
  bannerText: { color: '#b91c1c' },
  loader: { marginVertical: 16, alignItems: 'center' },
  claudeLoader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 },
  claudeLoadingText: { color: '#6b7280', fontSize: 14 },
  claudeError: { color: '#b91c1c', fontSize: 14, lineHeight: 20 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { backgroundColor: '#eff6ff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { color: '#1d4ed8', fontSize: 12, fontWeight: '500' },
});
