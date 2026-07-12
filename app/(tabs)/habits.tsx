import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HabitConfigItem {
  key: string;
  label: string;
  type: 'toggle' | 'input';
  placeholder?: string;
}

const habitConfig: HabitConfigItem[] = [
  { key: 'alcohol', label: 'Alcohol', type: 'toggle' },
  { key: 'nicotine', label: 'Nicotine', type: 'toggle' },
  { key: 'mood', label: 'Mood', type: 'input', placeholder: 'e.g. good' },
  { key: 'energy', label: 'Energy', type: 'input', placeholder: '1-10' },
  { key: 'sex', label: 'Sexual activity', type: 'toggle' },
];

export default function HabitsScreen() {
  const [values, setValues] = useState<Record<string, string>>({});

  const rows = useMemo(() => habitConfig, []);

  const toggleValue = (key: string) => {
    setValues((prev) => ({ ...prev, [key]: prev[key] === 'yes' ? 'no' : 'yes' }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Habits</Text>
        <Text style={styles.subtitle}>Config-driven habit tracker</Text>

        {rows.map((habit) => (
          <View key={habit.key} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>{habit.label}</Text>
              {habit.type === 'toggle' ? (
                <TouchableOpacity style={styles.toggle} onPress={() => toggleValue(habit.key)}>
                  <Text style={styles.toggleText}>{values[habit.key] === 'yes' ? 'Yes' : 'No'}</Text>
                </TouchableOpacity>
              ) : (
                <TextInput
                  style={styles.input}
                  placeholder={habit.placeholder}
                  value={values[habit.key] ?? ''}
                  onChangeText={(value) => setValues((prev) => ({ ...prev, [habit.key]: value }))}
                />
              )}
            </View>
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
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '600', color: '#111827' },
  toggle: { backgroundColor: '#dbeafe', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  toggleText: { color: '#2563eb', fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, minWidth: 140 },
});
