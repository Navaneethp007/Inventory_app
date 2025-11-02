import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { InventoryProvider } from './src/contexts/InventoryContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <InventoryProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </InventoryProvider>
  );
}