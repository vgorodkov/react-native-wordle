import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { DifficultyProvider } from 'components/DifficultyProvider';

const Layout = () => {
  return (
    <DifficultyProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="rules"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="difficulty"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </DifficultyProvider>
  );
};

export default Layout;

const styles = StyleSheet.create({});
