import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#f9fafb',
          borderTopColor: '#e5e7eb',
          paddingTop: 6,
          paddingBottom: 8,
          height: 64,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="trends" options={{ title: 'Trends', tabBarLabel: 'Trends' }} />
      <Tabs.Screen name="training" options={{ title: 'Training', tabBarLabel: 'Training' }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits', tabBarLabel: 'Habits' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
    </Tabs>
  );
}
