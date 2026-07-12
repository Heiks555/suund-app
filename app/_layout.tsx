import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { HealthDataProvider } from '../contexts/HealthDataContext';

export default function RootLayout() {
  return (
    <HealthDataProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </HealthDataProvider>
  );
}
