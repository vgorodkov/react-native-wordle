import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

import { Provider } from 'react-redux';
import { store } from 'redux/store';

const Layout = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default Layout;

const styles = StyleSheet.create({});
