import React, { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WorkoutEntry {
  exercise: string;
  sets: string;
  reps: string;
  weight: string;
  rpe: string;
}

export default function TrainingScreen() {
  const [entries, setEntries] = useState<WorkoutEntry[]>([
    { exercise: 'Squat', sets: '3', reps: '8', weight: '70', rpe: '7' },
  ]);
  const [form, setForm] = useState<WorkoutEntry>({ exercise: '', sets: '', reps: '', weight: '', rpe: '' });

  const addEntry = () => {
    if (!form.exercise.trim()) {
      return;
    }

    setEntries((prev) => [...prev, { ...form }]);
    setForm({ exercise: '', sets: '', reps: '', weight: '', rpe: '' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Training</Text>
        <Text style={styles.subtitle}>Local workout log for now</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log a workout</Text>
          <TextInput style={styles.input} placeholder="Exercise" value={form.exercise} onChangeText={(value) => setForm((prev) => ({ ...prev, exercise: value }))} />
          <TextInput style={styles.input} placeholder="Sets" keyboardType="numeric" value={form.sets} onChangeText={(value) => setForm((prev) => ({ ...prev, sets: value }))} />
          <TextInput style={styles.input} placeholder="Reps" keyboardType="numeric" value={form.reps} onChangeText={(value) => setForm((prev) => ({ ...prev, reps: value }))} />
          <TextInput style={styles.input} placeholder="Weight" keyboardType="numeric" value={form.weight} onChangeText={(value) => setForm((prev) => ({ ...prev, weight: value }))} />
          <TextInput style={styles.input} placeholder="RPE" keyboardType="numeric" value={form.rpe} onChangeText={(value) => setForm((prev) => ({ ...prev, rpe: value }))} />
          <Button title="Add entry" onPress={addEntry} />
        </View>

        {entries.map((entry, index) => (
          <View key={`${entry.exercise}-${index}`} style={styles.entryCard}>
            <Text style={styles.entryTitle}>{entry.exercise}</Text>
            <Text>Sets: {entry.sets} • Reps: {entry.reps} • Weight: {entry.weight} • RPE: {entry.rpe}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f4f6' },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subtitle: { color: '#6b7280', marginBottom: 14 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  entryCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  entryTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
});
