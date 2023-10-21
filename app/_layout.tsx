import { StyleSheet } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

import { Provider } from 'react-redux';
import { persistor, store } from 'redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Loading } from 'components/Loading';

const LAYOUT = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};

export default LAYOUT;

const styles = StyleSheet.create({});
